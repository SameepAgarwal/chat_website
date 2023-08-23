const User = require('../model/userSchema');

const getMessagesByChatId = async (req, res) => {
    const { id, chatId } = req.params;

    const user = await User.findOne({ _id: id });

    // const ourUser = user.whole_list.find((convo) => {
    //     return convo.name = "Shivam";
    // });

    // console.log({ ourUser: ourUser });
    res.status(200).json(ourUser);
};

const newMessageReceiverEnd = async (req, res) => {
    // ye receiver ka _id hai
    const _id = req.params.id;

    // ye sender ka
    const senderId = req.params.senderId;

    const { message, message_time, sender_name } = req.body;

    console.log({ "message req.body": req.body });

    console.log({ id: _id });
    console.log({ senderId: senderId });

    const receiverChatFound = await User.findOneAndUpdate({
        _id,
        "whole_list.sender_id": senderId
    }, {
        $push: {
            "whole_list.$.messages": req.body
        },
        $set: {
            "whole_list.$.latest_message": message,
            "whole_list.$.latest_message_time": message_time
        }
    }, {
        new: true,
        whole_list: 1,
    });

    console.log({ "ReceiverChatFound newMessage": receiverChatFound.whole_list });

    const receiver_id = receiverChatFound.whole_list.find(curUser => {
        return curUser.sender_id == senderId;
    });

    console.log({ receiver_id: receiver_id });
    res.status(201).json(receiver_id.messages[receiver_id.messages.length - 1]);
};

const newMessageSenderEnd = async (req, res) => {
    const _id = req.params.id;
    const chatId = req.params.chatId;
    const { message, message_time, sender_name } = req.body;

    // console.log({ "req.body": req.body });
    // const userArray = await User.findOne({ _id: _id });
    // // const temp = userArray.whole_list.
    // console.log({ "UserArray": userArray.whole_list });
    // console.log({ chatId: chatId });
    // // const ourChat = userArray.whole_list.filter((curObj, index) => {
    // //     return curObj._id == chatId;
    // // });
    // // const userObject = ourChat[0];
    // var chatFound = await User.find({
    //     "whole_list._id": chatId
    // });
    const chatFound = await User.findOneAndUpdate({
        "whole_list._id": chatId
    }, {
        $push: {
            "whole_list.$.messages": req.body,
        },
        $set: {
            "whole_list.$.latest_message": message,
            "whole_list.$.latest_message_time": message_time
        }
    }, {
        new: true,
        whole_list: 1,
    });

    // console.log({ "ChatFound newMessage": chatFound.whole_list });

    const sender_id = chatFound.whole_list.filter((curUser) => {
        return curUser._id == chatId;
    })[0];

    const details_sender = chatFound.whole_list.find(curUser => curUser._id == chatId);

    console.log({ sender_details: details_sender });
    res.status(201).json(sender_id);
};

module.exports = { getMessagesByChatId, newMessageReceiverEnd, newMessageSenderEnd };