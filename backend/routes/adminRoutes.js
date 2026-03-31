const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    toggleUserStatus,
    deleteUser,
    getAllJobs,
    getStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/jobs', protect, adminOnly, getAllJobs);

module.exports = router;