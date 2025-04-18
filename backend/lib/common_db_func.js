const ProjectSettingModel = require("../models/ProjectSettingModel");

const getTaxAndShippingFee = async () => {
    try {
        const setting = await ProjectSettingModel.findOne({});
        if (!setting) {
            return null;
        }
        return {
            tax: setting.tax || 0,
            flatShippingFee: setting.flatShippingFee || 0,
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    getTaxAndShippingFee,
}
