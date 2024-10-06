import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'; 

const RoomContent = () => {
  const [user, setUser] = useState(null); 
  const [roomCode, setRoomCode] = useState(''); 
  const [permissionsGranted, setPermissionsGranted] = useState(false); 
  const [isRoomCreated, setIsRoomCreated] = useState(false); 
  const [joinRoomCode, setJoinRoomCode] = useState(''); 
  const [chatMessages, setChatMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [remoteStream, setRemoteStream] = useState(null); 
  const videoRef = useRef(null); 
  const remoteVideoRef = useRef(null); 
  const peerRef = useRef(null); 
  const socketRef = useRef(null); 
  const localStreamRef = useRef(null); 

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    socketRef.current = io('http://localhost:5000');
  }, []);

  useEffect(() => {
    if (isRoomCreated || joinRoomCode) {
      requestPermissions();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isRoomCreated, joinRoomCode]);
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsRoomCreated(true);
    socketRef.current.emit('create-room', code);
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream; 
      }
      setPermissionsGranted(true);

      setupWebRTC();
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const setupWebRTC = () => {
    peerRef.current = new RTCPeerConnection();

    localStreamRef.current.getTracks().forEach(track => {
      peerRef.current.addTrack(track, localStreamRef.current);
    });

    peerRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };


    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: event.candidate, roomCode });
      }
    };

    
    peerRef.current.createOffer()
      .then(offer => peerRef.current.setLocalDescription(offer))
      .then(() => {
        socketRef.current.emit('offer', { sdp: peerRef.current.localDescription, roomCode });
      })
      .catch(err => console.error('Error creating offer:', err));
  };

  
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
            remoteVideoRef.current.srcObject = event.streams[0]; 
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, newMessage]);
      setNewMessage('');

  
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
