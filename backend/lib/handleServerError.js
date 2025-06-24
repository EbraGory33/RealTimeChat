/**
 * @desc Centralized error handling middleware for logging and responding
 * @param {object} res - Express response object
 * @param {object} error - Error object
 * @param {string} location - Name of the controller or logic block
 */
const handleServerError = (res, error, location) => {
    console.error(`Error in ${location}:`, error.message);
    return res.status(500).json({ message: `Internal server error: ${error.message}`});
};

module.exports = {
    handleServerError,
};