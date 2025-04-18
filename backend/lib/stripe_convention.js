const {
    ORDER_STATUS
} = require('../constants/constants');
const convertStripeStatusToOurStatus = (status) => {
    switch (status) {
        case 'complete':
            return ORDER_STATUS.New
    }
    return status;
}

module.exports = {
    convertStripeStatusToOurStatus,
}