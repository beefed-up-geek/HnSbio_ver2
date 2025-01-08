// src\screens\home\set_push_alarm\styles.js

import {StyleSheet, Dimensions} from 'react-native';

import theme from '../../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  detailsContainer: {
    width: 354 * width_ratio,
    marginVertical: 36 * height_ratio,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderColor: '#F4F4F4',
    borderWidth: 1,
  },
  detailRow: {
    height: 56 * height_ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
    alignItems: 'center',
  },
  detailLastRow: {
    height: 56 * height_ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    marginLeft: 20 * width_ratio,
    gap: 10 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18 * width_ratio,
    height: 18 * width_ratio,
  },
  detailLabel: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio,
    color: 'black',
  },
  valueContainer: {
    marginRight: 20 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    ...theme.fonts.Regular,
    fontSize: 15 * width_ratio,
    color: '#5D5D5D',
  },

  saveButton: {
    position: 'absolute',
    bottom: 40 * height_ratio,
    width: '60%',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 15 * width_ratio,
  },

  // 변경사항 저장 컨펌 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300 * width_ratio,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 30 * height_ratio,
    paddingHorizontal: 32 * width_ratio,
  },
  modalMessage: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio,
    textAlign: 'left',
    marginBottom: 24 * height_ratio,
    color: '#353535',
  },
  modalButtonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  modalButtonImage: {
    height: 42 * width_ratio,
    width: 105 * width_ratio,
    resizeMode: 'contain',
  },
});

export default styles;
