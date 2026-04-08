const Application = require('../models/Application');

// Application repository - handles all database operations for Application model

const findApplicationByJobAndApplicant = async (jobId, applicantId) => {
    return await Application.findOne({
        job: jobId,
        applicant: applicantId,
    });
};

const createApplication = async (applicationData) => {
    return await Application.create(applicationData);
};

const findApplicationsByApplicant = async (applicantId) => {
    return await Application.find({ applicant: applicantId })
        .populate('job', 'title company location type')
        .sort({ createdAt: -1 });
};

const findApplicationsByJob = async (jobId) => {
    return await Application.find({ job: jobId })
        .populate('applicant', 'name email profileImage')
        .sort({ createdAt: -1 });
};

const findApplicationById = async (applicationId) => {
    return await Application.findById(applicationId);
};

const updateApplicationStatus = async (applicationId, status) => {
    const application = await Application.findById(applicationId);
    if (!application) return null;
    
    application.status = status;
    return await application.save();
};

const countApplications = async (filter = {}) => {
    return await Application.countDocuments(filter);
};

const findRecentApplications = async (limit = 5) => {
    return await Application.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('job', 'title')
        .populate('applicant', 'name')
        .select('status createdAt job applicant');
};

module.exports = {
    findApplicationByJobAndApplicant,
    createApplication,
    findApplicationsByApplicant,
    findApplicationsByJob,
    findApplicationById,
    updateApplicationStatus,
    countApplications,
    findRecentApplications,
};