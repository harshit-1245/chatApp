import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
//sending and recieving massages

const Chat = ({socket,username,room}) => {
   const [currentMessage,setCurrentMessage]=useState("");
   const [messageList,setMessageList]=useState([]);
   
 const sendMessage=async()=>{
    if(currentMessage!==""){
        const messageData={
            room:room,
            user:username,
            message:currentMessage,
            time:new Date(Date.now()).getHours()+ ":"+new Date(Date.now()).getMinutes()
        }
       await socket.emit("send_message",messageData);
       //shwing msg on same screen
       setMessageList((list)=>[...list,messageData])
    };
 };

 //----------------------------->recieve message
 useEffect(() => {
    const receiveMessageHandler = (data) => {
        setMessageList((list) => [...list, data]);
    };

    // Add event listener
    socket.on("recieve_message", receiveMessageHandler);

    // Cleanup function to remove event listener when component unmounts or re-renders
    return () => {
        socket.off("recieve_message", receiveMessageHandler);
    };
}, [socket]);



  return (
    <div className='chat-window'>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className='message-container'>
        {messageList.map((chat)=>{
            return (
                <div key={chat.id} className="message" id={username === chat.user ? "you" : "other"}>
                    <div>
                        <div className="message-content">
                          <p>{chat.message}</p>
                        </div>
                        <div className="message-meta">
                        <p className='time'>{chat.time}</p>
                            <p className='author'>{chat.user}</p>
                        </div>
                    </div>
                </div>
            )
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text"
        placeholder='add message'
        value={currentMessage}
        onChange={(e)=>setCurrentMessage(e.target.value)}
        onKeyPress={(e)=>{
            e.key ==="Enter" && sendMessage(); //knowledge gained
        }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
