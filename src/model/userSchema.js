const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    whole_list: [
        {
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
            ],
            name: {
                type: String
            },
            sender_id: {
                type: String,
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
            group: {
                type: Boolean,
                default: false
            },
            icon_address: {
                type: String
            }
        },
    ]
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;