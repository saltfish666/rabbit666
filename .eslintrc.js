module.exports = {
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": ["error", {
      "allow": ["warn", "error", "info"]
    }],
    "indent": ["error", 4],
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "script"
  },
  "globals": {
  },
  "env": {
    "node": true,
    "es6": true,
    "mocha": true
  }
};
