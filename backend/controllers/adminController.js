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
        const disabledUsers = await User.countDocuments({ isDisabled: true });
        const activeJobs = await Job.countDocuments({ isActive: true });

        const [
            pendingApplications,
            reviewedApplications,
            acceptedApplications,
            rejectedApplications,
            remoteJobs,
            fullTimeJobs,
            recentUsers,
            recentJobs,
            recentApplications,
        ] = await Promise.all([
            Application.countDocuments({ status: 'pending' }),
            Application.countDocuments({ status: 'reviewed' }),
            Application.countDocuments({ status: 'accepted' }),
            Application.countDocuments({ status: 'rejected' }),
            Job.countDocuments({ location: { $regex: 'remote', $options: 'i' } }),
            Job.countDocuments({ type: 'full-time' }),
            User.find({}).sort({ createdAt: -1 }).limit(5).select('name role createdAt'),
            Job.find({}).sort({ createdAt: -1 }).limit(5).select('title company createdAt'),
            Application.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('job', 'title')
                .populate('applicant', 'name')
                .select('status createdAt job applicant'),
        ]);

        res.json({
            totalUsers,
            totalJobs,
            totalApplications,
            employers,
            applicants,
            disabledUsers,
            activeJobs,
            remoteJobs,
            fullTimeJobs,
            applicationBreakdown: {
                pending: pendingApplications,
                reviewed: reviewedApplications,
                accepted: acceptedApplications,
                rejected: rejectedApplications,
            },
            recentUsers,
            recentJobs,
            recentApplications,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get public stats for homepage
const getPublicStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments();
        const employers = await User.countDocuments({ role: 'employer' });
        res.json({ totalJobs, totalUsers, employers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleUserStatus, deleteUser, getAllJobs, getStats, getPublicStats };
