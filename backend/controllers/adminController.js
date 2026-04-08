const adminService = require('../services/adminService');

// Admin controller - handles HTTP request/response coordination

// @desc Get all users
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        const users = await adminService.getAllUsers(search);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Toggle user disabled status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await adminService.toggleUserStatus(req.params.id);
        const message = `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully`;
        res.json({ message, user });
    } catch (error) {
        const statusCode = error.message === 'User not found' ? 404 : 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Delete a user
const deleteUser = async (req, res) => {
    try {
        await adminService.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        const statusCode = error.message === 'User not found' ? 404 : 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await adminService.getAllJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get dashboard stats
const getStats = async (req, res) => {
    try {
        const stats = await adminService.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get public stats for homepage
const getPublicStats = async (req, res) => {
    try {
        const stats = await adminService.getPublicStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleUserStatus, deleteUser, getAllJobs, getStats, getPublicStats };