const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { normalizePayload, validateProfileInput } = require('../utils/validation');

// @desc Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const updates = normalizePayload(req.body);
        const validationError = validateProfileInput(updates);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUser = await User.findOne({
            email: updates.email,
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        user.name = updates.name;
        user.email = updates.email;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get comments made by logged in user
const getMyComments = async (req, res) => {
    try {
        const Comment = require('../models/Comment');
        const comments = await Comment.find({ author: req.user._id })
            .populate('job', 'title company')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, getMyComments };
