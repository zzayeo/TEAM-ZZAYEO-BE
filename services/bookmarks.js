//스키마
const Bookmark = require('../models/bookmark');

//userId로 populate해서 북마크 된 plan 모두 가져오기
const getBookmarkByUserId = async ({ userId }) => {
    const getBookmarks = await Bookmark.find({ userId }).populate({
        path: 'planId',
        populate: { path: 'userId' },
    });

    return getBookmarks;
};

//userId와 planId로 DB에 있는지 확인하기
const findBookmarkByUserIdAndPlanId = async ({ userId, planId }) => {
    const findBookmark = await Bookmark.findOne({ userId, planId });

    if (findBookmark !== null) {
        return;
    }
    return findBookmark;
};

module.exports = {
    getBookmarkByUserId,
    findBookmarkByUserIdAndPlanId
};
