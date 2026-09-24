import React, { useEffect, useState } from 'react'
const ChatQuestions = ({messages,activeUserData}) => {  
  return (
    <>
        { Object.entries(messages).map(([day, dayMessages],index) => (
            <div key={index}>
            <div className="day-header line-with-text"><span>{day}</span></div>
            {dayMessages.map((data,index)=>(
                <div className={`msg_item ${data.sender_id !== activeUserData.id && 'outgoing_msg'}`} key={index}>
                <div className='msg_content'>{data.content}</div>
                {/* <p className='msg_time'>{data.date_time_label == 'Today' ? data.created_time : data.created_date}</p> */}
                <p className='msg_time'>{data.created_time}</p>
                </div>
            ))}
            </div>
        ))}
    </>
  );
};
export default ChatQuestions;