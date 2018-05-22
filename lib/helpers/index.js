const moment = require('moment');
const isJpHoliday = require('japanese-holidays').isHoliday;
const assetPath = require('./asset_path');

module.exports = {
  functions: {
    moment,
    isJpHoliday,
    assetPath,
  },
};
