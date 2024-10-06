// server/signalingServer.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Change the port as needed

const rooms = {}; // Object to store active rooms and their participants

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'create-room':
                // Create a new room
                const roomCode = data.roomCode;
                rooms[roomCode] = [ws]; // Store the room with the creator's socket
                ws.send(JSON.stringify({ type: 'room-created', roomCode }));
                break;

            case 'join-room':
                // Join an existing room
                const codeToJoin = data.roomCode;
                if (rooms[codeToJoin]) {
                    rooms[codeToJoin].push(ws); // Add this socket to the room
                    ws.send(JSON.stringify({ type: 'joined-room', roomCode: codeToJoin }));
                    // Notify other users in the room
                    rooms[codeToJoin].forEach(client => {
                        if (client !== ws) {
                            client.send(JSON.stringify({ type: 'user-joined', roomCode: codeToJoin }));
                        }
                    });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room does not exist' }));
                }
                break;

            case 'signal':
                // Forward signaling data to the other client in the room
                const { roomCode: signalRoomCode, signalData } = data;
                rooms[signalRoomCode].forEach(client => {
                    if (client !== ws) {
                        client.send(JSON.stringify({ type: 'signal', signalData }));
                    }
                });
                break;

            case 'leave-room':
                // Handle leaving the room
                const leavingRoomCode = data.roomCode;
                rooms[leavingRoomCode] = rooms[leavingRoomCode].filter(client => client !== ws);
                if (rooms[leavingRoomCode].length === 0) {
                    delete rooms[leavingRoomCode]; // Remove the room if it's empty
                } else {
                    rooms[leavingRoomCode].forEach(client => {
                        client.send(JSON.stringify({ type: 'user-left', roomCode: leavingRoomCode }));
                    });
                }
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Handle disconnection logic if needed
    });
});

console.log('Signaling server is running on ws://localhost:8080');
