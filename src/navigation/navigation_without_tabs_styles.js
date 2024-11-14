// src/navigation/navigation_without_tabs_styles.js
import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  headerContainer: {
    height: 76, 
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers the title within the header
    backgroundColor: 'white',
    borderBottomWidth: 0.8,
    borderBottomColor: '#E9E9E9',
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 20, 
    padding: 8, 
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
    textAlign: 'center', // Center the title text
  },
  leftButtonFake: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 0,
  },
});

export default styles;
