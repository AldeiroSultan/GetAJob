const Comment = require('../models/Comment');
const Job = require('../models/Job');

// @desc Get all comments for a job
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ job: req.params.jobId })
            .populate('author', 'name role')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Post a comment
const postComment = async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const comment = await Comment.create({
            job: req.params.jobId,
            author: req.user._id,
            content,
        });

        const populated = await comment.populate('author', 'name role');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete a comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getComments, postComment, deleteComment };