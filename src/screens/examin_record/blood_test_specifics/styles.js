import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20 * width_ratio,
    paddingTop: 20 * height_ratio,
  },
  contentContainer: {
    paddingBottom: 20 * height_ratio,
  },
  label: {
    fontSize: 14 * width_ratio,
    color: theme.colors.textGray,
    marginBottom: 5 * height_ratio,
    ...theme.fonts.Medium,
  },
  input: {
    height: 50 * height_ratio,
    borderRadius: 10 * width_ratio,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15 * width_ratio,
    fontSize: 14 * width_ratio,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    color: '#333',
    marginBottom: 15 * height_ratio,
    ...theme.fonts.Regular,
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: '#F53E50',
  },
  buttonContainer: {
    marginBottom: 20 * height_ratio,
  },
  saveButton: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#EBEFFE',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
  },
  saveButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 15,
    color: '#7596FF',
  },
  deleteButton: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#FDEEEE',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
  },
  deleteButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 15,
    color: '#F53E50',
  },
});

export default styles;