const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

handlebars.registerHelper('breaklines', function (text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/g, '<br>');
    return new handlebars.SafeString(text);
});


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendOrderInvoice = async (order) => {

    try {
        const source = fs.readFileSync(path.resolve(process.cwd(), 'email_templates/order-confirmation.html'), 'utf8');
        const template = handlebars.compile(source);
        const html = template({
            fullName: order.firstName + ' ' + order.lastName,
        })

        const pdfBuffer = fs.readFileSync(order.invoicePdf);

        const msg = {
            to: order.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Thank you for your order',
            // text: '',
            html: html,
            attachments: [
                {
                    content: pdfBuffer.toString('base64'), // base64 encoding required
                    filename: 'invoice.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        }

        const response = await sgMail.send(msg);
        console.log('Email sent');
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const sendContactUsEmail = async (data) => {

    try {
        const source = fs.readFileSync(path.resolve(process.cwd(), 'email_templates/contact-us-email.html'), 'utf8');
        const template = handlebars.compile(source);
        const html = template({
            ...data,
        })

        const msg = {
            to: process.env.CONTACT_US_RECEIVER.split(','),
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'ESI Get in touch email',
            },
            subject: 'ESI Contact us info',
            html: html,
        }

        const response = await sgMail.send(msg);
        console.log('Email was sent');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    sendOrderInvoice,
    sendContactUsEmail,
}
