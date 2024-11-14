// src\screens\home\kidney_info\index.js
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import theme from '../../../theme.js';
import styles from './styles.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Kidney_info_screen = () => {
    const navigation = useNavigation();
    
    const handleGoHomescreen = () => {
        // Navigate to the KitStack in BottomNavigation
        navigation.navigate('BottomNavigation', {
            screen: 'HomeStack',  // Make sure to use the exact stack name
            params: {
                screen: 'Home',   // The screen within KitStack
            },
        });
    };

    return (
        <View>
            <Text style={{ color: 'black' }}>src/screens/home/kidney_info/index.js</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleGoHomescreen}>
                <Text style={{ color: 'black' }}>다시 홈으로</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Kidney_info_screen;