const Comment = require('../models/Comment');

// Comment repository - handles all database operations for Comment model

const findCommentsByJob = async (jobId) => {
    return await Comment.find({ job: jobId })
        .populate('author', 'name role')
        .sort({ createdAt: 1 });
};

const createComment = async (commentData) => {
    const comment = await Comment.create(commentData);
    return await comment.populate('author', 'name role');
};

const findCommentById = async (commentId) => {
    return await Comment.findById(commentId);
};

const deleteCommentById = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) return null;
    
    await comment.deleteOne();
    return comment;
};

const findCommentsByAuthor = async (authorId) => {
    return await Comment.find({ author: authorId })
        .populate('job', 'title company')
        .sort({ createdAt: -1 });
};

module.exports = {
    findCommentsByJob,
    createComment,
    findCommentById,
    deleteCommentById,
    findCommentsByAuthor,
};