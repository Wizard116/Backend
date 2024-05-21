const mongoose = require('mongoose');

// Define expense schema
const ExpenseSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '-'
    },
    date: {
        type: Date,
        default: () => new Date().toISOString().split('T')[0]
    },
    type: {
        type: String,
        default: "Expense"
    }
});

// Create Expense model
const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
