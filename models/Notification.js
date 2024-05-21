const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true},
  type: { type: String, required: true }, // Type of notification (e.g., delete, goal completed, update, alert)
  message: { type: String, required: true }, // Notification message
  timestamp: { type: Date, default: Date.now }, // Timestamp of the notification
  read: {type: Boolean, default: false}
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;