const Application = require('../models/Application');
const Job = require('../models/Job');

// receive request, extract values, return response

// @desc Apply to a job
const applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // check if already applied
        const alreadyApplied = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You already applied to this job' });
        }

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
            coverLetter: req.body.coverLetter || '',
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get my applications (applicant)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location type')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get applicants for a job (employer)
const getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update application status (employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = req.body.status || application.status;
        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus };