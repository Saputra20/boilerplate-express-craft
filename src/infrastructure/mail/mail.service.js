/* eslint-disable no-undef */

const fs = require('fs');
const ejs = require('ejs');
const juice = require('juice');
const { htmlToText } = require('html-to-text');
const httpStatus = require('http-status');
const mailer = require('../../config/mailer');
const logger = require('../../config/logger');
const payloads = require('./payloads');
const config = require('../../config/config');
const ApiError = require('../../@core/interceptor/ApiError');

class MailService {
  _buildPayload(event, toAddress, templateData) {
    const messagePayload = payloads[event](templateData);
    const { subject, template } = messagePayload;
    return {
      to: toAddress,
      from: config.mail.fromHeader,
      subject,
      template,
      data: templateData,
    };
  }

  async sendMail(mailOptions) {
    try {
      const { data, template, ...options } = mailOptions;
      const templatePath = `src/infrastructure/mail/templates/${template}.html`;

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (fs.existsSync(templatePath)) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const html = ejs.render(templateContent, data);
        const text = htmlToText(html);
        const htmlWithStylesInlined = juice(html);

        options.html = htmlWithStylesInlined;
        options.text = text;
      }

      if (data.attachment) {
        options.attachments = {
          data: Buffer.from(data.attachment, 'utf-8'),
          filename: data.filename,
        };
      }

      if (data.attachments) {
        const attachments = [];
        for (const d of data.attachments) {
          attachments.push({
            data: Buffer.from(d.attachment, 'utf-8'),
            filename: d.filename,
          });
        }
        options.attachments = attachments;
      }

      const result = await mailer.sendMail(options);
      logger.info('Success send email', result);
      return result;
    } catch (error) {
      logger.info('Success send email', error);
      throw new ApiError(httpStatus.BAD_REQUEST, error);
    }
  }

  dispatch(event, toAddress, templateData, queue) {
    queue.log('prepare send email');
    const payload = this._buildPayload(event, toAddress, templateData);
    queue.log(`payload email: ${JSON.stringify(payload)}`);
    return this.sendMail(payload);
  }
}

module.exports = new MailService();
