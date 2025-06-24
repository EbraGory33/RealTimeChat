const User = require('../models/User');
const { io, getSocketIdForUser } = require("./socket");

/**
 * @desc Emits a real-time "newMessage" event to the receiver
 * @param {string} receiverId - ID of the message receiver
 * @param {object} message - The message object
 */
function emitNewMessage(receiverId, message) {
  const socketId = getSocketIdForUser(receiverId);
  if (socketId) {
    io.to(socketId).emit("newMessage", message);
  }
}

/**
 * @desc Notifies both users of a new contact if a new conversation is started
 * @param {string} senderId
 * @param {string} receiverId
 */
async function notifyNewContacts(senderId, receiverId) {
  const senderSocketId = getSocketIdForUser(senderId);
  const receiverSocketId = getSocketIdForUser(receiverId);
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (senderSocketId) io.to(senderSocketId).emit("newContact", { contact: receiver });
  if (receiverSocketId) io.to(receiverSocketId).emit("newContact", { contact: sender });
}
module.exports = {
    emitNewMessage,
    notifyNewContacts,
}