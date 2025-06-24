const express = require('express');
const { fetchSidebarUsers, getContacts, getMessages, createAndDispatchMessage } = require('../controllers/messageController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router(); 

router.get("/users", authenticateUser, fetchSidebarUsers);
router.get("/contacts", authenticateUser, getContacts);
router.get("/:id", authenticateUser, getMessages);
router.post("/send/:id", authenticateUser, createAndDispatchMessage);


module.exports = router;