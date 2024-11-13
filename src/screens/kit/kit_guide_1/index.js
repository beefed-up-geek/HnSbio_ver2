// src/screens/kit/kit_guide_1.js

import {useNavigation} from '@react-navigation/native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './kit_guide_1_styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

import React, {useEffect} from 'react';
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
const {width, height} = Dimensions.get('window');
const scaleWidth = width / 390;
const scaleHeight = height / 844;

const Kit_guide_1_screen = ({navigation, onPress}) => {
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
                style={styles.headerLeftIcon}
                source={require('./assets/images/2965bb04-fa93-4fc2-af21-da51b8a4fe33.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              소변 검사 가이드
            </Text>
            <View style={styles.headerRightIconWrapper}>
              <ImageBackground
                style={styles.headerRightIcon}
                source={require('./assets/images/ff5c89e1-1e02-48ca-a40a-324811996b44.png')}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.mainContentTitle} numberOfLines={1}>
              검사하기 전에 참고하세요!
            </Text>
            <View style={styles.tipsWrapper}>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/4c4569cb-5e5c-47bc-8d48-48e0b3e3d6f7.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  아침의 첫 소변이 가장 정확도가 높아요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/c6a4ae25-be3c-457f-a4fe-568dd7bceca6.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  검사 전에는 비타민을 섭취하면 안 돼요.&nbsp;
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/79cccc81-c921-4288-8914-4da2b2f4475c.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  임신 중이나 생리 중에는 검사 결과가 부정확해요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/44ed877c-47cd-4ce1-94b7-494684c8cac7.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  검사 전에 과도한 물 섭취는 피하세요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/fd75ea69-03eb-47f1-82a0-721c3defcb73.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  60분 이내에 촬영하세요.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => navigation.navigate('kit_guide_2')}>
              <Animated.View
                style={[styles.confirmButtonTextWrapper, animatedStyle]}>
                <Text style={styles.confirmButtonText} numberOfLines={1}>
                  확인했어요
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.footerSpacer} />
          <View style={styles.footer}>
            <View style={styles.footerIconsWrapper}>
              <View style={styles.footerIconWrapper}>
                <View style={styles.footerIconBackground}>
                  <View style={styles.footerIconImageWrapper}>
                    <ImageBackground
                      style={styles.footerIconImage}
                      source={require('./assets/images/b86dfc01-3441-4689-8f2d-c7386a7d1669.png')}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.footerIconButton}>
                <View style={styles.footerIconWrapper}>
                  <ImageBackground
                    style={styles.footerIconImage}
                    source={require('./assets/images/5020e8c8-66ca-4247-9aa9-e67addbc6044.png')}
                  />
                </View>
                <Text style={styles.footerIconText} numberOfLines={1}>
                  키트 결과
                </Text>
              </View>
              <View style={styles.footerIconWrapper}>
                <View style={styles.footerIconImageWrapper}>
                  <ImageBackground
                    style={styles.footerIconImage}
                    source={require('./assets/images/bce61a0e-da28-493b-b63b-a6fc6e15c776.png')}
                  />
                </View>
              </View>
              <View style={styles.footerIconWrapper}>
                <ImageBackground
                  style={styles.footerIconImage}
                  source={require('./assets/images/d274c04b-d15c-4fdf-85ba-6a02b0e0cc10.png')}
                />
              </View>
              <View style={styles.footerIconWrapper}>
                <ImageBackground
                  style={styles.footerIconImage}
                  source={require('./assets/images/0facc259-9130-4b57-bb25-eedd26f6442b.png')}
                />
              </View>
            </View>
          </View>
          <ImageBackground
            style={styles.footerImage}
            source={require('./assets/images/a1b5eba3-e8ae-4071-9dec-cbebd3c9cdc4.png')}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Kit_guide_1_screen;
