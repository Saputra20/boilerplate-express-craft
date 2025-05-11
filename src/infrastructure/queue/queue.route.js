const express = require('express');
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const basicAuth = require('basic-auth');
const config = require('../../config/config');

const mailQueue = require('./mail/mail.queue');

const router = express.Router();
const adapter = new ExpressAdapter();
const queues = [mailQueue];

createBullBoard({
  queues: queues.map((q) => new BullAdapter(q)),
  serverAdapter: adapter,
});

const auth = (req, res, next) => {
  const credentials = basicAuth(req);

  if (
    !credentials ||
    credentials.name !== config.queue.username ||
    credentials.pass !== config.queue.password
  ) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }

  next();
};

adapter.setBasePath('/api/queue-monitor');
router.use('/', auth, adapter.getRouter());

module.exports = router;
