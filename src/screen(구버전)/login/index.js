// src\screen(구버전)\login\index.js
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const Login1 = () => {
  const navigation = useNavigation();
  const logoOpacity = useSharedValue(0); // 로고의 투명도
  const textOpacity = useSharedValue(0);
  const textColor = useSharedValue(0);

  useEffect(() => {
    const checkLoginMethod = async () => {
      const loginMethod = await AsyncStorage.getItem('loginMethod');
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (loginMethod) {
        setTimeout(() => {
          if (userInfo) {
            navigation.replace('BottomNavigation');
          } else {
            navigation.replace('GetUserInfo');
          }
        }, 3000);
      } else {
        setTimeout(() => {
          navigation.replace('Login2');
        }, 3000);
      }
    };

    checkLoginMethod();

    // 로고 및 텍스트의 투명도 및 색상 애니메이션
    logoOpacity.value = withTiming(1, {duration: 2000});
    textOpacity.value = withTiming(1, {duration: 2000});
    textColor.value = withTiming(1, {duration: 1000});
  }, [navigation, logoOpacity, textOpacity, textColor]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value, // 로고의 투명도만 애니메이션으로 적용
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolate(
      textColor.value,
      [0, 1],
      ['#FFFFFF', '#000000'], // 흰색에서 검은색으로 점점 진해지는 색상
      Extrapolate.CLAMP,
    );

    return {
      opacity: textOpacity.value,
      color: color,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../images/login/splash1.png')}
        style={[styles.image, logoAnimatedStyle]} // 로고 투명도 애니메이션 적용
      />
      <Animated.Text style={[styles.descriptionText, textAnimatedStyle]}>
        빠르고 간편한
      </Animated.Text>
      <Animated.Text style={[styles.descriptionText, textAnimatedStyle]}>
        신장기능 조기 진단 검사지
      </Animated.Text>
      <ActivityIndicator
        size="large"
        color="#1677FF"
        style={styles.loadingIndicator}
      />
      <Text style={styles.footerText}>HNSBio.lab</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: 'gray',
  },
});

export default Login1;
