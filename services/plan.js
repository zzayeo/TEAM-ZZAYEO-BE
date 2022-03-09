const User = require('../models/user');
const Plan = require('../models/plan');
const Day = require('../models/day');

const findOnePlanByPlanId = async ({ planId }) => {
    const findPlan = await Plan.findOne({ _id: planId });
    return findPlan;
};
const findAllPlanByUserId = async ({ userId }) => {
    const findPlan = await Plan.find({ userId });
    return findPlan;
};

const findAllPublicPlans = async ({ page, user, destination, style }) => {
    page === undefined || page < 0 ? (page = 1) : +page;
    destination === undefined ? (destination = ['국내', '해외']) : (destination = [destination]);

    if (typeof style === 'string') {
        style = [style];
    }
    console.log('스타일 :', style);
    if (style === undefined) {
        const numPlans = await Plan.count({ destination: { $in: destination }, status: '공개' });
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findPage = await Plan.find({ destination: { $in: destination }, status: '공개' })
            .sort('-createdAt')
            .skip(5 * (page - 1))
            .limit(5)
            .populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img');

        const plansLikeBookmark = await Plan.findLikeBookmark(findPage, user);
        return { plans: plansLikeBookmark, endPage };
    } else {
        const numPlans = await Plan.count({
            destination: { $in: destination },
            style: { $all: style },
            status: '공개',
        });
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findByStyle = await Plan.find({
            destination: { $in: destination },
            style: { $all: style },
            status: '공개',
        })
            .sort('-createdAt')
            .skip(5 * (page - 1))
            .limit(5)
            .populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img');

        const plansLikeBookmark = await Plan.findLikeBookmark(findByStyle, user);
        return { plans: plansLikeBookmark, endPage };
    }
};

module.exports = {
    findAllPublicPlans,
};
