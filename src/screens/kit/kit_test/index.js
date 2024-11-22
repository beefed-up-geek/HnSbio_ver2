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
          quality: 0.8,
          skipMetadata: true,
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

      console.log('Sending FormData:', formData);

      const response = await axios.post(
        'http://scalawox1.iptime.org:5555/predict/segment/v1/simple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000, // 10초 대기
        },
      );

      console.log('API Response:', response.data);

      if (response.data.responseCode !== 200) {
        throw new Error(response.data.responseDetails || 'Unexpected error');
      }

      const {result} = response.data.inference;

      console.log('Result:', result);

      // 결과값에 따라 분기 처리
      if (result === 'positive') {
        const status = '비정상';
        await saveResultToStorage(photoUri, status);
        Alert.alert('키트 인식 완료', `결과가 ${status}입니다.`, [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('Kit', {photo: photoUri, status}),
          },
        ]);
      } else if (result === 'negative') {
        const status = '정상';
        await saveResultToStorage(photoUri, status);
        Alert.alert('키트 인식 완료', `결과가 ${status}입니다.`, [
          {
            text: '확인',
            onPress: () =>
              navigation.navigate('Kit', {photo: photoUri, status}),
          },
        ]);
      } else if (result === 'none') {
        Alert.alert(
          '키트를 사용 후 다시 시도해주세요',
          '키트를 먼저 사용한 후 다시 촬영해주세요.',
          [
            {
              text: '확인',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else if (result === 'unknown') {
        Alert.alert(
          '키트 확인 불가',
          '키트를 확인할 수 없습니다. 다시 한 번 명확하게 촬영해주세요.',
          [
            {
              text: '확인',
              onPress: () => setPhotoUri(null), // 처음 상태로 되돌림
            },
          ],
        );
      } else {
        throw new Error('Unexpected result value');
      }
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      Alert.alert('오류', '사진 전송에 실패했습니다.');
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

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.imageContainer}>
          <Image source={{uri: 'file://' + photoUri}} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setPhotoUri(null)}>
            <Text style={styles.backButtonText}>다시 촬영하기</Text>
          </TouchableOpacity>
        </View>
      ) : cameraPermission && device ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
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
