import React, { useEffect, useState } from 'react'; // Importing necessary modules
import ScrollToBottom from "react-scroll-to-bottom"; // Importing ScrollToBottom for scrolling to the bottom of the chat window

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState(""); // State for the current message being typed
  const [messageList, setMessageList] = useState([]); // State to manage the list of messages

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        user: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData); // Emitting a "send_message" event with the message data to the server
      setMessageList((list) => [...list, messageData]); // Adding the message to the local message list for immediate display
    }
  };

  // Event listener to receive messages
  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]); // Adding the received message to the message list
    };

    // Adding event listener for "recieve_message" event
    socket.on("recieve_message", receiveMessageHandler);

    // Cleanup function to remove the event listener when the component unmounts or re-renders
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
        {/* ScrollToBottom component to handle scrolling in the message container */}
        <ScrollToBottom className='message-container'>
          {/* Mapping through messageList to display messages */}
          {messageList.map((chat, index) => {
            return (
              <div key={index} className="message" id={username === chat.user ? "you" : "other"}>
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
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {/* Input field for typing messages */}
        <input
          type="text"
          placeholder='add message'
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage(); // Sending message on "Enter" key press
          }}
        />
        {/* Button to send the message */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
