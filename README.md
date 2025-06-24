# Technical Specification: GrapeVine Real-Time Messaging App

## Overview

This system allows users to register, log in, search for other users, and engage in real-time one-on-one conversations. Messages are stored persistently and delivered in real-time using WebSockets. A minimal UI offers message history and optional typing indicators.

---

## Core Features

- User Registration & Login (JWT-based)
- Auth Middleware for protected routes
- Real-time 1:1 Messaging (Socket.IO)
- contact system (fetches users you've interacted with)
- Persisted Message History (MongoDB)
- User Search by Username

---

## System Architecture

**Client:** React frontend with Zustand for state
**Server:** Node.js + Express REST API
**Database:** MongoDB
**Real-time:** Socket.IO (WebSocket protocol fallback to polling)
**Auth:** JWT stored in HTTP-only cookies
**State Management:** Zustand (client-side)

---

## User Authentication Flow

### Registration

- Endpoint: `POST /api/auth/register`
- Input: `{ username, email, password }`
- Password is hashed with bcrypt.
- On success, server returns a JWT cookie and user info.

### Login

- Endpoint: `POST /api/auth/login`
- Input: `{ username, password }`
- On success, server returns a JWT cookie and user info.
- Socket.IO client initialized using `userId`.

### Session Verification

- Endpoint: `GET /api/auth/authenticate`
- Checks for valid token in cookie.
- If valid, returns user info.

---

### Authentication Endpoints (`/api/auth`)

| Method | Route           | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/register`     | Register new user            |
| POST   | `/login`        | Login and receive auth token |
| POST   | `/logout`       | Clear auth cookie            |
| GET    | `/authenticate` | Validate current session     |

## Messaging Endpoints (`/api/messages`)

| Method | Route       | Description                             |
| ------ | ----------- | --------------------------------------- |
| GET    | `/users`    | List all users except current           |
| GET    | `/contacts` | List users you’ve chatted with          |
| GET    | `/:id`      | Load message history with specific user |
| POST   | `/send/:id` | Send message to user (and emit socket)  |

---

## Database Design

### User (users)

```js
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
}
```

### Message (messages)

```js
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  createdAt: Date,
}
```

- Messages are queried by both sender and receiver IDs.
- Contacts are inferred from message history (aggregated users from both sides of each message).

---

## Real-time Communication (Socket.IO)

### Setup

- Client connects to backend WebSocket on login:

  ```js
  io("http://localhost:8000", { query: { userId } });
  ```

- Server maps `userId → socketId` to route events.

### Key Socket Events

| Event Name       | Description                                         | Emitted By                     | Listened By Clients                        |
| ---------------- | --------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| `newMessage`     | Real-time delivery of a new chat message            | Server (on message send)       | Client to display incoming messages        |
| `newContact`     | Notification of a new conversation/contact          | Server (on first message)      | Client to update contact list              |
| `getOnlineUsers` | Broadcast current online users list                 | Server (on connect/disconnect) | Client to show who is online               |
| `searchUsers`    | Client emits to perform live username search        | Client                         | Server responds with `searchResults` event |
| `searchResults`  | Server emits search results after a username search | Server                         | Client to display search results           |

---

## How the System Works (End-to-End Flow)

1. **Registration/Login**

   - User signs up or logs in.
   - JWT is issued and stored in HTTP-only cookie.
   - Client verifies auth and opens a WebSocket connection using their `userId`.

2. **Looking Up a User**

   - On typing in the search bar, client emits `searchUsers` event with the search term.
   - Server queries users by `username` using regex and returns matching users in `searchResults`.

3. **Starting a Chat**

   - Client selects a user → triggers `GET /messages/:id` to fetch message history.
   - Messages are displayed, and `subscribeToMessages()` starts listening to `newMessage`.

4. **Sending Messages**

   - Client calls `POST /send/:id` to persist the message.
   - Server emits `newMessage` via WebSocket to receiver.
   - If first-time contact, server also emits `newContact` to both users.

---

## Tradeoffs & Assumptions

| Tradeoff                             | Reason                                               |
| ------------------------------------ | ---------------------------------------------------- |
| **Socket.IO over raw WebSocket**     | Easier setup, built-in reconnection, room management |
| **JWT in cookie (vs. localStorage)** | Mitigates XSS risks                                  |
| **MongoDB for chat**                 | Flexible schema, fast for prototyping                |
| **No Room Model**                    | Since it's 1:1 chat, not group-based                 |

---

## Open Questions & Future Considerations

- How should we handle deleted messages or blocked users?
- Should message delivery statuses (delivered, read) be tracked?
- How would this scale to group chats or presence tracking across tabs/devices?
- Should pagination or infinite scroll be used for chat history?

---

## Project Structure Overview

```
frontend/
├──src/
│  ├── App.jsx # Main app component with routing
│  ├── index.jsx # React DOM render entry point
│  ├── index.css # Global styles
│  │
│  ├── components/ # Reusable UI components
│  │   ├── ChatContainer.jsx
│  │   ├── ChatHeader.jsx
│  │   ├── Footer.jsx
│  │   ├── MessageContainer.jsx
│  │   ├── MessageInput.jsx
│  │   ├── Navbar.jsx
│  │   ├── NoChatSelected.jsx
│  │   ├── Sidebar.jsx
│  │   └── skeleton/ # Loading skeleton components
│  │       ├── LoadingChatSkeleton.jsx
│  │       └── SidebarSkeleton.jsx
│  │
│  ├── screens/ # Page-level components (routes/screens)
│  │   ├── HomeScreen.jsx
│  │   └── auth/
│  │   ├── LoginScreen.jsx
│  │   └── SignUpScreen.jsx
│  │
│  ├── lib/ # Utilities and API clients
│  │   ├── axios.jsx # Axios instance configuration
│  │   ├── utils.js # Utility functions
│  │   └── endpoints/ # API endpoint functions
│  │       ├── auth.jsx # Authentication API calls
│  │       └── chat.jsx # Chat API calls
│  │
│  └── store/ # Zustand stores for state management
│      ├── auth/
│      │   └── useAuthFunction.jsx
│      └── chat/
│          └── useChatFunction.jsx
backend/
├── controllers/
│   ├── authController.js # Handles signup, login, logout, session
│   └── messageController.js # Handles message sending/fetching logic
│
├── routes/
│   ├── auth.js # Auth routes
│   └── message.js # Message routes
│
├── lib/
│   ├── db.js # MongoDB connection logic
│   ├── utils.js # Token generation and helpers
│   ├── socket.js # Socket.IO setup
│   ├── socketUtils.js # Socket event helpers
│   ├── chatUtils.js # Utility to check conversation existence
│   └── messageUtils.js # Message creation abstraction
│
├── middleware/
│   └── authMiddleware.js # JWT verification
│
├── models/
│   ├── User.js # Mongoose model for users
│   └── Message.js # Mongoose model for messages
│
├── swagger.yaml # OpenAPI spec for Swagger UI
├── server.js # App entry point

```

---

## Sketch

### System Architecture

![System Architecture](<./media/images/System%20Design%20—%20Real-Time%20Chat%20App%20(MERN%20+%20Socket.drawio%20(1).png>)

## Getting Started

### 1. Navigate to the Backend

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

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

### 5. Navigate to the Frontend

```bash
cd ../frontend
```

### 6. Install dependencies

```bash
npm install
```

### 7. Environment Variables

.env file

```ini
REACT_APP_API_BASE_URL="http://localhost:8000"
```

### 8. Start the frontend

```bash
npm run start
```

### Client will be running at: http://localhost:3000
