const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc Get all users
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Toggle user disabled status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot disable an admin account' });
        }
        user.isDisabled = !user.isDisabled;
        await user.save();
        res.json({ message: `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete an admin account' });
        }
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get dashboard stats
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const employers = await User.countDocuments({ role: 'employer' });
        const applicants = await User.countDocuments({ role: 'applicant' });
        res.json({ totalUsers, totalJobs, totalApplications, employers, applicants });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleUserStatus, deleteUser, getAllJobs, getStats };