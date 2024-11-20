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
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import {bundleResourceIO} from '@tensorflow/tfjs-react-native';
import ImageResizer from 'react-native-image-resizer'; // ImageManipulator 대체
import styles from './styles';
import RNFS from 'react-native-fs';

const KitTestScreen = ({navigation}) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [classificationData, setClassificationData] = useState([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
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

    const loadTensorFlow = async () => {
      await tf.ready();
      console.log('TensorFlow.js is ready!');
    };

    requestPermissions();
    loadTensorFlow();
  }, []);

  const takePhoto = async () => {
    if (camera.current && device) {
      try {
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

  const loadModel = async () => {
    const modelJson = RNFS.DocumentDirectoryPath + '/model.json';
    const modelWeights = [
      RNFS.DocumentDirectoryPath + '/group1-shard1of5.bin',
      RNFS.DocumentDirectoryPath + '/group1-shard2of5.bin',
      RNFS.DocumentDirectoryPath + '/group1-shard3of5.bin',
      RNFS.DocumentDirectoryPath + '/group1-shard4of5.bin',
      RNFS.DocumentDirectoryPath + '/group1-shard5of5.bin',
    ];
    const model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights),
    );
    console.log('Model loaded successfully');
    return model;
  };

  const processImage = async uri => {
    try {
      // 이미지 크기 조정
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        150,
        150,
        'JPEG',
        80,
      );

      // 이미지를 텐서로 변환
      const img = await tf.react_native.decodeJpeg(
        await tf.io.readFile(resizedImage.uri),
      );
      const imgTensor = img.div(255.0).expandDims(0); // 정규화 및 배치 차원 추가
      return imgTensor;
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      throw error;
    }
  };

  const classifyWithTensorFlow = async uri => {
    const model = await loadModel();
    const inputTensor = await processImage(uri);
    const prediction = model.predict(inputTensor);
    return prediction.arraySync();
  };

  const classifyImage = async uri => {
    try {
      const predictionArray = await classifyWithTensorFlow(uri);
      const isKit = predictionArray[0] > 0.5;

      if (isKit) {
        Alert.alert('결과', '키트를 인식했습니다.');
        setClassificationData(predictionArray);
      } else {
        Alert.alert('결과', '키트를 인식하지 못했습니다. 다시 촬영해주세요.');
      }
    } catch (error) {
      console.error('이미지 처리 오류:', error);
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
