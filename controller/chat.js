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

const getChatListByUserId = async (req, res) => {
    const { userId } = res.locals.user;
    const findChatRoom = await chatService.getChatRoomList({ userId });
    return res.status(200).json({ result: 'success', chatRoomList: findChatRoom });
};

const checkNewChat = async (req, res) => {
    const { userId } = res.locals.user;
    const newChatMessage = await chatService.checkChat({ userId });
    res.status(200).json({ result: 'success', newChatMessage });
};

// 채팅방 삭제
const deletechatroom = async (req, res) => {
    const { userId } = res.locals.user;
    const { chatroomId } = req.params;

    const targetchatroom = await chatService.getTargetchatroom({ chatroomId });
    if (targetchatroom.userId.toHexString() !== userId) {
        return res
            .status(200)
            .json({ result: 'false', message: '본인의 채팅방만 삭제할수있습니다' });
    }
    await chatService.getOutChatRoom({ chatroomId });
    res.json({
        result: 'success',
        message: '성공',
    });
};

module.exports = { getChatListByUserId, getChatMessageByIds, checkNewChat, deletechatroom };
