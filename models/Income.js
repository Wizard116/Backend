const mongoose = require('mongoose');

// Define income schema
const IncomeSchema = new mongoose.Schema({
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
        default: "Income"
    }
});

// Create Income model
const Income = mongoose.model('Income', IncomeSchema);

module.exports = Income;
