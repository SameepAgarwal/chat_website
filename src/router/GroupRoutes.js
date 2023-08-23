const { createGroupAndJoin, getGroupsJoined, joinGroup, getAllGroups } = require('../controller/groupController');
const express = require('express');

const router = express.Router();

router
    .get('/', getAllGroups)
    .get('/:userId', getGroupsJoined)
    .post('/create/:name/:userId', createGroupAndJoin)
    .put('/join/:groupId/:userId', joinGroup);

module.exports = router;