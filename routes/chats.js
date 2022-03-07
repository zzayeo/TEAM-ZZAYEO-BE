const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController');

const authMiddleware = require('../middlewares/auth-middleware');

// 채팅방 목록 가져오기
router.get('/chat/list', authMiddleware, chatController.getChatListByUserId);

// 신규 채팅 확인
router.get('/chat/new', authMiddleware, chatController.checkNewChat);

// 해당 채팅방 내용 가져오기
router.get('/chat/:toSnsId', authMiddleware, chatController.getChatMessageByIds);

module.exports = router;
