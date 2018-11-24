var webpack = require('webpack')
var exec = require('child_process').execSync

module.exports = {
  baseUrl: process.env['NODE_ENV'] === 'production' ? '/crm/' : '/',
  lintOnSave: true,
  configureWebpack: {
    // other webpack options to merge in ...
    plugins: [
      new webpack.DefinePlugin({
        CRUST_VERSION: JSON.stringify(('' + exec('git describe --always --tags')).trim()),
        CRUST_BUILD_TIME: JSON.stringify((new Date()).toISOString()),
      }),
    ],
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
