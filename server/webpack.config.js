const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: __dirname + '/public',
    filename: 'js/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({ use: 'css-loader!postcss-loader!sass-loader' })
      },
      {
        test: /\.woff$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'application/font-woff',
            publicPath: '../',
            context: __dirname + '/src/'
          }
        }
      },
      {
        test: /\.woff2$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'application/font-woff2',
            context: __dirname + '/src/'
          }
        }
      },
      {
        test: /\.[ot]tf$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'application/octet-stream',
            context: __dirname + '/src/'
          }
        }
      },
      {
        test: /\.eot$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'application/vnd.ms-fontobject',
            context: __dirname + '/src/'
          }
        }
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'image/svg+xml',
            context: __dirname + '/src/'
          }
        }
      },
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            limit: 20000,
            mimetype: 'image/png',
            context: __dirname + '/src/'
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ]
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/bundle.css'
    })
  ]
}
