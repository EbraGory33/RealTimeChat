# Chat Messaging Backend

A lightweight, real-time messaging backend built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. This backend powers user authentication, real-time chat messaging, and session management for the Chat Messaging app.

---

## Features

- JWT-based Authentication (Register, Login, Logout)
- Auth Middleware for protected routes
- Real-time messaging with Socket.IO
- contact system (fetches users you've interacted with)
- Swagger API Docs (accessible at `/api-docs`)
- Modular folder structure with separation of concerns

---

## API Overview

### Auth Routes (`/api/auth`)

| Method | Route           | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/register`     | Register new user            |
| POST   | `/login`        | Login and receive auth token |
| POST   | `/logout`       | Clear auth cookie            |
| GET    | `/authenticate` | Validate current session     |

### Messaging Routes (`/api/messages`)

| Method | Route       | Description                                |
| ------ | ----------- | ------------------------------------------ |
| GET    | `/users`    | List users excluding the logged-in user    |
| GET    | `/contacts` | List users you've had conversations with   |
| GET    | `/:id`      | Get messages between you and another user  |
| POST   | `/send/:id` | Send a message to another user (real-time) |

---

## WebSocket / Real-time Messaging

### Key Socket Events

| Event Name       | Description                                         | Emitted By                     | Listened By Clients                        |
| ---------------- | --------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| `newMessage`     | Real-time delivery of a new chat message            | Server (on message send)       | Client to display incoming messages        |
| `newContact`     | Notification of a new conversation/contact          | Server (on first message)      | Client to update contact list              |
| `getOnlineUsers` | Broadcast current online users list                 | Server (on connect/disconnect) | Client to show who is online               |
| `searchUsers`    | Client emits to perform live username search        | Client                         | Server responds with `searchResults` event |
| `searchResults`  | Server emits search results after a username search | Server                         | Client to display search results           |

## Project Structure

```
backend/
├── controllers/
│ ├── authController.js # Handles signup, login, logout, session
│ └── messageController.js # Handles message sending/fetching logic
│
├── routes/
│ ├── auth.js # Auth routes
│ └── message.js # Message routes
│
├── lib/
│ ├── db.js # MongoDB connection logic
│ ├── utils.js # Token generation and helpers
│ ├── socket.js # Socket.IO setup
│ ├── socketUtils.js # Socket event helpers
│ ├── chatUtils.js # Utility to check conversation existence
│ └── messageUtils.js # Message creation abstraction
│
├── middleware/
│ └── authMiddleware.js # JWT verification
│
├── models/
│ ├── User.js # Mongoose model for users
│ └── Message.js # Mongoose model for messages
│
├── swagger.yaml # OpenAPI spec for Swagger UI
├── server.js # App entry point

---
```

## Getting Started

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the Environment Variables

.env file

```ini
PORT=8000
MONGO_URI= ...
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
SALT_ROUNDS=10
```

### 4. Start the server

```bash
npm run dev
```

### Server will be running at: http://localhost:8000

### Swagger docs: http://localhost:8000/api-docs
