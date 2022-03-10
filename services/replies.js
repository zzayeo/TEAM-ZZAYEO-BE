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

module.exports = {
    createReply,
};
