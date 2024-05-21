const Income = require('../models/Income');
const Expense = require('../models/Expense');
const utils = require('../utils/utils');


// exports.sortByDate = async (req, res, next) => {
//     try {
//         const income = await utils.sortByDate(Income, req.user.email, req.params.order)
//         const expense = await utils.sortByDate(Expense, req.user.email, req.params.order)
//         const result = await income.concat(expense);
//         res.json(result)
//     }
//     catch (err) {
//         res.status(500).json({ message: 'Interval server error'})
//     }
// };
const modelMap = {
    'Income': Income,
    'Expense': Expense
};

exports.sortByDate = async (req, res) => {
    try {
        const email = req.user.email; // Ensure user email is obtained from authenticated user
        const order = req.params.order === 'asc' ? 1 : -1;

        // Fetch and sort data from both Income and Expense collections
        const incomeData = await Income.find({ email }).sort({ date: order });
        const expenseData = await Expense.find({ email }).sort({ date: order });

        const mergedData = [...incomeData, ...expenseData].sort((a, b) => order * (new Date(a.date) - new Date(b.date)));

        // Convert dates to UTC before sending to client
        const result = mergedData.map(item => ({
            ...item._doc, // _doc contains the raw document data in mongoose
            date: new Date(item.date).toISOString().split('T')[0]
        }));

        res.json(result);
    } catch (err) {
        console.error('Error sorting by date:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// exports.sortByDate = async (req, res, next) => {
//     try {
//         const order = req.params.order || 'asc'; // Default to 'asc' if order is not provided
//         const email = req.user.email;

//         // Fetch and sort data from Income and Expense collections
//         const income = await utils.sortByDate(Income, email, order);
//         const expense = await utils.sortByDate(Expense, email, order);

//         // Combine the data and sort it again to ensure correct order
//         const combinedData = [...income, ...expense];
//         const sortedData = combinedData.sort((a, b) => {
//             return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
//         });

//         res.json(sortedData);
//     } catch (err) {
//         console.error('Error fetching and merging data:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.deleteById = async (req, res) => {
    try {
        const { id, type } = req.query;

        let Model;
        if (type === 'Income') {
            Model = Income;
        } else if (type === 'Expense') {
            Model = Expense;
        } else {
            return res.status(400).json({ message: 'Invalid type' });
        }

        const result = await Model.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error('Error deleting document:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editData = async (req, res, next) => {
    try {
        const modelName = req.query.type;
        const Model = modelMap[modelName];
        if (!Model) {
            return res.status(400).json({ error: 'Invalid model name' });
        }

        const { id } = req.query;
        const updateData = req.body;
        // console.log(id);
        const updatedDocument = await Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(updatedDocument);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDataByMonthAndYear = async (req, res, next) => {
    try {
        const modelName = req.query.type;
        const { month, year } = req.query;
        const Model = modelMap[modelName];
        if (!Model) {
            return res.status(400).json({ error: 'Invalid model name' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month

        const data = await Model.find({
            date: {
                $gte: startDate,
                $lte: endDate
            },
            email: req.user.email
        });

        const groupedData = data.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {
                    category: item.category,
                    totalAmount: 0,
                    details: []
                };
            }
            acc[item.category].totalAmount += item.amount;
            acc[item.category].details.push({
                date: item.date.toISOString().split('T')[0],
                amount: item.amount,
                type: item.type,
                description: item.description
            });
            return acc;
        }, {});

        const result = Object.values(groupedData);
        // console.log(result)
        res.json(result);
    } catch (error) {
        console.error('Error getting data by month and year:', error);
        throw error;
    }
};

exports.findOneById = async (req, res) => {
    try {
        const modelName = req.params.type;
        const Model = modelMap[modelName];

        if (!Model) {
            return res.status(400).json({ error: 'Invalid model name' });
        }

        const { id } = req.params;

        // Validate if the ID is provided
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }

        // Find the document by ID
        const document = await Model.findById(id);

        // Check if the document exists
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Return the document if found
        res.json(document);
    } catch (error) {
        // Handle errors
        console.error('Error finding document by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

