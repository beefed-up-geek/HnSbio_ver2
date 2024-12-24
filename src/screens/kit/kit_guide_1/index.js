// src\screens\kit\kit_guide_1\index.js
import {useNavigation} from '@react-navigation/native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
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

  const ImageOrIcon = ({defaultIcon, defaultText}) => {
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

    return (
      <TouchableOpacity onPress={handleImagePick} style={styles.iconContainer}>
        {selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.iconImage} />
        ) : defaultIcon ? (
          <Icon name={defaultIcon} size={30} color="#666" />
        ) : (
          <Text style={styles.iconText}>{defaultText}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <Text style={styles.mainContentTitle} numberOfLines={1}>
              검사하기 전에 참고하세요!
            </Text>
            <View style={styles.tipsWrapper}>
              <View style={styles.tip}>
                <ImageOrIcon defaultIcon="sun-o" defaultText="아침 소변" />
                <Text style={styles.tipText}>
                  아침의 첫 소변이 가장 정확도가 높아요.
                </Text>
              </View>
              <View style={styles.tip}>
                <ImageOrIcon defaultIcon="cutlery" defaultText="비타민" />
                <Text style={styles.tipText}>
                  검사 전에는 비타민을 섭취하면 안 돼요.
                </Text>
              </View>
              <View style={styles.tip}>
                <ImageOrIcon defaultIcon="female" defaultText="임신/생리" />
                <Text
                  style={styles.tipText}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  임신 중이나 생리 중에는 검사 결과가 부정확해요.
                </Text>
              </View>
              <View style={styles.tip}>
                <ImageOrIcon defaultIcon="tint" defaultText="물 섭취" />
                <Text style={styles.tipText}>
                  검사 전에 과도한 물 섭취는 피하세요.
                </Text>
              </View>
              <View style={styles.tip}>
                <ImageOrIcon defaultIcon="clock-o" defaultText="60분" />
                <Text style={styles.tipText}>60분 이내에 촬영하세요.</Text>
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
              <ImageOrIcon defaultIcon="camera" defaultText="카메라" />
              <ImageOrIcon defaultIcon="file-text" defaultText="결과" />
              <ImageOrIcon defaultIcon="check" defaultText="확인" />
              <ImageOrIcon defaultIcon="times" defaultText="취소" />
              <ImageOrIcon defaultIcon="plus" defaultText="추가" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Kit_guide_1_screen;
