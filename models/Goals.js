// Import mongoose
const mongoose = require('mongoose');

// Define the schema for the Goal
const GoalSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    targetAmount: {
        type: Number,
        required: true
    },
    lastTransaction: {
        type: Number,
        default: 0
    }
});

// Create the Goal model
const Goal = mongoose.model('Goal', GoalSchema);

// Export the model
module.exports = Goal;
