const Income = require('../models/Income')
const utils = require('../utils/utils');

exports.getIncome = async (req, res, next) => {
    try {
        const email = req.user.email;
        const incomeData = await Income.find({ email });
        if (!incomeData) {
            return res.status(401).json({ message: 'No income found' });
        }
        if(incomeData.length === 0) return res.json({ message: 'No Result Found'})
        res.status(200).json(incomeData);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Interval server error' })
    }
};

exports.putIncome = async (req, res, next) => {
    try {
        const email = req.user.email;
        // Extract income data from request body
        const { amount, category, description, date } = req.body;

        // Create a new income object
        const newIncome = new Income({
            email,
            amount,
            category,
            description,
            date
        });

        // Save the new income to the database
        await newIncome.save();

        res.status(201).json({ message: 'Income added successfully', income: newIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.findByCategory = async (req, res, next) => {
    try {
        const result = await utils.filterByCategory(Income, req.params.id)
        res.json(result)
    }
    catch (err) {
        res.status(500).json({ message: 'Interval server error'})
    }
}

exports.findByDate = async (req, res, next) => {
    try {
        const result = await utils.filterByDateRange(Income, req.params.start, req.params.end)
        res.json(result)
    }
    catch (err) {
        res.status(500).json({ message: 'Interval server error'})
    }
}

exports.findByAmount = async (req, res, next) => {
    try {
        const result = await utils.filterByAmountRange(Income, req.params.start, req.params.end)
        res.json(result)
    }
    catch (err) {
        res.status(500).json({ message: 'Interval server error'})
    }
}

exports.sortByField = async (req, res, next) => {
    try {
        const result = await utils.sortByField(Income, req.params.field, req.params.order)
        res.json(result)
    }
    catch (err) {
        res.status(500).json({ message: 'Interval server error'})
    }
};


exports.sortByDate = async (req, res, next) => {
    try {
        const result = await utils.sortByDate(Income, req.user.email, req.params.order)
        res.json(result)
    }
    catch (err) {
        res.status(500).json({ message: 'Interval server error'})
    }
};