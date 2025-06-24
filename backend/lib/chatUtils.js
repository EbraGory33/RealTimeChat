const Message = require("../models/Message");

/**
 * @desc Checks if a conversation already exists between two users
 * @param {string} senderId
 * @param {string} receiverId
 * @returns {boolean}
 */
async function conversationExists(senderId, receiverId) {
  return await Message.exists({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });
}

module.exports = {
  conversationExists,
};
