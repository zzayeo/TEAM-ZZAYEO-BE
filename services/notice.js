/* eslint-disable no-useless-catch */
const NoticeBoard = require('../models/noticeboard');
const NoticeMessage = require('../models/noticemessage');
const Plan = require('../models/plan');
const Comment = require('../models/comment');

const { NOTICE_EVENT: EVENT } = require('../config/constants');

const findAllNotice = async ({ user }) => {
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
        throw error;
    }
};

const createNewNoticeBoard = async ({ user }) => {
    try {
        const findExistBoard = await NoticeBoard.findOne({
            boardNum: user.snsId,
            userId: user.userId,
        });

        if (findExistBoard) return;
        else {
            const newBoard = new NoticeBoard({
                boardNum: user.snsId,
                userId: user.userId,
            });

            await newBoard.save();
            return;
        }
    } catch (error) {
        throw error;
    }
};

const deleteNotice = async ({ user, id }) => {
    try {
        await NoticeMessage.deleteOneNotice({
            _id: id,
        });
        return;
    } catch (error) {
        throw error;
    }
};

const deleteAllNotice = async ({ user }) => {
    try {
        const findBoard = await NoticeBoard.findOne({
            userId: user.userId,
        });
        await NoticeMessage.deleteMany({
            noticeBoardId: findBoard.noticeBoardId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAllNotice,
    createNewNoticeBoard,
    deleteNotice,
    deleteAllNotice,
};
