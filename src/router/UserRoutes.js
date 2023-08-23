const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const { createNewUser, startConversation, getAllUsers, getSpecificUser, getSpecificChat } = require('../controller/userController');

router.post("/newuser", createNewUser);

router.post('/startconversation/:id', startConversation);

router.get("/getusers", getAllUsers);

router.get("/getusers/:id", getSpecificUser);

router.get("/getusers/:id/:chatId", getSpecificChat);

module.exports = router;