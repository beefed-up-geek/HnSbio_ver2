// jestSetup.js

import 'react-native-gesture-handler/jestSetup';

// Jest에서 기본 모듈 mock 처리
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: jest.fn(),
    DrawerLayout: jest.fn(),
    State: {},
    Directions: {},
    GestureHandlerRootView: ({ children }) => children,
    createNativeWrapper: jest.fn(),
    attachGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    enableExperimentalWebImplementation: jest.fn(),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => {
    return {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      mergeItem: jest.fn(),
      clear: jest.fn(),
      getAllKeys: jest.fn(),
      multiSet: jest.fn(),
      multiRemove: jest.fn(),
      multiGet: jest.fn(),
      multiMerge: jest.fn(),
    };
});

jest.mock('react-native-geolocation-service', () => {
    return {
      getCurrentPosition: jest.fn((success, error) =>
        success({ coords: { latitude: 37.7749, longitude: -122.4194 } })
      ),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
      stopObserving: jest.fn(),
    };
});

jest.mock('react-native-blob-util', () => {
    return {
      DocumentDir: jest.fn(),
      TemporaryDir: jest.fn(),
      LibraryDir: jest.fn(),
      CachesDir: jest.fn(),
      MainBundleDir: jest.fn(),
      PicturesDir: jest.fn(),
      MusicDir: jest.fn(),
      MoviesDir: jest.fn(),
      DownloadDir: jest.fn(),
      DCIMDir: jest.fn(),
      SDCardDir: jest.fn(),
      createFile: jest.fn(),
      isDir: jest.fn(),
      mkdir: jest.fn(),
      moveFile: jest.fn(),
      pathForAppGroup: jest.fn(),
      readFile: jest.fn(),
      unlink: jest.fn(),
      writeFile: jest.fn(),
      writeStream: jest.fn(),
      session: jest.fn(),
      fetch: jest.fn(),
      base64: jest.fn(),
      removeSession: jest.fn(),
    };
});

jest.mock('react-native-webview', () => {
    return {
      WebView: jest.fn(() => null),
    };
});
  
jest.mock('react-native-youtube-iframe', () => {
    return jest.fn(() => null);
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
