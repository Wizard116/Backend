const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;
    const notification = new Notification({ email: req.user.email, type, message, read: false });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all notifications for the authenticated user
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ email: req.user.email });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single notification by ID for the authenticated user
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userEmail: req.user.email });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a notification by ID for the authenticated user
exports.updateNotificationById = async (req, res) => {
  try {
    const { type, message } = req.body;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userEmail: req.user.email },
      { type, message },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a notification by ID for the authenticated user
exports.deleteNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.readAll = async (req, res) => {
    try {
        const userEmail = req.user.email;
        await Notification.updateMany({ email: userEmail, read: false }, { read: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
