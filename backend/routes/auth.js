const express = require('express');
const { signup, login, logout, verifyUserSession } = require('../controllers/authController')
const { authenticateUser } = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/authenticate", authenticateUser, verifyUserSession);

module.exports = router;
