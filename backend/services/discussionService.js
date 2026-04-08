const commentRepository = require('../repositories/commentRepository');
const jobRepository = require('../repositories/jobRepository');

// Discussion service - handles comment-related business logic

const getComments = async (jobId) => {
    return await commentRepository.findCommentsByJob(jobId);
};

const postComment = async (jobId, userId, content) => {
    // Validate content
    if (!content || content.trim() === '') {
        throw new Error('Comment cannot be empty');
    }

    // Check if job exists
    const job = await jobRepository.findJobById(jobId);
    if (!job) {
        throw new Error('Job not found');
    }

    // Create comment
    return await commentRepository.createComment({
        job: jobId,
        author: userId,
        content,
    });
};

const deleteComment = async (commentId, userId, userRole) => {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }

    // Check authorization
    if (comment.author.toString() !== userId.toString() && userRole !== 'admin') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    // Delete comment
    await commentRepository.deleteCommentById(commentId);
};

module.exports = {
    getComments,
    postComment,
    deleteComment,
};