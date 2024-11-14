// src/screens/kit/kit_test_styles.js

import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    display: 'flex',
    height: 68,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 1,
  },
  headerIconContainer: {
    position: 'absolute',
    left: 24,
    zIndex: 2,
    padding: 10, // 터치 영역을 늘려서 사용자가 쉽게 누를 수 있도록 합니다.
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 16,
    color: '#000000',
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    transform: [{translateX: 0}],
    zIndex: 1,
  },
  instructionsContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#49494e',
  },
  squareContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeSquare: {
    width: 250,
    height: 350,
    borderWidth: 3,
    borderColor: 'orange',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  captureButton: {
    width: 150,
    height: 50,
    backgroundColor: 'orange',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    zIndex: 3,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default styles;
