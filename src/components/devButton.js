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

const DevButton = ({ loadUserData }) => {
  const [buttonPressCount, setButtonPressCount] = useState(0);

  const handleButtonPress = async () => {
    const newCount = buttonPressCount + 1;
    setButtonPressCount(newCount);
    console.log(newCount);
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

    if (newCount % 7 === 0) {
      try {
        if (newCount % 14 === 7) {
          console.log(`\n=== ${newCount}번째 클릭: 데이터 설정 ===`);

          const kitResponse = await axios.post('http://54.79.61.80:5000/kit/setTestResultsDev', { providerId });
          const healthResponse = await axios.post('http://54.79.61.80:5000/health_checkup/healthCheckupDev', { providerId });
          const bloodResponse = await axios.post('http://54.79.61.80:5000/blood_test/setBloodTestResultsDev', { providerId });

          const updatedUserData = await AsyncStorage.getItem('user');
          const parsedData = JSON.parse(updatedUserData);
          parsedData.kit_result = kitResponse.data;
          if (healthResponse.data && healthResponse.data.data) {
            parsedData.healthCheckup = healthResponse.data.data;
          }
          parsedData.blood_test_result = bloodResponse.data;

          await AsyncStorage.setItem('user', JSON.stringify(parsedData));
          console.log('Updated User Data:', JSON.stringify(parsedData, null, 2)); // Prettify output
          loadUserData(); // Call loadUserData after updating AsyncStorage
          Alert.alert('Success', '키트 검사 결과, 건강검진 데이터, 혈액검사 결과가 설정되었습니다.');
        } else {
          console.log(`\n=== ${newCount}번째 클릭: 데이터 제거 ===`);

          await axios.post('http://54.79.61.80:5000/kit/clearTestResultsDev', { providerId });
          await axios.post('http://54.79.61.80:5000/health_checkup/healthCheckupDevRemove', { providerId });
          await axios.post('http://54.79.61.80:5000/blood_test/clearBloodTestResultsDev', { providerId });

          const updatedUserData = await AsyncStorage.getItem('user');
          const parsedData = JSON.parse(updatedUserData);
          parsedData.kit_result = [];
          parsedData.healthCheckup = [];
          parsedData.blood_test_result = [];

          await AsyncStorage.setItem('user', JSON.stringify(parsedData));
          console.log('Updated User Data:', JSON.stringify(parsedData, null, 2)); // Prettify output
          loadUserData(); // Call loadUserData after updating AsyncStorage
          Alert.alert('Success', '키트 검사 결과, 건강검진 데이터, 혈액검사 결과가 제거되었습니다.');
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
