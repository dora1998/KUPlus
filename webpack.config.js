const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || "development",
  devtool: "inline-source-map",
  entry: {
    main: path.resolve(__dirname, 'src/main.js'),
    popup: path.resolve(__dirname, 'src/popup.js'),
    background: path.resolve(__dirname, 'src/background.js')
  },
  output: {
    filename: 'scripts/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: "initial",
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {from: './public', to: './'},
    ]),
  ],
};