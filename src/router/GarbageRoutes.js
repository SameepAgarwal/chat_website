const express = require('express');

const GarbageRoute = express.Router();

GarbageRoute.get("/", (req, res) => {
    res.send("Hii from Me");
});

module.exports = GarbageRoute;