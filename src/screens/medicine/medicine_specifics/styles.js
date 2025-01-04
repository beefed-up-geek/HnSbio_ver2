import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

/**
 * 의약품 상세페이지 스타일 정의
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20 * width_ratio,
    paddingBottom: 20 * height_ratio,
  },

  // 상단 그라데이션 헤더
  gradientHeader: {
    minHeight: 153 * height_ratio,
    borderRadius: 12,
    paddingHorizontal: 22,
    marginVertical: 22,
    justifyContent: 'center',
  },
  koreanName: {
    fontSize: 24 * width_ratio,
    color: '#FFFFFF',
    ...theme.fonts.SemiBold,
  },
  englishName: {
    fontSize: 18 * width_ratio,
    color: '#FFFFFF',
    marginTop: 10,
    ...theme.fonts.Regular,
  },

  // 탭 메뉴
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 22,
    justifyContent: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#7596FF',
    width: 78 * width_ratio,
    height: 34 * height_ratio,
    alignItems: 'center',
    marginHorizontal: 6, // 버튼 간격
    ...theme.fonts.Medium,
  },
  activeTabButton: {
    backgroundColor: '#7596FF',
  },
  tabText: {
    color: '#7596FF',
    fontSize: 13 * width_ratio,
    ...theme.fonts.Medium,
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  // 상세 정보 영역
  infoContainer: {
    backgroundColor: '#F1F1F1',
    paddingVertical: 35,
    paddingHorizontal: 24,
    borderColor: '#fff',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 20,
    color: 'black',
    ...theme.fonts.SemiBold,
  },
  sectionContent: {
    fontSize: 13,
    color: 'black',
    lineHeight: 18,
    ...theme.fonts.Medium,
  },

  // 푸터 영역
  sectionFooter: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    ...theme.fonts.Medium,
  },
});

export default styles;
