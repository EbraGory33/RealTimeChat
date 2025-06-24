const Message = require("../models/Message");


/**
 * @desc Creates and saves a new message to the database
 * @param {object} param0 - Object containing sender, receiver, and content
 * @returns {object} - Saved message document
 */
async function createMessage({ sender, receiver, content }) {
  const message = new Message({ sender, receiver, content });
  await message.save();
  return message;
}
module.exports = {
    createMessage
}