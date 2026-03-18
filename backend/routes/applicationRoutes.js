const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

// implement routes and connect to controllers
router.post('/:jobId/apply', protect, applyToJob);
router.get('/myapplications', protect, getMyApplications);
router.get('/:jobId/applicants', protect, employerOnly, getJobApplicants);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

module.exports = router;