const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  resolver: {
    assetExts: ['bin'], // 기존 확장자 목록에 'bin' 추가
  },
};

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  return mergeConfig(defaultConfig, customConfig);
})();
