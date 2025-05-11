const listPagination = (data) => {
  return {
    items: [data],
    meta: {
      currentPage: 1,
      perPage: 10,
      totalItems: 1,
      totalPages: 1,
    },
  };
};

const validation = [
  {
    message: 'Message Error',
    path: ['body', 'variable'],
    type: 'any.string',
    context: {
      valids: [
        {
          adjust: null,
          in: false,
          iterables: null,
          map: null,
          separator: '.',
          type: 'value',
          ancestor: 1,
          path: ['variable'],
          depth: 1,
          key: 'variable',
          root: 'variable',
          display: 'ref:variable',
        },
      ],
      label: 'labelName',
      value: 'value',
      key: 'variable',
    },
  },
];

const fileUpload = {
  file: {
    fieldname: 'file',
    originalname: 'Screenshot from 2023-08-04 15-02-33.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 330714,
    bucket: 'vodjo-space',
    key: 'sepajak/25135754-045f-4904-adec-fee0d8cc9254.png',
    acl: 'public-read',
    contentType: 'image/png',
    contentDisposition: null,
    contentEncoding: null,
    storageClass: 'STANDARD',
    serverSideEncryption: null,
    metadata: {
      fieldName: 'file',
    },
    location:
      'https://vodjo-space.sgp1.digitaloceanspaces.com/sepajak/25135754-045f-4904-adec-fee0d8cc9254.png',
    etag: '"7d38cc3d77d738d86587527976d7cfa4"',
  },
};

module.exports = {
  listPagination,
  validation,
  fileUpload,
};
