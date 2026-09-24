import { useChatContext } from '../../../context/chatContext';
import React, { useState } from 'react'
import { Dropdown, Figure, Image } from 'react-bootstrap';
import Select from "react-select";

const ChatSidebar = () => {
    const { chatList = [], setReceiverId, receiverId, handleConfirmBox, setIsBlocked, isBlocked, handlePropertyTypeChange, propertyTypeValue, propertyTypeOption, onlineUsers } = useChatContext();
    console.log(handlePropertyTypeChange ,"handlePropertyTypeChange")
    const closeSidebar = () => {
        document.body.classList.remove("msg-sidebar-open");
    };

    return (
        <>
            <div className='chat_sidebar'>
                <Select
                    name="property_type"
                    defaultValue=""
                    options={propertyTypeOption}
                    onChange={(item) =>
                        handlePropertyTypeChange(item)
                    }
                    className="select"
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={false}
                    isLoading={false}
                    value={propertyTypeValue}
                    isRtl={false}
                    placeholder="Select Property Type"
                    closeMenuOnSelect={true}
                    //menuIsOpen={true}
                />
                <h6 className='mt-3'>Messages
                    <div className='d-flex align-items-center gap-3'>
                        <Dropdown>
                            <Dropdown.Toggle>
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="20" viewBox="0 0 4 20" fill="none">
                                    <path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z" fill="#464B70" />
                                    <path d="M2 11.9999C3.10457 11.9999 4 11.1044 4 9.99988C4 8.89531 3.10457 7.99988 2 7.99988C0.895431 7.99988 0 8.89531 0 9.99988C0 11.1044 0.895431 11.9999 2 11.9999Z" fill="#464B70" />
                                    <path d="M2 19.9998C3.10457 19.9998 4 19.1043 4 17.9998C4 16.8952 3.10457 15.9998 2 15.9998C0.895431 15.9998 0 16.8952 0 17.9998C0 19.1043 0.895431 19.9998 2 19.9998Z" fill="#464B70" />
                                </svg>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item href="javascript:void(0)" onClick={() => setIsBlocked(prev => prev ? 0 : 1)}>{isBlocked ? 'UnBlocked Users' : 'Blocked Users'}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <span className='sidebar_mob_close d-lg-none' onClick={closeSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M9.28265 7.5L14.6306 2.15205C15.7766 1.00606 13.9939 -0.776597 12.848 0.369393L7.5 5.71735L2.15205 0.369393C1.00606 -0.776597 -0.776597 1.00606 0.369393 2.15205L5.71735 7.5L0.369393 12.848C-0.776597 13.9939 1.00606 15.7766 2.15205 14.6306L7.5 9.28265L12.848 14.6306C13.9939 15.7766 15.7766 13.9939 14.6306 12.848L9.28265 7.5Z" fill="#5c5c5c" />
                            </svg>
                        </span>
                    </div>
                </h6>
                <ul className='chat_side_list scrollbar_design'>
                    {
                        chatList.length > 0 ?
                            chatList.map((data, index) => {
                                return (
                                    <li onClick={() => {
                                        setReceiverId(data.id);
                                        closeSidebar();
                                    }} key={index} className={data.is_block == 1 ? 'blocked' : data.id == receiverId && 'active-user'}>
                                        <div className='chat_user_img'>
                                            <Figure>
                                                <Image src={data.profile_image || '/assets/images/property-img.png'} alt='' />
                                                {/* <span className={onlineUsers.has(Number(data.id)) ? 'active_status' : 'inactive_status'}></span> */}
                                            </Figure>
                                        </div>
                                        {data.wishlisted &&
                                            <div className='wishlist_star_icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                    <path d="M8.50049 13.8076L4.51586 15.8652C3.65728 16.3089 2.65428 15.5927 2.81791 14.6532L3.57874 10.2936L0.354951 7.20564C-0.340093 6.54064 0.0435119 5.38183 1.00299 5.24404L5.45834 4.60827L7.45065 0.64124C7.8799 -0.213747 9.11997 -0.213747 9.54922 0.64124L11.5415 4.60827L15.997 5.24404C16.9564 5.38083 17.34 6.53955 16.6452 7.20564L13.4213 10.2936L14.1821 14.6532C14.3458 15.5928 13.3427 16.3089 12.4842 15.8652L8.50049 13.8076Z" fill="#FFA800" />
                                                </svg>
                                            </div>
                                        }
                                        <div className='chat_pro_area'>
                                            <div className='chat_user_info'>
                                                <span>{data.name} </span>
                                                <p>{data?.last_message?.content}</p>
                                            </div>
                                            <div className='chat_status_area'>
                                                <p className='mb-0'>{data.last_message_at}</p>
                                                {data.unread_message_count > 0 && data.id != receiverId ?
                                                    <div className='seen_status text-end'>
                                                        <span className='msg_left_number'>{data.unread_message_count}</span>
                                                    </div> :
                                                    <div className='seen_status text-end'>
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="15" viewBox="0 0 27 15" fill="none">
                                                                <path d="M13.0745 9.70926L14.8158 11.4712L25.2562 0.907162L27 2.67157L14.8158 15L6.96766 7.0589L8.71143 5.29448L11.332 7.94609L13.0745 9.70801V9.70926ZM13.077 6.18043L19.1839 0L20.9227 1.75942L14.8158 7.93986L13.077 6.18043ZM9.59071 13.2368L7.84818 15L0 7.0589L1.74377 5.29448L3.4863 7.05765L3.48506 7.0589L9.59071 13.2368Z" fill="#3F53FE" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                }
                                                {data.is_block == 1 && <button className='unblock_btn' onClick={() => handleConfirmBox(data.id, 0)}>Unblock</button>}
                                            </div>
                                        </div>
                                    </li>
                                )
                            }) : <p className='text-center'>No User Found</p>
                    }

                </ul>
            </div>
            <div className='mobile_overlay d-lg-none' onClick={closeSidebar}></div>
        </>
    );
};

export default ChatSidebar;