const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionConfig = {
  store: new FileStore(),
  key: 'elbrusid',
  secret: process.env.SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
  httpOnly: true,
  cookie: {
    path: '/',
    httpOnly: true,
    expires: 24 * 60 * 60e3,
  },
};
module.exports = sessionConfig;
