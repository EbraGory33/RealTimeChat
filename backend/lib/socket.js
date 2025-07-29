const { Server } = require("socket.io");
const http = require('http');
const express = require('express');
const User = require("../models/User");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000"] },
});

/**
 * Retrieves the socket ID for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {string|undefined} - The socket ID if the user is online.
 */
const getSocketIdForUser = (userId) => {
  return onlineUsersMap[userId];
}

/**
 * A map of currently connected users.
 * @type {Object.<string, string>} userId -> socketId
 */
const onlineUsersMap = {};

io.on("connection", (socket) => {
  //console.log(`A user connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) addUserSocket(userId, socket.id)

  // Notify all clients about current online users
  io.emit("getOnlineUsers", getOnlineUserIds());

   /**
   * Handles live user search by username.
   * Emits results back to the client.
   * @event searchUsers
   * @param {string} term - The search term typed by the user.
   */
  socket.on("searchUsers", async (term) => {
    try {
      const results = await User.find({
      username: { $regex: `^${term}`, $options: "i" },
      }).select("_id username");

      socket.emit("searchResults", results);
    } catch (err) {
      console.error("Search error:", err.message);
    }
  });

  /**
   * Handles disconnection of a user.
   * Removes them from the online users map and updates all clients.
   */
  socket.on("disconnect", () => {
    //console.log("A user disconnected", socket.id);
    if (userId) {
      removeUserSocket(userId);
      io.emit("getOnlineUsers", getOnlineUserIds());
    }
  });
});

/**
 * Adds a user and their socket to the online users map.
 * @param {string} userId - The user’s ID.
 * @param {string} socketId - The socket ID associated with the user.
 */
function addUserSocket(userId, socketId) {
  onlineUsersMap[userId] = socketId;
}

/**
 * Removes a user from the online users map.
 * @param {string} userId - The user’s ID to remove.
 */
function removeUserSocket(userId) {
  delete onlineUsersMap[userId];
}

/**
 * Gets a list of all currently online user IDs.
 * @returns {string[]} - Array of online user IDs.
 */
function getOnlineUserIds() {
  return Object.keys(onlineUsersMap);
}



module.exports = { io, app, server, getSocketIdForUser };