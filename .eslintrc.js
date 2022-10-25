module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:cypress/recommended'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  plugins: ['@typescript-eslint', 'cypress'],
}
