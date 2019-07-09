const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appName: 'compose',
  appLabel: 'Corteza Compose',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-compose',
})
