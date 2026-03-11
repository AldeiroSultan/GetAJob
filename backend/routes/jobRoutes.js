const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    searchJobsFromJson,
} = require('../controllers/jobController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

router.get('/search', searchJobsFromJson);
router.get('/', getJobs);
router.get('/myjobs', protect, employerOnly, getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, employerOnly, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;