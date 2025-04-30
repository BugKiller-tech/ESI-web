
const WeekModel = require('../models/WeekModel');

const getWeeksByState = async (state, showInvisibleAsWell=true) => {

    let conditions = {
        isDeleted: 0,
    };
    if (state) {
        conditions['state'] = state;
    }
    if (!showInvisibleAsWell) {
        conditions['isHided'] = 0;
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