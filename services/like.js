//스키마
const Like = require('../models/like');

//userId, planId, type으로 DB에 있는지 확인하기
const findLikeByUserIdAndIdAndType = async ({ userId, Id, type }) => {
    
    if (type === 'plan') {
        const findLike = await Like.findOne({ userId, planId: Id });

        if (findLike !== null) {
            return;
        }
        return findLike;
    }
    if (type === 'comment') {
        const findLike = await Like.findOne({ userId, commentId: Id });

        if (findLike !== null) {
            return;
        }
        return findLike;
    }
    if (type === 'reply') {
        const findLike = await Like.findOne({ userId, replyId: Id });

        if (findLike !== null) {
            return;
        }
        return findLike;
    }
}

module.exports = {
    findLikeByUserIdAndIdAndType
};