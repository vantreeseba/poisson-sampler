const path = require('path');

// Define the Webpack config.
const config = {
  performance: {
    hints: false,
  },
  entry: {
    index: [
      './index.js',
    ],
  },
  output: {
    library: ['poissonDiscSampler'],
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js?[chunkhash]',
  },
};

module.exports = config;
