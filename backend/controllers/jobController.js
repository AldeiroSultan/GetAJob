const Job = require('../models/Job');
const mongoose = require('mongoose');
const jobs = require('../jobs.json')
const { normalizePayload, validateJobInput } = require('../utils/validation');

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

        const matchesType =
            !normalizedType || job.type.toLowerCase() === normalizedType;

        const matchesLocation =
            !normalizedLocation || job.location.toLowerCase().includes(normalizedLocation);

        return matchesTerm && matchesType && matchesLocation;
    });
};

const searchJobsFromJson = (req, res) => {
    res.json(filterJsonJobs(req.query));
}

// @desc Get all jobs (with optional search/filter)
const getJobs = async (req, res) => {
    try {
        const { search, type, location } = req.query;
        const filteredJsonJobs = filterJsonJobs({ search, type, location });

        if (mongoose.connection.readyState !== 1) {
            return res.json(filteredJsonJobs);
        }

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

        const dbJobs = await Job.find(query)
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        if (dbJobs.length > 0) {
            return res.json(dbJobs);
        }

        const activeJobCount = await Job.countDocuments({ isActive: true });
        if (activeJobCount === 0) {
            return res.json(filteredJsonJobs);
        }

        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single job by ID
const getJobById = async (req, res) => {
    try {
        const jsonJob = jobs.find((job) => job._id === req.params.id);

        if (!mongoose.isValidObjectId(req.params.id)) {
            if (jsonJob) {
                return res.json(jsonJob);
            }

            return res.status(404).json({ message: 'Job not found' });
        }

        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (!job) {
            if (jsonJob) {
                return res.json(jsonJob);
            }

            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a new job (employer only)
const createJob = async (req, res) => {
    const { title, company, location, type, description, requirements, salary } = normalizePayload(req.body);
    const validationError = validateJobInput({
        title,
        company,
        location,
        description,
        requirements,
    });

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const job = await Job.create({
            title,
            company,
            location,
            type,
            description,
            requirements,
            salary,
            postedBy: req.user._id,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update a job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const updates = normalizePayload(req.body);
        const mergedPayload = {
            title: updates.title ?? job.title,
            company: updates.company ?? job.company,
            location: updates.location ?? job.location,
            description: updates.description ?? job.description,
            requirements: updates.requirements ?? job.requirements,
        };
        const validationError = validateJobInput(mergedPayload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get jobs posted by logged in employer
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, searchJobsFromJson };
