const ChatService = require('../services/chat');
const NoticeService = require('../services/notice');

const roomNameCreator = (snsIdA, snsIdB) => {
    const roomName = [snsIdA, snsIdB];
    roomName.sort((a, b) => a - b);
    let createdRoomName = roomName[0] + roomName[1];
    return createdRoomName;
};

const getChatMessageByIds = async (req, res) => {
    const { user } = res.locals;
    const { snsId } = res.locals.user;
    const { page } = req.query;
    const { toSnsId } = req.params; //상대방꺼 userId임

    const roomNum = await roomNameCreator(snsId, toSnsId);
    console.log(roomNum);
    const getChat = await ChatService.getChatMessageByRoomNum({
        fromSnsId: user.snsId,
        toSnsId,
        roomNum,
        page,
        // chatCount,
    });
    const checkFirst = await ChatService.findAndUpdateChatRoom({
        fromSnsId: user.snsId,
        toSnsId,
        roomNum,
    });
    if (checkFirst)
        await NoticeService.createNewChatNoticeMessage({ sentUser: user, document: checkFirst });
    return res.status(200).json({ result: 'success', ChatMessages: getChat });
};

const getChatListByUserId = async (req, res) => {
    const { userId } = res.locals.user;
    const findChatRoom = await ChatService.getChatRoomList({ userId });
    return res.status(200).json({ result: 'success', ChatRoomList: findChatRoom });
};

// 채팅방 삭제
const deletechatroom = async (req, res) => {
    const { userId } = res.locals.user;
    const { chatRoomId } = req.params;

    await ChatService.getOutChatRoom({ chatRoomId, userId });
    res.json({
        result: 'success',
        message: '성공',
    });
};

module.exports = { getChatListByUserId, getChatMessageByIds, deletechatroom };
