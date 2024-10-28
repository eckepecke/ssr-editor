module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/test/**/docs.js',
        '<rootDir>/test/**/auth.js'
    ],
    coverageDirectory: 'coverage/backend',
    collectCoverage: true,
    verbose: true
  };