const ReplyService = require('../services/replies');

//댓글에 답글 작성
const postReply = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { content } = req.body;
        const { planId, commentId } = req.params;

        const Replies = await ReplyService.createreplies({ userId, content, planId, commentId });

        return res.json({ result: 'success', message: '작성 완료' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postReply,
};
