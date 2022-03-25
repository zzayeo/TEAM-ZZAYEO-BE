const express = require('express');
const router = express.Router();

// Routers
const plansRouter = require('./plans');
const placesRouter = require('./places');
const commentsRouter = require('./comments');
const likesRouter = require('./likes');
const AuthRouter = require('./auth');
const bookmarksRouter = require('./bookmarks');
const repliesRouter = require('./replies');
const chatsRouter = require('./chats');
const noticesRouter = require('./notices')

// Constatns
const { ROUTE } = require("../config/constants");

router.use(ROUTE.INDEX, placesRouter);
router.use(ROUTE.INDEX, likesRouter);
router.use(ROUTE.INDEX, AuthRouter);
router.use(ROUTE.INDEX, bookmarksRouter);
router.use(ROUTE.INDEX, repliesRouter);
router.use(ROUTE.INDEX, chatsRouter);
router.use(ROUTE.INDEX, commentsRouter);
router.use(ROUTE.INDEX, plansRouter);
router.use(ROUTE.INDEX, noticesRouter)


module.exports = router;