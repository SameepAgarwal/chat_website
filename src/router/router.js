const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');


router.get("/", (req, res) => {
    res.send("Hii from Me");
});


router.post("/newuser", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    // console.log({ user: user });
    if (user !== null) {
        // console.log("Hiii");
        res.json(user);
    }
    else {
        const createNewUser = new User(req.body);
        await createNewUser.save();
        // console.log({ createNewUser: createNewUser });
        res.json(createNewUser);
    }
});

router.post('/startconversation/:id', async (req, res) => {
    const { name, _id } = req.body;
    const id = req.params.id;

    const user = await User.findOne({ _id: id, "whole_list.sender_id": _id });
    const mainUser = await User.findOne({ _id: id });

    if (user === null) {
        //Receiver End Ko bhi Dekhna Padega
        if (mainUser !== null) {
            mainUser.whole_list.push({
                name,
                sender_id: _id,
                messages: [],
                latest_message: '',
                latest_message_time: ''
            });
            await mainUser.save();
            res.status(200).json({ message: "Success!" });
        }
        else res.status(404).json({ message: "No User Found" });
    }
    else res.status(200).json({ startConversation: "Already Exists" });

    // const userReceiver = await User.findOne({ _id, "whole_list.sender_id": id });
    // const receivingUser = await User.findOne({ _id });
    // if (userReceiver === null) {
    //     if (receivingUser !== null) {
    //         receivingUser.whole_list.push({
    //             name: mainUser.name,
    //             sender_id: id,
    //             messages: [],
    //             latest_message: '',
    //             latest_message_time: ''
    //         });
    //         await receivingUser.save();
    //         res.status(200).json({ message: "Success!" });
    //     }
    //     else res.status(404).json({ message: "No User Found" });
    // }
    // else res.status(200).json({ startConversation: "Receiver Already Exists" });
});

router.get("/getusers", async (req, res) => {
    const userArray = await User.find();
    res.json(userArray);
});

router.get("/getusers/:id", async (req, res) => {
    const id = req.params.id;
    const userArray = await User.findOne({ _id: id });
    // console.log({ "userFound : ": userArray });
    res.json(userArray);
});

router.get("/getusers/:id/:chatId", async (req, res) => {
    const _id = req.params.id;
    const chatId = req.params.chatId;
    const userArray = await User.findOne({ _id: _id });
    if (userArray === null || userArray === undefined) res.status(404).json({ message: "No User Found" });
    else if (userArray.whole_list.length > 0) {
        const ourChat = userArray.whole_list.filter((curObj, index) => {
            return curObj._id == chatId;
        });

        // console.log({ "chatFound getUsers : ": ourChat[0] });

        res.json(ourChat[0]);
    }
    else res.json(userArray.whole_list);
});

router.put('/newmessage/sender/:id/:chatId', async (req, res) => {
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
            "whole_list.$.messages": req.body
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
});


router.put('/newmessage/receiver/:id/:senderId', async (req, res) => {
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
        }
    }, {
        new: true,
        whole_list: 1,
    });

    console.log({ "ReceiverChatFound newMessage": receiverChatFound.whole_list });

    // const receiver_id = receiverChatFound.whole_list.filter((curUser) => {
    //     return curUser._id == senderId;
    // })[0];

    // console.log({ receiver_id: receiver_id });
    res.status(201).json("All Good");
});

router.get('/getmessages/:id/:chatId', async (req, res) => {
    const { id, chatId } = req.params;

    const user = await User.findOne({ _id: id });

    const ourUser = user.whole_list.find((convo) => {
        return convo.name = "Shivam";
    });

    console.log({ ourUser: ourUser });

    res.status(200).json(ourUser);
});


router.get('/*', (req, res) => {
    res.redirect('/');
});

module.exports = router;