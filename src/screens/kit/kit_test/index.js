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
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
        Alert.alert(
          '서버 오류',
          error.response.data.responseDetails || '오류 발생',
        );
      } else if (error.request) {
        console.error('요청 전송 오류:', error.request);
        Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
      } else {
        console.error('요청 설정 오류:', error.message);
        Alert.alert('요청 오류', error.message);
      }
    }
  };

  const saveResultToStorage = async (photoUri, status) => {
    try {
      const newResult = {
        photo: photoUri,
        status,
        date: new Date().toISOString(),
      };
      const existingResults = await AsyncStorage.getItem('@kit_results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(newResult);
      await AsyncStorage.setItem('@kit_results', JSON.stringify(results));
      console.log('저장된 데이터:', results); // 디버깅용 로그
    } catch (error) {
      console.error('결과 저장 중 오류:', error);
    }
  };

  // 최적의 포맷과 해상도를 선택
  const optimalFormat = device?.formats.sort(
    (a, b) => b.photoWidth - a.photoWidth,
  )[0];

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

export default KitTestScreen;
