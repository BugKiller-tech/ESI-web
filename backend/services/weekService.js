
const WeekModel = require('../models/WeekModel');

const getWeeksByState = async (state) => {

    let conditions = {};
    if (state) {
        conditions['state'] = state;
    }
    try {
        const weeks = await WeekModel.find(conditions).sort({
            year: -1,
            weekNumber: 1,
            createdAt: -1,
        });
        return weeks;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching weeks by state');
    }
}


module.exports = {
    getWeeksByState,
}