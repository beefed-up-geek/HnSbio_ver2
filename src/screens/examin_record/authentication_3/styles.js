// src\screens\health_checkup\authentication_3\styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        paddingTop: 20,
        paddingHorizontal: 24,
        backgroundColor: 'white',
      },
      backButton: {
        marginLeft: -8,
        marginTop: 12,
        marginBottom: 40,
      },
      backButtonImage: {
        width: 24,
        height: 24,
      },
      image: {
        width: 200,
        height: 200,
        marginBottom: 20,
      },
      text: {
        color: 'black',
        marginBottom: 50,
      },
      mainText: {
        marginLeft: 6,
        fontSize: 20,
        ...theme.fonts.SemiBold,
        color: theme.colors.textGray,
        marginBottom: 12,
      },
      waitingText: {
        marginLeft: 6,
        fontSize: 16,
        ...theme.fonts.Medium,
        color: theme.colors.BlueGray,
      },
      flowContainer: {
        justifyContent: 'center',
        marginVertical: 120,
        flexDirection: 'row',
        alignItems: 'center',
      },
      imageContainer: {
        alignItems: 'center',
      },
      appImage: {
        width: 64,
        height: 64,
        resizeMode: 'contain',
      },
      HSappImage: {
        width: 52,
        height: 52,
        resizeMode: 'contain',
      },
      arrowImage: {
        width: 16,
        height: 16,
        marginHorizontal: 24,
        marginBottom: 24,
      },
      label: {
        marginTop: 12,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
      },
      alertBox: {
        backgroundColor: '#F3F6FB',
        borderRadius: 13,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
      },
      alertTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      infoIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
      },
      alertTitle: {
        fontSize: 15,
        ...theme.fonts.SemiBold,
        color: theme.colors.textGray,
      },
      alertDescription: {
        marginLeft: 20,
        fontSize: 14,
        color: theme.colors.BlueGray,
      },
      button: {
        alignItems: 'center',
        backgroundColor: theme.colors.mainBlue,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 13,
      },
      buttonText: {
        ...theme.fonts.SemiBold,
        color: theme.colors.White,
      },
      loadingContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
        alignItems: 'center',
        justifyContent: 'center',
      },
      loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
      },
});
  
export default styles;