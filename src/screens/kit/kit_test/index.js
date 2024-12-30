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

      await saveResultToStorage(photoUri, status);

      Alert.alert('키트 인식 완료', message, [
        {
          text: '확인',
          onPress: () => navigation.navigate('Kit', {photo: photoUri, status}),
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

      await saveResultToStorage(photoUri, status);

      Alert.alert('키트 인식 완료 (오류 처리)', message, [
        {
          text: '확인',
          onPress: () => navigation.navigate('Kit', {photo: photoUri, status}),
        },
      ]);
    }
  };

  const saveResultToStorage = async (photoUri, status) => {
    try {
      // 1) status를 숫자로 변환
      let numericResult = -1;
      if (status === '비정상') {
        numericResult = 1;
      } else if (status === '정상') {
        numericResult = 0;
      }
      // -1은 '알 수 없음' 처리

      // 2) 날짜 포맷팅
      const now = new Date();
      const formattedDate = formatMyDateTime(now);

      // 3) 최종 저장할 객체 만들기
      const newResult = {
        datetime: formattedDate,
        result: numericResult,
      };
      // 4) 기존 user 데이터 가져오기
      const userDataString = await AsyncStorage.getItem('user');
      let userData = userDataString ? JSON.parse(userDataString) : {};

      // 5) kit_result 리스트 업데이트 (항상 추가)
      if (!userData.kit_result) {
        userData.kit_result = []; // 초기화
      }
      userData.kit_result.unshift(newResult); // 새로운 데이터를 리스트 맨 앞에 추가

      // 6) 업데이트된 user 데이터를 저장
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      /*const response = await axios.post(
        'http://98.82.55.237/kit/addTestResultById',
        _id,
        testResult,
      );*/
      //=============================================================================
      // 만약 기존 배열에 추가하는 방식이 필요하다면:
      const existingResults = await AsyncStorage.getItem('@kit_results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(newResult);
      await AsyncStorage.setItem('@kit_results', JSON.stringify(results));
      // 최근 검사 날짜를 별도로 저장
      await AsyncStorage.setItem('@recent_test_date', formattedDate);
      console.log('저장된 최근 검사 날짜:', formattedDate); // 로그 확인
      console.log('업데이트된 user 데이터:', userData);
    } catch (error) {
      console.error('결과 저장 중 오류:', error);
    }
  };

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
