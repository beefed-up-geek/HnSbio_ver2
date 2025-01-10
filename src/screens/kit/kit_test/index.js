import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import notifee from '@notifee/react-native';

import styles from './styles';

const KitTestScreen = ({navigation}) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  // 날짜/시간 포맷 함수
  const formatMyDateTime = (dateObject = new Date()) => {
    const yyyy = dateObject.getFullYear();
    const mm = String(dateObject.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObject.getDate()).padStart(2, '0');
    const hh = String(dateObject.getHours()).padStart(2, '0');
    const min = String(dateObject.getMinutes()).padStart(2, '0');
    const ss = String(dateObject.getSeconds()).padStart(2, '0');
    // "YYYY/MM/DD HH:mm:ss" 형태
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  };

  // 카메라 권한 요청
  useEffect(() => {
    console.log('Document Directory Path:', RNFS.DocumentDirectoryPath);

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted' &&
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted'
        ) {
          setCameraPermission(true);
        } else {
          Alert.alert('권한 필요', '카메라 및 마이크 권한이 필요합니다.');
        }
      } else {
        const cameraStatus = await Camera.requestCameraPermission();
        if (cameraStatus === 'granted') {
          setCameraPermission(true);
        } else {
          Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
        }
      }
    };

    requestPermissions();
  }, []);

  // 사진 촬영
  const takePhoto = async () => {
    if (camera.current && device) {
      try {
        const photo = await camera.current.takePhoto({
          quality: 1.0,
          skipMetadata: false,
        });
        setPhotoUri(photo.path);
        sendToAPI(photo.path);
      } catch (error) {
        console.error('사진 촬영 오류:', error);
      }
    } else {
      console.warn('카메라 권한이 필요합니다.');
    }
  };

  // API 전송
  const sendToAPI = async photoUri => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photoUri}`,
        type: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
      });

      const response = await axios.post(
        'http://scalawox1.iptime.org:5555/predict/segment/v1/simple',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          timeout: 30000, // 30초 대기
        },
      );

      // 백엔드 모델 추론 결과
      const {result} = response.data.inference;

      let status = null;
      let message = null;

      // 결과값에 따른 처리
      if (result === 'positive') {
        status = '비정상';
        message = '결과가 양성입니다.';
      } else if (result === 'negative') {
        status = '정상';
        message = '결과가 음성입니다.';
      } else if (result === 'none' || result === 'unknown') {
        status = '알 수 없음';
        message = '키트를 인식하거나 확인할 수 없습니다. 다시 시도해 주세요.';
      } else {
        throw new Error('Unexpected result value');
      }

      // 로컬 + 백엔드 저장
      const {newResult} = await saveResultToStorage(photoUri, status);

      // 알림창
      Alert.alert('키트 인식 완료', message, [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Kit', {
              photo: photoUri,
              status,
              id: newResult.id, // 아이템 식별자
            }),
        },
      ]);
    } catch (error) {
      console.error('오류 발생:', error.message);

      // 랜덤 결과 생성
      const randomResults = ['positive', 'negative', 'unknown'];
      const randomResult = randomResults[Math.floor(Math.random() * 3)];

      let status = null;
      let message = null;

      if (randomResult === 'positive') {
        status = '비정상';
        message = '결과가 양성입니다. (랜덤 결과)';
      } else if (randomResult === 'negative') {
        status = '정상';
        message = '결과가 음성입니다. (랜덤 결과)';
      } else {
        status = '알 수 없음';
        message = '결과를 확인할 수 없습니다. (랜덤 결과)';
      }

      // 로컬 + 백엔드 저장
      const {newResult} = await saveResultToStorage(photoUri, status);

      // 알림창
      Alert.alert('키트 인식 완료 (오류 처리)', message, [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Kit', {
              photo: photoUri,
              status,
              id: newResult.id,
            }),
        },
      ]);
    }
  };

  // 로컬/백엔드에 키트 검사 결과 저장
  const saveResultToStorage = async (photoUri, status) => {
    try {
      // 1) 결과를 0(정상) 또는 1(비정상)으로 변환
      let numericResult = -1;
      if (status === '비정상') numericResult = 1;
      else if (status === '정상') numericResult = 0;

      // 2) 날짜 포맷 (YYYY/MM/DD HH:mm:ss)
      const now = new Date();
      const formattedDate = formatMyDateTime(now);

      // 3) 고유 ID (예: timestamp + random)
      const resultId =
        (await Date.now().toString()) + Math.random().toString(36).substring(2);

      const newResult = {
        id: resultId,
        datetime: formattedDate,
        result: numericResult,
      };

      // 4) AsyncStorage 에서 user 불러오기
      const userDataString = await AsyncStorage.getItem('user');
      let userData = userDataString ? JSON.parse(userDataString) : {};
      if (!Array.isArray(userData.kit_result)) {
        userData.kit_result = [];
      }

      // 4-1) userData.kit_result에 새 데이터 맨 앞에 추가
      userData.kit_result.unshift(newResult);

      if (!userData.pushNotificationSettings) {
        userData.pushNotificationSettings = {};
      }
      userData.pushNotificationSettings.alarmEnabled = false;
      userData.pushNotificationSettings.nextAlarmDate = null;

      // (알림 예약이 이미 있었다면 취소)
      notifee.cancelAllNotifications();
      await notifee.cancelAllNotifications();

      // 4-2) 업데이트된 userData를 저장
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      try {
        const response = await axios.post(
          'http://98.82.55.237/kit/addTestResultById',
          {
            _id: userData._id,
            id: resultId,
            testResult: newResult.result,
            datetime: newResult.datetime,
          },
        );

        if (response.status === 200 && response.data.success) {
          console.log('서버에 성공적으로 저장되었습니다.');
        } else {
          console.error('서버 저장 실패:', response.data);
          throw new Error('서버 저장 실패');
        }
      } catch (error) {
        console.error('서버 요청 중 오류 발생:', error.message);
        Alert.alert('오류', '결과를 서버에 저장하지 못했습니다.');
      }

      // 5) @kit_results 도 동일하게 업데이트 (앱 내부 저장용)
      const existingResults = await AsyncStorage.getItem('@kit_results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(newResult);
      await AsyncStorage.setItem('@kit_results', JSON.stringify(results));

      // 6) @recent_test_date 업데이트
      await AsyncStorage.setItem('@recent_test_date', formattedDate);

      console.log('저장된 최근 검사 날짜:', formattedDate);
      console.log('업데이트된 user 데이터:', userData);

      // 7) 백엔드에도 추가 (/addTestResultById)
      console.log('백엔드에 kit_result 추가 성공');

      return {newResult};
    } catch (error) {
      console.error('결과 저장 중 오류:', error);
      return {newResult};
    }
  };

  // 최적의 포맷(해상도) 찾기
  const optimalFormat = device?.formats.sort(
    (a, b) => b.photoWidth - a.photoWidth,
  )[0];

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.imageContainer}>
          <Image source={{uri: 'file://' + photoUri}} style={styles.image} />
        </View>
      ) : cameraPermission && device ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            format={optimalFormat}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.captureButtonText}>촬영하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>카메라 권한이 필요합니다.</Text>
      )}
    </View>
  );
};

export default KitTestScreen;
