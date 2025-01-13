import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme'; // 폰트와 컬러를 적용하기 위한 theme
const width_ratio = Dimensions.get('screen').width / 390; // 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    width: 390 * width_ratio,
    backgroundColor: theme.colors.background || '#ffffff',
    position: 'relative',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    paddingTop: 0,
  },
  fixedHeaderContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20 * height_ratio,
  },
  headerContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18 * width_ratio,
    color: theme.colors.textPrimary || '#333',
    textAlign: 'center',
  },
  headerBorder: {
    height: 1 * height_ratio,
    backgroundColor: theme.colors.border || '#E9E9E9',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  cardContainer: {
    width: 326 * width_ratio,
    height: 200 * height_ratio,
    position: 'relative',
    marginTop: 20 * height_ratio,
    alignSelf: 'center',
  },
  profileImage: {
    width: 125 * width_ratio,
    height: 125 * height_ratio,
    position: 'absolute',
    top: 10 * height_ratio,
    left: 100 * width_ratio,
    zIndex: 1,
  },
  card: {
    backgroundColor: theme.colors.cardBackground || '#EFE8FF',
    width: 326 * width_ratio,
    height: 128 * height_ratio,
    borderRadius: 24 * width_ratio,
    padding: 20 * width_ratio,
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    ...theme.fonts.Bold,
    fontSize: 18 * width_ratio,
    color: theme.colors.textPrimary || '#353535',
    marginBottom: 5 * height_ratio,
  },
  cardDateText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: theme.colors.textSecondary || '#545359',
  },
  roundButtonContainer: {
    position: 'absolute',
    right: 20 * width_ratio,
    top: 70 * height_ratio,
  },
  roundButton: {
    width: 80 * width_ratio,
    height: 50 * height_ratio,
    borderRadius: 25 * width_ratio,
    backgroundColor: theme.colors.accent || '#CCAEEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonImage: {
    width: 20 * width_ratio,
    height: 20 * height_ratio,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20 * height_ratio,
    alignSelf: 'flex-start',
  },
  linkIcon: {
    width: 20 * width_ratio,
    height: 20 * height_ratio,
    resizeMode: 'contain',
    marginRight: 10 * width_ratio,
  },
  linkText: {
    ...theme.fonts.Medium,
    fontSize: 14 * width_ratio,
    color: theme.colors.textGray || '#888',
  },
  resultsContainer: {
    marginTop: 20 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
  },
  resultsTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18 * width_ratio,
    color: theme.colors.textPrimary || '#5D5D62',
    marginBottom: 10 * height_ratio,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100 * height_ratio,
  },
  emptyText: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio,
    color: theme.colors.textGray || '#888',
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white || '#fff',
    borderRadius: 10 * width_ratio,
    padding: 16 * width_ratio,
    marginBottom: 15 * height_ratio,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2 * height_ratio},
    shadowOpacity: 0.1,
    shadowRadius: 5 * width_ratio,
    elevation: 3,
  },
  resultImage: {
    width: 80 * width_ratio,
    height: 80 * height_ratio,
    borderRadius: 10 * width_ratio,
    marginRight: 15 * width_ratio,
  },
  resultDetails: {
    flex: 1,
  },
  resultDate: {
    ...theme.fonts.Medium,
    fontSize: 14 * width_ratio,
    color: theme.colors.textPrimary || '#444',
    marginBottom: 5 * height_ratio,
  },
  resultStatus: {
    ...theme.fonts.Medium,
    fontSize: 16 * width_ratio,
  },
  statusAbnormal: {
    color: theme.colors.danger || '#FF5C5C',
  },
  statusNormal: {
    color: theme.colors.success || '#4CAF50',
  },
  statusUnknown: {
    color: theme.colors.textGray || 'gray',
  },
  deleteButton: {
    backgroundColor: theme.colors.danger || '#F44336',
    paddingVertical: 5 * height_ratio,
    paddingHorizontal: 10 * width_ratio,
    borderRadius: 5 * width_ratio,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.colors.White || '#fff',
    ...theme.fonts.Medium,
  },
  bottomSpacing: {
    height: 130 * height_ratio,
    backgroundColor: theme.colors.background || '#ffffff',
  },
  resultsScroll: {
    maxHeight: 300 * height_ratio, // 최대 높이를 제한 (조정 가능)
  },
  resultsScrollContent: {
    paddingBottom: 20 * height_ratio, // 하단 패딩 추가
    backgroundColor: theme.colors.background || '#ffffff', // 흰색 배경 추가
  },
});

export default styles;
