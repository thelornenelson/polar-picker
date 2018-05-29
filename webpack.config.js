const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
  app: path.resolve(__dirname, 'client/js/index.js'),
  build: path.resolve(__dirname, 'build/'),
  template: path.resolve(__dirname, 'client/index.html')
};
const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  entry: {
    app: paths.app
  },
  output: {
    filename: 'js/[name]-generated.js',
    path: paths.build
  },
  module: {
    rules: [
    {
      test: /\.jsx?/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2015', 'react']
        }
      }
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: paths.template
    })
  ],
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: paths.build,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  }
};
