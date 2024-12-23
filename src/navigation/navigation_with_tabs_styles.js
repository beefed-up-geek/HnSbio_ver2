// src\navigation\navigation_with_tabs_styles.js
import {StyleSheet, Dimensions,} from 'react-native';
import theme from '../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  // CustomTabBar 스타일
  floatingContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -175}],
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 350,
    borderRadius: 24,
    elevation: 5,
  },

  // TabDesign 스타일
  tabButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    color: '#fff',
    marginLeft: 5,
    ...theme.fonts.Bold,
    fontWeight: 'bold',
  },

  // CustomHeader 스타일
  headerContainer: {
    height: 76 * height_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 16,
  },
  leftButton: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  homeLeftButton: {
    width: 48, // 아이콘 크기 증가
    height: 48,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    ...theme.fonts.SemiBold,
    textAlign: 'center',
    color: '#414141',
  },
});

export default styles;
