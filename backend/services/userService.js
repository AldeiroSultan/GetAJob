const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const commentRepository = require('../repositories/commentRepository');
const { normalizePayload, validateProfileInput } = require('../utils/validation');

// User service - handles user-related business logic

const getUserProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const updateUserProfile = async (userId, updates) => {
    const normalizedUpdates = normalizePayload(updates);

    // Validate input
    const validationError = validateProfileInput(normalizedUpdates);
    if (validationError) {
        throw new Error(validationError);
    }

    // Check if user exists
    const user = await userRepository.findUserByIdWithPassword(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if email is already taken by another user
    const existingUser = await userRepository.findUserByEmail(normalizedUpdates.email);
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new Error('Email is already in use');
    }

    // Prepare updates
    const updateData = {
        name: normalizedUpdates.name,
        email: normalizedUpdates.email,
    };

    // Hash new password if provided
    if (normalizedUpdates.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(normalizedUpdates.password, salt);
    }

    // Update user
    const updatedUser = await userRepository.updateUser(userId, updateData);

    // Return user data without password
    return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
    };
};

const getUserComments = async (userId) => {
    return await commentRepository.findCommentsByAuthor(userId);
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserComments,
};