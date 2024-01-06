import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [online,setOnline]=useState([]) // track online

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    const typingStatus = e.target.value.trim() !== '';

    if (typingStatus) {
      socket.emit('typing_status', { user: username, status: true, room });
    } else {
      socket.emit('typing_status', { user: username, status: false, room });
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        user: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      socket.emit('typing_status', { user: username, status: false, room });
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const handleTyping = ({ user, status }) => {
      if (user !== username) {
        setTypingUsers((users) => {
          if (status) {
            if (!users.includes(user)) {
              return [...users, user];
            }
          } else {
            return users.filter((u) => u !== user);
          }
          return users;
        });
      }
    };

   

    socket.on('recieve_message', receiveMessageHandler);
    socket.on('user_typing', handleTyping);
   

    return () => {
      socket.off('recieve_message', receiveMessageHandler);
      socket.off('user_typing', handleTyping);
      
    };
  }, [socket, username]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
        <div className="online-users">
          <p>Online Users:</p>
          <ul>
            
          </ul>
        </div>
      </div>
      <div className='chat-body'>
      {typingUsers.length > 0 && <p className='typing'>{`${typingUsers.slice(0, 4).join(', ')}${typingUsers.length > 4 ? ' and more are' : ' is'} typing...`}</p>}
        <ScrollToBottom className='message-container'>
          {messageList.map((chat, index) => (
            <div key={index} className='message' id={username === chat.user ? 'you' : 'other'}>
              <div>
                <div className='message-content'>
                  <p>{chat.message}</p>
                 
                </div>
                <div className='message-meta'>
                  <p className='time'>{chat.time}</p>
                  <p className='author'>{chat.user}</p>
                </div>
                
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='add message'
          value={currentMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            e.key === 'Enter' && sendMessage();
          }}
        />
       
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
