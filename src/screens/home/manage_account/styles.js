// src\screens\home\manage_account\styles.js

import {StyleSheet, Dimensions} from 'react-native';

import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10 * height_ratio,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginHorizontal: 18 * width_ratio,
    paddingVertical: 4 * height_ratio,
  },
  detailRow: {
    paddingHorizontal: 24 * width_ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16 * height_ratio,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
    alignItems: 'center',
  },
  detailLastRow: {
    paddingHorizontal: 24 * width_ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16 * height_ratio,
    alignItems: 'center',
  },
  detailLabel: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio,
    color: 'black',
  },
  detailValue: {
    ...theme.fonts.Regular,
    fontSize: 15 * width_ratio,
    color: '#5D5D5D',
  },
  goIcon: {
    width: 18 * width_ratio,
    height: 18 * width_ratio,
  },
});

export default styles;
