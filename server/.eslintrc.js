module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [ "error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-var": "error",
    "no-console": 0,
    "no-unused-vars": ["error", { "args": "none" }],
    "lines-around-comment": ["error", { "beforeLineComment": true, "beforeBlockComment": true }],
    "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "never" }]
  }
};
