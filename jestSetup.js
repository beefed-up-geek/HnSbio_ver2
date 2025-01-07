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

jest.mock('react-native-vision-camera', () => {
    return {
      Camera: jest.fn(() => null),
      useCameraDevice: jest.fn(() => ({
        devices: [],
      })),
      useFrameProcessor: jest.fn(),
    };
});

jest.mock('react-native-fs', () => {
    return {
      exists: jest.fn(() => Promise.resolve(true)),
      mkdir: jest.fn(() => Promise.resolve()),
      moveFile: jest.fn(() => Promise.resolve()),
      pathForBundle: jest.fn(() => Promise.resolve('/mock/path')),
      pathForGroup: jest.fn(() => Promise.resolve('/mock/group')),
      readDir: jest.fn(() => Promise.resolve([])),
      readFile: jest.fn(() => Promise.resolve('mocked file content')),
      writeFile: jest.fn(() => Promise.resolve()),
      unlink: jest.fn(() => Promise.resolve()),
      stat: jest.fn(() => Promise.resolve({ isFile: () => true, size: 12345 })),
      downloadFile: jest.fn(() => ({
        promise: Promise.resolve(),
      })),
      uploadFiles: jest.fn(() => Promise.resolve()),
    };
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
