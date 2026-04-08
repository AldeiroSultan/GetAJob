const Job = require('../models/Job');

// Job repository - handles all database operations for Job model

const findAllJobs = async (query = {}) => {
    return await Job.find(query)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 });
};

const findJobById = async (jobId) => {
    return await Job.findById(jobId).populate('postedBy', 'name email');
};

const createJob = async (jobData) => {
    return await Job.create(jobData);
};

const updateJobById = async (jobId, updates) => {
    return await Job.findByIdAndUpdate(jobId, updates, { new: true });
};

const deleteJobById = async (jobId) => {
    const job = await Job.findById(jobId);
    if (!job) return null;
    
    await job.deleteOne();
    return job;
};

const findJobsByUser = async (userId) => {
    return await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
};

const countJobs = async (filter = {}) => {
    return await Job.countDocuments(filter);
};

const findRecentJobs = async (limit = 5) => {
    return await Job.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title company createdAt');
};

module.exports = {
    findAllJobs,
    findJobById,
    createJob,
    updateJobById,
    deleteJobById,
    findJobsByUser,
    countJobs,
    findRecentJobs,
};