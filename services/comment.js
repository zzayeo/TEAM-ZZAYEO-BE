//스키마
const Comment = require('../models/comment');

const getCommentByPlanId = async ({ planId }) => {
    const getComment = await Comment.find({ planId })
        .populate('likeCount userId')
        .populate({
            path: 'replies',
            populate: { path: 'userId likeCount' },
        });
    return getComment;
};

const getCommentLike = async (foundComment, user) => {
    const commentLike = await Comment.findLike(foundComment, user);
    return commentLike;
};

const createComment = async ({ userId, content, planId }) => {
    try {
        await Comment.create({
            userId,
            content,
            planId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCommentByPlanId,
    getCommentLike,
    createComment
};
