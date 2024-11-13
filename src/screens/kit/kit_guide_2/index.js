// src/screens/kit/kit_guide_2.js

import {useNavigation} from '@react-navigation/native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');
const scaleWidth = width / 390;
const scaleHeight = height / 844;

const Kit_guide_2_screen = ({onPress, navigation}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // 페이드인 페이드아웃 애니메이션 설정
    opacity.value = withRepeat(
      withTiming(0, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1, // 무한 반복
      true, // 요요 효과 (반대로 애니메이션 반복)
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ImageBackground
                style={styles.headerIcon}
                source={require('./assets/images/1f9e7f42-01c5-40ec-88d3-2a33f0b7f5aa.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              소변 검사 가이드
            </Text>
            <View style={styles.headerRightIconContainer}>
              <ImageBackground
                style={styles.headerRightIcon}
                source={require('./assets/images/719ef727-9a73-40d3-b526-193146ddccca.png')}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.banner}>
            {/* <View style={styles.bannerInner}>
              <ImageBackground
                style={styles.bannerBackgroundImage}
                source={require('./assets/images/150b862e-e74e-485a-a1f8-73dce2fa73f4.png')}
                resizeMode="cover"
              />
              <ImageBackground
                style={styles.bannerForegroundImage}
                source={require('./assets/images/0a9072ca-e17b-4750-ba0d-2659d1ab76d3.png')}
                resizeMode="cover"
              />
              <Text style={styles.bannerText} numberOfLines={1}>
                HS
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressBarIcon}>
                <ImageBackground
                  style={styles.progressBarIconImage}
                  source={require('./assets/images/905cac4e-8da1-48c3-b6ab-6291d387aa69.png')}
                />
              </View>
              <Text style={styles.progressBarText} numberOfLines={1}>
                00:00
              </Text>
              <View style={styles.progressBarTrack} />
              <Text style={styles.progressBarText} numberOfLines={1}>
                -01:36
              </Text>
              <View style={styles.progressBarPlayIcon}>
                <ImageBackground
                  style={styles.progressBarPlayIconImage}
                  source={require('./assets/images/babfae0e-3934-4e27-8cc0-b207c520f470.png')}
                />
              </View>
            </View> */}
            <Video
              source={require('../../../../android/app/src/main/res/raw/video.mp4')} // 로컬 파일을 사용하려면 require('./path/to/video.mp4')
              style={styles.video}
              controls={true} // 컨트롤러 표시
            />
          </View>
          <View style={styles.instructions}>
            {Array.from({length: 6}).map((_, index) => (
              <View key={index} style={styles.instruction}>
                <View style={styles.instructionIconContainer}>
                  <Text style={styles.instructionIconText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText} numberOfLines={1}>
                  {instructionTexts[index]}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('kit_test')}>
            <View style={styles.captureButton}>
              <View style={styles.captureButtonTextContainer}>
                <Animated.View style={animatedStyle}>
                  <Text style={styles.captureButtonText} numberOfLines={1}>
                    촬영하러 가기
                  </Text>
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
