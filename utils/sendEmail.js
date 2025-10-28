const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL, // Your Gmail for authentication
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Your Company Name',
        address: process.env.SMTP_EMAIL, // Use SMTP_EMAIL here instead
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;