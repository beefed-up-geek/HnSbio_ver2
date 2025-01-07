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

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
