const applicationRepository = require('../repositories/applicationRepository');
const jobRepository = require('../repositories/jobRepository');

// Application service - handles application-related business logic

const applyToJob = async (jobId, applicantId, coverLetter = '') => {
    // Check if job exists
    const job = await jobRepository.findJobById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    // Check if already applied
    const alreadyApplied = await applicationRepository.findApplicationByJobAndApplicant(jobId, applicantId);
    if (alreadyApplied) {
        throw new Error('You already applied to this job');
    }

    // Create application
    return await applicationRepository.createApplication({
        job: jobId,
        applicant: applicantId,
        coverLetter,
    });
};

const getMyApplications = async (applicantId) => {
    return await applicationRepository.findApplicationsByApplicant(applicantId);
};

const getJobApplicants = async (jobId, userId, userRole) => {
    // Check if job exists
    const job = await jobRepository.findJobById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    // Check authorization
    if (job.postedBy._id.toString() !== userId.toString() && userRole !== 'admin') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    // Get applicants
    return await applicationRepository.findApplicationsByJob(jobId);
};

const updateApplicationStatus = async (applicationId, status) => {
    const application = await applicationRepository.findApplicationById(applicationId);
    if (!application) {
        throw new Error('Application not found');
    }

    return await applicationRepository.updateApplicationStatus(applicationId, status);
};

module.exports = {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
};