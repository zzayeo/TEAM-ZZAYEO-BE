const mongoose = require('mongoose');
const User = require('../schemas/user');
const Reply = require('../schemas/reply');
const Like = require('../schemas/like');
const Bookmark = require('../schemas/bookmark');
const Place = require('../schemas/place');
const Day = require('../schemas/day');
const Comment = require('../schemas/comment');

const PlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // foreignFields: '_id',
        },
        title: {
            type: String,
        },
        detination: {
            type: String,
        },
        locations: {
            type: Array,
        },
        withlist: {
            type: Array,
        },
        style: {
            type: Array,
        },
        nickname: {
            type: String,
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        },
    },
    { timestamps: true }
);

PlanSchema.virtual('planId').get(function () {
    return this._id.toHexString();
});

PlanSchema.virtual('days', {
    ref: 'Day',
    localField: '_id',
    foreignField: 'planId',
});

PlanSchema.virtual('bookmarkCount', {
    ref: 'Bookmark',
    localField: '_id',
    foreignField: 'planId',
    count: true,
});

PlanSchema.virtual('likeCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'planId',
    count: true,
});

PlanSchema.statics.findLikeBookmark = async function (page, user) {
    const findPaging = await this.find()
        .sort('-createdAt')
        .skip(5 * (page - 1))
        .limit(5)
        .populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img')
        .exec();
    console.log(user);
    if (user === undefined) {
        for (let i = 0; i < findPaging.length; i++) {
            findPaging[i]._doc.isLike = false;
            findPaging[i]._doc.isBookmark = false;
        }
        return findPaging;
    }

    for (let i = 0; i < findPaging.length; i++) {
        const LikeUser = await Like.findOne({ userId: user.userId, planId: findPaging[i].planId });
        const BookMarkUser = await Bookmark.findOne({
            userId: user.userId,
            planId: findPaging[i].planId,
        });
        LikeUser ? (findPaging[i]._doc.isLike = true) : (findPaging[i]._doc.isLike = false);
        BookMarkUser
            ? (findPaging[i]._doc.isBookmark = true)
            : (findPaging[i]._doc.isBookmark = false);
    }
    return findPaging;
};

PlanSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    // post id
    const { _id } = this.getFilter();
    // 자식 전부 삭제
    await Day.deleteMany({ planId: _id });
    await Place.deleteMany({ planId: _id });
    await Like.deleteMany({ planId: _id });
    await Bookmark.deleteMany({ planId: _id });
    await Comment.deleteMany({ planId: _id });
    await Reply.deleteMany({ planId: _id });
    next();
});

PlanSchema.set('toJSON', { virtuals: true });
PlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plan', PlanSchema);
