const express = require('express');
const router = express.Router({ mergeParams: true });
const { getComments, postComment, deleteComment } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getComments);
router.post('/', protect, postComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;