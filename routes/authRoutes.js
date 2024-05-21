const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const router = express.Router()


router.post('/login', authController.loginUser)
router.post('/register', authController.registerUser)
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ status: req.user})
    // res.json(req.user);
});

module.exports = router;