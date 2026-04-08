const discussionService = require('../services/discussionService');

// Discussion controller - handles HTTP request/response coordination

// @desc Get all comments for a job
const getComments = async (req, res) => {
    try {
        const comments = await discussionService.getComments(req.params.jobId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Post a comment
const postComment = async (req, res) => {
    try {
        const comment = await discussionService.postComment(
            req.params.jobId,
            req.user._id,
            req.body.content
        );
        res.status(201).json(comment);
    } catch (error) {
        const statusCode = error.message === 'Job not found' ? 404 : 400;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc Delete a comment
const deleteComment = async (req, res) => {
    try {
        await discussionService.deleteComment(
            req.params.commentId,
            req.user._id,
            req.user.role
        );
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        const statusCode = error.statusCode || (error.message === 'Comment not found' ? 404 : 500);
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { getComments, postComment, deleteComment };