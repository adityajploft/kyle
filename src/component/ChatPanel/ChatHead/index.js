import React from 'react';
import {  Dropdown, Figure, Image} from 'react-bootstrap';
import { useChatContext } from '../../../context/chatContext';

const ChatHead = ({activeUserData}) => {
  const { onlineUsers } = useChatContext();
  const isOnline = onlineUsers.has(Number(activeUserData?.id));
  return (
    <>
        <div className='chat_header d-flex flex-wrap align-items-center'>
            <div className='chat_header_user d-flex flex-wrap align-items-center'>
                <Figure>
                    <Image src={activeUserData?.profile_image} alt='' />
                    <span className={isOnline ? 'active_status' : 'inactive_status'}></span>
                </Figure>
                <div>
                    <div className='d-flex chat_user_name_area'>
                        <span>{activeUserData?.name}</span><span>Level {activeUserData?.level_type }</span>
                    </div>
                    <div className='d-flex align-items-center chat_user_name_below gap-2'>
                        <p>{isOnline ? 'Online' : 'Offline'}</p>
                        {activeUserData?.profile_tag_image && 
                        <p className='d-flex gap-1'>
                            <span><Image src={activeUserData?.profile_tag_image} alt='' /></span>
                            {activeUserData?.profile_tag_name}
                        </p>
                        }
                    </div>
                </div>
            </div>
            <div className='chat_header_action d-flex'>
                <div className='fav-icons-start'><img src='/assets/images/vector.svg'/></div>
                <Dropdown>
                    <Dropdown.Toggle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="20" viewBox="0 0 4 20" fill="none">
                        <path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z" fill="#464B70"/>
                        <path d="M2 11.9999C3.10457 11.9999 4 11.1044 4 9.99988C4 8.89531 3.10457 7.99988 2 7.99988C0.895431 7.99988 0 8.89531 0 9.99988C0 11.1044 0.895431 11.9999 2 11.9999Z" fill="#464B70"/>
                        <path d="M2 19.9998C3.10457 19.9998 4 19.1043 4 17.9998C4 16.8952 3.10457 15.9998 2 15.9998C0.895431 15.9998 0 16.8952 0 17.9998C0 19.1043 0.895431 19.9998 2 19.9998Z" fill="#464B70"/>
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item href="javascript:void(0)">Unblock</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)">Block</Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0)" className='text-danger'><strong>Report</strong></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    </>
  );
};
export default ChatHead;