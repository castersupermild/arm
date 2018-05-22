const { helpers } = require('../lib/lib.js');
const hello = require('./modules/hello');
const user = require('./modules/user');

const targets = Object.assign(helpers.functions, {
  sayHello: hello,
  user,
});

module.exports = targets;
