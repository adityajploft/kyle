import React from 'react';
import { Button} from 'react-bootstrap';

const ChatFooter = ({activeTab, setActiveTab, inputValue, setInputValue,handleSendMessage, handleKeyDown,message,setMessage,sendMessage}) => {
  return (
    <>
        <div className='chat_footer noti_buyer_chat_foot'>
            <div className='chat_footBoth_btn'>
                <ul>
                    <li>
                        <Button className={activeTab === "tab1" ? "active foot_fill_btn" : "foot_fill_btn"} onClick={() => setActiveTab("tab1")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.75 13.8226H9.75L6.41249 16.0425C5.91749 16.3725 5.25 16.0201 5.25 15.4201V13.8226C3 13.8226 1.5 12.3226 1.5 10.0726V5.57251C1.5 3.32251 3 1.82251 5.25 1.82251H12.75C15 1.82251 16.5 3.32251 16.5 5.57251V10.0726C16.5 12.3226 15 13.8226 12.75 13.8226Z" stroke="#3F53FE" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.99986 8.52002V8.36255C8.99986 7.85255 9.31488 7.58254 9.62988 7.36504C9.93738 7.15504 10.2448 6.88505 10.2448 6.39005C10.2448 5.70005 9.68986 5.14502 8.99986 5.14502C8.30986 5.14502 7.75488 5.70005 7.75488 6.39005" stroke="#3F53FE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.99662 10.3125H9.00337" stroke="#3F53FE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>Questions
                        </Button>
                    </li>
                    <li>
                        <Button className={activeTab === "tab2" ? "active foot_outline_btn" : "foot_outline_btn"} onClick={() => setActiveTab("tab2")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                <path d="M3.71177 11.6448L7.11556 15.0423C8.51314 16.4373 10.7823 16.4373 12.1874 15.0423L15.486 11.7498C16.8836 10.3548 16.8836 8.08978 15.486 6.68728L12.0747 3.29728C11.3609 2.58478 10.3766 2.20228 9.36973 2.25478L5.61278 2.43478C4.11 2.50228 2.9153 3.69478 2.84016 5.18728L2.65982 8.93727C2.61474 9.94977 2.99795 10.9323 3.71177 11.6448Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.71636 9.16992C8.75381 9.16992 9.59484 8.33046 9.59484 7.29492C9.59484 6.25939 8.75381 5.41992 7.71636 5.41992C6.67891 5.41992 5.83789 6.25939 5.83789 7.29492C5.83789 8.33046 6.67891 9.16992 7.71636 9.16992Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M10.3467 12.9199L13.3522 9.91992" stroke="#07B89C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>Make Offer
                        </Button>
                    </li>
                </ul>
            </div>
            <form className='msg_send_footer notified_chat_footer'>
                {activeTab === "tab1" &&
                    <>
                        <input type='text' placeholder='Message Here...' value={message}  onChange={(e) => setMessage(e.target.value)}  onKeyDown={handleKeyDown} />
                    </>
                }
                {activeTab === "tab2" &&
                    <>
                        <input type='number' value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)} />
                        <span className='offer_symbols'>$</span>
                    </>
                }
                <button type='button' className='msg_send_btn' onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </form>
        </div>
    </>
  );
};
export default ChatFooter;