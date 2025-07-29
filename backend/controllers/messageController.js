const User = require('../models/User');
const Message = require('../models/Message');
const { handleServerError} = require('../lib/handleServerError')

const { conversationExists } = require("../lib/chatUtils");
const { createMessage } = require("../lib/messageUtils");
const { emitNewMessage, notifyNewContacts } = require("../lib/socketUtils");

/**
 * @desc Fetch users excluding the logged-in user, for use in sidebar list
 * @route GET /api/messages/users
 * @access Private
 */
const fetchSidebarUsers = async (req, res) => {
    try {
        const loggedInUserID = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserID } });
        //console.log(filteredUsers);
        res.status(200).json(filteredUsers);
    } catch (error) {
        return handleServerError(res, error, 'fetchSidebarUsers');
    }
}

/**
 * @desc Fetch list of unique users that the logged-in user has messaged with
 * @route GET /api/messages/contacts
 * @access Private
 */
const getContacts = async (req, res) => {
    try {
        const loggedInUserID = req.user._id
        
        const messages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: loggedInUserID },
                    { receiver: loggedInUserID },
                ]
            }
        },
        {
            $project: {
                contact: {
                    $cond: [
                        { $eq: ["$sender", loggedInUserID] },
                        "$receiver",
                        "$sender",
                    ]
                }
            }
        },
        {
            $group: {
            _id: "$contact"
            }
        }
        ]);
        const contactIDs = messages.map(m => m._id);

        const contacts = await User.find({ _id: { $in: contactIDs } });

        //console.log(JSON.stringify(contacts, null, 2));

        res.status(200).json(contacts);
    } catch (error) {
        return handleServerError(res, error, 'getContacts');
    }
}

/**
 * @desc Fetch all messages between the logged-in user and another user
 * @route GET /api/messages/:id
 * @access Private
 */
const getMessages = async (req, res) => {
    try {
        const { id: ContactId } = req.params;
        const UserId = req.user._id;
        //console.log("Logged-in user ID:", UserId);
        //console.log(`ContactId = ${ContactId}`);
        const messages = await Message.find({
            $or: [
                { sender: UserId, receiver: ContactId },
                { sender: ContactId, receiver: UserId }, 
            ],
        });
        //console.log(JSON.stringify(messages, null, 2));
        res.status(200).json(messages);
    } catch (error) {
        return handleServerError(res, error, 'getMessages');
    }
}

/**
 * @desc Create a new message and send real-time updates via socket
 * @route POST /api/messages/send/:id
 * @access Private
 */
const createAndDispatchMessage = async (req, res) => {
    try {
        const { content} = req.body;
        const { id: ContactId } = req.params;
        const UserId = req.user._id;
        
        const alreadyMessaged = await conversationExists(UserId, ContactId);
        const newMessage = await createMessage({ sender: UserId, receiver: ContactId, content });
        
        emitNewMessage(ContactId, newMessage);
        
        if (!alreadyMessaged) {
            await notifyNewContacts(ContactId, UserId);
        }

        res.status(201).json(newMessage);
        
    } catch (error){
        return handleServerError(res, error, 'createAndDispatchMessage');
    }
}

module.exports = {
    fetchSidebarUsers, 
    getContacts,
    getMessages, 
    createAndDispatchMessage, 
}

