// src/navigation/navigation_without_tabs_styles.js
// src/components/navigation_without_tabs_styles.js
import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  // CustomHeader 스타일
  headerContainer: {
    height: 76, 
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  leftButton: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#414141',
  },
  leftButtonFake: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 0,
  },
});

export default styles;
