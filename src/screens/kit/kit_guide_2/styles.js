// src/screens/kit/kit_guide_2/styles.js

import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    button: {
        marginTop: 20 * height_ratio,
        backgroundColor: '#7596FF',
        height: 50,
        width: 100,
        borderRadius: 8 * width_ratio,
        alignItems: 'center',
    },
});
  
export default styles;
