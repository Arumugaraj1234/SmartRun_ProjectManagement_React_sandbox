module.exports = {
  "extends": [
    "react-app",
    "airbnb",
    "prettier"
  ],
  "rules": {
    "no-unused-vars": ["error", { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "ignoreRestSiblings": true }],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    "react/self-closing-comp": [
      "error",
      {
        "component": true,
        "html": true
      }
    ],
    "no-useless-escape": "off",
    "no-script-url": "off",
    "jsx-a11y/anchor-has-content": "off",
    "jsx-a11y/href-no-hash": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-template-curly-in-string": "off",
    "react/prop-types": 0,
    "react/prefer-stateless-function": 0,
    "react/jsx-one-expression-per-line": 0,
    "linebreak-style": 0,
    "react/jsx-wrap-multilines": 0,
    "react/no-danger": 0,
    "react/forbid-prop-types": 0,
    "no-use-before-define": 0,
    "no-param-reassign": 0,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
    "no-console": 0,
    "react/no-multi-comp": 0,
    "no-nested-ternary": 0
  },
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
};
