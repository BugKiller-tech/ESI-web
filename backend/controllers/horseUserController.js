const { getHorsesByWeekId } = require('../services/horseService');

const getHorsesForWeek = async ( req, res ) => {
    try {
        console.log('req body tttttttttttttttttt', req.body);
        const { weekId } = req.body;

        if (!weekId) {
            return res.status(400).json({
                message: 'Week ID is required',
            });
        }

        // Assuming you have a function to fetch horses based on weekId
        const horses = await getHorsesByWeekId(weekId);

        return res.status(200).json({
            message: 'Horses fetched successfully',
            horses: horses,
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
    getHorsesForWeek,
}
