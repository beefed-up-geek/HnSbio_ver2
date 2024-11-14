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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    top: 10,
    left: 0,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '70%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#ffffffaa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 20,
  },
  percentageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  percentageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  label: {
    fontSize: 16,
    color: '#777777',
  },
});

export default styles;
