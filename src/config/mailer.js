const nodemailer = require('nodemailer');
const config = require('./config');

module.exports = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});
