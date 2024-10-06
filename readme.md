# **Connectify**  
An online video call service that enables real-time peer-to-peer video communication using WebRTC, powered by the MERN stack.

## **Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## **Overview**
**Connectify** is a real-time video calling application that connects users seamlessly. By leveraging WebRTC for peer-to-peer communication, Socket.io for signaling, and the MERN stack for robust backend support, users can experience a high-quality, low-latency video chat system.

Whether it's personal communication or team collaboration, Connectify provides a simple yet powerful platform for video calls.

---

## **Features**
- **Real-Time Video/Audio** Communication using WebRTC
- **Signaling** via Socket.io for fast connection establishment
- **User Authentication** to ensure secure video calls
- **Room-Based Calls**: Users can join or create rooms for private video calls
- **Responsive UI** for an optimized experience on all devices
- **Peer-to-Peer Connection** for direct video streaming

---

## **Tech Stack**
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: WebRTC, Socket.io
- **Deployment**: (Optional) Heroku, Netlify/Vercel
- **Others**: STUN/TURN servers for WebRTC

---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (Local or Cloud e.g. MongoDB Atlas)
- **Git** (for version control)
- **npm** (comes with Node.js)

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/connectify.git
   cd connectify
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   - Create a `.env` file in the `server` folder and add the following:
     ```
     MONGO_URI=<Your MongoDB connection string>
     JWT_SECRET=<Your JWT secret>
     PORT=5000
     ```

### **Running the App**

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd ../client
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

---

## **Usage**
1. **Register/Login**: Users can sign up or log in to access the video call service.
2. **Create/Join Rooms**: Start a new video call room or join an existing one.
3. **Make a Video Call**: Once connected, users can enjoy high-quality peer-to-peer video calls.
4. **Manage Calls**: Mute/unmute the microphone, turn the video on/off, and end the call.

---

## **Project Structure**

```
connectify/
│
├── server/                   # Node.js backend
│   ├── controllers/           # API Controllers
│   ├── models/                # Mongoose models (User, Room)
│   ├── routes/                # Express API routes
│   ├── config/                # Environment configuration (e.g. DB connection)
│   └── server.js              # Main entry point for the server
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components (Video, Chat UI)
│   │   ├── pages/             # Application pages (Home, Room)
│   │   ├── services/          # WebRTC and Socket.io logic
│   │   └── App.js             # Main App component
│
├── .gitignore                 # Ignored files and directories
├── README.md                  # Project documentation
└── package.json               # Project dependencies
```

---

## **Future Enhancements**
- **Group Video Calls**: Support for multi-user group video chats.
- **Text Chat**: Add real-time messaging alongside video calls.
- **Screen Sharing**: Enable users to share their screens during a call.
- **Call Recording**: Add a feature to record video calls for later reference.
- **Push Notifications**: Notify users when a call invitation is received.

---

## **Contributing**
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch and create a Pull Request.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---