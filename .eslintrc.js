module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
    // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/order-in-components.md
    'vue/order-in-components': ['error'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
