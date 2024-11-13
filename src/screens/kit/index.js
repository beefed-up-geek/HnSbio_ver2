import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity, Alert } from 'react-native';
import theme from '../../theme';
import styles from './styles.js';
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Kit_screen = () => {
    const [providerId, setProviderId] = useState('');
    const [buttonPressCount, setButtonPressCount] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setProviderId(parsedData.providerId);
            }
        };
        fetchUserData();
    }, []);

    const handleButtonPress = async () => {
        const newCount = buttonPressCount + 1;
        setButtonPressCount(newCount);

        // 7의 배수일 때마다 체크
        if (newCount % 7 === 0) {
            try {
                // 7, 21, 35, ... 번째 누름 (7로 나누었을 때 나머지가 0이고, 14로 나누었을 때 나머지가 7인 경우)
                if (newCount % 14 === 7) {
                    console.log(newCount);
                    // setTestResultsDev 호출
                    const response = await axios.post('http://54.79.61.80:5000/kit/setTestResultsDev', { providerId });
                    const updatedUserData = await AsyncStorage.getItem('user');
                    const parsedData = JSON.parse(updatedUserData);
                    parsedData.kit_result = response.data;
                    await AsyncStorage.setItem('user', JSON.stringify(parsedData));
                    const newdata = await AsyncStorage.getItem('user');
                    console.log(newdata);
                    Alert.alert('Success', 'kit_result가 초기 데이터로 설정되었습니다.');
                } 
                // 14, 28, 42, ... 번째 누름 (7로 나누었을 때 나머지가 0이고, 14로 나누었을 때 나머지가 0인 경우)
                else {
                    console.log(newCount);
                    // clearTestResultsDev 호출
                    await axios.post('http://54.79.61.80:5000/kit/clearTestResultsDev', { providerId });
                    const updatedUserData = await AsyncStorage.getItem('user');
                    const parsedData = JSON.parse(updatedUserData);
                    parsedData.kit_result = [];
                    await AsyncStorage.setItem('user', JSON.stringify(parsedData));
                    const newdata = await AsyncStorage.getItem('user');
                    console.log(newdata);
                    Alert.alert('Success', 'kit_result가 비워졌습니다.');
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
                Alert.alert('Error', 'API 요청에 실패했습니다.');
            }
        }
    };

    return (
        <View>
            <Text style={{ color: 'black' }}>src/screens/kit/index.js</Text>
            <Text style={{ color: 'black' }}>키트 검사 결과들 보여주는 화면</Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('NoTabs', { screen: 'kit_guide_1' })}
            >
                <Text style={{ color: 'black' }}>키트 검사 시작</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleButtonPress}
            >
                <Text style={{ color: 'black' }}>개발자용 기능 버튼 ({buttonPressCount})</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Kit_screen;