// controllers/userController.js
const Profile = require('../models/Profile');
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Goals = require('../models/Goals');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.getUser = async (req, res, next) => {
  try {
    const email = req.user.email;
    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(404).json({ message: 'No Result Found' });

    const profileData = {
      ...profile._doc,
      imageUrl: profile.imageUrl.data
        ? `data:${profile.imageUrl.contentType};base64,${profile.imageUrl.data.toString('base64')}`
        : null,
    };

    res.status(200).json(profileData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.setUser = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      let updateFields = { ...req.body };

      // Check if a file was uploaded
      if (req.file) {
        updateFields.imageUrl = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }

      // console.log(updateFields);
      const updatedProfile = await Profile.findOneAndUpdate(
        { email: updateFields.email },
        updateFields,
        { new: true }
      );

      res.status(200).json(updatedProfile);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
];


exports.deleteUser = async (req, res, next) => {
  const deleteDoc = req.query.email;
  try {
    await Profile.deleteMany({ "email": deleteDoc });
    await User.deleteMany({ "email": deleteDoc });
    await Income.deleteMany({ "email": deleteDoc });
    await Expense.deleteMany({ "email": deleteDoc });
    await Goals.deleteMany({ "email": deleteDoc});
    // console.log("Documents deleted successfully");
    res.status(202).json({ message: "Documents deleted successfully" });
  } catch (error) {
    console.error("Error deleting documents:", error);
    res.status(500).json({ message: "Server Error" });
  }
}


