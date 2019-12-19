module.exports = {
  plugins: [ 'jest' ],
  extends: [
    '../.eslintrc.js',
    'plugin:jest/recommended'
  ],
  rules: {
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['supertest']
      }
    ]
  }
}
