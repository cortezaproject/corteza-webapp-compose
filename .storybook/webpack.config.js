const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  config.resolve.alias["@"] = path.join(path.resolve(__dirname, '../'), 'src')
  config.resolve.alias["corteza-webapp-compose"] = path.resolve(__dirname, '../'),
  config.resolve.alias["@components"] = path.join(path.resolve(__dirname, '../'), 'src/components')

  // Return the altered config
  return config;
};
