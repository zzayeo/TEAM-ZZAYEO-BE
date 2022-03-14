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

        return findLike;
    }
};

//userId와 planId로 Like콜렉션에 도큐먼트 생성하기
const createLike = async ({ userId, Id, type }) => {
    if (type === 3) {
        await Like.create({
            userId,
            planId: Id,
        });
        return;
    }
    if (type === 4) {
        await Like.create({
            userId,
            commentId: Id,
        });
        return;
    }
    if (type === 5) {
        await Like.create({
            userId,
            replyId: Id,
        });
        return;
    }
};
//userId와 planId로 Like콜렉션에서 도큐먼트 삭제하기
const deleteLike = async ({ Id, userId, type }) => {
    if (type === 3) {
        await Like.deleteOne({
            userId,
            planId: Id,
        });
        return;
    }
    if (type === 4) {
        await Like.deleteOne({
            userId,
            commentId: Id,
        });
        return;
    }
    if (type === 5) {
        await Like.deleteOne({
            userId,
            replyId: Id,
        });
        return;
    }
};

module.exports = {
    findLikeByUserIdAndIdAndType,
    createLike,
    deleteLike,
};
