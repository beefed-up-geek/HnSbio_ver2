// src/screens/home/set_push_alarm/styles.js
import { StyleSheet, Dimensions } from 'react-native';

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
    height: 18 * height_ratio,
  },
  detailLabel: {
    ...theme.fonts.Regular,
    fontSize: 16,
    color: 'black',
  },
  valueContainer: {
    marginRight: 20 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    ...theme.fonts.Regular,
    fontSize: 15,
    color: '#5D5D5D',
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
    fontSize: 15,
    color: '#7596FF',
  },
  
});

export default styles;
