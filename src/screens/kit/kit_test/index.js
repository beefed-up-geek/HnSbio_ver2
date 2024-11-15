import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {NativeModules} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import {onDisplayNotification} from '../../../pushnotification';
import axios from 'axios';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트

const KitTestScreen = ({navigation}) => {
  const {KitClassifierModule} = NativeModules;
  const [photoUri, setPhotoUri] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermission();

      if (cameraStatus === 'authorized' || cameraStatus === 'granted') {
        setCameraPermission(true);
      } else {
        Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      }
    };
    requestPermissions();
  }, []);

  const handleReset = () => {
    setPhotoUri(null);
    setClassificationData([]);
  };

  const takePhoto = async () => {
    if (camera.current && device) {
      try {
        startTimeRef.current = new Date().getTime();

        const photo = await camera.current.takePhoto({
          quality: 0.8,
          skipMetadata: true,
        });
        setPhotoUri(photo.path);
        classifyImage(photo.path);
      } catch (error) {
        console.error('사진 촬영 오류:', error);
      }
    } else {
      console.warn('카메라 권한이 필요합니다.');
    }
  };

  const classifyImage = async uri => {
    try {
      const imageUri = 'file://' + uri;
      const result = await KitClassifierModule.classifyKit(imageUri);

      // 종료 시간 기록 및 경과 시간 계산
      const endTime = new Date().getTime();
      const elapsed = endTime - startTimeRef.current;
      console.log(`인식 시간: ${(elapsed / 1000).toFixed(2)} 초`);

      const isKit = result.isKit;

      // 키트 인식 여부와 상관없이 진행 여부를 묻기
      Alert.alert(
        '결과',
        isKit
          ? '키트를 인식했습니다. 진행하시겠습니까?'
          : '키트를 인식하지 못했습니다. 다시 촬영하거나 진행을 선택하세요.',
        [
          {
            text: '다시 찍기',
            onPress: handleReset,
          },
          {
            text: '진행하기',
            onPress: () => {
              if (isKit) {
                // 키트 인식 성공 시 API 호출
                sendToAPI(imageUri);
              } else {
                // 키트 인식 실패 시 결과를 저장하고 이동
                saveResultToStorage(imageUri, '미확인');
                navigation.navigate('Kit', {photo: imageUri, status: '미확인'});
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('이미지 처리 오류:', error);
    }
  };

  const sendToAPI = async photoUri => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post(
        'http://scalawox1.iptime.org:5555/predict/segment/v1/simple',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const result = response.data.inference.result;
      const status = result === 'positive' ? '비정상' : '정상';

      // 결과 저장
      await saveResultToStorage(photoUri, status);

      Alert.alert('검사 결과', `결과가 ${status}입니다.`, [
        {
          text: '확인',
          onPress: () => navigation.navigate('Kit', {photo: photoUri, status}),
        },
      ]);

      // 5분 후 푸시 알림
      setTimeout(() => {
        onDisplayNotification();
      }, 300000);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      Alert.alert('오류', '사진 전송에 실패했습니다.');
    }
  };

  // AsyncStorage에 결과 저장
  const saveResultToStorage = async (photoUri, status) => {
    try {
      const newResult = {
        photo: photoUri,
        status,
        date: new Date().toISOString(),
      };
      const existingResults = await AsyncStorage.getItem('@kit_results');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(newResult); // 새로운 결과를 맨 앞에 추가
      await AsyncStorage.setItem('@kit_results', JSON.stringify(results));
    } catch (error) {
      console.error('결과 저장 중 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.imageContainer}>
          <Image source={{uri: 'file://' + photoUri}} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
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
