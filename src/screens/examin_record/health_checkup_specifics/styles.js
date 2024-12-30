// src/screens/health_checkup/health_checkup_specifics/styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  // 전체 화면 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // PDF 버튼
  pdfButton: {
    backgroundColor: '#E8EFFD',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 8 * height_ratio,
    paddingHorizontal: 16 * width_ratio,
    margin: 16 * width_ratio,
    borderRadius: 9999, // 둥글게
  },
  pdfIcon: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
    marginRight: 5 * width_ratio,
    resizeMode: 'contain',
  },
  pdfButtonText: {
    ...theme.fonts.Medium,
    color: '#4a4a4f',
    fontSize: 14 * width_ratio,
  },

  // 요약 영역
  summaryContainer: {
    marginHorizontal: 24 * width_ratio,
    backgroundColor: '#FFFFFF',
    borderRadius: 7 * width_ratio,
    padding: 16 * width_ratio,
    borderColor: '#DADADA',
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * height_ratio,
  },
  summaryTitle: {
    ...theme.fonts.Bold,
    fontSize: 15 * width_ratio,
    color: '#000000',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8 * width_ratio,
  },
  circleRed: {
    width: 10 * width_ratio,
    height: 10 * width_ratio,
    borderRadius: 5 * width_ratio,
    backgroundColor: '#FFF0F0',
    marginRight: 4 * width_ratio,
  },
  indicatorText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: '#000000',
  },
  diseaseGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  diseaseBox: {
    width:
      (Dimensions.get('window').width -
        16 * 2 * width_ratio -
        8 * 3 * width_ratio) /
        4 -
      10,
    height:
      (Dimensions.get('window').width -
        16 * 2 * width_ratio -
        8 * 3 * width_ratio) /
        4 -
      10,
    backgroundColor: '#F7F8FB',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 7 * width_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6 * width_ratio,
  },
  activeDiseaseBox: {
    backgroundColor: '#FFF6F9',
    borderColor: '#FEB9B5',
    borderWidth: 1,
  },
  diseaseText: {
    ...theme.fonts.SemiBold,
    fontSize: 13 * width_ratio,
    textAlign: 'center',
    color: '#72777A',
    lineHeight: 16 * height_ratio,
  },
  activeDiseaseText: {
    color: '#72777A',
  },

  // 카드들 배치
  cardsContainer: {
    padding: 16 * width_ratio, // 양옆 패딩
  },

  // 공통 카드 스타일
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12 * width_ratio,
    padding: 16 * width_ratio,
    marginBottom: 16 * height_ratio,
    elevation: 3, // 안드로이드 그림자
    shadowColor: '#000000', // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    ...theme.fonts.Bold,
    fontSize: 16 * width_ratio,
    color: '#000000',
    marginBottom: 16 * height_ratio,
    textAlign: 'left',
  },

  // 질환 박스(공통)
  diseaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12 * height_ratio,
  },
  diseaseStatusBox: {
    flex: 1,
    marginHorizontal: 4 * width_ratio,
    padding: 12 * width_ratio,
    borderRadius: 8 * width_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  // 텍스트 라벨, 값, 단위
  metricLabel: {
    ...theme.fonts.Bold,
    fontSize: 12 * width_ratio,
    color: '#72777A',
    marginBottom: 8 * height_ratio,
  },
  metricValue: {
    ...theme.fonts.Bold,
    fontSize: 20 * width_ratio,
    color: '#000000',
  },
  metricUnit: {
    ...theme.fonts.Regular,
    fontSize: 12 * width_ratio,
    color: '#000000',
    marginLeft: 4 * width_ratio,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  noTestText: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 16 * height_ratio,
  },
});

export default styles;
