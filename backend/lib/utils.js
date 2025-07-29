const jwt = require("jsonwebtoken");
const ms = require("ms");

/**
 * Generates a JWT for the authenticated user and sets it as an HTTP-only cookie in the response.
 *
 * @function generateToken
 * @param {Object} user - The authenticated user object.
 * @param {string} user._id - The user's unique MongoDB ID.
 * @param {string} user.username - The user's username.
 * @param {Object} res - Express response object used to set the cookie.
 * @returns {string} token - The signed JWT token.
 *
 * @example
 * generateToken(user, res); // Sets the token cookie and returns the token string
 *
 * Notes:
 * - Cookie is set with options for security (httpOnly, sameSite, secure).
 * - Token expiration is driven by `process.env.TOKEN_EXPIRES_IN` (e.g., "7d", "3h").
 */
const generateToken = (user, res) => {
    
  const payload = {
      userId: user._id,
      username: user.username
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
      expiresIn: process.env.TOKEN_EXPIRES_IN
  });

  const tokenExpiry = process.env.TOKEN_EXPIRES_IN || "7d";
  const maxAgeMs = ms(tokenExpiry);

  console.log(`IsSecure: ${process.env.NODE_ENV !== "development"}`)

  res.cookie("jwt", token, {
    maxAge: maxAgeMs,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

module.exports = { generateToken }