'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function (message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();
  let account = {
    user: process.env.ACCOUNT_EMAIL,
    pass: process.env.ACCOUNT_PASSWORD,
  };

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"General Global Services" <main@generalglobalservices.com>', // sender address
    to: process.env.ESTIMATE_RECIPIENT, // list of receivers
    subject: '✅ New Appointment', // Subject line
    text: message.text, // plain text body
    html: message.html, // html body
  });

  let text = await transporter.sendMail({
    from: '"General Global Services" <main@generalglobalservices.com>', // sender address
    subject: '> New Appointment',
    to: process.env.ESTIMATE_TEXT, // list of receivers
    text: message.text, // plain text body
    html: message.html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

// Mail().catch(console.error);

// exports.Mail = Mail;
