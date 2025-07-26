module.exports = {
  extends: ['expo', '@expo/eslint-config'],
  rules: {
    // Disable some rules that might cause issues with our code
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
};