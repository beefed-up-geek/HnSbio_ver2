// src/screens/kit/index.js

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity, Alert } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용
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

        if (newCount === 7) {
            try {
                if (newCount % 14 === 7) {
                    console.log("7");
                    // 7번째 누름 - /setTestResultsDev 호출
                    const response = await axios.post('http://54.79.61.80:5000/kit/setTestResultsDev', { providerId });
                    const updatedUserData = await AsyncStorage.getItem('user');
                    const parsedData = JSON.parse(updatedUserData);
                    parsedData.kit_result = response.data;
                    await AsyncStorage.setItem('user', JSON.stringify(parsedData));
                    const newdata = await AsyncStorage.getItem('user');
                    console.log(newdata);
                    Alert.alert('Success', 'kit_result가 초기 데이터로 설정되었습니다.');
                } else {
                    // 14번째 누름 - /clearTestResultsDev 호출
                    console.log("14");
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
            setButtonPressCount(0); // 카운트 초기화
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
                <Text style={{ color: 'black' }}>개발자용 기능 버튼</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Kit_screen;
