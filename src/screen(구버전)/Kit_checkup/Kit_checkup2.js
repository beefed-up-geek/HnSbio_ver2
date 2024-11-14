// src\screen(구버전)\Kit_checkup\Kit_checkup2.js
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

const Kit_checkupScreen2 = ({onPress, navigation}) => {
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
              source={require('../../../android/app/src/main/res/raw/video.mp4')} // 로컬 파일을 사용하려면 require('./path/to/video.mp4')
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
          <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
            <View style={styles.captureButton}>
              <View style={styles.captureButtonTextContainer}>
                <Animated.View style={animatedStyle}>
                  <ImageBackground
                    style={styles.captureButtonIcon}
                    source={require('./assets/images/f8bca994-9ff5-46f4-96b3-d7420314c9b5.png')}
                    resizeMode="cover"
                  />
                  <Text style={styles.captureButtonText} numberOfLines={1}>
                    촬영하러 가기
                  </Text>
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <ImageBackground
            style={styles.footerImage}
            source={require('./assets/images/2a636030-9d1b-41dc-8565-8a5424694706.png')}
            resizeMode="cover"
          />
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

export default Kit_checkupScreen2;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
    bottom: 58,
  },
  container: {
    display: 'flex',
    width: 390 * scaleWidth,
    height: 844 * scaleHeight,
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  header: {
    display: 'flex',
    height: 68 * scaleHeight,
    paddingTop: 24 * scaleHeight,
    paddingRight: 24 * scaleWidth,
    paddingBottom: 24 * scaleHeight,
    paddingLeft: 24 * scaleWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
  },
  headerIcon: {
    width: 20 * scaleWidth,
    height: 20 * scaleWidth,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  headerTitle: {
    height: 20 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 16 * scaleWidth,
    fontWeight: '600',
    lineHeight: 20 * scaleHeight,
    color: '#000000',
    position: 'relative',
    textAlign: 'left',
    zIndex: 2,
  },
  headerRightIconContainer: {
    display: 'flex',
    width: 20 * scaleWidth,
    flexDirection: 'row',
    gap: 8 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 3,
  },
  headerRightIcon: {
    width: 20 * scaleWidth,
    height: 20 * scaleWidth,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 4,
  },
  banner: {
    display: 'flex',
    height: 207 * scaleHeight,
    paddingTop: 58 * scaleHeight,
    paddingRight: 78 * scaleWidth,
    paddingBottom: 58 * scaleHeight,
    paddingLeft: 78 * scaleWidth,
    gap: 10 * scaleHeight,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#e1e4ef',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 5,
  },
  bannerInner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 6,
  },
  bannerBackgroundImage: {
    width: 397 * scaleWidth,
    height: 112 * scaleHeight,
    flexShrink: 0,
    position: 'absolute',
    top: -13 * scaleHeight,
    left: -85 * scaleWidth,
    zIndex: 7,
  },
  bannerForegroundImage: {
    width: 60 * scaleWidth,
    height: 30 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    zIndex: 8,
  },
  bannerText: {
    display: 'flex',
    width: 140.571 * scaleWidth,
    height: 83.429 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Bungee',
    fontSize: 70 * scaleWidth,
    fontWeight: '400',
    lineHeight: 83.429 * scaleHeight,
    color: '#ffffff',
    position: 'relative',
    textAlign: 'center',
    zIndex: 9,
  },
  progressBar: {
    display: 'flex',
    width: 365 * scaleWidth,
    height: 45 * scaleHeight,
    paddingTop: 12 * scaleHeight,
    paddingRight: 13 * scaleWidth,
    paddingBottom: 12 * scaleHeight,
    paddingLeft: 13 * scaleWidth,
    flexDirection: 'row',
    gap: 10 * scaleWidth,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: 'rgba(93, 93, 98, 0.32)',
    borderTopLeftRadius: 13 * scaleWidth,
    borderTopRightRadius: 13 * scaleWidth,
    borderBottomRightRadius: 13 * scaleWidth,
    borderBottomLeftRadius: 13 * scaleWidth,
    position: 'relative',
    zIndex: 10,
  },
  progressBarIcon: {
    width: 20 * scaleWidth,
    height: 20 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 11,
  },
  progressBarIconImage: {
    width: 16.667 * scaleWidth,
    height: 16.667 * scaleHeight,
    position: 'relative',
    zIndex: 12,
    marginTop: 1.667 * scaleHeight,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 1.667 * scaleWidth,
  },
  progressBarText: {
    height: 17 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 14 * scaleWidth,
    fontWeight: '400',
    lineHeight: 16.707 * scaleHeight,
    color: '#ffffff',
    position: 'relative',
    textAlign: 'left',
    zIndex: 13,
  },
  progressBarTrack: {
    width: 173 * scaleWidth,
    height: 8 * scaleHeight,
    flexShrink: 0,
    backgroundColor: 'rgba(126, 133, 150, 0.2)',
    borderTopLeftRadius: 8 * scaleWidth,
    borderTopRightRadius: 8 * scaleWidth,
    borderBottomRightRadius: 8 * scaleWidth,
    borderBottomLeftRadius: 8 * scaleWidth,
    position: 'relative',
    zIndex: 14,
  },
  progressBarPlayIcon: {
    width: 28 * scaleWidth,
    height: 28 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 16,
  },
  progressBarPlayIconImage: {
    width: 19.25 * scaleWidth,
    height: 19.25 * scaleHeight,
    position: 'relative',
    zIndex: 17,
    marginTop: 4.375 * scaleHeight,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 4.375 * scaleWidth,
  },
  instructions: {
    display: 'flex',
    paddingTop: 40 * scaleHeight,
    paddingRight: 24 * scaleWidth,
    paddingBottom: 40 * scaleHeight,
    paddingLeft: 24 * scaleWidth,
    gap: 20 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 18,
  },
  instruction: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 19,
  },
  instructionIconContainer: {
    display: 'flex',
    width: 24 * scaleWidth,
    height: 24 * scaleHeight,
    paddingTop: 2 * scaleHeight,
    paddingRight: 6 * scaleWidth,
    paddingBottom: 2 * scaleHeight,
    paddingLeft: 6 * scaleWidth,
    gap: 10 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#7595ff',
    borderTopLeftRadius: 12 * scaleWidth,
    borderTopRightRadius: 12 * scaleWidth,
    borderBottomRightRadius: 12 * scaleWidth,
    borderBottomLeftRadius: 12 * scaleWidth,
    position: 'relative',
    zIndex: 20,
  },
  instructionIconText: {
    height: 20 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 14 * scaleWidth,
    fontWeight: '500',
    lineHeight: 20 * scaleHeight,
    color: '#ffffff',
    position: 'relative',
    textAlign: 'left',
    zIndex: 21,
  },
  instructionText: {
    height: 20 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 14 * scaleWidth,
    fontWeight: '500',
    lineHeight: 20 * scaleHeight,
    color: '#353535',
    position: 'relative',
    textAlign: 'left',
    zIndex: 22,
  },
  captureButton: {
    display: 'flex',
    width: 211 * scaleWidth,
    paddingTop: 12 * scaleHeight,
    paddingRight: 50 * scaleWidth,
    paddingBottom: 12 * scaleHeight,
    paddingLeft: 50 * scaleWidth,
    flexDirection: 'row',
    gap: 10 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#7595ff',
    borderTopLeftRadius: 48 * scaleWidth,
    borderTopRightRadius: 48 * scaleWidth,
    borderBottomRightRadius: 48 * scaleWidth,
    borderBottomLeftRadius: 48 * scaleWidth,
    position: 'relative',
    zIndex: 43,
  },
  captureButtonTextContainer: {
    width: 111 * scaleWidth,
    height: 18 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    zIndex: 44,
  },
  captureButtonIcon: {
    width: 18 * scaleWidth,
    height: 18 * scaleHeight,
    position: 'absolute',
    top: 0,
    left: 93 * scaleWidth,
    overflow: 'hidden',
    zIndex: 46,
  },
  captureButtonText: {
    display: 'flex',
    width: 112 * scaleWidth,
    height: 18 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'DM Sans',
    fontSize: 14 * scaleWidth,
    fontWeight: '700',
    lineHeight: 18 * scaleHeight,
    color: '#ffffff',
    letterSpacing: 0.56 * scaleWidth,
    position: 'absolute',
    top: 2 * scaleHeight,
    left: 0,
    textAlign: 'center',
    textTransform: 'uppercase',
    zIndex: 45,
  },
  spacer: {
    height: 110 * scaleHeight,
    alignSelf: 'stretch',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    position: 'relative',
    zIndex: 47,
  },
  footerImage: {
    width: 148 * scaleWidth,
    height: 5 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    zIndex: 49,
  },
});
