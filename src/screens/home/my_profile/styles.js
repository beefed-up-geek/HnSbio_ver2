// src/screens/home/my_profile_styles.js

import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 36 * height_ratio,
    marginBottom: 50 * height_ratio,
  },
  profileImage: {
    width: 124 * width_ratio,
    height: 124 * width_ratio,
    borderRadius: 50 * width_ratio,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 133 * width_ratio,
    width: 28 * width_ratio,
  },
  cameraIcon: {
    width: 36 * width_ratio,
    height: 36 * width_ratio,
  },

  detailsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderColor: '#F4F4F4',
    borderWidth: 1,
    marginHorizontal: 18 * width_ratio,
    paddingVertical: 4 * height_ratio,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18.5 * height_ratio,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  detailLastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18.5 * height_ratio,
  },
  detailLabel: {
    marginLeft: 24 * width_ratio,
    fontSize: 16,
    color: 'black',
  },
  textButtonWrapper: {
    marginRight: 24 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * width_ratio,
  },
  detailValue: {
    ...theme.fonts.Regular,
    fontSize: 15,
    color: '#5D5D5D',
  },
  goIcon: {
    width: 18 * width_ratio,
    height: 18 * width_ratio,
  },
});
  
export default styles;
