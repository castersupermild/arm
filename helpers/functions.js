const { helpers } = require('../lib/lib.js');
const user = require('./modules/user');

const targets = Object.assign(helpers.functions, {
  user,
});

module.exports = targets;
