// src\screens\home\daily_check\styles.js

import {StyleSheet, Dimensions} from 'react-native';

import theme from '../../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F6FA',
  },

  checklist: {
    marginTop: 36 * height_ratio,
    marginHorizontal: 18 * width_ratio,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 24 * height_ratio,
    paddingHorizontal: 16 * width_ratio,
    marginBottom: 32 * height_ratio,
    gap: 6 * height_ratio,
  },
  checkBoxImage: {
    width: 20 * width_ratio,
    height: 20 * width_ratio,
  },
  checklistItem: {
    height: 56 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 239, 245, 0.5)',
    borderRadius: 13,
    paddingHorizontal: 16 * width_ratio,
    gap: 22 * width_ratio,
  },
  checklistText: {
    color: '#49494F',
    ...theme.fonts.Regular,
    fontSize: 15 * width_ratio,
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginTop: 0 * height_ratio,
  },
  saveButton: {
    width: '60%',
    backgroundColor: '#EBEFFE',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 16 * width_ratio,
    color: '#7596FF',
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 334 * width_ratio,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 36 * height_ratio,
    paddingHorizontal: 36 * width_ratio,
  },
  modalMessage: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio,
    textAlign: 'left',
    marginBottom: 26 * height_ratio,
    color: '#353535',
  },
  boldText: {
    ...theme.fonts.SemiBold,
  },
  modalButtonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 7 * width_ratio,
  },
  modalButtonImage1: {
    height: 48 * width_ratio,
    width: 79 * width_ratio,
    resizeMode: 'contain',
  },
  modalButtonImage2: {
    height: 48 * width_ratio,
    width: 192 * width_ratio,
    resizeMode: 'contain',
  },
});

export default styles;
