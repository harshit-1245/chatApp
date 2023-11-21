
import { useEffect, useState } from "react";
import './App.css'
import io from "socket.io-client"
import Chat from "./component/chat";

const socket = io.connect("http://localhost:5000");

function App() {
  const [username,setUsername]=useState("");
  const [room,setRoom]=useState("");
 
  const [chatAccess,setChatAccess]=useState(false);

  const joinRoom=()=>{
    if(username!=="" && room!==""){
      socket.emit("join_room",room) //comes from backend
      setChatAccess(true)
    }
  }

  
  return (
    <div className="App">
      {!chatAccess ?(
      <div className="joinChatContainer">
     <h3>Join A Chat</h3>
     <input type="text" placeholder="name..." value={username} onChange={(e)=>setUsername(e.target.value)}/>
     <input type="text"
     placeholder="Room ID"
     value={room}
      onChange={(e)=>setRoom(e.target.value)} />
     <button onClick={joinRoom}>Join A Room</button>
     </div>
      ):(

     <Chat socket={socket} username={username} room={room}/>
     )}
    
</div>
  );
      }

export default App;
