import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'; // Import socket.io for signaling

const RoomContent = () => {
  const [user, setUser] = useState(null); // State to store user info
  const [roomCode, setRoomCode] = useState(''); // State to store room code
  const [permissionsGranted, setPermissionsGranted] = useState(false); // State to check permissions
  const [isRoomCreated, setIsRoomCreated] = useState(false); // State to check if room is created
  const [joinRoomCode, setJoinRoomCode] = useState(''); // State for joining room code
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(''); // State to store new message input
  const [remoteStream, setRemoteStream] = useState(null); // State to store the remote video stream
  const videoRef = useRef(null); // Ref for user's video element
  const remoteVideoRef = useRef(null); // Ref for remote video element
  const peerRef = useRef(null); // Ref for peer connection
  const socketRef = useRef(null); // Ref for socket connection
  const localStreamRef = useRef(null); // Ref to store the local stream

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    // Initialize socket connection to signaling server
    socketRef.current = io('http://localhost:5000'); // Adjust based on your signaling server
  }, []);

  useEffect(() => {
    if (isRoomCreated || joinRoomCode) {
      requestPermissions();
    }

    // Clean up socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isRoomCreated, joinRoomCode]);

  // Generate a random room code
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsRoomCreated(true);

    // Emit the event to the server signaling the room creation
    socketRef.current.emit('create-room', code);
  };

  // Request media permissions and handle WebRTC setup
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Display local video
      }
      setPermissionsGranted(true);

      setupWebRTC();
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  // Setup WebRTC Peer Connection
  const setupWebRTC = () => {
    peerRef.current = new RTCPeerConnection();

    // Add local stream tracks to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      peerRef.current.addTrack(track, localStreamRef.current);
    });

    // Handle receiving remote stream
    peerRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]; // Display remote video
      }
    };

    // Create offer and send it to the server via socket
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: event.candidate, roomCode });
      }
    };

    // Create an offer for the connection
    peerRef.current.createOffer()
      .then(offer => peerRef.current.setLocalDescription(offer))
      .then(() => {
        socketRef.current.emit('offer', { sdp: peerRef.current.localDescription, roomCode });
      })
      .catch(err => console.error('Error creating offer:', err));
  };

  // Handle joining an existing room
  const handleJoinRoom = () => {
    if (joinRoomCode) {
      socketRef.current.emit('join-room', joinRoomCode);

      socketRef.current.on('offer', async (offer) => {
        peerRef.current = new RTCPeerConnection();
        localStreamRef.current.getTracks().forEach(track => {
          peerRef.current.addTrack(track, localStreamRef.current);
        });

        peerRef.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]; // Display remote video
          }
        };

        peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerRef.current.createAnswer();
        peerRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', { sdp: peerRef.current.localDescription, roomCode: joinRoomCode });
      });

      socketRef.current.on('ice-candidate', (candidate) => {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
    } else {
      alert('Please enter a valid room code.');
    }
  };

  // Handle sending messages in the chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, newMessage]);
      setNewMessage('');

      // Emit the chat message to the signaling server
      socketRef.current.emit('chat-message', { message: newMessage, roomCode });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-100">
      {user ? (
        <>
          <h2 className="text-3xl text-[#2d2d2d] font-bold mb-4">Hi, {user.username}!</h2>
          <p className="text-lg text-[#2d2d2d] mb-6">You can create a room or join an existing one.</p>

          <div className="mb-4 flex space-x-4">
            <button
              onClick={generateRoomCode}
              className="bg-blue-600 text-[#2d2d2d] py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create Room
            </button>
            <div>
              <input
                type="text"
                value={joinRoomCode}
                onChange={(e) => setJoinRoomCode(e.target.value)}
                placeholder="Enter Room Code"
                className="p-2 border rounded-lg mr-2"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-blue-600 text-[#2d2d2d] py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Join Room
              </button>
            </div>
          </div>

          {isRoomCreated && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-[#2d2d2d]">Room Code: {roomCode}</h4>
              <p className="text-sm text-gray-600">Share this code with others to invite them to the room.</p>
            </div>
          )}

          {/* Video Section */}
          <div className="flex space-x-4 mb-4">
            <div>
              <h3 className="text-xl text-[#2d2d2d] font-bold">Your Video</h3>
              <video ref={videoRef} autoPlay muted className="w-[300px] h-[200px] border rounded-lg bg-black"></video>
            </div>
            <div>
              <h3 className="text-xl text-[#2d2d2d] font-bold">Remote Video</h3>
              <video ref={remoteVideoRef} autoPlay className="w-[300px] h-[200px] border rounded-lg bg-black"></video>
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-full max-w-2xl p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold mb-2">Chat</h3>
            <div className="h-[200px] bg-gray-200 overflow-y-auto p-2 rounded-lg mb-4">
              {chatMessages.map((message, index) => (
                <p key={index} className="text-gray-800 mb-2">{message}</p>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>Please sign up to create or join a room.</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomContent;
