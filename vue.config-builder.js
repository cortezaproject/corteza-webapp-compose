var webpack = require('webpack')
var exec = require('child_process').execSync
var path = require('path')

module.exports = ({ appName, appLabel, version, theme, packageAlias, root = path.resolve('.'), env = process.env.NODE_ENV }) => {
  const isDevelopment = (env === 'development')
  const isProduction = (env === 'production')
  const isTest = (env === 'test')

  if (isTest) {
    var Vue = require('vue')
    Vue.config.devtools = false
    Vue.config.productionTip = false
  }

  const publicPath = isProduction ? '/' + appName : '/'
  const optimization = isTest ? {} : {
    usedExports: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
  }

  return {
    publicPath,
    lintOnSave: true,
    runtimeCompiler: true,

    transpileDependencies: [
      /^[\\/]node_modules[\\/]corteza-webapp-/,
    ],

    configureWebpack: {
      // other webpack options to merge in ...
      plugins: [
        new webpack.DefinePlugin({
          WEBAPP: JSON.stringify(appLabel),
          VERSION: JSON.stringify(version || ('' + exec('git describe --always --tags')).trim()),
          BUILD_TIME: JSON.stringify((new Date()).toISOString()),
        }),
      ],

      optimization,
    },

    chainWebpack: config => {
      // Do not copy config files (deployment procedure will do that)
      config.plugins.has('copy') && config.plugin('copy').tap(options => {
        options[0][0].ignore.push('config*js')
        return options
      })

      // Aliasing 'corteza-webapp-compose' instead of '@' so we do
      // not break imports on apps that import this code
      config.resolve.alias.delete('@')
      if (packageAlias) {
        config.resolve.alias.set(packageAlias, root)
      }

      const scssNormal = config.module.rule('scss').oneOf('normal')

      scssNormal.use('sass-loader')
        .loader('sass-loader')
        .tap(options => ({
          ...options,
          sourceMap: true,
          sourceMapContents: false,
        }))

      // Load CSS assets according to their location
      scssNormal.use('resolve-url-loader')
        .loader('resolve-url-loader').options({
          keepQuery: true,
          root: path.join(root, 'src/themes', theme),
        })
        .before('sass-loader')
    },

    devServer: {
      host: '0.0.0.0',
      hot: true,
      disableHostCheck: true,
    },

    css: {
      sourceMap: isDevelopment,
      loaderOptions: {
        sass: {
          // @todo cleanup all components and remove this global import
          data: `
            @import "./src/themes/${theme}/variables.scss";
          `,
        },
      },
    },
  }
}
