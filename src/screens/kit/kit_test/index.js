import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { onDisplayNotification } from '../../../pushnotification';
import axios from 'axios';
import styles from './styles';

const KitTestScreen = ({ navigation }) => {
  const { KitClassifierModule } = NativeModules;
  const [photoUri, setPhotoUri] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      const microphoneStatus = await Camera.requestMicrophonePermission();

      if (cameraStatus === 'granted' && microphoneStatus === 'granted') {
        setCameraPermission(true);
      } else {
        Alert.alert('권한 필요', '카메라 및 마이크 권한이 필요합니다.');
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

  const classifyImage = async (uri) => {
    try {
      const imageUri = 'file://' + uri;
      const result = await KitClassifierModule.classifyKit(imageUri);

      // 종료 시간 기록 및 경과 시간 계산
      const endTime = new Date().getTime();
      const elapsed = endTime - startTimeRef.current;
      console.log(`인식 시간: ${(elapsed / 1000).toFixed(2)} 초`);

      const isKit = result.isKit;

      if (isKit) {
        // 분류 결과를 저장하고 API 호출
        setClassificationData(formatClassificationData(result));
        sendToAPI(imageUri);
      } else {
        Alert.alert('결과', '키트를 인식하지 못했습니다. 다시 촬영해주세요.', [
          { text: '확인', onPress: handleReset },
        ]);
      }
    } catch (error) {
      console.error('이미지 처리 오류:', error);
    }
  };

  const formatClassificationData = (result) => {
    const { isKit, ...scores } = result; // isKit을 제외한 분류 결과
    const sortedResult = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topResults = sortedResult.map(([label, percentage]) => ({
      label,
      percentage: Math.floor(percentage * 100), // 퍼센트로 변환
    }));

    return topResults;
  };

  const sendToAPI = async (photoUri) => {
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

      if (result === 'positive') {
        Alert.alert('검사 결과', '결과가 비정상입니다.');
        askToRetakeOrProceed(photoUri, '비정상');
      } else {
        Alert.alert('검사 결과', '결과가 정상입니다.');
        askToRetakeOrProceed(photoUri, '정상');
      }

      // 5분 후 푸시 알림
      setTimeout(() => {
        onDisplayNotification();
      }, 300000);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      Alert.alert('오류', '사진 전송에 실패했습니다.');
    }
  };

  const askToRetakeOrProceed = (photoUri, status) => {
    Alert.alert(
      '사진 촬영 완료',
      '사진을 재촬영하겠습니까? 아니면 진행하겠습니까?',
      [
        {
          text: '다시 찍기',
          onPress: handleReset,
        },
        {
          text: '진행하기',
          onPress: () => navigation.navigate('Kit', { photo: photoUri, status }),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'file://' + photoUri }} style={styles.image} />
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
