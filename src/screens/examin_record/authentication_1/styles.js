// src\screens\health_checkup\authentication_1\styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용x
const buttonWidth = (Dimensions.get('screen').width - 65 * width_ratio) / 3; // Adjusted for 3 buttons per row with equal margins

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        paddingVertical: 20 * height_ratio,
        paddingHorizontal: 24 * width_ratio, 
      },
      title: {
        ...theme.fonts.SemiBold,
        color: 'black',
        fontSize: 20 * height_ratio,
        marginBottom: 40 * height_ratio,
        marginLeft: 2 * width_ratio,
      },
      backButton: {
        marginLeft: -8,
        marginTop: 12,
        marginBottom: 40,
      },
      backButtonImage: {
        width: 24 * width_ratio,
        height: 24 * width_ratio,
      },
      // buttonContainer: {
      //   flexDirection: 'row',
      //   flexWrap: 'wrap',
      //   justifyContent: 'space-around',
      // },
      // button: {
      //   width: (Dimensions.get('screen').width / 3) - 24 * width_ratio, // Adjust width to fit 3 per row
      //   height: 100 * width_ratio,
      //   marginBottom: 12 * height_ratio,
      //   justifyContent: 'center',
      //   alignItems: 'center',
      //   backgroundColor: '#FAFAFB',
      //   borderRadius: 13 * width_ratio,
      // },
      buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginRight: -8 * width_ratio,
        },
      button: {
        width: buttonWidth, // Adjust width to fit 3 per row
        height: 100 * width_ratio,
        marginBottom: 12 * height_ratio,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFB',
        borderRadius: 13 * width_ratio,
        marginRight: 8 * width_ratio,
      },
      buttonImage: {
        width: 40 * width_ratio,
        height: 40 * width_ratio,
        borderRadius: 10 * width_ratio,
      },
      buttonText: {
        marginTop: 4 * height_ratio,
        fontSize: 12 * height_ratio,
        color: '#828287',
        textAlign: 'center',
      },
});
  
export default styles;
  