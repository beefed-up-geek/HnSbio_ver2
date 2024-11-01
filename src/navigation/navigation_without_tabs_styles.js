// src/navigation/navigation_without_tabs_styles.js
// src/components/navigation_without_tabs_styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // CustomHeader 스타일
  headerContainer: {
    height: 50, // 아이콘 크기에 맞게 헤더 높이 설정
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default styles;
