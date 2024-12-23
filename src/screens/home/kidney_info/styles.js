// src\screens\home\kidney_info\styles.js

import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  statusCard: {
    marginHorizontal: 18 * width_ratio,
    flexDirection: 'row',
    marginTop: 24 * height_ratio,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 13,
    paddingVertical: 30 * height_ratio,
    paddingHorizontal: 22 * width_ratio,
    gap: 25 * width_ratio,
  },
  statusChartImage: {
    width: 120 * width_ratio,
    height: 120 * width_ratio,
    resizeMode: 'contain',
  },
  textWrapper: {
    width: 160 * width_ratio,
    alignSelf: 'center',
    gap: 12 * height_ratio,
  },
  lightText: {
    ...theme.fonts.Light,
    fontSize: 14 * width_ratio,
    color: '#7F7F7F',
  },
  MiddleText: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#49494F',
  },
  gfrText: {
    ...theme.fonts.Medium,
    fontSize: 17 * width_ratio,
    color: '#49494F',
  },

  sectionTitle: {
    marginLeft: 24 * width_ratio,
    marginTop: 42 * height_ratio,
    ...theme.fonts.SemiBold,
    fontSize: 16 * width_ratio,
    color: '#49494F',
    marginBottom: 12 * height_ratio,
  },

  criteriaCard: {
    height: 330 * height_ratio,
    marginHorizontal: 18 * width_ratio,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 13,
    paddingVertical: 48 * height_ratio,
    alignSelf: 'center',
  },
  riskGraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10 * width_ratio,
    alignItems: 'flex-end',
  },
  riskItem: {
    alignItems: 'center',
    flex: 1,
  },

  // 단계별 riskImage 스타일
  riskImageNormal: {
    height: 120 * width_ratio,
    width: 56 * width_ratio,
    resizeMode: 'contain',
  },
  riskImageCaution: {
    height: 102 * width_ratio,
    width: 56 * width_ratio,
    resizeMode: 'contain',
  },
  riskImageModerate: {
    height: 87 * width_ratio,
    width: 56 * width_ratio,
    resizeMode: 'contain',
  },
  riskImageSevere: {
    height: 71 * width_ratio,
    width: 56 * width_ratio,
    resizeMode: 'contain',
  },
  riskImageCritical: {
    height: 54 * width_ratio,
    width: 56 * width_ratio,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    marginTop: 20 * height_ratio,
    alignItems: 'flex-start',
    paddingHorizontal: 20 * width_ratio,
  },

  selectedRiskLabel: {
    marginTop: 6 * height_ratio,
    ...theme.fonts.SemiBold,
    fontSize: 18 * width_ratio,
    color: '#49494F',
  },
  gfrCriteria: {
    ...theme.fonts.Medium,
    fontSize: 15 * width_ratio,
    marginTop: 10 * height_ratio,
    color: '#49494F',
  },
  descriptionText: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    marginTop: 4 * height_ratio,
  },
});

export default styles;
