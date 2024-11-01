// src/screens/home/index_styles.js

import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
const { width } = Dimensions.get('screen');
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16 * width_ratio,
        paddingTop: 16 * height_ratio,
      },
      profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 16 * height_ratio,
      },
      profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24 * height_ratio,
      },
      profileText: {
        ...theme.fonts.Regular,
        marginRight: 8 * width_ratio,
        fontSize: 14 * width_ratio,
        color: '#72777A',
      },
      profileIcon: {
        width: 24 * width_ratio,
        height: 24 * height_ratio,
        resizeMode: 'contain',
      },
      infoBox: {
        backgroundColor: '#EBEFFE',
        borderRadius: 8 * width_ratio,
        padding: 24 * width_ratio,
        marginBottom: 24 * height_ratio,
        width: width - 32 * width_ratio,
      },
      infoTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20 * height_ratio,
      },
      setPushAlarmButton: {
        padding: 4 * width_ratio,
      },
      setPushAlarmIcon: {
        width: 24 * width_ratio,
        height: 24 * height_ratio,
        resizeMode: 'contain',
      },
      buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
      kitButton: {
        backgroundColor: 'transparent',
        borderRadius: 50 * width_ratio,
        width: 50 * width_ratio,
        height: 50 * width_ratio,
        alignItems: 'center',
        justifyContent: 'center',
      },
      testButton: {
        backgroundColor: 'white',
        borderColor: '#7596FF',
        borderWidth: 1,
        paddingVertical: 12 * height_ratio,
        paddingLeft: 22 * width_ratio,
        paddingRight: 20 * width_ratio,
        borderRadius: 30 * width_ratio,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#7596FF',
        fontSize: 14 * width_ratio,
        ...theme.fonts.Bold,
      },
      goIcon: {
        width: 16 * width_ratio,
        height: 16 * height_ratio,
        marginLeft: 11 * width_ratio,
        resizeMode: 'contain',
      },
      roundedButtonBox: {
        backgroundColor: '#F5F7FB',
        borderRadius: 12 * width_ratio,
        paddingVertical: 16 * height_ratio,
        paddingHorizontal: 20 * width_ratio,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16 * height_ratio,
      },
      boxText: {
        fontSize: 16 * width_ratio,
        ...theme.fonts.Bold,
        color: '#333',
      },
      boxStatus: {
        fontSize: 14 * width_ratio,
        ...theme.fonts.SemiBold,
        color: '#66CDAA',
        backgroundColor: '#E6F9F2',
        paddingVertical: 4 * height_ratio,
        paddingHorizontal: 10 * width_ratio,
        borderRadius: 12 * width_ratio,
      },
      boxSubText: {
        fontSize: 14 * width_ratio,
        color: '#888',
      },
      bottomSpacer: {
        height: 100 * height_ratio,
      },
});
  
export default styles;
