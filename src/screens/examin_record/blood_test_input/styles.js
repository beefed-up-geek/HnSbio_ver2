// src\screens\kit\styles.js
import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20 * width_ratio,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14 * width_ratio,
    color: theme.colors.textGray,
    marginTop: 16 * height_ratio,
    marginBottom: 8 * height_ratio,
    ...theme.fonts.Medium,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 50 * height_ratio,
    borderRadius: 10 * width_ratio,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15 * width_ratio,
    fontSize: 14 * width_ratio,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    color: '#333',
    ...theme.fonts.Regular,
  },
  invalidInput: {
    borderColor: '#F53E50',
  },
  unitText: {
    position: 'absolute',
    right: 15 * width_ratio,
    top: 15 * height_ratio,
    fontSize: 14 * width_ratio,
    color: '#828287',
    ...theme.fonts.Regular,
  },
  button: {
    height: 50 * height_ratio,
    borderRadius: 25 * width_ratio,
    backgroundColor: '#E8EFFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20 * height_ratio,
  },
  buttonText: {
    fontSize: 16 * width_ratio,
    color: theme.colors.mainBlue,
    ...theme.fonts.SemiBold,
  },
});

export default styles;