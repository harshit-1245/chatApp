import { useEffect, useState } from "react"; // Importing necessary modules
import './App.css'; // Importing CSS file
import io from "socket.io-client"; // Importing Socket.IO client
import Chat from "./component/chat"; // Importing the Chat component

const socket = io.connect("http://localhost:5000"); // Connecting to the Socket.IO server

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatAccess, setChatAccess] = useState(false);
  const [error, setError] = useState(""); // State for managing errors

  const joinRoom = () => {
    if (username.trim() === "" || room.trim() === "") {
      setError("Please enter a valid username and room ID.");
      return;
    }

    socket.emit("join_room", room);
    setChatAccess(true);
  };

  return (
    <div className="App">
      {!chatAccess ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join A Room</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;



