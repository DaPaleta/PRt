module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json' },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-console': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-floating-promises': 'error'
    // We want this rule, but it conflicts with prettier
    // https://github.com/prettier/prettier/issues/3806
    // 'operator-linebreak': ['error', 'before']
  },
  globals: {
    global: true,
    globalThis: true,
    document: true,
    module: true,
    window: true,
    require: true
  }
}
