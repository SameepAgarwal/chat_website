const express = require('express');
const { newMessage, getMessages } = require('../controller/groupMessageController');

const GroupMessageRoutes = express.Router();

GroupMessageRoutes
    .put('/newmessage/:groupId', newMessage)
    .get('/allmessages/:groupId', getMessages);

module.exports = GroupMessageRoutes;