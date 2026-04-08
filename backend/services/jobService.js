const mongoose = require('mongoose');
const jobRepository = require('../repositories/jobRepository');
const jobs = require('../jobs.json');
const { normalizePayload, validateJobInput } = require('../utils/validation');

// Job service - handles job-related business logic

const filterJsonJobs = ({ term = '', search = '', type = '', location = '' } = {}) => {
    const normalizedTerm = (search || term).toLowerCase();
    const normalizedType = type.toLowerCase();
    const normalizedLocation = location.toLowerCase();

    return jobs.filter((job) => {
        const matchesTerm =
            !normalizedTerm ||
            job.title.toLowerCase().includes(normalizedTerm) ||
            job.company.toLowerCase().includes(normalizedTerm) ||
            job.description.toLowerCase().includes(normalizedTerm);

        const matchesType = !normalizedType || job.type.toLowerCase() === normalizedType;
        const matchesLocation = !normalizedLocation || job.location.toLowerCase().includes(normalizedLocation);

        return matchesTerm && matchesType && matchesLocation;
    });
};

const getJobs = async ({ search, type, location }) => {
    const filteredJsonJobs = filterJsonJobs({ search, type, location });

    // If MongoDB is not connected, return JSON jobs
    if (mongoose.connection.readyState !== 1) {
        return filteredJsonJobs;
    }

    // Build query for database
    let query = { isActive: true };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }

    if (type) {
        query.type = type;
    }

    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    // Get jobs from database
    const dbJobs = await jobRepository.findAllJobs(query);

    // Return DB jobs if found
    if (dbJobs.length > 0) {
        return dbJobs;
    }

    // Check if there are any active jobs in DB
    const activeJobCount = await jobRepository.countJobs({ isActive: true });
    
    // If no active jobs in DB, return JSON jobs
    if (activeJobCount === 0) {
        return filteredJsonJobs;
    }

    // Otherwise return empty array
    return [];
};

const getJobById = async (jobId) => {
    // Check if it's a JSON job first
    const jsonJob = jobs.find((job) => job._id === jobId);

    // If not a valid MongoDB ID, return JSON job or error
    if (!mongoose.isValidObjectId(jobId)) {
        if (jsonJob) {
            return jsonJob;
        }
        throw new Error('Job not found');
    }

    // Try to get from database
    const job = await jobRepository.findJobById(jobId);

    if (!job) {
        // Fallback to JSON job if available
        if (jsonJob) {
            return jsonJob;
        }
        throw new Error('Job not found');
    }

    return job;
};

const createJob = async (jobData, userId) => {
    const { title, company, location, type, description, requirements, salary } = normalizePayload(jobData);

    // Validate input
    const validationError = validateJobInput({
        title,
        company,
        location,
        description,
        requirements,
    });

    if (validationError) {
        throw new Error(validationError);
    }

    // Create job
    return await jobRepository.createJob({
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary,
        postedBy: userId,
    });
};

const updateJob = async (jobId, updates, userId, userRole) => {
    const job = await jobRepository.findJobById(jobId);

    if (!job) {
        throw new Error('Job not found');
    }

    // Check authorization
    if (job.postedBy._id.toString() !== userId.toString() && userRole !== 'admin') {
        const error = new Error('Not authorized to update this job');
        error.statusCode = 403;
        throw error;
    }

    // Normalize and validate updates
    const normalizedUpdates = normalizePayload(updates);
    const mergedPayload = {
        title: normalizedUpdates.title ?? job.title,
        company: normalizedUpdates.company ?? job.company,
        location: normalizedUpdates.location ?? job.location,
        description: normalizedUpdates.description ?? job.description,
        requirements: normalizedUpdates.requirements ?? job.requirements,
    };

    const validationError = validateJobInput(mergedPayload);
    if (validationError) {
        throw new Error(validationError);
    }

    // Update job
    return await jobRepository.updateJobById(jobId, normalizedUpdates);
};

const deleteJob = async (jobId, userId, userRole) => {
    const job = await jobRepository.findJobById(jobId);

    if (!job) {
        throw new Error('Job not found');
    }

    // Check authorization
    if (job.postedBy._id.toString() !== userId.toString() && userRole !== 'admin') {
        const error = new Error('Not authorized to delete this job');
        error.statusCode = 403;
        throw error;
    }

    // Delete job
    await jobRepository.deleteJobById(jobId);
};

const getMyJobs = async (userId) => {
    return await jobRepository.findJobsByUser(userId);
};

module.exports = {
    filterJsonJobs,
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
};