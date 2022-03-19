/* eslint-disable no-useless-catch */
const User = require('../models/user');
const Plan = require('../models/plan');
const Place = require('../models/place');
const Day = require('../models/day');
const deleteS3 = require('../utils/deleteS3');
const { DIRECTORY } = require('../config/constants');

const firstDayCalculator = (now) => {
    const dateNow = now;
    dateNow.setDate(1);
    return dateNow;
};

const nextMonthCalculator = (now) => {
    const nextMonth = now;
    nextMonth.setDate(1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
};

const findOnePlanByPlanId = async ({ planId }) => {
    const findPlan = await Plan.findOne({ _id: planId });
    return findPlan;
};
const findAllPlanByUserId = async ({ userId }) => {
    const findPlan = await Plan.find({ userId });
    return findPlan;
};

const findLikePlanByDate = async () => {
    const thisMonthPlan = await Plan.aggregate()
        .match({
            status: '공개',
            updatedAt: {
                $gte: firstDayCalculator(new Date()),
                $lt: nextMonthCalculator(new Date()),
            },
        })
        .lookup({
            from: 'likes',
            localField: '_id',
            foreignField: 'planId',
            as: 'planLikes',
        })
        .lookup({
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'planId',
            as: 'planBookMarks',
        })
        .addFields({
            bookmarkCount: { $size: '$planBookMarks' },
            likeCount: { $size: '$planLikes' },
        })
        .sort('-likeCount')
        .limit(10)
        .lookup({
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo',
        })
        .unwind('$userInfo')
        .project({
            _id: 0,
            planId: { $toString: '$_id' },
            userId: {
                userId: '$userInfo._id',
                email: '$userInfo.email',
                nickname: '$userInfo.nickname',
                snsId: '$userInfo.snsId',
                profile_img: '$userInfo.profile_img',
            },
            title: 1,
            nickname: 1,
            locations: 1,
            destination: 1,
            style: 1,
            status: 1,
            startDate: 1,
            endDate: 1,
            createdAt: 1,
            updatedAt: 1,
            withlist: 1,
            scrapCount: 1,
            thumbnailImage: 1,
            likeCount: 1,
            bookmarkCount: 1,
            planLikes: 0,
            planBookMarks: 0,
        });

    console.log(thisMonthPlan);

    return thisMonthPlan;
};

const findAllPublicPlans = async ({ page, user, destination, style }) => {
    page === undefined || page < 0 ? (page = 1) : +page;
    destination === undefined ? (destination = ['국내', '해외']) : (destination = [destination]);

    if (typeof style === 'string') {
        style = [style];
    }
    console.log('스타일 :', style);
    if (style === undefined) {
        const numPlans = await Plan.count({
            destination: { $in: destination },
            status: '공개',
        });
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findPage = await Plan.find({
            destination: { $in: destination },
            status: '공개',
        })
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

const calculateDays = (start, end) => {
    let sDate = new Date(start);
    let eDate = new Date(end);
    let diffDate = sDate.getTime() - eDate.getTime();
    return Math.abs(diffDate / (1000 * 3600 * 24));
};

const createPlan = async ({ user, title, startDate, endDate, destination, style, withlist }) => {
    const newPlan = new Plan({
        userId: user.userId,
        nickname: user.nickname,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist,
    });
    await newPlan.save();

    for (let i = 1; i <= calculateDays(startDate, endDate) + 1; i++) {
        await Day.create({
            planId: newPlan._id,
            dayNumber: i,
        });
    }
    return newPlan;
};

const updatePlan = async ({ planId, title, startDate, endDate, destination, style, withlist }) => {
    const findPlan = await Plan.findOne({ _id: planId });
    let beforeDays = calculateDays(findPlan.startDate, findPlan.endDate);
    let updateDays = calculateDays(startDate, endDate);
    let diffDays = Math.abs(beforeDays - updateDays);

    if (beforeDays < updateDays) {
        for (let i = beforeDays + 2; i <= updateDays + 1; i++) {
            await Day.create({
                planId: findPlan._id,
                dayNumber: i,
            });
        }
    }
    if (beforeDays > updateDays) {
        for (let i = beforeDays + 1; i > updateDays + 1; i--) {
            await Day.deleteOne({ planId, dayNumber: i });
        }
    }

    findPlan.title = title;
    findPlan.startDate = startDate;
    findPlan.endDate = endDate;
    findPlan.destination = destination;
    findPlan.style = style;
    findPlan.withlist = withlist;

    await findPlan.save({ timestamps: false });

    return findPlan;
};

const findOnePlanByPlanIdisLikeBookMark = async ({ user, planId }) => {
    const plan = await Plan.findOne({ _id: planId })
        .populate({
            path: 'days',
            populate: { path: 'places' },
        })
        .populate('userId likeCount bookmarkCount');

    const planLikeBookmark = await Plan.findLikeBookmark([plan], user);

    const findPlaces = await Place.find({ planId });
    let allImages = [];
    for (let place of findPlaces) {
        for (let image of place.memoImage) {
            allImages.push(image);
        }
    }

    planLikeBookmark[0]._doc.allImages = allImages;

    return planLikeBookmark[0];
};

const changePlanByPlanId = async ({ targetPlan, status }) => {
    targetPlan.status = status;

    await targetPlan.save();
    return;
};

const deletePlanByPlanId = async ({ planId }) => {
    const findPlaces = await Place.find({ planId });
    let S3DeleteList = [];
    for (let place of findPlaces) {
        for (let image of place.memoImage) {
            S3DeleteList.push(image);
        }
    }
    deleteS3(S3DeleteList);
    await Plan.deleteOne({ _id: planId });
    return;
};

const addThumbnail = async ({ thumbnailImage, planId }) => {
    try {
        const findPlan = await Plan.findOne({ _id: planId });
        if (findPlan.thumbnailImage) deleteS3([findPlan.thumbnailImage]);
        findPlan.thumbnailImage = thumbnailImage;
        await findPlan.save({ timestamps: false });
        return;
    } catch (error) {
        throw error;
    }
};

const copyPlanByPlanId = async ({ planId, user }) => {
    try {
        const findPlan = await Plan.findOne({ _id: planId }).populate({
            path: 'days',
            populate: { path: 'places' },
        });

        const newPlan = new Plan({
            userId: user.userId,
            title: `${findPlan.nickname}님으로 부터 복사된 여행`,
            nickname: user.nickname,
            startDate: findPlan.startDate,
            endDate: findPlan.endDate,
            destination: findPlan.destination,
            style: findPlan.style,
            withlist: findPlan.withlist,
            locations: findPlan.locations,
            copyplan: '가져온 여행',
        });

        await newPlan.save();

        for (let i = 1; i <= calculateDays(findPlan.startDate, findPlan.endDate) + 1; i++) {
            const newDay = await Day.create({
                planId: newPlan._id,
                dayNumber: i,
            });
            for (let j = 0; j < findPlan.days[i - 1].places.length; j++) {
                const newPlace = await Place.create({
                    planId: findPlan.planId,
                    dayId: newDay._id,
                    placeName: findPlan.days[i - 1].places[j].placeName,
                    time: findPlan.days[i - 1].places[j].time,
                    lat: findPlan.days[i - 1].places[j].lat,
                    lng: findPlan.days[i - 1].places[j].lng,
                    address: findPlan.days[i - 1].places[j].address,
                });
            }
        }
        findPlan.scrapCount++;
        await findPlan.save({ timestamps: false });
        return newPlan;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAllPublicPlans,
    createPlan,
    findOnePlanByPlanIdisLikeBookMark,
    changePlanByPlanId,
    deletePlanByPlanId,
    findOnePlanByPlanId,
    findAllPlanByUserId,
    calculateDays,
    addThumbnail,
    updatePlan,
    copyPlanByPlanId,
    findLikePlanByDate,
};
