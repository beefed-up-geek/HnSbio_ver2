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
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textWrapper: {
    width: 160,
    alignSelf: 'center',
    gap: 12 * height_ratio,
  },
  lightText: {
    ...theme.fonts.Light,
    fontSize: 14,
    color: '#7F7F7F',
  },
  MiddleText: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#49494F',
  },
  gfrText: {
    ...theme.fonts.SemiBold,
    fontSize: 16 * width_ratio,
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

  riskLevels: {
    marginHorizontal: 18 * width_ratio,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 13,
    paddingVertical: 50,
    alignSelf: 'center',
  },
  riskGraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  riskItem: {
    alignItems: 'center',
    flex: 1,
  },

  // 단계별 riskImage 스타일
  riskImageNormal: {
    height: 120,
    width: 56,
    resizeMode: 'contain',
  },
  riskImageCaution: {
    height: 102,
    width: 56,
    resizeMode: 'contain',
  },
  riskImageModerate: {
    height: 87,
    width: 56,
    resizeMode: 'contain',
  },
  riskImageSevere: {
    height: 71,
    width: 56,
    resizeMode: 'contain',
  },
  riskImageCritical: {
    height: 54,
    width: 56,
    resizeMode: 'contain',
  },
  descriptionContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },

  selectedRiskLabel: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#49494F'
  },
  gfrCriteria: {
    ...theme.fonts.Medium,
    fontSize: 14,
    marginTop: 10,
    color: '#49494F'
  },
  descriptionText: {
    ...theme.fonts.Regular,
    fontSize: 14,
    marginTop: 4,
  },
});

export default styles;
