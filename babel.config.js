// babel.config.js

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
  overrides: [
    {
      test: /node_modules\/@invertase\/react-native-apple-authentication/,
      presets: ['module:@babel/preset-env'],
    },
  ],
};
