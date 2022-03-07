const userService = require('../services/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user) => {
        if (err) return next(err);
        const token = jwt.sign({ snsId: user.snsId }, JWT_SECRET_KEY);

        res.json({ token, userId: user.email });
    })(req, res, next);
};

module.exports = { kakaoCallback };
