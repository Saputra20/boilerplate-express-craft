const { createQueue } = require('..');
const emailService = require('../../mail/mail.service');

const emailQueue = createQueue('Email');

emailQueue.process(function (job) {
  const { event, toAddress, templateData } = job.data;
  return emailService.dispatch(event, toAddress, templateData, job);
});

module.exports = emailQueue;
