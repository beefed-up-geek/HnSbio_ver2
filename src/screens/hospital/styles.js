// src\screens\hospital\styles.js
import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 21 * width_ratio*0.95,
  },
  headerContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20 * height_ratio,
  },
  backgroundImage: {
    position: 'absolute', // 절대 위치
    top: - 58 * height_ratio,
    right: 0 * width_ratio,
    width: '150%',
    height: '150%',
    opacity: 0.5,
    resizeMode: 'contain', // 이미지를 전체 화면에 맞게
    zIndex: -1, // 다른 요소 뒤로 배치
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  searchSection: {
    marginTop: 40 * height_ratio*0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 12 * height_ratio*0.9,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * width_ratio*0.95,
    paddingVertical: 4 * height_ratio*0.9,
    borderRadius: 24 * width_ratio*0.95,
    backgroundColor: '#f9f9f9',
  },
  input: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio*0.95,
    color: '#000',
  },
  searchIcon: {
    marginRight: 8 * width_ratio*0.95,
    width: 24 * width_ratio*0.95,
    height: 24 * height_ratio*0.9,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: '#8E9098',
  },
  locationContainer: {
    marginLeft: 4 * width_ratio*0.95,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  locationText: {
    fontSize: 14 * width_ratio*0.95,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
  },
  filtersection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10 * width_ratio*0.95,
    paddingVertical: 8 * height_ratio*0.9,
  },
  filterScrollView: {
    flex: 1,
    marginRight: 10 * width_ratio*0.95,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8 * height_ratio*0.9,
    paddingHorizontal: 2 * width_ratio*0.95,
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16 * width_ratio*0.95,
    paddingVertical: 6 * height_ratio*0.9,
    paddingHorizontal: 12 * width_ratio*0.95,
    marginRight: 4 * width_ratio*0.95,
    padding: 3 * width_ratio*0.95,
  },
  filterChipText: {
    fontSize: 14 * width_ratio*0.95,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 1* width_ratio
  },
  scrollView: {
    flex: 1,
  },
  section: {
    // backgroundColor: 'black',
    marginTop: 18 * height_ratio*0.9,
    marginBottom: 12 * height_ratio*0.9,
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
    fontSize: 16 * width_ratio*0.95,
  },
  distancePicker: {
    color: 'black',
    width: 120 * width_ratio*0.95,
  },
  gradePicker: {
    color: '#72777A',
    width: 94 * width_ratio*0.95,
    marginLeft: 5 * width_ratio*0.95,
  },
  dropdownContainer: {
    // 여기에 추가적인 스타일이 있다면 동일하게 적용하세요.
  },
  dropdown: {
    borderColor: 'transparent',
    borderWidth: 1 * width_ratio*0.95,
    borderRadius: 15 * width_ratio*0.95,
  },
  dropdownList: {
    borderColor: '#ddd',
    borderWidth: 1 * width_ratio*0.95,
    borderRadius: 15 * width_ratio*0.95,
    maxHeight: 200 * height_ratio*0.9,
  },
  dropdownList1: {
    borderColor: '#ddd',
    borderWidth: 1 * width_ratio*0.95,
    borderRadius: 15 * width_ratio*0.95,
    maxHeight: 250 * height_ratio*0.9,
  },
  dropdownText: {
    fontSize: 14 * width_ratio*0.95,
    color: '#72777A',
  },
  arrowIcon: {
    tintColor: '#72777A',
  },
  card: {
    padding: 20 * width_ratio*0.95,
    backgroundColor: '#fafafa',
    borderRadius: 13 * width_ratio*0.95,
    marginBottom: 10 * height_ratio*0.9,
    marginLeft: 10 * width_ratio,
    width: "95%",
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * height_ratio*0.9,
  },
  grade: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio*0.95,
    backgroundColor: '#F0F5FF',
    borderColor: '#ADC6FF',
    textAlign: 'center',
    borderWidth: 1 * width_ratio*0.95,
    borderRadius: 8 * width_ratio*0.95,
    paddingHorizontal: 10 * width_ratio*0.95,
    paddingVertical: 3 * height_ratio*0.9,
  },
  starIcon: {
    marginRight: 5 * width_ratio*0.95,
    width: 23 * width_ratio*0.95,
    height: 23 * height_ratio*0.9,
  },
  hospitalName: {
    ...theme.fonts.SemiBold,
    marginBottom: 6 * height_ratio*0.9,
    fontSize: 16 * width_ratio*0.95,
    color: '#000',
  },
  hospitalAddressContainer: {
    marginTop: 3 * height_ratio  ,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalTimeContainer: {
    flexDirection: 'row',
    marginTop: 5 * height_ratio*0.9,
  },
  hospitalTimeLabel: {
    color: '#888',
    fontWeight: 'bold',
  },
  hospitalTime: {
    color: '#888',
  },
  locationImage: {
    width: 20 * width_ratio*0.95,
    height: 20 * height_ratio*0.9,
    marginRight: 6 * width_ratio*0.95,
  },
  hospitalAddress: {
    width: '90%',
    ...theme.fonts.Medium,
    fontSize: 13 * width_ratio*0.95,
    color: '#888',
  },
  phone: {
    ...theme.fonts.Regular,
    fontSize: 13 * width_ratio*0.95,
    color: '#666',
    marginLeft: 5.8 * width_ratio,
    marginBottom: 4 * height_ratio*0.9,
  },
  blankBox: {
    zIndex: 1,
  },
  filterButton: {
    marginTop: 6 * height_ratio*0.9,
    width: 30 * width_ratio*0.95, // 버튼의 가로 길이
    height: 30 * height_ratio*0.9, // 버튼의 세로 길이
    backgroundColor: '#F0F0F0', // 버튼 배경색
    borderRadius: 25 * width_ratio*0.95, // 둥근 버튼을 위해 반지름 설정
    alignItems: 'flex-end', // 이미지 가운데 정렬
    justifyContent: 'flex-end', // 이미지 가운데 정렬
  },
  filterIcon: {
    width: 43 * width_ratio*0.95, // 이미지 너비
    height: 43 * height_ratio*0.9, // 이미지 높이
    resizeMode: 'contain',
  },
  filtersection: {
    backgroundColor: 'transparent',
    marginLeft: -10 * width_ratio*0.95,
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between',
    alignItems: 'center', // 요소들을 세로로 중앙 정렬
    paddingHorizontal: 10 * width_ratio*0.95, // 필요 시 양쪽 패딩
  },
  noHospitalText: {
    ...theme.fonts.Medium,
    marginTop: 120 * height_ratio*0.9,
    fontSize: 16 * width_ratio*0.95,
    color: '#888',
    textAlign: 'center',
  },
  placeholder: {
    height: 50 * height_ratio*0.9,
    backgroundColor: 'transparent',
  },
  phonecontainer: {
    flexDirection: 'row',
    alignItems: 'center', // 이미지 가운데 정렬
    marginTop: 9 * height_ratio*0.9,
  },
  headerBorder: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  distanceText: {
    fontSize:15 * width_ratio*0.95,
    color: '#55aaff',
    ...theme.fonts.SemiBold,
    marginBottom: 6*height_ratio,
    marginLeft: 7*width_ratio,
  },
  hospitalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center', // 수직 정렬
    justifyContent: 'flex-start', // 병원 이름과 거리 사이 간격 조정
    width: '86%',
  },
  
});

export default styles;
