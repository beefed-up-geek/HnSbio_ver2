// src\screens\medicine\index.js
import { useNavigation } from '@react-navigation/native';
import { Dimensions,  Text, View, TouchableOpacity, } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용


const Medicine_screen = () => {
    const navigation = useNavigation();
    return (
        <View>
        <Text style={{ color: 'black' }}>  src/screens/medicine/index.js</Text>
            <Text style={{ color: 'black' }}>의약품 검색 화면</Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('NoTabs', { screen: 'medicine_specifics' })}
            >
                <Text style={{ color: 'black' }}>의약품 상세 화면</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Medicine_screen;