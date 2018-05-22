const sessionConfig = require('config')
  .get('common')
  .get('session');
const session = require('express-session');

const productionMode = process.env.NODE_ENV === 'production';

const sessionOption = {
  secret: sessionConfig.get('secret'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: productionMode,
    httpOnly: true,
    maxAge: sessionConfig.get('cookieMaxAge'),
  },
};

module.exports = session(sessionOption);
