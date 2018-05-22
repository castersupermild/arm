const config = require('config');
const fs = require('fs');

const modeProduction = process.env.NODE_ENV === 'production';

const assetConfig = config.asset || {};
const manifestPath =
  assetConfig.manifestPath || './public/javascripts/manifest.json';
const staticJsPath = assetConfig.staticJsPath || 'javascripts';
const staticCssPath = assetConfig.staticCssPath || 'stylesheets';

const getManifest = () => JSON.parse(fs.readFileSync(manifestPath));
const manifest = getManifest();
const assetsPath = path => {
  if (modeProduction) {
    return `${manifest[path]}`;
  }
  return `${getManifest()[path]}`;
};

module.exports = {
  jsPath: path =>
    `<script src="/${staticJsPath}/${assetsPath(path)}"></script>`,
  cssPath: path =>
    `<link rel='stylesheet' href='/${staticCssPath}/${assetsPath(path)}' />`,
};
