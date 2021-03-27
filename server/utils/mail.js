const auth = require("../pipes/auth.js")
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'essencialsbytoddlewis@gmail.com',
    pass: '200202489'
  }
});

const sendMail = async (email, subject, html) => {
    const mailOptions = {
        from: 'Essencials',
        to: email,
        subject,
        html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) 
            console.log(error);
        else 
            console.log('Email sent: ' + info.response);
    })

    return {msg: 'success'}
}

module.exports = {sendMail}