// src/screens/kit/kit_test_styles.js
import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390; // 상대 크기 기준
const height_ratio = Dimensions.get('screen').height / 844; // 상대 크기 기준

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    display: 'flex',
    height: 68 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 1,
  },
  headerIconContainer: {
    position: 'absolute',
    left: 24 * width_ratio,
    zIndex: 2,
    padding: 10 * width_ratio, // 터치 영역을 늘려서 사용자가 쉽게 누를 수 있도록 합니다.
  },
  headerIcon: {
    width: 20 * width_ratio,
    height: 20 * height_ratio,
  },
  headerText: {
    fontSize: 16 * width_ratio,
    fontWeight: '600',
    lineHeight: 16 * height_ratio,
    color: theme.colors.Black,
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    transform: [{translateX: 0}],
    zIndex: 1,
    ...theme.fonts.Medium,
  },
  instructionsContainer: {
    paddingTop: 40 * height_ratio,
    paddingBottom: 20 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 16 * width_ratio,
    fontWeight: '500',
    textAlign: 'center',
    color: theme.colors.BlueGray,
    ...theme.fonts.Regular,
  },
  squareContainer: {
    flex: 1,
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
    position: 'absolute', // 절대 위치
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orangeSquare: {
    width: 250 * width_ratio,
    height: 350 * height_ratio,
    borderWidth: 3 * width_ratio,
    borderColor: 'orange',
    backgroundColor: 'transparent',
  },
  captureButton: {
    width: 150 * width_ratio,
    height: 50 * height_ratio,
    backgroundColor: 'orange',
    borderRadius: 25 * width_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100 * height_ratio,
    zIndex: 3,
  },
  captureButtonText: {
    fontSize: 18 * width_ratio,
    color: theme.colors.White,
    fontWeight: '600',
    ...theme.fonts.Bold,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.White,
    padding: 20 * width_ratio,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // 필요시 배경색 설정
  },
  camera: {
    flex: 1,
    top: 10 * height_ratio,
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
    borderRadius: 10 * width_ratio,
  },
  backButton: {
    position: 'absolute',
    top: 40 * height_ratio,
    left: 20 * width_ratio,
    backgroundColor: `${theme.colors.White}aa`,
    paddingVertical: 8 * height_ratio,
    paddingHorizontal: 12 * width_ratio,
    borderRadius: 8 * width_ratio,
  },
  backButtonText: {
    fontSize: 16 * width_ratio,
    color: theme.colors.Black,
    ...theme.fonts.Medium,
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20 * height_ratio,
  },
  resultTitle: {
    fontSize: 24 * width_ratio,
    fontWeight: 'bold',
    color: theme.colors.textGray,
    marginBottom: 10 * height_ratio,
    ...theme.fonts.Bold,
  },
  result: {
    fontSize: 18 * width_ratio,
    color: theme.colors.BlueGray,
    marginBottom: 20 * height_ratio,
    ...theme.fonts.Regular,
  },
  percentageContainer: {
    width: '100%',
    marginBottom: 20 * height_ratio,
  },
  percentageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5 * height_ratio,
    padding: 10 * width_ratio,
    borderRadius: 8 * width_ratio,
    backgroundColor: theme.colors.lightGray,
  },
  percentage: {
    fontSize: 18 * width_ratio,
    fontWeight: 'bold',
    color: theme.colors.textGray,
    ...theme.fonts.Bold,
  },
  label: {
    fontSize: 16 * width_ratio,
    color: theme.colors.BlueGray,
    ...theme.fonts.Regular,
  },
  proceedButton: {
    marginTop: 10 * height_ratio,
    paddingVertical: 10 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    backgroundColor: theme.colors.mainBlue,
    borderRadius: 5 * width_ratio,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: theme.colors.White,
    fontSize: 16 * width_ratio,
    fontWeight: 'bold',
    ...theme.fonts.Bold,
  },
});

export default styles;
