import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const useChat = (apiUrl, userData, getTokenData, getLocalStorageUserdata) => {
  const [socket, setSocket] = useState(null);
  console.log(socket ,"socket11111")
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [conversationUuid, setConversationUuid] = useState("");
  const [activeUserData, setActiveUserData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [priceMessages, setPriceMessages] = useState([]);
  const [inputValue, setInputValue] = useState(100);
  const [messageType, setMessageType] = useState("normal");

  const getAuthHeaders = () => ({
    Accept: "application/json",
    Authorization: `Bearer ${getTokenData().access_token}`,
  });

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
      query: { userId: userData.id },
    });
    setSocket(socketInstance);
 console.log(socket ,"socket11111",socketInstance)
    const handleMessage = (newMessage) => {          
      const chatIdValue = sessionStorage.getItem("chatId");
      if (chatIdValue === "undefined" || chatIdValue == null) {
        setIsFirstMessage(!isFirstMessage);
      }
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        if (!updatedMessages.Today) updatedMessages.Today = [];
        if (chatIdValue === newMessage.conversation_uuid) {
          updatedMessages.Today = [...updatedMessages.Today, newMessage];
        }
        return updatedMessages;
      });
    };

    socketInstance.on("connect", () => console.log("Connected to Socket.IO server") );
    socketInstance.on("receiveMessage", handleMessage);

    return () => {
      socketInstance.off("receiveMessage", handleMessage);
      socketInstance.disconnect();
    };

  }, [userData.id, isFirstMessage]);

  
  const fetchMessages = async (id) => {
    if (!id) return;
    try {
      const response = await axios.post(
        `${apiUrl}chat-messages`,
        { recipient_id: id ,message_type: messageType },
        { headers: getAuthHeaders() }
      );      
      setActiveUserData(response.data.data || []);
      setMessages(response.data.message || []);
      setConversationUuid(response.data.data.conversation_uuid);
      setCurrentUserId(response.data.data.id);
      setReceiverId(response.data.data.id);
      if (response.data.data.conversation_uuid !== undefined) {
        sessionStorage.setItem("chatId", response.data.data.conversation_uuid);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data?.message || error.message);
    }
  };

  // Send chat message
  const sendMessage = () => {    
    if (!socket?.connected || !message.trim() && !inputValue) {
      console.error("Socket is not connected or message is empty");
      return;
    }

    const now = new Date();
    const created_time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const senderMessage = {
      content: message.trim() || inputValue,
      sender_id: getLocalStorageUserdata().id,
      recipient_id: receiverId,
      type: "text",
      chat_type: "direct",
      date_time_label: "Today",
      created_time,
      message_type: messageType,
      timestamp: now.toISOString(),
    };

    setMessages((prevMessages) => {   
      const updatedMessages = { ...prevMessages };
      if (!updatedMessages.Today) updatedMessages.Today = [];
      updatedMessages.Today.push(senderMessage);
      return updatedMessages;
    });

    const payload = {
      access_token: `Bearer ${getTokenData().access_token}`,
      recipient_id: receiverId,
      content: message.trim() || inputValue,
      message_type: messageType,
      type: "text",
    };
    socket.emit("sendMessage", payload);
    setMessage("");
    setInputValue(100);
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        setMessage((prevMessage) => `${prevMessage}\n`);
      } else if (message.trim()) {
        sendMessage();
      }
    }
  };


  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const minAmount = 100;
    if (!inputValue || Number(inputValue) < minAmount) {
      return;
    }

    const newMessage = {
      id: priceMessages.length + 1,
      amount: `$${inputValue}/-`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      type: "outgoing",
    };
    setPriceMessages([...priceMessages, newMessage]);
    setInputValue(100);
  };
    const scrollToBottom = () => {
      const chatBody = document.querySelector('.whole_messages');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]); 

  return {
    messages,
    message,
    setMessage,
    sendMessage,
    handleKeyDown,
    fetchMessages,
    handleSendMessage,
    inputValue,
    setInputValue,
    priceMessages,
    receiverId,
    setReceiverId,
    activeUserData,
    messageType,
    setMessageType,
  };
};

export default useChat;
