// src/components/devButton.js
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const DevButton = () => {
    const [buttonPressCount, setButtonPressCount] = useState(0);

    const handleButtonPress = async () => {
        const newCount = buttonPressCount + 1;
        setButtonPressCount(newCount);

        // providerId 가져오기
        let providerId = '';
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                providerId = parsedData.providerId;
            }
        } catch (error) {
            console.error('Error getting providerId:', error);
            return;
        }

        // 7의 배수일 때마다 체크
        if (newCount % 7 === 0) {
            try {
                // 7, 21, 35, ... 번째 누름 - 데이터 설정
                if (newCount % 14 === 7) {
                    console.log(`\n=== ${newCount}번째 클릭: 데이터 설정 ===`);
                    // 1. 키트 검사 결과 설정
                    const kitResponse = await axios.post('http://54.79.61.80:5000/kit/setTestResultsDev', { providerId });
                    
                    // 2. 건강검진 데이터 설정
                    const healthResponse = await axios.post('http://54.79.61.80:5000/health_checkup/healthCheckupDev', { providerId });

                    // AsyncStorage 업데이트
                    const updatedUserData = await AsyncStorage.getItem('user');
                    const parsedData = JSON.parse(updatedUserData);
                    
                    // 키트 결과 업데이트
                    parsedData.kit_result = kitResponse.data;
                    
                    // 건강검진 데이터 업데이트
                    if (healthResponse.data && healthResponse.data.data) {
                        parsedData.healthCheckup = healthResponse.data.data;
                    }

                    await AsyncStorage.setItem('user', JSON.stringify(parsedData));
                    const newdata = await AsyncStorage.getItem('user');
                    console.log('Updated User Data:');
                    console.log(JSON.stringify(JSON.parse(newdata), null, 2));
                    Alert.alert('Success', '키트 검사 결과와 건강검진 데이터가 설정되었습니다.');
                } 
                // 14, 28, 42, ... 번째 누름 - 데이터 제거
                else {
                    console.log(`\n=== ${newCount}번째 클릭: 데이터 제거 ===`);
                    // 1. 키트 검사 결과 제거
                    await axios.post('http://54.79.61.80:5000/kit/clearTestResultsDev', { providerId });
                    
                    // 2. 건강검진 데이터 제거
                    await axios.post('http://54.79.61.80:5000/health_checkup/healthCheckupDevRemove', { providerId });

                    // AsyncStorage 업데이트
                    const updatedUserData = await AsyncStorage.getItem('user');
                    const parsedData = JSON.parse(updatedUserData);
                    
                    // 키트 결과 비우기
                    parsedData.kit_result = [];
                    
                    // 건강검진 데이터 제거
                    delete parsedData.healthCheckup;

                    await AsyncStorage.setItem('user', JSON.stringify(parsedData));
                    const newdata = await AsyncStorage.getItem('user');
                    console.log('Updated User Data:');
                    console.log(JSON.stringify(JSON.parse(newdata), null, 2));
                    Alert.alert('Success', '키트 검사 결과와 건강검진 데이터가 제거되었습니다.');
                }
            } catch (error) {
                console.error('API 요청 오류:', error);
                Alert.alert('Error', 'API 요청에 실패했습니다.');
            }
        }
    };

    return (
        <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
            <Image
                source={require('../images/home/logo.png')}
                style={styles.logo}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginLeft: 24 * width_ratio,
        padding: 0,
        backgroundColor: 'transparent',
    },
    logo: {
        width: 60 * width_ratio,
        height: 30 * width_ratio,
        resizeMode: 'contain',
    }
});

export default DevButton;