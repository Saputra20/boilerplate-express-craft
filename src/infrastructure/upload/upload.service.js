/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../../@core/interceptor/ApiError');
const { spaceClient: s3, spaceACL } = require('../../config/storage');
const config = require('../../config/config');

class UploadService {
  send(filename, directory = 'common') {
    const filePath = path.join(__dirname, `../../storage/temp/${filename}`);
    const imageSrc = fs.readFileSync(filePath);
    if (!imageSrc) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'File not found');
    return new Promise((resolve, reject) => {
      return s3.upload(
        {
          Bucket: config.s3.name,
          Key: `${config.s3.rootDir}/${directory}/${filename}`,
          // eslint-disable-next-line no-undef
          Body: Buffer.from(imageSrc, 'utf-8'),
          ACL: spaceACL.PUBLIC_READ,
        },
        async (err, data) => {
          if (err) {
            reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err));
          } else {
            fs.unlinkSync(filePath);
            resolve({
              etag: data.ETag,
              location: data.Location,
              key: data.Key,
              bucket: data.Bucket,
            });
          }
        },
      );
    });
  }
}

module.exports = new UploadService();
