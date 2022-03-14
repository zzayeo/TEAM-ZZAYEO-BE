const User = require('../models/user');

const updateUserInfo = async ({ userId, nickname, profile_img }) => {
    await User.findOneAndUpdate({ _id: userId }, { nickname, profile_img });

    return;
};

const findUserInfoByUserId = async ({ myUserId, otherUserId }) => {
    const loginUserInfo = await User.findOne({ _id: myUserId }).populate('plans');
    const otherUserInfo = await User.findOne({ _id: otherUserId }).populate({
        path: 'plans',
        match: { status: '공개' },
    });
    if (loginUserInfo.userId === otherUserInfo.userId) {
        return loginUserInfo;
    }
    return otherUserInfo;
};

module.exports = {
    findUserInfoByUserId,
    updateUserInfo,
};
