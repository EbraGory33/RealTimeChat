const jwt = require('jsonwebtoken');
const User  = require('../models/User');
const { handleServerError } = require('../lib/handleServerError')

/**
 * @module middleware/authmiddleware
 * @description Middleware to authenticate users based on a JWT token stored in cookies.
 * If the token is valid and the corresponding user exists, the user is attached to `req.user`.
 */

/**
 * Authenticate incoming request using JWT token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {401} If the JWT token is missing or invalid.
 * @throws {404} If the user decoded from the token is not found in the database.
 * @throws {500} If an unexpected error occurs during processing.
 *
 * @example
 * // Usage in a route
 * router.get('/profile', authenticateUser, {?} );
 */

const authenticateUser = async (req, res, next) => {
  try {

    const token = req.cookies?.jwt;

    if (!token) {
      console.warn("Authentication failed: Missing token.");
      return res.status(401).json({ message: "Access denied: No token found." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Access denied: Token is invalid or expired." });
    }
  
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return handleServerError(res, error, 'authenticateUser');
  }
};

module.exports = { authenticateUser }