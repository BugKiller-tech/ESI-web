const { getWeeksByState } = require('../services/weekService');

const getWeeksForState = async (req, res) => {
    try {
        const { state } = req.body;

        if (!state) {
            return res.status(400).json({
                message: 'State is required',
            });
        }

        // Assuming you have a function to fetch weeks based on state
        const weeks = await getWeeksByState(state, false);

        return res.status(200).json({
            message: 'Weeks fetched successfully',
            weeks: weeks,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports = {
    getWeeksForState,
}