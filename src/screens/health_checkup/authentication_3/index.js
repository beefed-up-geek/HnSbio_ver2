// src\screens\health_checkup\authentication_3\index.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단에 추가

const Authentication_3_screen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    providerId,
    jti,
    twoWayTimestamp,
    name,
    birthdate,
    phoneNo,
    telecom,
    loginTypeLevel,
    selectedLabel,
    selectedImage,
    refreshHealthData
  } = route.params;

  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleCompleteAuth = async () => {
    setLoading(true);
    try {
      const request_data = {
        providerId: providerId,
        userName: name,
        identity: birthdate,
        phoneNo: phoneNo,
        telecom: telecom,
        loginTypeLevel: loginTypeLevel,
        jti: jti,
        twoWayTimestamp: twoWayTimestamp,
      };
  
      const response = await axios.post(
        'http://54.79.61.80:5000/health_checkup/step2',
        request_data,
      );
  
      if (!response || !response.data) {
        throw new Error('서버 응답이 없습니다. 다시 시도해주세요.');
      }
  
      console.log('API Response:', response.data);
  
      const filteredData = response.data.filteredData || [];
  
      // AsyncStorage에서 현재 user 데이터를 가져옴
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // healthCheckup 필드 업데이트
        userData.healthCheckup = filteredData;
        
        // 업데이트된 데이터를 다시 저장
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('Updated user data in AsyncStorage:', userData);
  
        if (filteredData.length === 0) {
          //Alert.alert('알림', '인증이 완료되었으나 데이터를 찾을 수 없습니다.');
        } else {
          //Alert.alert('성공', '인증이 완료되었습니다.');
          refreshHealthData();;
          navigation.navigate('BottomNavigation', { screen: 'HealthCheckup' });
        }
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
          간편인증 서비스 이용 중 인증 오류가 발생할 경우 선택하신 인증기관으로 문의해
          주세요.
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
            <Text style={styles.loadingText}>인증을 진행 중입니다...</Text>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  backButton: {
    marginLeft: -8,
    marginTop: 12,
    marginBottom: 40,
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    color: 'black',
    marginBottom: 50,
  },
  mainText: {
    marginLeft: 6,
    fontSize: 20,
    ...theme.fonts.SemiBold,
    color: theme.colors.textGray,
    marginBottom: 12,
  },
  waitingText: {
    marginLeft: 6,
    fontSize: 16,
    ...theme.fonts.Medium,
    color: theme.colors.BlueGray,
  },
  flowContainer: {
    justifyContent: 'center',
    marginVertical: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  appImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  HSappImage: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  arrowImage: {
    width: 16,
    height: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    marginTop: 12,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  alertBox: {
    backgroundColor: '#F3F6FB',
    borderRadius: 13,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 15,
    ...theme.fonts.SemiBold,
    color: theme.colors.textGray,
  },
  alertDescription: {
    marginLeft: 20,
    fontSize: 14,
    color: theme.colors.BlueGray,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.mainBlue,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 13,
  },
  buttonText: {
    ...theme.fonts.SemiBold,
    color: theme.colors.White,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
});

export default Authentication_3_screen;
