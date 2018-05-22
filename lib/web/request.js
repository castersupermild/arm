const config = require('config').get('common');

const uidConfig = config.get('uid');
const uidCookieKey = uidConfig.get('cookieKey');

const getUid = req => req.cookies[uidCookieKey];

const requestMixin = req => {
  req.uid = getUid(req);
};

module.exports = (req, res, next) => {
  requestMixin(req);
  next();
};
