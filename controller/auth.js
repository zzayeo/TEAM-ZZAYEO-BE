const userService = require('../services/auth');
const NoticeService = require('../services/notice')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET_KEY } = process.env;
const bcrypt = require("bcrypt")

const checkDuplicateEmail = async (req, res, next) => {
    try {
        const email = req.body
        const findExistEmail = await userService.getExistEmail({ email })
        
        if(findExistEmail) {
            res.status(400).json({
                result: 'fail',
                message: '이메일이 중복되었습니다.',
            });
        }
        return res.status(200).json({ 
            result: 'success',
            message: '사용하실 수 있는 이메일 입니다.',
        });
    } catch (error) {
        next(error);
    }
};

const updateUserInfo = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { nickname } = req.body;
        let profile_img = '';
        if (req.file) profile_img = req.file.location;

        await userService.updateUserInfo({
            userId,
            nickname,
            profile_img,
        });
        res.status(200).json({ result: 'success', message: '업데이트 완료되었습니다.' });
    } catch (error) {
        next(error);
    }
};

const getMyInfo = async (req, res, next) => {
    try {
        const { user } = res.locals;
        res.status(200).json({
            result: 'success',
            userId: user._id,
            snsId: user.snsId,
            email: user.email,
            nickname: user.nickname,
            userImg: user.profile_img,
        });
    } catch (error) {
        next(error);
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { userId } = req.params;
        const findUserInfo = await userService.findUserInfoByUserId({
            myUserId: user.userId,
            otherUserId: userId,
        });
        res.status(200).json({ result: 'success', userInfo: findUserInfo });
    } catch (error) {
        next(error);
    }
};

const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user) => {
        if (err) return next(err);
        const token = jwt.sign({ snsId: user.snsId }, JWT_SECRET_KEY);

        res.json({ token, userId: user.email, snsId: user.snsId });
    })(req, res, next);
};

const withdrawalUser = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        await userService.deleteUser({ userId });

        res.status(200).json({
            result: 'success',
            message: '탈퇴 완료',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { kakaoCallback, getUserInfo, getMyInfo, updateUserInfo, withdrawalUser, checkDuplicateEmail };
