const chatService = require('../services/chat');

const roomNameCreator = (snsIdA, snsIdB) => {
    const roomName = [snsIdA, snsIdB];
    roomName.sort((a, b) => a - b);
    let createdRoomName = roomName[0] + roomName[1];
    return createdRoomName;
};

const getChatMessageByIds = async (req, res, next) => {
    const { snsId } = res.locals.user;
    const { page } = req.query;
    const { toSnsId } = req.params; //상대방꺼 userId임

    console.log(snsId, toSnsId);

    const roomName = await roomNameCreator(snsId, toSnsId);
    const getChat = await chatService.getChatMessageByRoomNum({
        fromSnsId: snsId,
        toSnsId,
        roomName,
        page,
        // chatCount,
    });
    await chatService.findAndUpdateChatRoom({ snsId, toSnsId, roomName });
    return res.status(200).json({ result: 'success', chatMessages: getChat });
};

const getChatListByUserId = async (req, res, next) => {
    const { userId } = res.locals.user;
    const findChatRoom = await chatService.getChatRoomList({ userId });
    return res.status(200).json({ result: 'success', chatRoomList: findChatRoom });
};

const checkNewChat = async (req, res, next) => {
    const { userId } = res.locals.user;
    const newChatMessage = await chatService.checkChat({ userId });
    res.status(200).json({ result: 'success', newChatMessage });
};

module.exports = { getChatListByUserId, getChatMessageByIds, checkNewChat };
