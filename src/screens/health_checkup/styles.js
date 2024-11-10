// src/screens/health_checkup/styles.js

import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
      boxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 25,
      },
      box: {
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(89,126,247,0.12)',
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      textContainer: {
        flex: 1,
        gap: 2,
      },
      boxTitle: {
        ...theme.fonts.Bold,
        fontSize: 20,
        color: '#5D5D62',
        textAlign: 'left',
        marginBottom: 8,
        paddingVertical: 3,
      },
      row: {
        alignItems: 'left',
      },
      boxSubtitle: {
        ...theme.fonts.Medium,
        fontSize: 14,
        color: '#7F7F7F',
      },
      image: {
        width: 140,
        height: 130,
        resizeMode: 'contain',
        marginLeft: 10,
        position: 'absolute',
        right: 46,
        bottom: 18,
      },
      arrowButtonContainer: {
        position: 'absolute',
        right: 11,
        bottom: 12,
        borderRadius: 25,
        width: 83,
        height: 56,
      },
      blueBox: {
        flex: 1,
        backgroundColor: '#F4F5FB',
      },
      contentContainer: {
        paddingHorizontal: 20,
        flex: 1,
      },
});
  
export default styles;
