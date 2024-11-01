// src/screens/health_checkup/authentication_1.js

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './authentication_1_styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const Authentication_1_screen = () => {
    const navigation = useNavigation();
    return (
        <Text style={{ color: 'black' }}>  src/screens/health_checkup/authentication_1.js</Text>
    );
}

export default Authentication_1_screen;