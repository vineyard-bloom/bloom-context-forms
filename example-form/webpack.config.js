const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const BLOOM_DIR = path.join(__dirname, '../src/');
const APP_DIR = path.join(__dirname, '/src/');
const BUILD_DIR = path.join(__dirname, '/dist/');

const baseConfig = {
  entry: {
    bundle: ['babel-polyfill', APP_DIR + 'app-root.js']
  },
  output: {
    filename: 'index-[hash].js',
    path: BUILD_DIR,
    publicPath: '/'
  },

  devtool: 'eval-source-map',
  devServer: {
    publicPath: '/',
    contentBase: './public',
    port: 8081,
    host: '0.0.0.0',
    open: false,
    historyApiFallback: true,
    disableHostCheck: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'env'],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties'
          ]
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([{ from: 'public/index.html' }]),
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],

  resolve: {
    alias: {
      'bloom-context-forms': BLOOM_DIR,
      components: path.resolve(__dirname, 'src/components'),
      images: path.resolve(__dirname, 'src/images'),
      'redux-store': path.resolve(__dirname, 'src/redux-store')
    },
    extensions: ['.jsx', '.js', '.html']
  }
};

module.exports = baseConfig;
