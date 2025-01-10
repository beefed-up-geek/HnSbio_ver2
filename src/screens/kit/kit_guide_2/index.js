import React, {useCallback, useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles.js';

const {width, height} = Dimensions.get('window');

const ImageOrIcon = ({defaultIcon}) => {
  return (
    <View style={styles.iconContainer}>
      <Icon name={defaultIcon} size={(30 * width) / 390} color="#4CAF50" />
    </View>
  );
};

const Kit_guide_2_screen = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  const opacity = useSharedValue(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 컴포넌트가 focus될 때 동작
      setIsPlaying(false);

      return () => {
        // cleanup 작업
        setIsPlaying(false); // 컴포넌트가 unfocus될 때 동작
      };
    }, []), // 빈 배열로 유지
  );

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1,
      true,
    );
  }, []); // 빈 배열로 변경

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const getIconName = index => {
    const icons = ['check', 'tint', 'flask', 'ban', 'clock-o', 'list'];
    return icons[index] || 'info-circle';
  };

  return (
    <View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.banner}>
              {selectedImage ? (
                <Image
                  source={{uri: selectedImage}}
                  style={styles.bannerImage}
                />
              ) : (
                <YoutubePlayer
                  height={height * 0.4}
                  width={width * 0.9}
                  play={isPlaying}
                  videoId="TXT4Zj0K6X4"
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.instructions}>
            {instructionTexts.map((text, index) => (
              <View key={index} style={styles.instructionBox}>
                <ImageOrIcon defaultIcon={getIconName(index)} />
                <Text style={styles.instructionText}>{text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('kit_test')}>
            <View style={styles.captureButton}>
              <Animated.View style={animatedStyle}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="camera"
                    size={20}
                    color="#FFF"
                    style={{marginRight: 8}}
                  />
                  <Text style={styles.captureButtonText} numberOfLines={1}>
                    촬영하러 가기
                  </Text>
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const instructionTexts = [
  '구성품 확인',
  '소변컵에 채우기',
  '검사 스틱에 소변 묻히기',
  '스틱에 묻은 물기 제거하기',
  '60초 기다리기',
  '비색표에 스틱 올리기',
];

export default Kit_guide_2_screen;
