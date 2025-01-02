// src/screens/health_checkup/health_checkup_specifics/styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  // 전체 화면
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // PDF 보기 버튼
  pdfButton: {
    backgroundColor: '#E8EFFD',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 8 * height_ratio,
    paddingHorizontal: 16 * width_ratio,
    margin: 16 * width_ratio,
    marginBottom: 0,
    borderRadius: 9999,
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
    paddingLeft: 5,
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
    paddingRight: 5,
  },
  diseaseGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  diseaseBox: {
    // width:
    //   (Dimensions.get('window').width -
    //     16 * 2 * width_ratio - 8 * 3 * width_ratio) / 4 - 10,
    // height:
    //   (Dimensions.get('window').width -
    //     16 * 2 * width_ratio - 8 * 3 * width_ratio) / 4 - 10,
    width: 70 * width_ratio,
    height: 70 * width_ratio,
    backgroundColor: '#F7F8FB',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 7 * width_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5 * width_ratio,
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
  footerText: {
    ...theme.fonts.Medium,
    fontSize: 10 * width_ratio,
    color: '#5D5D62',
    textAlign: 'center',
    paddingVertical: 16 * height_ratio,
  },


  // 카드 컨테이너
  cardsContainer: {
    padding: 16 * width_ratio,
    backgroundColor: '#F4F5FB',
  },

  // 공통 카드 레이아웃
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12 * width_ratio,
    padding: 16 * width_ratio,
    marginBottom: 16 * height_ratio,
  },
  cardTitle: {
    ...theme.fonts.Bold,
    fontSize: 16 * width_ratio,
    color: '#000000',
    marginBottom: 16 * height_ratio,
    textAlign: 'left',
    paddingLeft: 5,
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
  },
  warningText: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 10 * width_ratio,
    color: '#72777A',
    textAlign: 'flex-start',
    ...theme.fonts.Regular,
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
    fontSize: 14 * width_ratio,
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

  // 값 + 그래프 레이아웃
  valueAndGraphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8 * height_ratio,
  },
  valueContainerHorizontal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 12 * width_ratio,
  },

  // 세로 배치 (수치+단위)
  valueContainerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    paddingBottom: 10,
  },

  // 그래프 관련
  graphContainer: {
    // 필요한 경우 margin or alignItems등 추가
  },
  graphBar: {
    position: 'relative',
    width: 200 * width_ratio,
    height: 16 * height_ratio,
    backgroundColor: '#E0E0E0',
    borderRadius: 8 * width_ratio,
  },
  referenceRangeBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#CCEB75', // 초록
    borderRadius: 8 * width_ratio,
  },
  userValueLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2 * width_ratio,
    backgroundColor: '#FF5252',
  },
  userValueMarkerImage: {
    position: 'absolute',
    width: 12 * width_ratio,
    height: 12 * width_ratio,
    top: -15 * height_ratio,
    transform: [
      { translateX: -5 * width_ratio },
      { translateY: 3 * width_ratio },
    ],
    zIndex: 9999,
  },

  // 그래프 라벨(참고치 min/max)
  referenceEdgeLabel: {
    position: 'absolute',
    ...theme.fonts.SemiBold,
    top: 20 * height_ratio,
    transform: [{ translateX: -10 * width_ratio }],
    fontSize: 12 * width_ratio,
    color: '#A1A1A1',
  },
  graphLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200 * width_ratio,
    marginTop: 4 * height_ratio,
  },
  graphLabel: {
    fontSize: 12 * width_ratio,
    color: '#999999',
  },
});

export default styles;
