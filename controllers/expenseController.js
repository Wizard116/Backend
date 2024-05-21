const Expense = require('../models/Expense')

exports.getExpense = async (req, res, next) => {
    try {
        const email = req.user.email;
        const expenseData = await Expense.find({ email });
        if (!expenseData) {
            return res.status(401).json({ message: 'No Expense found' });
        }
        if(expenseData.length === 0) return res.json({ message: 'No Result Found'})
        res.status(200).json(expenseData);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Interval server error' })
    }
};

exports.putExpense = async (req, res, next) => {
    try {
        const email = req.user.email;
        // Extract Expense data from request body
        const { amount, category, description, date } = req.body;

        // Create a new Expense object
        const newExpense = new Expense({
            email,
            amount,
            category,
            description,
            date
        });

        // Save the new Expense to the database
        await newExpense.save();

        res.status(201).json({ message: 'Expense added successfully', Expense: newExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}