// jest.config.js

module.exports = {
    // Indicates the environment in which the tests are going to run
    testEnvironment: 'jsdom',
    
    // An array of file extensions your tests use
    moduleFileExtensions: ['js', 'jsx', 'json'],
    verbose: true,
    
    // The glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)', '**/*.test.(js|jsx|ts|tsx)'],
    
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // A list of paths to directories that Jest should use to search for files
    roots: ['<rootDir>/src'],
    
    // Module paths are mapped to mock modules or files
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    
    // Transform files with specific extensions using specified transformers
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    
    // A map from regular expressions to paths to transformers
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    
    // Specify the setup file to run before each test
    setupFilesAfterEnv: ['./jest.setup.js'],
  };
  