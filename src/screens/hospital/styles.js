import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  searchSection: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: '#f9f9f9',
  },
  input: {
    ...theme.fonts.Regular,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginRight: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: '#8E9098',
  },
  locationContainer: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold'
  },
  filtersection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterScrollView: {
    flex: 1,
    marginRight: 10,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 4,
    padding: 3,
  },
  filterChipText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold'
  },
  scrollView: {
    flex: 1,
  },
  section: {
    // backgroundColor: 'black',
    marginTop: 18,
    marginBottom: 12,
    zIndex: 9000,
  },
  pickerWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9000,
  },
  sectionTitle: {
    ...theme.fonts.Medium,
    color: 'black',
    fontSize: 16,
  },
  distancePicker: {
    color: 'black',
    width: 120,
  },
  gradePicker: {
    color: '#72777A',
    width: 94,
    marginLeft: 5,
  },
  dropdownContainer: {

  },
  dropdown: {
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 15,
  },
  dropdownList: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    maxHeight: 200,
  },
  dropdownList1: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    maxHeight: 250,
  },
  dropdownText: {
    fontSize: 14,
    color: '#72777A',
  },
  arrowIcon: {
    tintColor: '#72777A',
  },
  card: {
    padding: 20,
    backgroundColor: '#fafafa',
    borderRadius: 13,
    marginBottom: 10,
    marginLeft: width_ratio * 5,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  grade: {
    ...theme.fonts.Medium,
    fontSize: 12,
    backgroundColor: '#F0F5FF',
    borderColor: '#ADC6FF',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  hospitalName: {
    ...theme.fonts.SemiBold,
    marginBottom: 6,
    fontSize: 16,
    color: '#000',
  },
  hospitalAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalTimeContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  hospitalTimeLabel: {
    color: '#888',
    fontWeight: 'bold',
  },
  hospitalTime: {
    color: '#888',
  },
  locationImage: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  hospitalAddress: {
    width: '90%',
    ...theme.fonts.Medium,
    fontSize: width_ratio * 12,
    color: '#888',
  },
  phone: {
    ...theme.fonts.Regular,
    fontSize: 13,
    color: '#666',
    marginLeft: 3,
    marginBottom: 2,
  },
  blankBox: {
    zIndex: 1,
  },
  filterButton: {
    marginTop: 6,
    width: 30, // 버튼의 가로 길이
    height: 30, // 버튼의 세로 길이
    backgroundColor: '#F0F0F0', // 버튼 배경색
    borderRadius: 25, // 둥근 버튼을 위해 반지름 설정
    alignItems: 'flex-end', // 이미지 가운데 정렬
    justifyContent: 'flex-end', // 이미지 가운데 정렬
  },
  filterIcon: {
    width: 40, // 이미지 너비
    height: 40, // 이미지 높이
    resizeMode: 'contain',
  },
  filtersection: {
    backgroundColor: 'transparent',
    marginLeft: -10,
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between',
    alignItems: 'center', // 요소들을 세로로 중앙 정렬
    paddingHorizontal: 10, // 필요 시 양쪽 패딩
  },
  noHospitalText: {
    ...theme.fonts.Medium,
    marginTop: 120,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  placeholder: {
    height: 50,
    backgroundColor: 'transparent',
  },
  phonecontainer:{
    flexDirection: 'row',
    alignItems: 'center', // 이미지 가운데 정렬
    marginTop: 5,
  },
});

export default styles;