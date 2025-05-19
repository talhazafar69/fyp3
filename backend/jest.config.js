module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // Setup file to run before each test suite
  setupFilesAfterEnv: ['./tests/setup.js'],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],

  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',

  // A map from regular expressions to paths to transformers
  transform: {},

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // An array of regexp pattern strings that are matched against all test paths before executing the test
  testPathIgnorePatterns: [
    '/node_modules/'
  ],

  // The paths to modules that run some code to configure or set up the testing environment
  setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test file
  setupFilesAfterEnv: ['./tests/setup.js'],

  // The number of seconds after which a test is considered as slow and reported as such in the results
  slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: {},

  // This option allows the use of a custom results processor
  testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  testRunner: 'jest-circus/runner',

  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: {
    url: 'http://localhost'
  },

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  fakeTimers: {
    enableGlobally: false
  },
};