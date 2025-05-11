const { status: httpStatus } = require('http-status');

class ApiResponse {
  /**
   * @param {string} [options.message] - Optional success message
   * @param {object} options
   * @param {*} options.data - JSON object
   * @param {number} [options.status=httpStatus.OK] - HTTP status code
   * @param {*} options.writer - writable stream
   * @param {string} [options.mime] - Required for stream (e.g., 'text/csv')
   * @param {string} [options.filename] - Required for stream
   */
  constructor({ message = 'Success', data, status = httpStatus.OK, writer, mime, filename }) {
    this.message = message;
    this.data = data;
    this.status = status;
    this.writer = writer;
    this.mime = mime;
    this.filename = filename;
  }

  async send(res) {
    if (this.writer) {
      // Stream response
      res.setHeader('Content-Type', this.mime || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${this.filename || 'file'}"`);

      await this.writer.write(res); // assuming writer.write(res) returns a Promise
      return res.status(this.status).end();
    }

    // JSON response
    const payload = {
      success: true,
      message: this.message,
      data: this.data,
    };

    return res.status(this.status).json(payload);
  }
}

module.exports = ApiResponse;
