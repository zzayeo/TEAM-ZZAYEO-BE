const NoticeBoard = require('../models/noticeboard');
const NoticeMessage = require('../models/noticemessage');
const Plan = require('../models/plan');
const Comment = require('../models/comment');

const { NOTICE_EVENT: EVENT } = require('../config/constants');

const findAllNotice = async ({ user, next }) => {
    try {
        const findBoard = await NoticeBoard.findOne({
            userId: user.userId,
        }).populate({
            path: 'notices',
            populate: { path: 'sentUser', select: 'profile_img' },
        });
        await NoticeMessage.where({
            noticeBoardId: findBoard.noticeBoardId,
        }).updateMany({ checkNotice: 'true' });

        return findBoard.notices;
    } catch (error) {
        throw next(error);
    }
};

module.exports = {
    findAllNotice,
};
