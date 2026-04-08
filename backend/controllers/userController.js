const userService = require('../services/userService');

// User controller - handles HTTP request/response coordination

// @desc Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// @desc Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get comments made by logged in user
const getMyComments = async (req, res) => {
    try {
        const comments = await userService.getUserComments(req.user._id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, getMyComments };