// src/screens/home/styles.js

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
    marginBottom: 12 * height_ratio,
    paddingRight: 24,
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
    height: 24 * height_ratio,
    resizeMode: 'contain',
  },
  character: {
    alignItems: 'center',
  },
  characterImage: {
    width: '90%',
    height: 303 * height_ratio,
    resizeMode: 'contain',
  },
  lineWrapper: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextCheckupText1: {
    marginTop: 12,
    marginLeft: 24,
    ...theme.fonts.Regular,
    fontSize: 24 * width_ratio,
    color: '#4D495A',
  },
  nextCheckupText2: {
    marginLeft: 24,
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
    marginTop: 32 * height_ratio,
    marginBottom: 32 * height_ratio,
    gap: 4 * width_ratio,
  },
  button: {
    height: 54 * height_ratio,
    width: 166 * height_ratio,
    resizeMode: 'contain',
  },

  resultsContainer: {
    marginBottom: 36 * height_ratio,
  },
  pastResultGo: {
    marginTop: 24 * height_ratio,
    marginLeft: 28 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11 * height_ratio,
  },
  sectionTitle: {
    ...theme.fonts.Medium,
    fontSize: 16,
    color: '#A2A1AD',
  },
  resultGoIcon: {
    width: 16 * width_ratio,
    height: 16 * width_ratio,
  },
  resultBoxContainer: {
    paddingRight: 48,
    marginLeft: 24 * width_ratio,
    gap: 6,
  },
  resultBox: {
    alignItems: 'center',
    gap: 12 * height_ratio,
    paddingHorizontal: 18 * width_ratio,
    paddingVertical: 24 * height_ratio,
    backgroundColor: 'white',
    borderRadius: 18,
  },
  dateText: {
    ...theme.fonts.Medium,
    fontSize: 15 * width_ratio,
    color: '#4A4A4F',
  },
  kitStatusImage: {
    width: 68 * width_ratio,
    height: 28 * width_ratio,
  },

  roundedButtonBox: {
    backgroundColor: 'white',
    borderRadius: 24 * width_ratio,
    marginHorizontal: 24 * width_ratio,
    paddingHorizontal: 22 * width_ratio,
    paddingVertical: 28 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8 * height_ratio,
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
    ...theme.fonts.SemiBold,
    color: '#4A4A4F',
  },
  goIcon: {
    width: 26.93 * width_ratio,
    height: 23 * height_ratio,
    marginLeft: 0 * width_ratio,
    resizeMode: 'contain',
  },
  checkImage: {
    width: 36 * width_ratio,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  titleLines: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4 * height_ratio,
  },
  subLines: {
    gap: 1 * height_ratio,
  },
  boxSubLight: {
    width: 170 * width_ratio,
    fontSize: 12 * width_ratio,
    ...theme.fonts.Light,
    color: '#4A4A4F',
  },
  boxSubTextDark: {
    width: 170 * width_ratio,
    fontSize: 12 * width_ratio,
    ...theme.fonts.Light,
    color: '#7F7F7F',
  },
  percentageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EFFD',
    borderRadius: 24 * width_ratio,
    width: 68 * width_ratio,
    height: 30 * width_ratio,
  },
  percentageText: {
    ...theme.fonts.Medium,
    fontSize: 16 * width_ratio,
    color: '#4A4A4F',
  },
  noDataText: {
    ...theme.fonts.Medium,
    fontSize: 14 * width_ratio,
    color: '#828282',
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
