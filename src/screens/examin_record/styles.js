// src/screens/examin_record/styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  fixedHeaderContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  headerBorder: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 10 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    paddingBottom: 20 * height_ratio,
  },
  scrollViewContent: {
    paddingBottom: 20 * height_ratio,
  },
  bloodTestContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * width_ratio,
    padding: 20 * width_ratio,
    marginBottom: 10 * height_ratio,

  },
  healthCheckupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * width_ratio,
    padding: 20 * width_ratio,
  },
  bloodTestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
  },
  healthCheckupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
  },
  sectionTitle: {
    ...theme.fonts.Bold,
    fontSize: 18,
    color: '#7596FF',
  },
  infoText: {
    fontSize: 12,
    color: '#72777A',
    marginBottom: 10 * height_ratio,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFFD',
    padding: 10 * width_ratio,
    borderRadius: 20 * width_ratio,
  },
  buttonText: {
    marginLeft: 5 * width_ratio,
    ...theme.fonts.Medium,
    fontSize: 12,
    color: '#4a4a4f',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10 * height_ratio,
    padding: 16 * width_ratio,
    borderRadius: 25 * width_ratio,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardType: {
    ...theme.fonts.Bold,
    fontSize: 16 * width_ratio,
    color: '#333',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: '#828282',
    marginRight: 4 * width_ratio,
  },
  cardContent: {
    marginTop: 8 * height_ratio,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6 * width_ratio,
  },
  abnormalTag: {
    backgroundColor: '#FEE7E7',
    borderRadius: 10 * width_ratio,
    paddingHorizontal: 10 * width_ratio,
    paddingVertical: 5 * height_ratio,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginBottom: 5 * height_ratio,
  },
  abnormalTagText: {
    ...theme.fonts.Medium,
    fontSize: 10 * width_ratio,
    color: '#FF6B6B',
  },
  normalText: {
    fontSize: 12 * width_ratio,
    color: '#333',
  },
  footerMargin: {
    height: 100 * height_ratio,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10 * width_ratio,
    borderRadius: 10 * width_ratio,
    marginHorizontal: 10 * width_ratio,
    maxHeight: 120 * height_ratio, // 최대 높이 제한
  },
  noDataImage: {
    width: 90 * width_ratio,
    height: 90 * width_ratio,
    resizeMode: 'contain',
  },
  noDataText: {
    ...theme.fonts.Medium,
    fontSize: 16 * width_ratio,
    color: '#555',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10 * height_ratio,
  },
  viewAllText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: '#828282',
    marginRight: 5 * width_ratio,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
  },
  viewAllButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8 * width_ratio,
    paddingVertical: 6 * height_ratio,
    backgroundColor: '#ffffff',
    borderRadius: 12 * width_ratio,
  },
});

export default styles;
