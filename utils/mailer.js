const nodemailer = require('nodemailer');

function getMailer(recipientEmail, subjectText) {  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAILID, 
          pass: process.env.MAILPASSWORD, 
        },
    });
    
    const mailOptions = {
        from: process.env.MAILID,
        to: recipientEmail,
        subject: `Feedback from ${recipientEmail}`,
        text: subjectText, 
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { getMailer };
