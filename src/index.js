const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 8080;
const User = require('./model/userSchema');
const Group = require('./model/groupSchema');
const GroupRouter = require("./router/GroupRoutes.js");
const MessageRoutes = require("./router/MessageRoutes.js");
const UserRoutes = require('./router/UserRoutes.js');
const GarbageRoute = require("./router/GarbageRoutes.js");
const GroupMessageRoutes = require("./router/GroupMessagesRoutes.js");
const PORT = process.env.PORT;

require('./db/conn');
app.use(cors());
app.use(express.json());
app.use(express.static('frontend usingvite/dist'));

app.use('/user', UserRoutes);
app.use('/message', MessageRoutes);
app.use('/group', GroupRouter);
app.use('/groupmessage', GroupMessageRoutes);
app.use('', GarbageRoute);


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
    });
    socket.on('online', (_id) => {
        console.log("online");
        socket.broadcast.emit("check online", _id);
    });
    socket.on("confirm online", (_id) => {
        socket.in(_id).emit("online confirm", _id);
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
    socket.on("join group chat", group_id => {
        console.log("Joined group chat " + group_id);
        socket.emit("new user joined", group_id);
        socket.join(group_id);
    });
    socket.on("new group message", ({ message, message_time, sender_name, group_id }) => {
        socket.in(group_id).emit("group message received", { message, message_time, sender_name, group_id });
    });
    socket.on('disconnect', socket => {
        delete socket;
        console.log("deleted");
    });
});
// const users = {};
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('join', (username) => {
//         users[socket.id] = username;
//         io.emit('updateUserList', Object.values(users));
//     });

//     socket.on('message', (message) => {
//         io.emit('message', { user: users[socket.id], text: message });
//     });

//     socket.on('typing', () => {
//         console.log("IN typing");
//         socket.broadcast.emit('typing', users[socket.id]);
//     });

//     socket.on('disconnect', () => {
//         delete users[socket.id];
//         io.emit('updateUserList', Object.values(users));
//         console.log('User disconnected:', socket.id);
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
