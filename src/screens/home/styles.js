// src\screens\home\styles.js
import {StyleSheet, Dimensions} from 'react-native';

import theme from '../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  logoContainer: {
    height: 68 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    marginLeft: 24 * width_ratio,
    width: 60 * width_ratio,
    height: 30 * width_ratio,
    resizeMode: 'contain',
  },
  container: {
    flexGrow: 1,
  },
  profileButton: {
    marginBottom: 4 * height_ratio,
    paddingRight: 24 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 24 * height_ratio,
  },
  profileText: {
    ...theme.fonts.Medium,
    marginRight: 8 * width_ratio,
    fontSize: 14 * width_ratio,
    color: '#72777A',
  },
  profileIcon: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
    resizeMode: 'contain',
  },
  character: {
    alignItems: 'center',
  },
  characterImage: {
    width: 278 * width_ratio,
    height: 179.83 * width_ratio,
    resizeMode: 'contain',
  },
  lineWrapper: {
    gap: 8 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextCheckupText1: {
    marginTop: 4 * height_ratio,
    marginLeft: 24 * width_ratio,
    ...theme.fonts.Regular,
    fontSize: 24 * width_ratio,
    color: '#4D495A',
  },
  nextCheckupText2: {
    marginLeft: 24 * width_ratio,
    ...theme.fonts.SemiBold,
    fontSize: 24 * width_ratio,
    color: '#4D495A',
  },
  setPushAlarmButton: {},
  setPushAlarmIcon: {
    width: 26 * width_ratio,
    height: 26 * width_ratio,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18 * height_ratio,
    marginBottom: 16 * height_ratio,
    gap: 4 * width_ratio,
  },
  button: {
    height: 54 * height_ratio,
    width: 166 * height_ratio,
    resizeMode: 'contain',
  },

  roundedButtonBox: {
    backgroundColor: 'white',
    borderRadius: 24 * width_ratio,
    marginHorizontal: 18 * width_ratio,
    paddingRight: 22 * width_ratio,
    paddingLeft: 22 * width_ratio,
    paddingVertical: 22.5 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7 * height_ratio,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * width_ratio,
  },
  bodyImage: {
    width: 32 * width_ratio,
    aspectRatio: 1,
  },
  boxText: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Medium,
    color: '#4A4A4F',
  },
  checkImage: {
    width: 36 * width_ratio,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  titleLines: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2 * height_ratio,
  },
  subLines: {
    gap: 1 * height_ratio,
  },
  boxSubTextLight: {
    width: 170 * width_ratio,
    fontSize: 12 * width_ratio,
    ...theme.fonts.Light,
    color: '#7F7F7F',
  },
  kidneyImage: {
    alignSelf: 'flex-end',
    width: 76 * width_ratio,
    height: 28 * height_ratio,
    resizeMode: 'contain',
  },
  noDataImage: {
    width: 88 * width_ratio,
    height: 28 * height_ratio,
    resizeMode: 'contain',
  },
  checkStatusImage: {
    width: 68 * width_ratio,
    height: 28 * height_ratio,
    resizeMode: 'contain',
  },
  bottomSpacer: {
    height: 100 * height_ratio,
  },
});

export default styles;
