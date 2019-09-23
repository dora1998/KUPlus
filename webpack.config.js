const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './scripts/main.js',
    popup: './scripts/popup.js',
    background: './scripts/background.js'
  },
  output: {
    filename: 'scripts/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new CopyPlugin([
      'manifest.json',
      {from: 'icons', to: 'icons'},
      {from: 'styles', to: 'styles'},
      {from: 'pages', to: 'pages'},
    ]),
  ],
};