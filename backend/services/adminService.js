const userRepository = require('../repositories/userRepository');
const jobRepository = require('../repositories/jobRepository');
const applicationRepository = require('../repositories/applicationRepository');

// Admin service - handles admin-related business logic

const getAllUsers = async (searchQuery) => {
    return await userRepository.searchUsers(searchQuery);
};

const toggleUserStatus = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        throw new Error('Cannot disable an admin account');
    }

    return await userRepository.toggleUserDisabledStatus(userId);
};

const deleteUser = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        throw new Error('Cannot delete an admin account');
    }

    await userRepository.deleteUserById(userId);
};

const getAllJobs = async () => {
    return await jobRepository.findAllJobs({});
};

const getStats = async () => {
    // Get basic counts
    const totalUsers = await userRepository.countUsers();
    const totalJobs = await jobRepository.countJobs();
    const totalApplications = await applicationRepository.countApplications();
    const employers = await userRepository.countUsers({ role: 'employer' });
    const applicants = await userRepository.countUsers({ role: 'applicant' });
    const disabledUsers = await userRepository.countUsers({ isDisabled: true });
    const activeJobs = await jobRepository.countJobs({ isActive: true });

    // Get detailed breakdowns and recent data
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
        applicationRepository.countApplications({ status: 'pending' }),
        applicationRepository.countApplications({ status: 'reviewed' }),
        applicationRepository.countApplications({ status: 'accepted' }),
        applicationRepository.countApplications({ status: 'rejected' }),
        jobRepository.countJobs({ location: { $regex: 'remote', $options: 'i' } }),
        jobRepository.countJobs({ type: 'full-time' }),
        userRepository.findRecentUsers(5),
        jobRepository.findRecentJobs(5),
        applicationRepository.findRecentApplications(5),
    ]);

    return {
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
    };
};

const getPublicStats = async () => {
    const totalJobs = await jobRepository.countJobs({ isActive: true });
    const totalUsers = await userRepository.countUsers();
    const employers = await userRepository.countUsers({ role: 'employer' });

    return { totalJobs, totalUsers, employers };
};

module.exports = {
    getAllUsers,
    toggleUserStatus,
    deleteUser,
    getAllJobs,
    getStats,
    getPublicStats,
};