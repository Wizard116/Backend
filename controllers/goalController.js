const Goal = require('../models/Goals');
// Controller function to create a new goal
exports.createGoal = async (req, res) => {
    const email = req.user.email;
    try {
        const { name, description, targetAmount } = req.body;
        const newGoal = new Goal({
            email,
            name,
            description,
            targetAmount
        });
        await newGoal.save();
        res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
};

// Controller function to get all goals
exports.getAllGoals = async (req, res) => {
    try {
        const email = req.user.email;

        // Check if email exists in req.user
        if (!email) {
            return res.status(400).json({ message: 'User email is missing' });
        }

        // Query the database for goals associated with the email
        const goals = await Goal.find({ email: email });

        // Respond with the retrieved goals
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Error fetching goals', error: error.message });
    }
};


// Controller function to add amount to a goal
exports.addAmountToGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        goal.currentAmount += amount;
        goal.lastTransaction = amount;
        await goal.save();
        res.status(200).json({ message: 'Amount added to goal successfully', goal });
    } catch (error) {
        res.status(500).json({ message: 'Error adding amount to goal', error: error.message });
    }
};

// Controller function to undo the last transaction of a goal
exports.undoLastTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        const lastTransaction = goal.lastTransaction;
        goal.currentAmount -= lastTransaction;
        goal.lastTransaction = 0;
        await goal.save();
        res.status(200).json({ message: 'Last transaction undone successfully', goal });
    } catch (error) {
        res.status(500).json({ message: 'Error undoing last transaction', error: error.message });
    }
};

exports.deleteGoalById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the goal by ID and delete it
        const deletedGoal = await Goal.findByIdAndDelete(id);

        if (!deletedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.status(200).json({ message: 'Goal deleted successfully', deletedGoal });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};