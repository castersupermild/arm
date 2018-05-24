const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const jsEntryPath = path.resolve(__dirname, 'client/src/entries');
const jsDistPath = path.join(__dirname, 'public/javascripts');

const targets = glob.sync(`${jsEntryPath}/**/*.js`);

const entries = {};
targets.forEach(value => {
  const re = new RegExp(`${jsEntryPath}/`);
  const key = value.replace(re, '').split('.')[0];
  entries[key] = value;
});

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    filename: '[name].[chunkhash].js',
    path: jsDistPath,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // target loader file
        test: /\.js$/,
        // exclude directory
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
  },

  plugins: [
    // for eslint-loader runtime error
    new webpack.LoaderOptionsPlugin({ options: {} }),
    // for clean js dist directory
    new CleanWebpackPlugin([jsDistPath]),
    new ManifestPlugin(),
  ],
};
