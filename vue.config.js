var webpack = require('webpack')
var exec = require('child_process').execSync

const baseUrl = process.env.NODE_ENV === 'production' ? '/crm' : '/'

module.exports = {
  baseUrl,
  lintOnSave: true,
  configureWebpack: {
    // other webpack options to merge in ...
    plugins: [
      new webpack.DefinePlugin({
        CRUST_VERSION: JSON.stringify(('' + exec('git describe --always --tags')).trim()),
        CRUST_BUILD_TIME: JSON.stringify((new Date()).toISOString()),
      }),
    ],

    mode: process.env['NODE_ENV'],
    optimization: {
      usedExports: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  },

  // Do not copy config files (deployment procedure will do that)
  chainWebpack: config => {
    config.plugin('copy').tap(options => {
      options[0][0].ignore.push('config*js')
      return options
    })
  },

  // devServer Options don't belong into `configureWebpack`
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  css: {
    sourceMap: process.env['NODE_ENV'] === 'development',
  },
}
