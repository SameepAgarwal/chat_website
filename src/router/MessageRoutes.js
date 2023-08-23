const express = require('express');
const MessageRoutes = express.Router();
const { getMessagesByChatId, newMessageReceiverEnd, newMessageSenderEnd } = require('../controller/messageController');

MessageRoutes
    .get('/getmessages/:id/:chatId', getMessagesByChatId)
    .put('/newmessage/receiver/:id/:senderId', newMessageReceiverEnd)
    .put('/newmessage/sender/:id/:chatId', newMessageSenderEnd);

module.exports = MessageRoutes;