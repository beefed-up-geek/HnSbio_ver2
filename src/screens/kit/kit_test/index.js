import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import RNFS from 'react-native-fs';

const KitTestScreen = ({navigation}) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  const formatMyDateTime = (dateObject = new Date()) => {
    // JS에서 월(Month)은 0부터 시작하므로 +1 필요
    const yyyy = dateObject.getFullYear();
    const mm = String(dateObject.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObject.getDate()).padStart(2, '0');
    const hh = String(dateObject.getHours()).padStart(2, '0');
    const min = String(dateObject.getMinutes()).padStart(2, '0');
    const ss = String(dateObject.getSeconds()).padStart(2, '0');
    // "YYYY/MM/DD HH:mm:ss" 형태로 리턴
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  };

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
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 10초 대기
        },
      );

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

      const {newResult} = await saveResultToStorage(photoUri, status);
      Alert.alert('키트 인식 완료', message, [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Kit', {
              photo: photoUri,
              status,
              id: newResult.id, // ★
            }),
        },
      ]);
    } catch (error) {
      // 오류 처리
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

      const {newResult} = await saveResultToStorage(photoUri, status);
      Alert.alert('키트 인식 완료 (오류 처리)', message, [
        {
          text: '확인',
          onPress: () =>
            navigation.navigate('Kit', {
              photo: photoUri,
              status,
              id: newResult.id, // ★
            }),
        },
      ]);
    }
  };

  const saveResultToStorage = async (photoUri, status) => {
    try {
      // (1) 숫자 변환
      let numericResult = -1;
      if (status === '비정상') numericResult = 1;
      else if (status === '정상') numericResult = 0;

      // (2) 날짜 포맷
      const now = new Date();
      const formattedDate = formatMyDateTime(now);

      // (3) 고유 ID (간단히 Date.now + random)
      const resultId =
        Date.now().toString() + Math.random().toString(36).substring(2);

      const newResult = {
        id: resultId, // 고유 ID
        datetime: formattedDate, // "YYYY/MM/DD HH:mm:ss"
        result: numericResult,
      };

      const userDataString = await AsyncStorage.getItem('user');
      let userData = userDataString ? JSON.parse(userDataString) : {};

      // ★ 기존: userData.kit_result = [newResult];
      //    -> 누적하려면 배열 형태로 계속 추가해야 함
      if (!Array.isArray(userData.kit_result)) {
        userData.kit_result = [];
      }
      // 가장 최근 결과가 맨 앞으로 오도록 unshift 사용
      userData.kit_result.unshift(newResult);

      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // (5) @kit_results (누적)
      const existingResults = await AsyncStorage.getItem('@kit_results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(newResult);
      await AsyncStorage.setItem('@kit_results', JSON.stringify(results));

      // (6) @recent_test_date
      await AsyncStorage.setItem('@recent_test_date', formattedDate);

      console.log('저장된 최근 검사 날짜:', formattedDate);
      console.log('업데이트된 user 데이터:', userData);
      return {newResult};
    } catch (error) {
      console.error('결과 저장 중 오류:', error);
      return null;
    }
  };

  /*const response = await axios.post(
        'http://98.82.55.237/kit/addTestResultById',
        _id,
        testResult,
      );*/
  //=============================================================================
  // 만약 기존 배열에 추가하는 방식이 필요하다면:

  // 최적의 포맷과 해상도를 선택
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
            format={optimalFormat} // 최적의 포맷 적용
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
