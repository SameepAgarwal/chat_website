const Group = require('../model/groupSchema');
const User = require('../model/userSchema');

const createGroupAndJoin = async (req, res) => {
    const { name, userId } = req.params;

    const user = await User.findOne({ _id: userId });

    const group = new Group({
        group_name: name,
        userId: user,
        messages: [],
        users: [
            {
                name: user.name,
                number: user.number,
                email: user.email,
                user_id: user._id
            }
        ],
    });

    const result = await group.save();
    res.status(200).json(result);
};

const getGroupsJoined = async (req, res) => {
    const { userId } = req.params;
    console.log("I am IN Group");
    const groups = await Group.find({ "users.user_id": userId });

    res.status(200).json(groups);
};

const joinGroup = async (req, res) => {
    const { groupId, userId } = req.params;
    const user = await User.findOne({ _id: userId });

    const groups = await Group.findByIdAndUpdate(
        {
            _id: groupId
        },
        {
            $push: {
                users: {
                    name: user.name,
                    number: user.number,
                    email: user.email,
                    user_id: user._id
                }
            },
        },
        {
            timestamps: true,
            new: true,
        }
    );

    res.status(200).json(groups);
};

const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json(error);

    }
};

module.exports = { createGroupAndJoin, getGroupsJoined, joinGroup, getAllGroups };