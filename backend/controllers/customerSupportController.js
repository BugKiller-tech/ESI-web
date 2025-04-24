
const {
    sendContactUsEmail
} = require('../lib/emails');

const sendContactUs = async (req, res) => {
    try {
        const {
            name,
            email,
            subject,
            message,
        } = req.body;
        sendContactUsEmail(req.body)
        .then(response => {
        })
        .catch(error => {
            console.log('error occured during sending contact us');
            console.log(error);
        })
        return res.json({
            message: 'Successfully sent',
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to send your contact trying',
        })
    }
}

module.exports = {
    sendContactUs,
}