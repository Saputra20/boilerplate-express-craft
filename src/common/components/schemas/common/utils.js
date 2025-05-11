module.exports = {
  upload: {
    etag: '"35b3fc1ad8f45156ec00b24ae0f1b6a7"',
    location:
      'https://vodjo-space.sgp1.digitaloceanspaces.com/test/common/b0bcee59-bf75-415a-85b7-ffe9cdd285d4.jpeg',
    key: 'test/common/b0bcee59-bf75-415a-85b7-ffe9cdd285d4.jpeg',
    bucket: 'vodjo-space',
  },
  validation: [
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
  ],
};
