// src\screens\hospital\styles.js
import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 21 * width_ratio * 0.95,
  },
  backgroundImage: {
    position: 'absolute',
    top: -58 * height_ratio,
    right: 0 * width_ratio,
    width: '150%',
    height: '150%',
    opacity: 0.5,
    resizeMode: 'contain',
    zIndex: -1,
  },
  searchSection: {
    marginTop: 20 * height_ratio * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 12 * height_ratio * 0.9,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * width_ratio * 0.95,
    paddingVertical: 4 * height_ratio * 0.9,
    borderRadius: 24 * width_ratio * 0.95,
    backgroundColor: '#f9f9f9',
  },
  input: {
    ...theme.fonts.Regular,
    fontSize: 16 * width_ratio * 0.95,
    color: '#000',
  },
  searchIcon: {
    marginRight: 8 * width_ratio * 0.95,
    width: 24 * width_ratio * 0.95,
    height: 24 * height_ratio * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: '#8E9098',
  },
  filtersection: {
    backgroundColor: 'transparent',
    marginLeft: -10 * width_ratio * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10 * width_ratio * 0.95,
  },
  filterScrollView: {
    flex: 1,
    marginRight: 10 * width_ratio * 0.95,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8 * height_ratio * 0.9,
    paddingHorizontal: 2 * width_ratio * 0.95,
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16 * width_ratio * 0.95,
    paddingVertical: 6 * height_ratio * 0.9,
    paddingHorizontal: 12 * width_ratio * 0.95,
    marginRight: 4 * width_ratio * 0.95,
    padding: 3 * width_ratio * 0.95,
  },
  filterChipText: {
    fontSize: 14 * width_ratio * 0.95,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 1 * width_ratio,
  },
  filterButton: {
    marginTop: 6 * height_ratio * 0.9,
    width: 30 * width_ratio * 0.95,
    height: 30 * height_ratio * 0.9,
    backgroundColor: '#F0F0F0',
    borderRadius: 25 * width_ratio * 0.95,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  filterIcon: {
    width: 43 * width_ratio * 0.95,
    height: 43 * height_ratio * 0.9,
    resizeMode: 'contain',
  },
  blankBox: {
    zIndex: 1,
  },
  noHospitalText: {
    ...theme.fonts.Medium,
    marginTop: 120 * height_ratio * 0.9,
    fontSize: 16 * width_ratio * 0.95,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    padding: 20 * width_ratio * 0.95,
    backgroundColor: '#fafafa',
    borderRadius: 13 * width_ratio * 0.95,
    marginTop: 10 * height_ratio * 0.9,
    marginHorizontal: 0 * width_ratio,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * height_ratio * 0.9,
  },
  grade: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio * 0.95,
    backgroundColor: '#F0F5FF',
    borderColor: '#ADC6FF',
    textAlign: 'center',
    borderWidth: 1 * width_ratio * 0.95,
    borderRadius: 8 * width_ratio * 0.95,
    paddingHorizontal: 10 * width_ratio * 0.95,
    paddingVertical: 3 * height_ratio * 0.9,
  },
  hospitalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '86%',
  },
  hospitalName: {
    ...theme.fonts.SemiBold,
    marginBottom: 6 * height_ratio * 0.9,
    fontSize: 16 * width_ratio * 0.95,
    color: '#000',
  },
  distanceText: {
    fontSize: 15 * width_ratio * 0.95,
    color: '#55aaff',
    ...theme.fonts.SemiBold,
    marginBottom: 6 * height_ratio,
    marginLeft: 7 * width_ratio,
  },
  hospitalAddressContainer: {
    marginTop: 3 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationImage: {
    width: 20 * width_ratio * 0.95,
    height: 20 * height_ratio * 0.9,
    marginRight: 6 * width_ratio * 0.95,
  },
  hospitalAddress: {
    width: '90%',
    ...theme.fonts.Medium,
    fontSize: 13 * width_ratio * 0.95,
    color: '#888',
  },
  phonecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9 * height_ratio * 0.9,
  },
  phone: {
    ...theme.fonts.Regular,
    fontSize: 13 * width_ratio * 0.95,
    color: '#666',
    marginLeft: 5.8 * width_ratio,
    marginBottom: 4 * height_ratio * 0.9,
  },
  blank: {
    height: 20 * height_ratio,
  },
});

export default styles;
