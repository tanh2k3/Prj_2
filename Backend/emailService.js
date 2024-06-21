const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const myOAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Thêm redirect URI nếu cần
);

myOAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = async (to, subject, text) => {
    try {
        const accessTokenObject = await myOAuth2Client.getAccessToken();
        const accessToken = accessTokenObject.token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'trantuananh.bo2093@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: 'trantuananh.bo2093@gmail.com',
            to: to,
            subject: subject,
            text: text
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + result.response);
    } catch (error) {
        console.log('Error occurs: ', error);
    }
}

module.exports = {sendMail};