module.exports = {
    env: {
      browser: false,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:node/recommended',
      'airbnb-base',   // If you chose Airbnb style guide
      'plugin:prettier/recommended', // Enables Prettier as an ESLint rule
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error', // Show prettier errors as ESLint errors
      'no-console': 'off', // Turn off this rule if using console for logging
      // Other custom rules can be added here
    },
  };
  