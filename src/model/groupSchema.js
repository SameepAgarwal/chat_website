const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    users: [
        {
            name: {
                type: String
            },
            number: {
                type: Number
            },
            email: {
                type: String
            },
            user_id: {
                type: String
            }
        }
    ],
    group_name: {
        type: String
    },
    latest_message: {
        type: String
    },
    latest_message_time: {
        type: String
    },
    icon: {
        type: Boolean,
        default: false
    },
    icon_address: {
        type: String
    },
    messages: [
        {
            sender_name: {
                type: String
            },
            message: {
                type: String
            },
            message_time: {
                type: String
            }
        }
    ]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;