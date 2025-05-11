const CONST = require('../../../common/constants');

const { event } = CONST.mailer;
const appName = 'Boilerplate';

const payloads = {
  [event.DYNAMIC_CONTENT]: (data) => ({
    subject: `${appName} - ${data.subject}`,
    template: event.DYNAMIC_CONTENT,
  }),
  [event.EMAIL_VERIFY]: (data) => ({
    subject: `${appName} - ${data.subject}`,
    template: event.EMAIL_VERIFY,
  }),
  [event.RESET_PASSWORD]: (data) => ({
    subject: `${appName} - ${data.subject}`,
    template: event.RESET_PASSWORD,
  }),
};

module.exports = payloads;
