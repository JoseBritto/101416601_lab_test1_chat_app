const express = require('express');
const { Server } = require("socket.io");
const userModel = require('./models/User');
const mongoose = require("mongoose");

require("dotenv").config();
const SERVER_PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(express.static('views'));
app.use('/api/auth', require('./routes/auth'));

try {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB');
    });
} catch (error) {
    console.error("Mongodb Connection Error:", error);
    process.exit(1);
}

const server = app.listen(SERVER_PORT, () => {
    console.log('Server running on http://localhost:'+ SERVER_PORT);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join channel", (channel) => {
        socket.leaveAll();
        socket.join(channel);
        console.log(`${socket.id} joined channel: ${channel}`);
    });

    socket.on("chat message", async ({ channel, text, user_id, rand }) => {
        console.log(user_id);
        const user = await userModel.findOne({ _id: user_id });
        let username = 'Glitch';
        if(user) {
            username = `${user.firstname || 'NoName'} (@${user.username})`;
        }
        const messageData = { author: username, channel, text, rand };

        // Broadcast message to channel
        socket.to(channel).emit("chat message", messageData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});