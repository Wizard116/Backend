const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // expireAt: { type: Date, default: Date.now,  expires: 15 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
