// src\screen(구버전)\healthscreen\authentication3.js
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

import theme from '../../theme';

const printAllAsyncStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length === 0) {
      console.log('AsyncStorage에 저장된 데이터가 없습니다.');
      return;
    }

    const result = await AsyncStorage.multiGet(keys);
    result.forEach(([key, value]) => {
      console.log(`Key: ${key}, Value: ${value}`);
    });

    return result;
  } catch (error) {
    console.error(
      'AsyncStorage 데이터를 불러오는 중 에러가 발생했습니다:',
      error,
    );
  }
};

const Authentication3Screen = () => {
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
    fetchData
  } = route.params;

  

  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleCompleteAuth = async () => {
    setLoading(true); // 로딩 시작
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
        'http://54.79.61.80:3000/health_checkup/step2',
        request_data,
      );

      // 응답 데이터 검증
      if (!response || !response.data) {
        throw new Error('서버 응답이 없습니다. 다시 시도해주세요.');
      }

      // maxBodyLength 값 추출
      console.log(response.headers); // -1

      if (response.data.message && response.data.message.includes('length')) {
        Alert.alert(
          '알림',
          '서버에서 오류가 발생했습니다. 데이터를 찾을 수 없습니다.',
        );
        return;
      }

      const filteredData = response.data.filteredData || []; // 빈 데이터일 경우 빈 배열로 처리
      if (filteredData.length === 0) {
        Alert.alert('알림', '인증이 완료되었으나 데이터를 찾을 수 없습니다.');
      } else {
        Alert.alert('성공', '인증이 완료되었습니다.');
      }

      // 오늘 날짜를 AsyncStorage에 저장
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 저장
      await AsyncStorage.setItem('healthscreen_last_update', today);

      // filteredData를 AsyncStorage에 저장
      await AsyncStorage.setItem(
        'healthscreen_data',
        JSON.stringify(filteredData),
      );

      // 저장된 값을 가져와서 출력
      const storedDate = await AsyncStorage.getItem('healthscreen_last_update');
      const storedData = await AsyncStorage.getItem('healthscreen_data');
      await printAllAsyncStorageData();
      fetchData();
      navigation.navigate('BottomNavigation', { screen: 'Health' });
      //navigation.navigate('Health'); // 건강검진 홈화면으로 가기
    } catch (error) {
      console.error('Error response:', error.response);
      if (error.response) {
        // 서버로부터의 응답이 있는 경우
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
        //Alert.alert('오류', '인증이 완료가 됐으나 정보를 찾을 수 없습니다.');
      } else {
        // 요청이 전송되지 못한 경우
        console.log('Error message:', error.message);
        //Alert.alert('오류', error.message || '인증이 완료되지 않았습니다');
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../images/chevronArrowLeft.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Text style={styles.mainText}>
        {selectedLabel}에서 본인인증 후 인증완료를 눌러주세요
      </Text>
      <Text style={styles.waitingText}>
        선택하신 인증서 앱에서 인증을 진행해 주세요.
      </Text>
      <View style={styles.flowContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../images/hns.png')}
            style={styles.HSappImage}
          />
          <Text style={styles.label}>인증요청</Text>
        </View>
        <Image
          source={require('../../images/health_screen/play.png')}
          style={styles.arrowImage}
        />
        <View style={styles.imageContainer}>
          <Image source={selectedImage} style={styles.appImage} />
          <Text style={styles.label}>간편인증</Text>
        </View>
        <Image
          source={require('../../images/health_screen/play.png')}
          style={styles.arrowImage}
        />
        <View style={styles.imageContainer}>
          <Image
            source={require('../../images/hns.png')}
            style={styles.HSappImage}
          />
          <Text style={styles.label}>인증완료</Text>
        </View>
      </View>
      <View style={styles.alertBox}>
        <View style={styles.alertTitleContainer}>
          <Image
            source={require('../../images/health_screen/info.png')}
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

export default Authentication3Screen;
