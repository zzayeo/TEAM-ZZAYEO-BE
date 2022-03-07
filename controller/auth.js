const userService = require('../services/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

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

        res.json({ token, userId: user.email });
    })(req, res, next);
};

module.exports = { kakaoCallback, getUserInfo };
