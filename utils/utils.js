exports.filterByCategory = async (YourModel, category) => {
    try {
        return await YourModel.find({ category });
    } catch (error) {
        console.error('Error filtering by category:', error);
        throw error;
    }
};

exports.filterByDateRange = async (YourModel, startDate, endDate) => {
    try {
        return await YourModel.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
    } catch (error) {
        console.error('Error filtering by date range:', error);
        throw error;
    }
};

exports.filterByAmountRange = async (YourModel, minAmount, maxAmount) => {
    try {
        return await YourModel.find({
            amount: {
                $gte: minAmount,
                $lte: maxAmount
            }
        });
    } catch (error) {
        console.error('Error filtering by amount range:', error);
        throw error;
    }
};
exports.sortByField = async (YourModel, field, order) => {
    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortQuery = {};
        sortQuery[field] = sortOrder;
        return await YourModel.find().sort(sortQuery);
    } catch (err) {
        console.error('Error sorting by field:', error);
        throw error;
    }
};

exports.sortByDate = async (YourModel, email, order) => {
    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        // Retrieve the data from the database
        const data = await YourModel.find({email: email});

        // Sort the data by date
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder * (dateA - dateB);
        });

        return sortedData;
    } catch (err) {
        console.error('Error sorting by date:', err);
        throw err;
    }
};

// exports.getPrevious7DaysData = async (YourModel) => {
//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(endDate.getDate() - 7);

//     try {
//         const data = await this.filterByDateRange(YourModel, startDate.toISOString(), endDate.toISOString());
//         return data;
//     } catch (error) {
//         console.error('Error getting data for the previous 7 days:', error);
//         throw error;
//     }
// };

exports.getPrevious7DaysData = async (YourModel, userEmail) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    // console.log(userEmail)
    try {
        const data = await YourModel.find({
            email: userEmail, // Filter by email
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Merge data by date and sum up the amount
        const mergedData = data.reduce((acc, item) => {
            const dateKey = item.date.toISOString().split('T')[0]; // Get the date part only
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, amount: item.amount }; // Initialize with the first amount
            } else {
                acc[dateKey].amount += item.amount; // Sum up the amounts
            }
            return acc;
        }, {});

        // Ensure we have data for the last 7 days
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(endDate.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            if (mergedData[dateKey]) {
                result.push(mergedData[dateKey]);
            } else {
                result.push({ date: dateKey, amount: 0 }); // Default value if no data for the date
            }
        }

        return result;
    } catch (error) {
        console.error('Error getting merged data for the previous 7 days:', error);
        throw error;
    }
};
