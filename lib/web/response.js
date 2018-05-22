const config = require('config').get('common');
const uuidv4 = require('uuid/v4');

const uidConfig = config.get('uid');
const uidCookieKey = uidConfig.get('cookieKey');
const uidCookieMaxAge = uidConfig.get('cookieMaxAge');

const responseMixin = (req, res) => {
  if (!req.uid) {
    const productionMode = req.app.get('env') === 'production';
    const uid = uuidv4();
    req.uid = uid;
    res.cookie(uidCookieKey, uid, {
      maxAge: uidCookieMaxAge,
      secure: productionMode,
      httpOnly: true,
    });
  }
  res.locals.req = req;
};

module.exports = (req, res, next) => {
  responseMixin(req, res);
  next();
};
