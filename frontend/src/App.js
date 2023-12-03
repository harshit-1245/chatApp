import { useEffect, useState } from "react"; // Importing necessary modules
import './App.css'; // Importing CSS file
import io from "socket.io-client"; // Importing Socket.IO client
import Chat from "./component/chat"; // Importing the Chat component

const socket = io.connect("http://localhost:5000"); // Connecting to the Socket.IO server

function App() {
  // State variables to manage username, room, and chat access
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatAccess, setChatAccess] = useState(false);

  // Function to join a room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room); // Emitting a "join_room" event to the server with the room ID
      setChatAccess(true); // Granting access to the chat if username and room are provided
    }
  };

  return (
    <div className="App">
      {!chatAccess ? (
        // Displaying the join chat interface if chat access is not granted
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          {/* Input fields for username and room ID */}
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
          {/* Button to join a room */}
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        // Displaying the Chat component if chat access is granted
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
