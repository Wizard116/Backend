const express = require('express');
const multer = require('multer');

const router = express.Router()
const userController = require('../controllers/userController');
const incomeController = require('../controllers/incomeController')
const expenseController = require('../controllers/expenseController')
const filterController = require('../controllers/filterController')
const dashboardController = require('../controllers/dashboardController')
const goalController = require('../controllers/goalController');
const notificationController = require('../controllers/notificationController')
const { authenticateToken } = require('../middlewares/authMiddleware')


// Income Routes
router.get('/getIncome', authenticateToken, incomeController.getIncome)
router.post('/putIncome', authenticateToken, incomeController.putIncome)

// Expense Routes
router.get('/getExpense', authenticateToken, expenseController.getExpense)
router.post('/putExpense', authenticateToken, expenseController.putExpense)

// Income Filter
// router.get('/findByCategory/:id', authenticateToken, incomeController.findByCategory)
// router.get('/findByDate/:start/:end', authenticateToken, incomeController.findByDate)
// router.get('/findByAmount/:start/:end', authenticateToken, incomeController.findByAmount)
// router.get('/sortByField/:field/:order', authenticateToken, incomeController.sortByField)

// Filter
router.get('/sortByDate/:order', authenticateToken, filterController.sortByDate)
router.put('/update', authenticateToken, filterController.editData)
router.delete('/deleteEntry', authenticateToken, filterController.deleteById)
router.get('/filterByMonth', authenticateToken, filterController.getDataByMonthAndYear)


router.get('/getOne/:type/:id', authenticateToken, filterController.findOneById)

// Dashboard

router.get('/dashboardShow', authenticateToken, dashboardController.getData)
// router.get('/reportData', authenticateToken, dashboardController.getMergedData)


// Profile Routes

router.get('/profile', authenticateToken, userController.getUser)
router.put('/updateProfile', authenticateToken, userController.setUser)
router.delete('/deactivateProfile', authenticateToken, userController.deleteUser);

// Goals Routes

router.post('/goals', authenticateToken, goalController.createGoal);

// Route to get all goals
router.get('/goals', authenticateToken, goalController.getAllGoals);

// Route to add amount to a goal
router.put('/goals/:id/addAmount', authenticateToken, goalController.addAmountToGoal);

// Route to undo the last transaction of a goal
router.put('/goals/:id/undoLastTransaction', authenticateToken, goalController.undoLastTransaction);

router.delete('/goals/:id', authenticateToken, goalController.deleteGoalById)


// Notification Routes

router.post('/notifications', authenticateToken, notificationController.createNotification);
router.get('/notifications', authenticateToken, notificationController.getAllNotifications);
router.get('/notifications/:id', authenticateToken, notificationController.getNotificationById);
router.put('/notifications/:id', authenticateToken, notificationController.updateNotificationById);
router.delete('/notifications/:id', authenticateToken, notificationController.deleteNotificationById);

router.put('/notifications/system/readAll', authenticateToken, notificationController.readAll);



module.exports = router;