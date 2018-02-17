const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './../build');
const APP_DIR = path.resolve(__dirname, './../src');

const config = {
  entry: ["babel-polyfill", APP_DIR + '/entry.js'],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.umd.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
};

module.exports = config;