/* eslint-disable no-useless-catch */
const Reply = require('../models/reply');
const Comment = require('../models/comment');

const getTargetReply = async ({ replyId }) => {
    const targetReply = await Reply.findOne({ _id: replyId });
    return targetReply;
};

//댓글에 답글 생성
const createReply = async ({ userId, content, commentId }) => {
    try {
        const findComment = await Comment.findOne({ _id: commentId });

        Reply.create({
            userId,
            commentId,
            content,
            planId: findComment.planId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

//댓글에 답글 수정
const updateReply = async ({ content, replyId }) => {
    await Reply.updateOne({ _id: replyId }, { $set: { content } });
    return;
};

//댓글에 답글 삭제
const deleteReply = async ({ replyId }) => {
    await Reply.deleteOne({ _id: replyId });
    return;
};

module.exports = {
    createReply,
    getTargetReply,
    updateReply,
    deleteReply,
};
