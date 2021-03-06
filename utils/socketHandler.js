/* eslint-disable no-useless-catch */
const ChatService = require('../services/chat');
const NoticeService = require('../services/notice');
const UserService = require('../services/auth');
const webpush = require('web-push');

const io = require('../config/socket').getIo();

const { publicKey, privateKey } = process.env;
const { NOTICE_EVENT: EVENT } = require('../config/constants');

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        clearInterval(socket.interval);
    });

    // socket error
    socket.on('error', (error) => {
        console.error(error);
    });

    //소켓 로그인
    socket.on('login', async ({ fromSnsId }) => {
        console.log(fromSnsId, '로 로그인 되었습니다');
        socket.join(fromSnsId);
        const checkNew = await NoticeService.checkNewNotice({ snsId: fromSnsId });
        io.to(fromSnsId).emit('checkNewNotice', checkNew);
    });

    // roomNum Maker
    const roomNameCreator = (snsIdA, snsIdB) => {
        const roomName = [snsIdA, snsIdB];
        roomName.sort((a, b) => a - b);
        let createdRoomName = roomName[0] + roomName[1];
        return createdRoomName;
    };

    // socket room join
    socket.on('joinRoom', async ({ fromSnsId, toSnsId }) => {
        try {
            const roomNum = await roomNameCreator(fromSnsId, toSnsId);
            const checkFirst = await ChatService.findAndUpdateChatRoom({
                fromSnsId,
                toSnsId,
                roomNum,
            });
            if (checkFirst)
                await NoticeService.createNewChatNoticeMessage({
                    sentUser: checkFirst.userId,
                    document: checkFirst,
                });
            io.to(roomNum).emit('join', toSnsId);
            socket.join(roomNum);
            socket.leave(fromSnsId);
        } catch (error) {
            console.log(error);
        }
    });

    // socket room leave
    socket.on('leaveRoom', async ({ fromSnsId, toSnsId }) => {
        try {
            const roomName = await roomNameCreator(fromSnsId, toSnsId);
            socket.join(fromSnsId);
            socket.leave(roomName);
            const checkNew = await NoticeService.checkNewNotice({ snsId: fromSnsId });
            io.to(fromSnsId).emit('checkNewNotice', checkNew);
        } catch (error) {
            console.log(error);
        }
    });

    // socket room (chat)
    socket.on('room', async ({ fromSnsId, toSnsId, chatText, createdAt }) => {
        try {
            const roomName = await roomNameCreator(fromSnsId, toSnsId);

            let checkChat = false;
            if (io.sockets.adapter.rooms.get(roomName).size === 2) {
                checkChat = true;
            }

            const chatMessage = {
                toSnsId,
                fromSnsId,
                chatText,
                checkChat,
                createdAt,
            };

            await ChatService.saveChatMessage({
                roomNum: roomName,
                ...chatMessage,
            });

            io.to(roomName).emit('chat', chatMessage);
            io.to(toSnsId).emit('chatNotice', { newChat: true });
        } catch (error) {
            console.log(error);
        }
    });
    // notice
    socket.on('notice', async ({ fromSnsId, toSnsId, noticeType, whereEvent }) => {
        try {
            io.to(toSnsId).emit('noticePage', { newNotice: true });
            const fromUser = await UserService.findUserBySnsId({ snsId: fromSnsId });
            const toUser = await UserService.findUserBySnsId({ snsId: toSnsId });
            if (toUser.subscription && fromSnsId !== toSnsId) {
                let body = fromUser.nickname;
                if (noticeType === 'Like') {
                    if (whereEvent === 'plan') body += EVENT.LIKE.PLAN;
                    if (whereEvent === 'comment') body += EVENT.LIKE.COMMENT;
                    if (whereEvent === 'reply') body += EVENT.LIKE.REPLY;
                }
                if (noticeType === 'CommentReply') {
                    if (whereEvent === 'comment') body += EVENT.COMMENT.PLAN;
                    if (whereEvent === 'reply') body += EVENT.LIKE.COMMENT;
                }
                if (noticeType === 'Chat') {
                    if (whereEvent === 'chat') body += EVENT.MESSAGE.CHAT;
                }
                const options = {
                    TTL: 24 * 60 * 60,
                    vapidDetails: {
                        subject: 'https://stgon.shop',
                        publicKey,
                        privateKey,
                    },
                };

                const payload = JSON.stringify({
                    title: '짜여',
                    body,
                });

                console.log(payload);
                webpush.sendNotification(toUser.subscription, payload, options);
            }
        } catch (error) {
            throw error;
        }
    });
});
