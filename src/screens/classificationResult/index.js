import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { NativeModules } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import styles from './styles';

const ClassificationResult = ({ navigation }) => {
  const { KitClassifierModule } = NativeModules;
  const [uri, setUri] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back')
  const camera = useRef(null);

  // 시작 시간을 저장할 참조 추가
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
    setUri(null);
    setClassificationData([]);
    // 인식 시간 초기화 필요 없음
  };

  const takePhoto = async () => {
    if (camera.current && device) {
      try {
        // 시작 시간 기록
        startTimeRef.current = new Date().getTime();

        const photo = await camera.current.takePhoto({
          quality: 0.8,
          skipMetadata: true,
        });
        setUri(photo.path);
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
      console.log(`인식 시간: ${(elapsed / 2000).toFixed(2)} 초`);

      const isKit = result.isKit;

      if (isKit) {
        Alert.alert('결과 확인', '결과를 보러가시겠습니까?', [
          {
            text: '예',
            onPress: () => setClassificationData(formatClassificationData(result)),
          },
          { text: '아니요', onPress: handleReset },
        ]);
      } else {
        Alert.alert('결과', 'kit가 없습니다. 다시 촬영해주세요.', [
          { text: '확인', onPress: handleReset },
        ]);
      }
    } catch (error) {
      console.error('이미지 처리 오류:', error);
    }
  };

  const formatClassificationData = (result) => {
    const sortedResult = Object.entries(result).sort((a, b) => b[1] - a[1]);
    const top3Result = sortedResult.slice(0, 3);

    return top3Result.map(([label, percentage]) => ({
      label,
      percentage: Math.floor(percentage),
    }));
  };

  return (
    <View style={styles.container}>
      {uri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'file://' + uri }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Text style={styles.backButtonText}>뒤로 가기</Text>
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
            <Text style={styles.captureButtonText}>촬영</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>카메라 권한이 필요합니다.</Text>
      )}

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>분석 결과</Text>
        {classificationData.length > 0 ? (
          <View style={styles.percentageContainer}>
            {classificationData.map((item, index) => (
              <View style={styles.percentageItem} key={index}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.percentage}>{item.percentage}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>이미지를 촬영하고 분석 결과를 확인하세요.</Text>
        )}

        {!uri && (
          <TouchableOpacity style={styles.selectButton} onPress={takePhoto}>
            <Text style={styles.selectButtonText}>사진 촬영하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ClassificationResult;
