const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../lib/utils');
const { handleServerError} = require('../lib/handleServerError')

/**
* Hashes a plain-text password using bcrypt.
* @param {string} password - The user's plain password.
* @returns {Promise<string>} The hashed password.
*/
const hashpassword = async (password) => {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const userpasswordHash = await bcrypt.hash(password, salt);
    
    return userpasswordHash
};

/**
 * Registers a new user if the input is valid and the email is not already taken.
 * Hashes the password and generates a JWT token upon success.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
const signup = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (!isValidSignupInput({ username, email, password })) {
           return res.status(400).json({ message: "Invalid input data" });
        }
        
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        // Hash password
        const passwordHash = await hashpassword(password);
        
        const newUser = await User.create({
            email,
            username,
            passwordHash,
        })
        if (newUser) {
            generateToken(newUser, res);
            
            res.status(201).json({ message: 'User created', userId: newUser._id });
        }else {
            res.status(400).json({ message: "Invalid user data" });
        }
    
    } catch (error) {
        return handleServerError(res, error, 'signup');
    }
};

const isValidSignupInput = ({ username, email, password }) => {
    return username && email && password && password.length >= 6;
};

/**
* Logs in a user by verifying the username and password, then generates a JWT token.
* @param {import('express').Request} req - Express request object.
* @param {import('express').Response} res - Express response object.
*/
const login = async (req, res) =>{

    const{ username, password} = req.body;
    
    try {
        const user = await User.findOne({ username }).select('+passwordHash');
        
        if (!user) {
            return res.status(400).json({message: 'Invalid username or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid username or password' });
        }
        generateToken(user, res);
        
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return handleServerError(res, error, 'login');
    }
};

/**
* Logs out the user by clearing the JWT cookie.
* @param {import('express').Request} req 
* @param {import('express').Response} res 
*/
const logout = (req, res) =>{
    try {
        res.cookie('jwt', "", {maxAge: 0})
        .status(200).json({message: 'Logged out successfully'})
    }  catch (error) {
        return handleServerError(res, error, 'logout');
    }
};

/**
* Checks if the user is authenticated by returning user data.
* @param {import('express').Request} req 
* @param {import('express').Response} res 
*/
const verifyUserSession = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
        return handleServerError(res, error, 'verifyUserSession');
    }
};

module.exports = {
    signup,
    login,
    logout,
    verifyUserSession,
};
