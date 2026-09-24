import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRef } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
  const { id: chatPartnerId = "", logId = '' } = useParams();
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isBlocked, setIsBlocked] = useState(0);
  const [userRole, setUserRole] = useState(0);
  const [activeUserData, setActiveUserData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [conversationUuid, setConversationUuid] = useState('');
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("normal");
  const [inputValue, setInputValue] = useState(100);
  const [counterOfferInput, setCounterOfferInput] = useState(100);
  const [priceMessages, setPriceMessages] = useState([]);
  const [error, setError] = useState("");
  const messageAbortControllerRef = useRef(null);
  // const [dealId, setDealId] = useState(logId || "");
   const [dealId, setDealId] = useState();
  const [propertyTypeOption, setPropertyTypeOption] = useState([]);
  const [propertyTypeValue, setPropertyTypeValue] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [isCounterOffer, setIsCounterOffer] = useState(0);
  const [selectedPofDocument, setSelectedPofDocument] = useState(null);
  const [manualFile, setManualFile] = useState(null);
  const [pofDocumentId, setPofDocumentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [preview, setPreview] = useState(null)
  const [congratulationPopup, setCongratulationPopup] = useState(false);
  const [acceptOffer, setAcceptOffer] = useState(false);
  // console.log(chatPartnerId,"chatPartnerId");


  useEffect(() => {
    if (logId && propertyTypeOption.length > 0) {
      const matchedOption = propertyTypeOption.find(
        (option) => String(option.value) === String(logId),
      );

      if (matchedOption) {
        if (!propertyTypeValue || String(propertyTypeValue.value) !== String(matchedOption.value)) {
          setPropertyTypeValue(matchedOption);
        }

        if (String(dealId) !== String(matchedOption.value)) {
          setDealId(matchedOption.value);
        }
        return;
      }
    }

    if ((!propertyTypeValue || propertyTypeValue.length === 0) && propertyTypeOption.length > 0 && !dealId) {
      setPropertyTypeValue(propertyTypeOption[0]);
      setDealId(propertyTypeOption[0].value);
    }
  }, [propertyTypeOption, propertyTypeValue, logId, dealId]);

  const dealIdRef = useRef();

  useEffect(() => {
    dealIdRef.current = dealId;
  }, [dealId]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const userData = getLocalStorageUserdata();
    if (getTokenData().access_token && userRole === 0) {
      setUserRole(userData.role);
    }
  }, []);

  const getAuthHeaders = () => ({
    Accept: "application/json",
    Authorization: `Bearer ${getTokenData().access_token}`,
  });


// const fetchChatList = async (isLoad = true) => {
//     try {
//       if (isLoad) {
//         setIsLoader(true);
//       }
//       const response = await axios.post(`${apiUrl}get-chat-list`, { is_blocked: isBlocked, recipient_id: chatPartnerId || '' }, { headers: getAuthHeaders() });
//       setChatList(response.data.data || []);
//       if (!receiverId && response.data.data.length) {
//         setReceiverId(response.data.data[0].id);
//       } else {
//         sessionStorage.removeItem('chatId');
//       }
//       setIsLoader(false);
//     } catch (error) {
//       setIsLoader(false);
//       console.error("Error fetching chat list:", error.response?.data?.message || error.message);
//     }
//   };


  const fetchChatList = async (isLoad = true) => {
    try {
      if (isLoad) {
        setIsLoader(true);
      }
      const response = await axios.post(
        `${apiUrl}get-chat-list`,
        { is_blocked: isBlocked, recipient_id: chatPartnerId || '' },
        { headers: getAuthHeaders() }
      );
      setChatList(response.data.data || []);
      if (chatPartnerId) {
        setReceiverId(Number(chatPartnerId));
      } else if (!receiverId && response.data.data.length) {
        setReceiverId(response.data.data[0].id);
      } else {
        sessionStorage.removeItem('chatId');
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      console.error("Error fetching chat list:", error.response?.data?.message || error.message);
    }
  };


  useEffect(() => {
    fetchChatList();
  }, [isBlocked]);

  useEffect(() => {
    if (chatPartnerId) {
      setReceiverId(Number(chatPartnerId));
    }
  }, [chatPartnerId]);

  useEffect(() => {
    if (!receiverId || logId) return;
    setPropertyTypeValue(null);
    setDealId(undefined);
  }, [receiverId, logId]);

  const handleConfirmBox = async (userId, status) => {
    try {
      const response = await axios.post(`${apiUrl}update-block-status`, { recipient_id: userId, is_block: status }, { headers: getAuthHeaders() });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The user block status has been updated.",
      });
      fetchMessages();
      fetchChatList();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the user block status. Please try again.",
      });
    }
  };


  useEffect(() => {
    const userData = getLocalStorageUserdata();
    const socketInstance = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
      query: { userId: userData.id },
    });
    setSocket(socketInstance);
    const handleMessage = (newMessage) => {
      const currentDealId = dealIdRef.current;

      if (Number(newMessage.buyer_deal_id) !== Number(currentDealId)) {
        return; 
      }

      const chatIdValue = sessionStorage.getItem('chatId');
      if (chatIdValue == "undefined" || chatIdValue == null) {
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

   
      setChatList((prevChatList) => {
        let updated = false;
        const updatedChatList = prevChatList.map((chat) => {
          if (chat.conversation_uuid == null) {
            setIsFirstMessage(!isFirstMessage);
          }
          if (chat.conversation_uuid === newMessage.conversation_uuid && chat.is_block === false) {
            updated = true;
            return {
              ...chat,
              unread_message_count: (chat.unread_message_count || 0) + 1,
              last_message: newMessage,
              last_message_at: newMessage.sender_user.last_message_at,
            };
          }
          return chat;
        });

        const isSenderIdPresent = updatedChatList.some(item => item.id === newMessage.sender_id && item.is_block === false);

        if (!updated && !isSenderIdPresent && newMessage.sender_user.is_block === false) {
          updatedChatList.push({
            ...newMessage.sender_user,
            conversation_uuid: newMessage.conversation_uuid
          });
        }
   
        const sortedChatList = updatedChatList.sort((a, b) => {
          if (a.wishlist === true && b.wishlist !== true) return -1;
          if (a.wishlist !== true && b.wishlist === true) return 1;
          if (a.last_message_at > b.last_message_at) return -1;
          if (a.last_message_at < b.last_message_at) return 1;
          return 0;
        });
        return sortedChatList;
      });

    };
    const handleOnlineUsers = (userIds) => {
      // userIds is an array of online user IDs emitted by the server
      setOnlineUsers(new Set(userIds.map(id => Number(id))));
    };

    socketInstance.on("receiveMessage", handleMessage);
    socketInstance.on("online_users", handleOnlineUsers);
    return () => {
      socketInstance.off("receiveMessage", handleMessage);
      socketInstance.off("online_users", handleOnlineUsers);
      socketInstance.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    if (!receiverId) return;

    if (messageAbortControllerRef.current) {
      messageAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    messageAbortControllerRef.current = controller;

    try {
      const response = await axios.post(`${apiUrl}chat-messages`, { recipient_id: receiverId, message_type: messageType, property_id: logId, buyer_deal_id: dealId }, { headers: getAuthHeaders(), signal: controller.signal });
      setPropertyTypeOption(response.data.deal_list)
      setActiveUserData(response.data.data || []);
      setMessages(response.data.message || []);
      setConversationUuid(response.data.data.conversation_uuid);
      setCurrentUserId(response.data.data.id);
      setReceiverId(response.data.data.id);
      if (response.data.data.conversation_uuid !== undefined) {
        sessionStorage.setItem('chatId', response.data.data.conversation_uuid);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
      } else {
        console.error("Error fetching messages:", error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (messageAbortControllerRef.current) {
        messageAbortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (receiverId) {
      fetchMessages(messageType);
      setChatList((prevChatList) =>
        prevChatList.map((chat) => {
          if (chat.id === receiverId) {
            return {
              ...chat,
              unread_message_count: 0
            };
          }
          return chat;
        })
      );
    }
  }, [receiverId, messageType]);


  useEffect(() => {
    fetchMessages();
    fetchChatList(false);
  }, [isSubmitted, isFirstMessage, dealId]);


  const sendMessage = async () => {
    if (isSending) {
      return false;
    }

    setIsSending(true);
    if (!socket?.connected) {
      Swal.fire({ icon: "error", title: "Error", text: "Socket is not connected." });
      setIsSending(false);
      return false;
    }
    if (messageType == 'offer') {
      const minAmount = 100;
      if (!inputValue || !counterOfferInput) {
        Swal.fire({ icon: "error", title: "Error", text: "Please enter an amount." });
        setIsSending(false);
        return false;
      }
      if ((inputValue || counterOfferInput) < minAmount) {
        Swal.fire({ icon: "error", title: "Error", text: `Minimum value is $${minAmount}.` });
        setIsSending(false);
        return false;
      }
    } else {
      if (!message.trim() && !attachment) {
        Swal.fire({ icon: "error", title: "Error", text: "Message or attachment cannot be empty." });
        setIsSending(false);
        return false;
      }
    }

    const now = new Date();
    const created_time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });

    let messageData = "100";
    if (messageType === "offer") {
      if (counterOfferInput && counterOfferInput !== 100) {
        messageData = counterOfferInput;
      }
      else if (inputValue && inputValue !== 100) {
        messageData = inputValue;
      }
    } else {
      messageData = message.trim() || (attachment ? attachment.name : "");
    }
    const isFileObject = (doc) => doc instanceof File || doc instanceof Blob;

    const getExtension = (doc) => {
      console.log(doc, "doc");

      if (!doc) return null;

      if (doc.name) {
        return doc.name.split(".").pop();
      }
      if (doc.original_file_name) {
        return doc.original_file_name.split(".").pop();
      }
      if (doc.extension) {
        return doc.extension;
      }
      return null;
    };

    const documents = attachment ?? manualFile;

    let uploadResponse = null;
    let file_id = null;
    try {
      if (documents) {
        setIsUploading(true);
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };

        const formData = new FormData();
        formData.append("type", "file");
        formData.append("is_counter_offer", isCounterOffer);
        formData.append("file", documents);

        const response = await axios.post(`${apiUrl}upload-attachment`, formData, { headers });
        uploadResponse = response.data;

        if (uploadResponse.status && uploadResponse.data?.id) {
          file_id = uploadResponse.data.id;
        }
      }

      const senderMessage = {
        content: messageData,
        sender_id: getLocalStorageUserdata().id,
        recipient_id: receiverId,
        // type: "text",
        type: documents ? "file" : "text",
        chat_type: "direct",
        date_time_label: "Today",
        created_time,
        buyer_deal_id: dealId,
        message_type: messageType,
        timestamp: now.toISOString(),
        is_counter_offer: (selectedPofDocument || manualFile) ? isCounterOffer : 0,
        chat_uploads
          : [
            {
              file_url: documents ? (isFileObject(documents) ? URL.createObjectURL(documents) : documents.file_url || null) : null,
              original_file_name: documents?.name || documents?.original_file_name || null,
              file_type: documents ? documents.type : null,
              extension: getExtension(documents),
              orientation: null
            },
          ],
      };

      console.log(senderMessage, "senderMessage");

      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        if (!updatedMessages.Today) updatedMessages.Today = [];
        updatedMessages.Today.push(senderMessage);
        return updatedMessages;
      });

      setChatList((prevChatList) => {
        const updatedChatList = prevChatList.map((chat) => {
          if (chat.id === receiverId) {
            // Initialize chat.last_message if it's null or undefined
            // chat.last_message = chat.last_message || {};
            // chat.last_message.created_time = created_time;
            // chat.last_message.content = message.trim();
          }
          return chat;
        });
        return updatedChatList;
      });

      const payload = {
        access_token: `Bearer ${getTokenData().access_token}`,
        recipient_id: receiverId,
        content: messageData,
        message_type: messageType,
        type: documents ? "file" : "text",
        // file: {
        //   file:documents,
        //   original_file_name: documents ? documents.name : null,
        //   file_type: documents ? documents.type : null,
        //   // extension: documents ? documents.name.split(".").pop() : null,
        //   extension: getExtension(documents),
        //   orientation: null
        // },
        // file_id:file_id?file_id:0,
        file_id: file_id ? file_id : (selectedPofDocument ? pofDocumentId : 0),
        buyer_deal_id: dealId,
        is_counter_offer: (selectedPofDocument || manualFile) ? isCounterOffer : 0,
        //   chat_uploads: attachment
        // ? [
        //     {
        //       file_url: attachment ? URL.createObjectURL(attachment) : null, // get this from backend after uploading
        //       original_file_name: attachment.name,
        //       file_type: attachment.type,
        //       extension: attachment.name.split(".").pop(),
        //       orientation: null
        //     },
        //   ]
        // : [],
      };

      socket.emit("sendMessage", payload);
      return true;
    } catch (error) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Unable to upload attachment." });
      return false;
    } finally {
      setIsSending(false);
      setIsUploading(false);
      setMessage("");
      setAttachment(null);
      setInputValue(100);
      setCounterOfferInput(100);
      setSelectedPofDocument(null);
      setManualFile(null);
      setPofDocumentId('');
      setIsCounterOffer(0);
      setPreview(null);
    }
  };

  const markReadNotification = async () => {
    try {
      await axios.post(`${apiUrl}mark-read-message`, { conversationUuid }, { headers: getAuthHeaders() });
    } catch (error) {
      console.log("Error marking as read:", error.response || error.message);
    }
  };

  useEffect(() => {
    if (conversationUuid) markReadNotification();
  }, [conversationUuid]);

  const scrollToBottom = () => {
    const chatBody = document.querySelector('.whole_messages');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, priceMessages]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const minAmount = 100;
    if (!inputValue || !counterOfferInput) {
      setError("Please enter an amount.");
      return;
    }
    if (Number(inputValue || counterOfferInput) < minAmount) {
      setError(`Minimum value is $${minAmount}.`);
      return;
    }
    setError("");
    const newMessage = {
      id: priceMessages.length + 1,
      amount: `$${inputValue || counterOfferInput}/-`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      type: "outgoing"
    };
    setPriceMessages([...priceMessages, newMessage]);
    setInputValue(100);
    setCounterOfferInput(100)
  }

  const handleMarkSold = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      // let response = await axios.post(`${apiUrl}mark-as-sold/${dealId}`, { search_log_id: logId,accepted_price:counterOfferInput},{ headers: headers });

      let response = await axios.post(
        `${apiUrl}update-buyer-deal/${dealId}`,
        {
          search_log_id: logId, accepted_price: counterOfferInput, status: 1,
        },
        { headers }
      );

      // setBuyerDetails(prev => ({
      //     ...prev,
      //     buyers: { ...prev.buyers, mark_as_sold: true }
      // }));
      setCongratulationPopup(true)
      setAcceptOffer(false);
      // toast.success(response.data.message, {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
      // navigate(`/buyer/deal-notifications`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.error) {
          Swal.fire({ icon: "error", title: "Error", text: error.response.data.error });
        }
        // if (error.response.data.error) {
        //   toast.error(error.response.data.error, {
        //     position: toast.POSITION.TOP_RIGHT,
        //   });
        // }
      }
    }
  }

  const handlePropertyTypeChange = (value) => {
    if (value === null) {
      setPropertyTypeValue(null);
    } else {
      const propertyVal = value.value
      setPropertyTypeValue(value);
      setDealId(propertyVal)
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        chatList,
        setChatList,
        fetchChatList,
        isLoader,
        setIsLoader,
        isBlocked,
        setIsBlocked,
        receiverId,
        setReceiverId,
        activeUserData,
        setActiveUserData,
        messages,
        setMessages,
        message,
        setMessage,
        isSubmitted,
        setIsSubmitted,
        currentUserId,
        setCurrentUserId,
        conversationUuid,
        setConversationUuid,
        sendMessage,
        handleConfirmBox,
        messageType,
        setMessageType,
        chatPartnerId,
        inputValue,
        setInputValue,
        setCounterOfferInput,
        counterOfferInput,
        priceMessages,
        setPriceMessages,
        error,
        setError,
        handleSendMessage,
        scrollToBottom,
        handleMarkSold,
        handlePropertyTypeChange,
        propertyTypeValue,
        setPropertyTypeValue,
        propertyTypeOption,
        setPropertyTypeOption,
        dealId,
        setDealId,
        attachment,
        setAttachment,
        isCounterOffer,
        setIsCounterOffer,
        selectedPofDocument,
        setSelectedPofDocument,
        manualFile,
        setManualFile,
        pofDocumentId,
        setPofDocumentId,
        isUploading,
        isSending,
        setIsUploading,
        preview,
        setPreview,
        congratulationPopup,
        setCongratulationPopup,
        acceptOffer,
        setAcceptOffer,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
