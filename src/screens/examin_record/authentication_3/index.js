// src/screens/health_checkup/authentication_3/index.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js';
import theme from '../../../theme';

// ★ HomeContext import
import { HomeContext } from '../../../components/homeContext';

const Authentication_3_screen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // route.params에서 필요한 값 가져오기
  const {
    _id,
    jti,
    twoWayTimestamp,
    name,
    birthdate,
    phoneNo,
    telecom,
    loginTypeLevel,
    selectedLabel,
    selectedImage,
    refreshHealthData, // 이미 존재하는 callback 함수
  } = route.params;

  // ★ Context 사용
  const { setRerenderHome } = useContext(HomeContext);

  const [loading, setLoading] = useState(false);

  const handleCompleteAuth = async () => {
    setLoading(true);
    try {
      const request_data = {
        _id,
        userName: name,
        identity: birthdate,
        phoneNo,
        telecom,
        loginTypeLevel,
        jti,
        twoWayTimestamp,
      };

      const response = await axios.post(
        'http://98.82.55.237/health_checkup/step2ById',
        request_data,
        {
          timeout: 180000, // 3 minutes in milliseconds
        }
      );

      if (!response || !response.data) {
        throw new Error('서버 응답이 없습니다. 다시 시도해주세요.');
      }

      console.log('API Response:', response.data);

      const filteredData = response.data.filteredData || [];

      // AsyncStorage에 저장된 user 데이터 가져오기
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // healthCheckup 필드를 새로 업데이트
        userData.healthCheckup = filteredData;

        // 업데이트된 데이터를 다시 저장
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('Updated user data in AsyncStorage:', userData);

        // (1) 이미 존재하는 refreshHealthData() 호출
        refreshHealthData?.();

        // (2) 홈화면 재렌더링 트리거
        setRerenderHome((prev) => !prev);

        // (3) HealthCheckup 화면으로 이동
        navigation.navigate('BottomNavigation', { screen: 'HealthCheckup' });
      } else {
        console.error('User data not found in AsyncStorage');
        Alert.alert('오류', '사용자 데이터를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error in handleCompleteAuth:', error);
      Alert.alert('오류', '인증 과정에서 문제가 발생했습니다.');

      if (error.response) {
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else {
        console.log('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        {selectedLabel}에서 본인인증 후 인증완료를 눌러주세요
      </Text>
      <Text style={styles.waitingText}>
        선택하신 인증서 앱에서 인증을 진행해 주세요.
      </Text>

      <View style={styles.flowContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../images/hns.png')}
            style={styles.HSappImage}
          />
          <Text style={styles.label}>인증요청</Text>
        </View>
        <Image
          source={require('../../../images/health_screen/play.png')}
          style={styles.arrowImage}
        />
        <View style={styles.imageContainer}>
          <Image source={selectedImage} style={styles.appImage} />
          <Text style={styles.label}>간편인증</Text>
        </View>
        <Image
          source={require('../../../images/health_screen/play.png')}
          style={styles.arrowImage}
        />
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../images/hns.png')}
            style={styles.HSappImage}
          />
          <Text style={styles.label}>인증완료</Text>
        </View>
      </View>

      <View style={styles.alertBox}>
        <View style={styles.alertTitleContainer}>
          <Image
            source={require('../../../images/health_screen/info.png')}
            style={styles.infoIcon}
          />
          <Text style={styles.alertTitle}>인증요청이 오지 않는다면?</Text>
        </View>
        <Text style={styles.alertDescription}>
          간편인증 서비스 이용 중 인증 오류가 발생할 경우
          선택하신 인증기관으로 문의해 주세요.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCompleteAuth}>
        <Text style={styles.buttonText}>인증완료</Text>
      </TouchableOpacity>

      {/* 로딩 인디케이터 */}
      {loading && (
        <Modal transparent={true} animationType="none">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.mainBlue} />
            <Text style={styles.loadingText}>
              건강보험공단에서 불러오는 중입니다.
            </Text>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Authentication_3_screen;
