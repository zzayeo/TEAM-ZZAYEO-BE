const Reply = require('../models/reply');

//댓글에 답글 생성
const createReply = async ({ userId, content, planId, commentId }) => {
    const newReply = await Reply.create({
        userId,
        commentId,
        content,
        planId,
    });
    return;
};

const getTargetReply = async ({ replyId }) => {
    const targetReply = await Reply.findOne({ _id: replyId });
    return targetReply;
};

//댓글에 답글 수정
const updateReply = async ({ content, replyId }) => {
    await Reply.updateOne({ _id: replyId }, { $set: { content } });
    return;
};

module.exports = {
    createReply,
    getTargetReply,
    updateReply,
};
