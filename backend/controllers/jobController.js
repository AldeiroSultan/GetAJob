const jobService = require('../services/jobService');

// Job controller - handles HTTP request/response coordination

const searchJobsFromJson = (req, res) => {
    const filteredJobs = jobService.filterJsonJobs(req.query);
    res.json(filteredJobs);
};

// @desc Get all jobs (with optional search/filter)
const getJobs = async (req, res) => {
    try {
        const { search, type, location } = req.query;
        const jobs = await jobService.getJobs({ search, type, location });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single job by ID
const getJobById = async (req, res) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        res.json(job);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// @desc Create a new job (employer only)
const createJob = async (req, res) => {
    try {
        const job = await jobService.createJob(req.body, req.user._id);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Update a job
const updateJob = async (req, res) => {
    try {
        const updatedJob = await jobService.updateJob(
            req.params.id,
            req.body,
            req.user._id,
            req.user.role
        );
        res.json(updatedJob);
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Delete a job
const deleteJob = async (req, res) => {
    try {
        await jobService.deleteJob(req.params.id, req.user._id, req.user.role);
        res.json({ message: 'Job removed' });
    } catch (error) {
        const statusCode = error.statusCode || 404;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Get jobs posted by logged in employer
const getMyJobs = async (req, res) => {
    try {
        const jobs = await jobService.getMyJobs(req.user._id);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, searchJobsFromJson };