import React, {useState} from 'react';
import {launchCamera} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity,  Image,} from 'react-native';
import theme from '../../../theme';
import styles from './styles.js';
import {RNCamera} from 'react-native-camera';
import {onDisplayNotification} from '../../../pushnotification';
import axios from 'axios';

const Kit_test_screen = ({navigation}) => {
  const [photo, setPhoto] = useState(null);

  const takePicture = async camera => {
    try {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      setPhoto(data.uri);

      sendToAPI(data.uri);
    } catch (error) {
      console.error(error);
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

      if (result === 'positive') {
        Alert.alert('검사 결과', '결과가 비정상입니다.');
        askToRetakeOrProceed(photoUri, '비정상');
      } else {
        Alert.alert('검사 결과', '결과가 정상입니다.');
        askToRetakeOrProceed(photoUri, '정상');
      }

      setTimeout(() => {
        onDisplayNotification(); // PushNotification에서 푸시 알림 함수 호출
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
          onPress: () => setPhoto(null),
        },
        {
          text: '진행하기',
          onPress: () => navigation.navigate('Kit', {photo: photoUri, status}),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1}}>
      {!photo ? (
        <RNCamera
          style={{flex: 1}}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          ref={ref => {
            this.camera = ref;
          }}>
          {({camera, status}) => {
            if (status !== 'READY') return <View />;
            return (
              <View style={styles.overlayContainer}>
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerIconContainer}>
                    <Image
                      style={styles.headerIcon}
                      source={require('./assets/images/1141b64f-2035-4c5c-bcf5-2e5e9773938c.png')}
                    />
                  </TouchableOpacity>
                  <Text style={styles.headerText}>촬영하기</Text>
                </View>
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsText}>
                    카메라의 주황색 네모칸을 키트에 잘 맞춰 주세요. 자동으로
                    촬영됩니다.
                  </Text>
                </View>
                <View style={styles.squareContainer}>
                  <View style={styles.orangeSquare} />
                </View>
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.captureButton}>
                  <Text style={styles.captureButtonText}>촬영하기</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      ) : (
        <Image source={{uri: photo}} style={{flex: 1}} />
      )}
    </View>
  );
};

export default Kit_test_screen;