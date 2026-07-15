// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const {
  override,
  // fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
  useBabelRc,
} = require('customize-cra')

// Remove ESLint from webpack build to prevent warnings blocking compilation
const removeEslintRule = config => {
  config.module.rules = config.module.rules.filter(
    rule => !(rule.use && rule.use.some(use => use.options && use.options.useEslintrc !== void 0))
  );
  return config;
}

module.exports = override(
  addDecoratorsLegacy(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 'root-entry-name': 'default' },
  }),
  removeEslintRule,
  useBabelRc(),
)