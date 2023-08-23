const Group = require('../model/groupSchema');
const User = require('../model/userSchema');

const newMessage = async (req, res) => {
    const { groupId } = req.params;
    const { message, message_time, sender_name } = req.body;
    //latest_message, latest_message_time
    const group = await Group.findByIdAndUpdate(
        { _id: groupId },
        {
            $push: {
                messages: {
                    message, message_time, sender_name
                }
            },
            $set: {
                latest_message: message,
                latest_message_time: message_time,
            }
        },
        {
            timestamps: true,
            messages: 1,
            new: 1,
        }
    );
    const addedMessage = group.messages[group.messages.length - 1];
    res.status(200).json(addedMessage);

};

const getMessages = async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findById({ _id: groupId }
            // ,{ messages: 1 }
        );
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json(error);
    }
};

module.exports = { newMessage, getMessages };