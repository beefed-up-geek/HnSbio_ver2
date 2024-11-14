import { StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  headerContainer: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.8,
    borderBottomColor: '#E9E9E9',
    justifyContent: 'center',
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
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
    textAlign: 'center',
    marginLeft: +32, // 뒤로가기 버튼 영역만큼 왼쪽으로 이동
  },
  leftButtonFake: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    opacity: 0,
  },
});

export default styles;