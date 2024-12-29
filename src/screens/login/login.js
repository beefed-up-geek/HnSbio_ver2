// src\screens\login\login.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import theme from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import splashImage from '../../images/login/splash2.png';
import naverIcon from '../../images/login/naver.png';
import kakaoIcon from '../../images/login/kakao.png';
import googleIcon from '../../images/login/google.png';
import appleIcon from '../../images/login/apple.png';
import { login as kakaoLogin, me as getKakaoProfile } from '@react-native-kakao/user';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import NaverLogin from '@react-native-seoul/naver-login';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuth } from '@invertase/react-native-apple-authentication';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

// Google 로그인 설정
GoogleSignin.configure({
  webClientId: '553674684367-g30th1q22jbqjs30jgad63i95vdntcmu.apps.googleusercontent.com',
  androidClientId: '553674684367-emj97ff7kjitq1qbn03ok9hebps9ijsg.apps.googleusercontent.com',
  iosClientId: '553674684367-sr2m1jems5sai07qgq710dvhdoqm6npv.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

// Naver 로그인 설정
const consumerKey = 'fujiEAut2m84ybqDQOoq';
const consumerSecret = 'yXEW6CuruC';
const appName = 'HS바이오랩';
const serviceUrlScheme = 'com.apple';
NaverLogin.initialize({
  appName,
  consumerKey,
  consumerSecret,
  serviceUrlSchemeIOS: serviceUrlScheme,
});

// Google 로그인 함수
async function loginWithGoogle() {
  try {
    const response = await GoogleSignin.signIn();
    const { user } = response;
    if (user) {
      return { providerId: user.id.toString() };
    }
  } catch (error) {
    console.error('Google login error:', error);
  }
  return null;
}

// Naver 로그인 함수
async function loginWithNaver() {
  try {
    const { successResponse } = await NaverLogin.login();
    if (successResponse) {
      const accessToken = successResponse.accessToken;
      const profileResult = await NaverLogin.getProfile(accessToken);
      if (profileResult && profileResult.response) {
        return { providerId: profileResult.response.id.toString() };
      }
    }
  } catch (error) {
    console.error('Naver login error:', error);
  }
  return null;
}

// Kakao 로그인 함수
async function loginWithKakao() {
  try {
    await kakaoLogin();
    const userInfo = await getKakaoProfile();
    if (userInfo && userInfo.id) {
      return { providerId: userInfo.id.toString() };
    }
  } catch (error) {
    console.error('Kakao login error:', error.message || error);
  }
  return null;
}

// Apple 로그인 함수
async function loginWithApple() {
  if (Platform.OS !== 'ios') {
    console.log('Apple Login is only available on iOS.');
    return null;
  }
  if (!appleAuth.isSupported) {
    console.log('Apple Login is not supported on this device.');
    return null;
  }
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const { user, identityToken } = response;
    if (user && identityToken) {
      return { providerId: user };
    }
  } catch (error) {
    console.error('Apple login error:', error);
  }

  return null;
}

const Login2 = () => {
  const navigation = useNavigation();

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result) {
      const providerId = result.providerId;
      const provider = 'google';

      try {
        const response = await axios.post(
          'http://98.82.55.237/login/login_',
          {
            provider,
            providerId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.navigate('BottomNavigation');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigation.navigate('GetUserInfo', {
            provider,
            providerId,
          });
        } else {
          console.error('Login error:', error);
        }
      }
    }
  };

  const handleNaverLogin = async () => {
    const result = await loginWithNaver();
    if (result) {
      const providerId = result.providerId;
      const provider = 'naver';

      try {
        const response = await axios.post(
          'http://98.82.55.237/login/login_',
          {
            provider,
            providerId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.navigate('BottomNavigation');
      } catch (error) {
        if (error.response ) {
          navigation.navigate('GetUserInfo', {
            provider,
            providerId,
          });
        } else {
          console.error('Login error:', error);
        }
      }
    }
  };

  const handleKakaoLogin = async () => {
    const result = await loginWithKakao();
    if (result) {
      const providerId = result.providerId;
      const provider = 'kakao';
      try {
        const response = await axios.post(
          'http://98.82.55.237/login/login_',
          {
            provider,
            providerId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.navigate('BottomNavigation');
      } catch (error) {
        if (error.response ) {
          navigation.navigate('GetUserInfo', {
            provider,
            providerId,
          });
        } else {
          console.error('Login error:', error);
        }
      }
    }
  };

  const handleAppleLogin = async () => {
    const result = await loginWithApple();
    if (result) {
      const providerId = result.providerId;
      const provider = 'apple';

      try {
        const response = await axios.post(
          'http://98.82.55.237/login/login_',
          {
            provider,
            providerId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.navigate('BottomNavigation');
      } catch (error) {
        if (error.response) {
          navigation.navigate('GetUserInfo', {
            provider,
            providerId,
          });
        } else {
          console.error('Apple Login error:', error);
        }
      }
    }
  };

  return (
    <LinearGradient colors={['#7596FF', '#ffffff']} style={styles.linearGradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Image source={splashImage} style={styles.splashImage} />
            <Text style={styles.welcomeText1}>환영합니다!</Text>
            <Text style={styles.welcomeText2}>혹시 처음이신가요?</Text>
          </View>
          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#FFFDF8' }]}
              onPress={handleGoogleLogin}>
              <Image source={googleIcon} style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#222322' }]}>구글로 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#03C75A' }]}
              onPress={handleNaverLogin}>
              <Image source={naverIcon} style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>네이버로 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#FEE500' }]}
              onPress={handleKakaoLogin}>
              <Image source={kakaoIcon} style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#2A1C11' }]}>카카오로 로그인</Text>
            </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#000000' }]}
              onPress={handleAppleLogin}>
              <Image source={appleIcon} style={styles.appleicon} />
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Apple로 로그인</Text>
            </TouchableOpacity>
          )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 100 * height_ratio,
    marginLeft: 40 * width_ratio,
  },
  splashImage: {
    width: 100 * width_ratio,
    height: 50 * height_ratio,
    resizeMode: 'contain',
    marginBottom: 50 * height_ratio,
  },
  welcomeText1: {
    ...theme.fonts.Bold,
    fontSize: 30 * width_ratio,
    color: 'white',
  },
  welcomeText2: {
    ...theme.fonts.SemiBold,
    fontSize: 18 * width_ratio,
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30 * width_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200 * height_ratio,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60 * height_ratio,
    borderRadius: 30 * width_ratio,
    marginBottom: 12 * height_ratio,
    paddingLeft: 28 * width_ratio,
    paddingRight: 52 * width_ratio,
  },
  icon: {
    width: 24 * width_ratio,
    height: 24 * height_ratio,
    resizeMode: 'contain',
  },
  appleicon:{
    width: 45 * width_ratio,
    height: 45 * height_ratio,
    marginLeft: -10 *width_ratio,
  },
  buttonText: {
    flex: 1,
    ...theme.fonts.Medium,
    fontSize: 18 * width_ratio,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 2 * height_ratio,
  },
});

export default Login2;

