const applicationService = require('../services/applicationService');

// Application controller - handles HTTP request/response coordination

// @desc Apply to a job
const applyToJob = async (req, res) => {
    try {
        const application = await applicationService.applyToJob(
            req.params.jobId,
            req.user._id,
            req.body.coverLetter
        );
        res.status(201).json(application);
    } catch (error) {
        const statusCode = error.message === 'Job not found' ? 404 : 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Get my applications (applicant)
const getMyApplications = async (req, res) => {
    try {
        const applications = await applicationService.getMyApplications(req.user._id);
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get applicants for a job (employer)
const getJobApplicants = async (req, res) => {
    try {
        const applications = await applicationService.getJobApplicants(
            req.params.jobId,
            req.user._id,
            req.user.role
        );
        res.json(applications);
    } catch (error) {
        const statusCode = error.statusCode || (error.message === 'Job not found' ? 404 : 500);
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Update application status (employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const application = await applicationService.updateApplicationStatus(
            req.params.id,
            req.body.status
        );
        res.json(application);
    } catch (error) {
        const statusCode = error.message === 'Application not found' ? 404 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus };