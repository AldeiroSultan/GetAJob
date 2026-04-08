const User = require('../models/User');

// User repository - handles all database operations for User model

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const findUserById = async (id) => {
    return await User.findById(id).select('-password');
};

const findUserByIdWithPassword = async (id) => {
    return await User.findById(id);
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const updateUser = async (userId, updates) => {
    const user = await User.findById(userId);
    if (!user) return null;
    
    Object.assign(user, updates);
    return await user.save();
};

const searchUsers = async (searchQuery) => {
    let query = {};
    if (searchQuery) {
        query.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
        ];
    }
    return await User.find(query).select('-password').sort({ createdAt: -1 });
};

const toggleUserDisabledStatus = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;
    
    user.isDisabled = !user.isDisabled;
    return await user.save();
};

const deleteUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;
    
    await user.deleteOne();
    return user;
};

const countUsers = async (filter = {}) => {
    return await User.countDocuments(filter);
};

const findRecentUsers = async (limit = 5) => {
    return await User.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name role createdAt');
};

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByIdWithPassword,
    createUser,
    updateUser,
    searchUsers,
    toggleUserDisabledStatus,
    deleteUserById,
    countUsers,
    findRecentUsers,
};