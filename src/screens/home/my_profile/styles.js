// src\screens\home\my_profile\styles.js
import {StyleSheet, Dimensions} from 'react-native';

import theme from '../../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 30 * width_ratio,
    marginBottom: 30 * width_ratio,
  },
  profileImage: {
    width: 110 * width_ratio,
    height: 110 * width_ratio,
    borderRadius: 500,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 140 * width_ratio,
  },
  cameraIcon: {
    width: 32 * width_ratio,
    height: 32 * width_ratio,
  },

  detailsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginHorizontal: 18 * width_ratio,
    paddingVertical: 4 * height_ratio,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16 * height_ratio,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
    alignItems: 'center',
  },
  detailLastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16 * height_ratio,
    alignItems: 'center',
  },
  detailLabel: {
    ...theme.fonts.Regular,
    marginLeft: 24 * width_ratio,
    fontSize: 16,
    color: 'black',
  },
  textButtonWrapper: {
    marginRight: 24 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * width_ratio,
  },
  detailValue: {
    ...theme.fonts.Regular,
    fontSize: 15,
    color: '#5D5D5D',
  },
  goIcon: {
    width: 18 * width_ratio,
    height: 18 * width_ratio,
  },
  accountManagementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 9 * height_ratio,
    marginHorizontal: 36 * width_ratio,
  },
  settingsIcon: {
    width: 18 * width_ratio,
    height: 18 * width_ratio,
    marginRight: 4 * width_ratio,
  },
  accountManagementText: {
    ...theme.fonts.Regular,
    fontSize: 14,
    color: '#828287',
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginTop: 12 * height_ratio,
  },
  saveButton: {
    marginTop: 12 * height_ratio,
    alignSelf: 'center',
    width: '60%',
    backgroundColor: '#EBEFFE',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 15,
    color: '#7596FF',
    alignItems: 'center',
  },
  modalOverlay: {
    // flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    // justifyContent: 'flex-end',
  },
  modalVisibleBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    // paddingHorizontal: 24 * width_ratio,
    // paddingTop: 24 * height_ratio,
    // paddingBottom: 40 * height_ratio
  },
  modalInvisibleBackground: {
    backgroundColor: 'white',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // marginTop: 500*height_ratio,
    paddingHorizontal: 24 * width_ratio,
    paddingTop: 24 * height_ratio,
    paddingBottom: 40 * height_ratio,
  },
  modalTitle: {
    color: '#49494F',
    fontSize: 18,
    ...theme.fonts.SemiBold,
    textAlign: 'center',
    marginBottom: 32 * height_ratio,
  },
  modalSaveButtonContainer: {
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    marginTop: 20 * height_ratio,
  },
  inputContainer: {
    marginBottom: 18 * height_ratio,
  },
  inputLabel: {
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#505054',
    marginBottom: 8 * height_ratio,
  },
  textInput: {
    ...theme.fonts.Regular,
    backgroundColor: '#F1F1F1',
    borderRadius: 18,
    paddingVertical: 15 * width_ratio,
    paddingHorizontal: 24 * width_ratio,
    fontSize: 14,
    color: '#49494F',
  },
  charCount: {
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
    marginTop: 5 * height_ratio,
  },
  optionContainer: {
    marginVertical: 20 * height_ratio,
    gap: 8,
  },
  optionButton: {
    height: 52 * height_ratio,
    backgroundColor: '#F1F1F1',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#EBEFFE',
  },
  optionText: {
    ...theme.fonts.Regular,
    fontSize: 15 * width_ratio,
    color: '#49494F',
  },
  selectedOptionText: {
    color: '#7596FF',
  },
  birthdateInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10 * height_ratio,
  },
  birthdateInput: {
    borderBottomWidth: 1,
    borderColor: '#878787',
    width: 80 * width_ratio,
    textAlign: 'center',
    fontSize: 16 * width_ratio,
    color: 'black',
    marginHorizontal: 5 * width_ratio,
  },
  birthdateSeparator: {
    fontSize: 16 * width_ratio,
    color: 'black',
    marginHorizontal: 2 * width_ratio,
  },
});

export default styles;
