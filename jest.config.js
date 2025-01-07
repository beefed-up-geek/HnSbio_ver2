// jest.config.js

module.exports = {
  preset: 'react-native',
  setupFiles: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|react-navigation|@react-navigation|react-native-gesture-handler|react-native-reanimated|@react-native|@env)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Babel로 파일 변환
  },
  moduleNameMapper: {
    '^@env$': '<rootDir>/path/to/your/mock/env', // .env 파일 mock (필요 시)
  },
};
