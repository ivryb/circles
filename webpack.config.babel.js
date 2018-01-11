import { resolve } from 'path'

import webpack from 'webpack'

import NotifierPlugin from 'webpack-notifier'

const src = resolve(__dirname, 'src')
const build = resolve(__dirname, 'build')

const development = true

export default {
  entry: {
    index: './src/js/index.js'
  },

  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: development ? [
    new NotifierPlugin()
  ] : [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      parallel: true
    })
  ],

  output: {
    filename: 'js/[name].js',
    path: build,
    publicPath: '/'
  },

  devServer: {
    host: 'localhost',

    port: 3000,

    contentBase: build,

    historyApiFallback: {
      rewrites: [
        { from: /^\/subdomain\/.*/, to: 'company.html' },
        { from: /.*/, to: 'index.html' }
      ]
    }
  }
}
