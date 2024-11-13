// src\screen(구버전)\Kit_checkup\Camera.js
import React, {useState} from 'react';
import {
  View,
  Image,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import { onDisplayNotification } from '../../pushnotification';

const CameraScreen = ({navigation}) => {
  const [photo, setPhoto] = useState(null);

  const takePicture = async camera => {
    try {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      setPhoto(data.uri);
      askToRetakeOrProceed();

      setTimeout(() => {
        onDisplayNotification(); // PushNotification에서 푸시 알림 함수 호출
      }, 300000);

    } catch (error) {
      console.error(error);
    }
  };

  const askToRetakeOrProceed = () => {
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
          onPress: () => navigation.navigate('Kit_checkup3', {photo}),
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

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    display: 'flex',
    height: 68,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 1,
  },
  headerIconContainer: {
    position: 'absolute',
    left: 24,
    zIndex: 2,
    padding: 10, // 터치 영역을 늘려서 사용자가 쉽게 누를 수 있도록 합니다.
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 16,
    color: '#000000',
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    transform: [{translateX: 0}],
    zIndex: 1,
  },
  instructionsContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#49494e',
  },
  squareContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeSquare: {
    width: 250,
    height: 350,
    borderWidth: 3,
    borderColor: 'orange',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  captureButton: {
    width: 150,
    height: 50,
    backgroundColor: 'orange',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    zIndex: 3,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CameraScreen;
