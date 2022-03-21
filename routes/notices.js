const express = require('express');
const router = express.Router();
const { ROUTE } = require('../config/constants');

const noticeController = require('../controller/notice');

const authMiddleware = require('../middlewares/auth-middleware');

module.exports = router;
