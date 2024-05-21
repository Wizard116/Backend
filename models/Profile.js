const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    imageUrl: {
        data: Buffer,
        contentType: String
    },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    language: { type: String, default: 'English' },
    timeZone: { type: String, default: 'GMT' },
    currency: { type: String, default: 'INR' }
    // expireAt: { type: Date, default: Date.now,  expires: 15 }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
