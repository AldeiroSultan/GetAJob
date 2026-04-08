const authService = require('../services/authService');

// Auth controller - handles HTTP request/response coordination

// @desc Register a new user
const registerUser = async (req, res) => {
    try {
        const userData = await authService.registerUser(req.body, req.file);
        res.status(201).json(userData);
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Login user
const loginUser = async (req, res) => {
    try {
        const userData = await authService.loginUser(req.body);
        res.json(userData);
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Get current logged in user
const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };