const Income = require('../models/Income');
const Expense = require('../models/Expense');
const utils = require('../utils/utils');

const modelMap = {
    'Income': Income,
    'Expense': Expense
};

exports.getData = async (req, res, next) => {
    try {
        const modelName = req.query.type;
        const Model = modelMap[modelName];
        if (!Model) {
            return res.status(400).json({ error: 'Invalid model name' });
        }
        // console.log(req.query.type);
        const data = await utils.getPrevious7DaysData(Model, req.user.email);
        // res.json({'status': 'fine'})
        res.json(data);
    }
    catch (err) {
        console.log(err)
    }
}

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