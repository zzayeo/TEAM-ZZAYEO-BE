const chatService = require('../services/chat');

const io = require('../config/socket').getIo();

io.on('connection', (socket) => {
    console.log(`User : ${socket.id}`);
    socket.on('disconnect', () => {
        clearInterval(socket.interval);
    });

    // socket error
    socket.on('error', (error) => {
        console.error(error);
    });

    //소켓 로그인
    socket.on('login', ({ fromSnsId }) => {
        socket.join(fromSnsId);
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
            const roomName = await roomNameCreator(fromSnsId, toSnsId);
            await chatService.findAndUpdateChatRoom({ fromSnsId, toSnsId, roomName });
            socket.join(roomName);
            socket.leave(fromSnsId);
        } catch (error) {
            console.log(error);
        }
    });

    // socket room leave
    socket.on('leaveRoom', async ({ fromSnsId, toSnsId }) => {
        try {
            const roomName = await roomNameCreator(fromSnsId, toSnsId);
            socket.leave(roomName);
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

            await chatService.saveChatMessage({
                roomName,
                ...chatMessage,
            });

            io.to(roomName).emit('chat', chatMessage);
            io.to(toSnsId).emit('list', chatMessage);
        } catch (error) {
            console.log(error);
        }
    });
});
