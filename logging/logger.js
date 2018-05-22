const config = require('config')
  .get('app')
  .get('logging')
  .get('log4js');
const log4js = require('log4js');

log4js.configure(config);

module.exports = {
  appLogger: log4js.getLogger('application'),
  apiLogger: log4js.getLogger('api'),
};
