// src\screen(구버전)\hospital\styles.js
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
    ...theme.fonts.Medium,
    marginLeft: 4,
    color: '#5D5D62',
    fontSize: 15,
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexShrink: 1,
  },
  buttonActive: {
    backgroundColor: '#E4EDFF',
  },
  buttonText: {
    ...theme.fonts.Medium,
    fontSize: 12,
    color: '#5D5D62',
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
    marginTop: 6,
    color: '#666',
  },
  blankBox: {
    zIndex: 1,
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
});

export default styles;
