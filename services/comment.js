//스키마
const Comment = require('../models/comment');

const getCommentByPlanId = async ({ planId }) => {
    const getComment = await Comment.find({ planId }).populate('likeCount userId').populate({
        path: 'replies', populate :{ path : 'userId likeCount' }
    });
    return getComment;
};

const getCommentLike = async (foundComment, user) => {
    const commentLike = await Comment.findLike(foundComment, user);
     return commentLike;
 };

module.exports = {
    getCommentByPlanId,
    getCommentLike
};
