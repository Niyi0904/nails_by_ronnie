const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const ERROR_LOG = path.join(LOG_DIR, 'error.log');
const REQUEST_LOG = path.join(LOG_DIR, 'request.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const timestamp = () => new Date().toISOString();

const write = (file, msg) => {
  const line = `[${timestamp()}] ${msg}\n`;
  fs.appendFile(file, line, (err) => {
    if (err) console.error('Logger write failed:', err);
  });
};

const formatReq = (req) => ({
  method: req.method,
  url: req.originalUrl || req.url,
  body: req.body,
  query: req.query,
  params: req.params,
  ip: req.ip,
});

const logger = {
  error: (err, req = {}) => {
    const info = formatReq(req);
    const text = [
      `ERROR: ${err.message}`,
      `Stack: ${err.stack}`,
      `Route: ${info.method} ${info.url}`,
      `Body: ${JSON.stringify(info.body)}`,
      `Query: ${JSON.stringify(info.query)}`,
      `Params: ${JSON.stringify(info.params)}`,
      `IP: ${info.ip}`,
    ].join('\n  ');
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);
    write(ERROR_LOG, text);
  },

  request: (req) => {
    const info = formatReq(req);
    const text = `${info.method} ${info.url} from ${info.ip}`;
    write(REQUEST_LOG, text);
  },

  fatal: (err) => {
    const msg = `FATAL: ${err.message}\n  Stack: ${err.stack}`;
    console.error(msg);
    write(ERROR_LOG, msg);
  },
};

module.exports = logger;
