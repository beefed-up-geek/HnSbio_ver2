// src/screens/login/login.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import theme from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import splashImage from '../../images/login/splash2.png';
import naverIcon from '../../images/login/naver.png';
import kakaoIcon from '../../images/login/kakao.png';
import googleIcon from '../../images/login/google.png';
import { login as kakaoLogin, me as getKakaoProfile } from '@react-native-kakao/user';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import NaverLogin from '@react-native-seoul/naver-login';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; 
import defaultUserImage from '../../images/login/defualt_user.png';


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
}

// Naver 로그인 함수
async function loginWithNaver() {
  try {
    const { successResponse, failureResponse } = await NaverLogin.login();
    if (successResponse) {
      const accessToken = successResponse.accessToken;
      const profileResult = await NaverLogin.getProfile(accessToken);
      if (profileResult && profileResult.response) {
        return { providerId: profileResult.response.id.toString() };
      }
    } else if (failureResponse) {
      console.error('Naver login failed:', failureResponse);
    }
  } catch (error) {
    console.error('Naver login error:', error);
  }
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
}

const Login2 = () => {
  const [providerId, setProviderId] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [inputPhase, setInputPhase] = useState('name'); // 'name' 또는 'birthdate'
  const [showInputBox, setShowInputBox] = useState(false);
  const [show404Modal, setShow404Modal] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [provider, setProvider] = useState('');
  const [accountData, setAccountData] = useState([]);
  const [modalExpanded, setModalExpanded] = useState(false);
  const [noAccountMessage, setNoAccountMessage] = useState(false); // New state for "No Account" message
  const [birthdatePlaceholder, setBirthdatePlaceholder] = useState('');

  const slideAnimation = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const modalHeight = useRef(new Animated.Value(260 * height_ratio)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    setBirthdatePlaceholder(`${year}/${month}/${day}`);

    const backAction = () => {
      if (showInputBox) {
        handleCloseInputBox();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showInputBox]);

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result) {
      setProviderId(result.providerId);
      setProvider('google');
      handleOpenInputBox();
      console.log('google login pushed: ', providerId);
    }
  };

  const handleNaverLogin = async () => {
    const result = await loginWithNaver();
    if (result) {
      setProviderId(result.providerId);
      setProvider('naver');
      handleOpenInputBox();
      console.log('naver login pushed: ', providerId);
    }
  };

  const handleKakaoLogin = async () => {
    const result = await loginWithKakao();
    if (result) {
      setProviderId(result.providerId);
      setProvider('kakao');
      handleOpenInputBox();
      console.log('kakao login pushed: ', providerId);
    }
  };

  const handleOpenInputBox = () => {
    setName('');
    setBirthdate('');
    setInputPhase('name');
    setShowInputBox(true);
    setNameError(false); 
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundFade, {
        toValue: 0.5,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseInputBox = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: Dimensions.get('window').height,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundFade, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowInputBox(false);
      setBirthdateError(false);
      setNoAccountMessage(false); // Hide message when closed
    });
    Keyboard.dismiss();
  };

  const handleBirthdateChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + '/' + cleaned.slice(4);
    }
    if (cleaned.length > 6) {
      formatted = formatted.slice(0, 7) + '/' + cleaned.slice(6);
    }
    setBirthdate(formatted);
  };

  const handleInputSubmit = async () => {
    if (inputPhase === 'name') {
      if (name.trim() === '') {
        setNameError(true);
      } else {
        setNameError(false);
        setInputPhase('birthdate'); // Move to the birthdate input phase
      }
    } else if (inputPhase === 'birthdate') {
      // Only check for errors on submission, not while typing
      if (birthdate.length !== 10) {
        setBirthdateError(true);
      } else {
        setBirthdateError(false);
        try {
          const response = await axios.post(
            'http://54.79.61.80:5000/login/login',
            {
              name,
              provider,
              provider_id: providerId,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          await AsyncStorage.setItem('loginData', JSON.stringify(response.data));
          navigation.navigate('BottomNavigation');
        } catch (error) {
          handle404();
        }
        handleCloseInputBox();
      }
    }
  };

  const handle404 = () => {
    setShow404Modal(true);
  };
  const close404Modal = () => {
    setShow404Modal(false);
    setModalExpanded(false);
    modalHeight.setValue(200 * height_ratio);
  };

  const navigateToGetUserInfo = () => {
    setShow404Modal(false);
    navigation.navigate('GetUserInfo', {
      name,
      birthdate,
      provider,
      providerId,
    });
  };

  const findOtherAccounts = async () => {
    try {
      const response = await axios.post(
        'http://54.79.61.80:5000/login/find_other_account',
        { name, birthdate },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.length === 0) {
        setNoAccountMessage(true); // Show message if no accounts found
        setAccountData([]); // Clear any previous account data
      } else {
        setAccountData(response.data);
        setNoAccountMessage(false); // Hide message if accounts are found
        setModalExpanded(true);
        Animated.timing(modalHeight, {
          toValue: 400 * height_ratio, // Expanded height
          duration: 500,
          useNativeDriver: false,
        }).start();
      }

    } catch (error) {
      console.error('Error finding accounts:', error);
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
          </View>
        </ScrollView>
  
        {showInputBox && (
          <>
            <TouchableWithoutFeedback onPress={handleCloseInputBox}>
              <Animated.View style={[styles.overlay, { opacity: backgroundFade }]} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.inputContainer, { transform: [{ translateY: slideAnimation }] }]}>
              {inputPhase === 'name' ? (
                <>
                  <Text style={[styles.promptText, { color: nameError ? 'red' : '#333' }]}>
                    이름을 입력해주세요.
                  </Text>
                  <TextInput
                    style={[styles.input, nameError && { borderColor: 'red' }]}
                    placeholder="홍길동"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setNameError(false);
                    }}
                    onSubmitEditing={handleInputSubmit}
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleInputSubmit}>
                    <Text style={styles.submitButtonText}>입력</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.promptText, { color: birthdateError ? 'red' : '#333' }]}>
                    {birthdateError ? '8자리 생년월일을 정확히 입력해주세요' : '생년월일을 입력하세요:'}
                  </Text>
                  <TextInput
                    style={[styles.input, birthdateError && { borderColor: 'red' }]}
                    placeholder={birthdatePlaceholder}
                    placeholderTextColor="#999"
                    value={birthdate}
                    onChangeText={handleBirthdateChange}
                    onSubmitEditing={handleInputSubmit}
                    keyboardType="numeric"
                    maxLength={10} 
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleInputSubmit}>
                    <Text style={styles.submitButtonText}>입력</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </>
        )}
  
        {show404Modal && (
          <>
            <TouchableWithoutFeedback onPress={close404Modal}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, { height: modalHeight }]}>
              <Text style={styles.modalSmallText}>이번이 처음이신가요?</Text>
              <TouchableOpacity style={[styles.modalButton, styles.signupButton]} onPress={navigateToGetUserInfo}>
                <Text style={styles.buttonText}>회원가입하기</Text>
              </TouchableOpacity>
              <Text style={styles.modalSmallText}>벌써 계정이 있으신가요?</Text>
              <TouchableOpacity style={[styles.modalButton, styles.findAccountButton]} onPress={findOtherAccounts}>
                <Text style={styles.buttonText}>내 계정 찾아보기</Text>
              </TouchableOpacity>
              
              {noAccountMessage && (
                <Text style={styles.noAccountText}>계정 정보가 없습니다</Text>
              )}

              {modalExpanded && (
                <ScrollView style={styles.accountList}>
                  <Text style={styles.modalSmallText}>이 중에 회원님의 계정이 있다면,</Text>
                  <Text style={styles.modalSmallText}>다시 로그인을 시도해주세요.</Text>
                  {accountData.map((account) => (
                    <View key={account._id} style={styles.accountCard}>
                    <Image
                      source={
                        account.profile_image
                          ? { uri: `data:image/png;base64,${account.profile_image}` }
                          : defaultUserImage
                      }
                      style={styles.accountImage}
                    />
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountText}>이름: {account.name}</Text>
                      <Text style={styles.accountText}>계정: {account.provider}</Text>
                      <Text style={styles.accountText}>닉네임: {account.nickname}</Text>
                      <Text style={styles.accountText}>생성 날짜: {account.createdAt}</Text>
                    </View>
                  </View>
                  ))}
                </ScrollView>
              )}
            </Animated.View>
          </>
        )}
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
    marginTop: 234 * height_ratio,
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
  buttonText: {
    flex: 1,
    ...theme.fonts.Medium,
    fontSize: 18 * width_ratio,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 2 * height_ratio,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 20 * height_ratio,
    paddingHorizontal: 16 * width_ratio,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  promptText: {
    fontSize: 16 * width_ratio,
    marginBottom: 10 * height_ratio,
    ...theme.fonts.Regular,
  },
  input: {
    width: '90%',
    padding: 10 * width_ratio,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16 * width_ratio,
    marginBottom: 10 * height_ratio,
    textAlign: 'center',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#7596FF',
    borderRadius: 8,
    paddingVertical: 10 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
  },
  modalContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalSmallText: {
    fontSize: 14 * width_ratio,
    ...theme.fonts.Regular,
    color: '#333',
    marginBottom: 8 * height_ratio,
    textAlign: 'left', // Aligns text to the left
    alignSelf: 'flex-start', // Ensures alignment is left within the modal
  },
  modalButton: {
    width: '80%',
    height: 40 * height_ratio,
    borderRadius: 30 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * height_ratio,
  },
  signupButton: {
    backgroundColor: '#7596FF', // Blue color for "회원가입"
  },
  findAccountButton: {
    backgroundColor: '#AAAAAA', // Gray color for "내 계정 찾기"
  },
  noAccountText: {
    color: 'red',
    fontSize: 14 * width_ratio,
    textAlign: 'center',
    ...theme.fonts.Regular,
  },
  accountList: {
    width: '100%',
    marginTop: 20 * height_ratio, // Space between button and account list
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12 * height_ratio,
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Rounded corners for each card
    marginBottom: 12 * height_ratio,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '95%', // Slightly smaller width for spacing within modal
    alignSelf: 'center', // Center align within modal
  },
  accountImage: {
    width: 50 * width_ratio,
    height: 50 * height_ratio,
    borderRadius: 25 * width_ratio,
    marginRight: 15 * width_ratio,
  },
  accountInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  accountText: {
    fontSize: 14 * width_ratio,
    color: '#333',
    marginBottom: 2 * height_ratio,
    ...theme.fonts.Regular,
  },
});

export default Login2;
