const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    password: { type: String, required: true },
    createdOn: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);