const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    ignored: [
      path.resolve(__dirname, 'node_modules')
    ]
  },
  devServer: {
    contentBase: './build',
    hot: true,
    open: false,
    port: process.env.PORT || 3000,
    historyApiFallback: true,
  },
  output: {
    hotUpdateChunkFilename: 'build/hot-update.js',
    hotUpdateMainFilename: 'build/hot-update.json'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
})