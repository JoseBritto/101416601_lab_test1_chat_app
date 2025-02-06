const express = require('express');
const socketio = require('socket.io');
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

