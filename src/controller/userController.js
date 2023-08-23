const User = require('../model/userSchema');

const createNewUser = async (req, res) => {
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
};

const startConversation = async (req, res) => {
    // const { name, _id } = req.body;
    const name = req.body.name;
    const other_user_id = req.body._id;
    const id = req.params.id;

    const user = await User.findOne({ _id: id, "whole_list.sender_id": other_user_id });
    const mainUser = await User.findOne({ _id: id });

    if (user === null) {
        //Receiver End Ko bhi Dekhna Padega
        if (mainUser !== null) {
            mainUser.whole_list.push({
                name,
                sender_id: other_user_id,
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
};

const getAllUsers = async (req, res) => {
    const userArray = await User.find();
    res.json(userArray);
};

const getSpecificUser = async (req, res) => {
    const id = req.params.id;
    const userArray = await User.findOne({ _id: id });
    // console.log({ "userFound : ": userArray });
    res.json(userArray);
};
const getSpecificChat = async (req, res) => {
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
};

module.exports = { createNewUser, startConversation, getAllUsers, getSpecificUser, getSpecificChat };