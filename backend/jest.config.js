module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  collectCoverageFrom: [
    'services/**/*.js',
    'controllers/**/*.js'
  ],
  coverageDirectory: 'coverage'
}
