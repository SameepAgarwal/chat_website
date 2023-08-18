const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 8080;
const User = require('./model/userSchema');

require('./db/conn');
app.use(cors());
app.use(express.json());
app.use(express.static('frontend usingvite/dist'));

app.use(require('./router/router'));


const server = app.listen(port, () => {
    console.log(`Listening to port number ${port}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected to socket IO server ${socket.id}`);

    socket.on("setup", async (_id) => {
        socket.join(_id);
        socket.broadcast.emit("check online", _id);
    });


    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`User Joined room ${room}`);
    });

    socket.on("new message", (newMessage) => {
        const receiver_id = newMessage.receiver_id;
        console.log({ newMessage: newMessage });
        console.log({ receiver_id: receiver_id });
        socket.in(receiver_id).emit("message received", newMessage);
    });
});
