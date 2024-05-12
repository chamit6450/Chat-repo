const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'socket.html'));
});

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('join', username => {
        socket.username = username;
        io.emit('chat message', { type: 'notification', message: `${username} has joined the chat` });
    });

    socket.on('chat message', msg => {
        io.emit('chat message', { type: 'message', username: socket.username, message: msg });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        if (socket.username) {
            io.emit('chat message', { type: 'notification', message: `${socket.username} has left the chat` });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
