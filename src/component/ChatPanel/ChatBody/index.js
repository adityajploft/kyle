import React, { useEffect, useState } from 'react'
import { useAuth } from "../../../hooks/useAuth";
import ChatQuestions from '../ChatQuestions';
import ChatOffers from '../ChatOffers';
import ChatHead from '../ChatHead';
import ChatFooter from '../ChatFooter';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatBodyPanel = ({activeUserData, priceMessages,setActiveTab, setMessage,sendMessage,message, activeTab ,messages, handleSendMessage,inputValue, setInputValue,handleKeyDown,messageType,setMessageType}) => {

  useEffect(() => {
      setMessageType(activeTab == 'tab1' ? 'normal' : 'offer');
  }, [activeTab]);


// Function to filter messages by message_type
const filterMessagesByType = (messages, messageType) => {
  const filteredMessages = {};
  
  for (const date in messages) {
    filteredMessages[date] = messages[date].filter((msg) => msg.message_type === messageType);
  }
  
  return filteredMessages;
};

// Filter messages based on selected tab
const normalMessages = filterMessagesByType(messages, "normal") || [];
const offerMessages = filterMessagesByType(messages, "offer") || [];

  return (
    <>
       <div className='chat_box'>
          <ChatHead activeUserData={activeUserData}/>
          <div className='chat_body'>
              <div className='whole_messages scrollbar_design'>
                  {activeTab === "tab1" && 
                      <ChatQuestions messages={normalMessages} activeUserData={activeUserData}/>
                  }
                  {activeTab === "tab2" && 
                     <ChatOffers priceMessages={offerMessages} activeUserData={activeUserData}/>
                  }
              </div>
          </div>
          <ChatFooter 
            setActiveTab={setActiveTab} 
            activeTab={activeTab} 
            handleSendMessage={handleSendMessage} 
            inputValue={inputValue} 
            setInputValue={setInputValue} 
            handleKeyDown={handleKeyDown}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
      </div>
    </>
  );
};
export default ChatBodyPanel;