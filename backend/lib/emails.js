const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

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
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    sendOrderInvoice,
}
