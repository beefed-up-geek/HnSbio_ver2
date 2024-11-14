// src\screens\kit\kit_test\index.js
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import theme from '../../../theme';
import styles from './styles.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Kit_test_screen = () => {
    const navigation = useNavigation();
    
    const handlePhotoCapture = () => {
        // Navigate to the KitStack in BottomNavigation
        navigation.navigate('BottomNavigation', {
            screen: 'KitStack',  // Make sure to use the exact stack name
            params: {
                screen: 'Kit',   // The screen within KitStack
            },
        });
    };

    return (
        <View>
            <Text style={{ color: 'black' }}>src/screens/kit/kit_test/index.js</Text>
            <Text style={{ color: 'black' }}>키트 사진찍기</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handlePhotoCapture}>
                <Text style={{ color: 'black' }}>사진 찍기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Kit_test_screen;