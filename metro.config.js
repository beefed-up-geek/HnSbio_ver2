const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname); // 기본 설정 가져오기

  const customConfig = {
    resolver: {
      // 기존 확장자를 유지하면서 'bin' 확장자 추가
      assetExts: [...defaultConfig.resolver.assetExts, 'bin'],
    },
  };

  // 기본 설정과 사용자 정의 설정 병합
  return mergeConfig(defaultConfig, customConfig);
})();
