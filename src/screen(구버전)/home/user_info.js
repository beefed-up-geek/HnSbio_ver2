// src\screen(구버전)\home\user_info.js
import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import theme from '../../theme';
import axios from 'axios'; // axios to handle HTTP requests

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Get_User_Info_Two = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [selectedKidneyDisease, setSelectedKidneyDisease] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo !== null) {
          const userInfo = JSON.parse(storedUserInfo);
  
          // Format birthdate from 'YYYYMMDD' to 'YYYY/MM/DD'
          const formatBirthdate = (birthdate) => {
            if (birthdate && birthdate.length === 8) {
              return `${birthdate.slice(0, 4)}/${birthdate.slice(4, 6)}/${birthdate.slice(6)}`;
            }
            return birthdate || '';
          };
  
          setName(userInfo.name || '');
          setNickname(userInfo.nickname || '');
          setBirthdate(formatBirthdate(userInfo.birthdate));  // Use formatted birthdate
          setHeight(userInfo.height ? userInfo.height.toString() : '');
          setWeight(userInfo.weight ? userInfo.weight.toString() : '');
          setGender(userInfo.gender === 'male' ? 'male' : 'female');  // Handle gender icon
          setSelectedKidneyDisease(userInfo.kidneyInfo || null);
        }
      } catch (error) {
        console.error('Failed to load user info', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  useEffect(() => {
    validateForm();
  }, [name, nickname, birthdate, height, weight, gender]);

  const validateForm = () => {
    const currentYear = new Date().getFullYear();
    const [year, month, day] = birthdate.split('/').map(Number);

    if (
      name &&
      nickname &&
      height &&
      weight &&
      gender &&
      /^\d{4}\/\d{2}\/\d{2}$/.test(birthdate) &&
      year >= currentYear - 150 &&
      year <= currentYear &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSave = async () => {
    const currentYear = new Date().getFullYear();
    const [year, month, day] = birthdate.split('/').map(Number);
    let errorMessage = '';

    if (!name) {
      errorMessage += '이름을 입력해주세요.\n';
    }
    if (!nickname) {
      errorMessage += '닉네임을 입력해주세요.\n';
    }
    if (!height) {
      errorMessage += '키를 입력해주세요.\n';
    }
    if (!weight) {
      errorMessage += '체중을 입력해주세요.\n';
    }
    if (!gender) {
      errorMessage += '성별을 선택해주세요.\n';
    }
    if (!selectedKidneyDisease) {
      errorMessage += '신장병 상태를 선택해주세요.\n';
    }
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(birthdate)) {
      errorMessage += '생년월일 형식이 잘못되었습니다.\n';
    } else {
      if (year < currentYear - 150 || year > currentYear) {
        errorMessage += `생년월일의 연도는 ${
          currentYear - 150
        }년에서 ${currentYear}년 사이여야 합니다.\n`;
      }
      if (month < 1 || month > 12) {
        errorMessage += '생년월일의 월은 01에서 12 사이여야 합니다.\n';
      }
      if (day < 1 || day > 31) {
        errorMessage += '생년월일의 일은 01에서 31 사이여야 합니다.\n';
      }
    }

    if (errorMessage) {
      Alert.alert('입력 오류', errorMessage);
      return;
    }

    try {
      // AsyncStorage에서 providerId 가져오기
      const providerId = await AsyncStorage.getItem('userId');
      const loginMethod = await AsyncStorage.getItem('loginMethod');
      if (!providerId) {
        Alert.alert('오류', '사용자 ID를 찾을 수 없습니다.');
        return;
      }

      let provider = -1;
      if (loginMethod === 'kakao') {
        provider = 2;
      } else if (loginMethod === 'naver') {
        provider = 1;
      } else if (loginMethod === 'google') {
        provider = 0;
      }
      const userInfo = {
        providerId, // AsyncStorage에서 불러온 providerId 사용
        provider,
        name,
        nickname,
        birthdate,
        height,
        weight,
        gender,
        kidneyInfo: selectedKidneyDisease,
        email: 'your_email@example.com', // 고정된 이메일 사용
      };

      const AsyncUserInfo = {
        name,
        nickname,
        birthdate,
        height,
        weight,
        gender,
        kidneyInfo: selectedKidneyDisease,
        email: 'your_email@example.com', // 고정된 이메일 사용
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(AsyncUserInfo));


      // 서버에 업데이트 요청
      const response = await axios.post(
        'http://54.79.61.80:3000/login/update',
        userInfo,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('성공', '사용자 정보가 성공적으로 업데이트되었습니다.');
        // 정보 저장 후 화면 이동 (뒤로 가기 등)
        navigation.goBack();
      } else {
        Alert.alert('실패', '사용자 정보 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
    }
  };

  const handleHeightChange = value => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numValue)) {
      setHeight(numValue > 250 ? '250' : numValue.toString());
    } else {
      setHeight('');
    }
  };

  const handleWeightChange = value => {
    const regex = /^[0-9]{1,3}(\.[0-9]?)?$/;
    if (regex.test(value) || value === '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue <= 300) {
        setWeight(value);
      } else if (value === '') {
        setWeight('');
      }
    }
  };

  const handleBirthdateChange = value => {
    const cleaned = value.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + '/' + cleaned.slice(4);
    }
    if (cleaned.length > 6) {
      formatted = formatted.slice(0, 7) + '/' + cleaned.slice(6);
    }
    setBirthdate(formatted);
  };

  const handleNameChange = text => {
    if (text.length > 6) {
      setNameError('6자리 이내로 입력하세요');
      setName(text.slice(0, 6)); // 6자까지만 입력
    } else {
      setNameError('');
      setName(text);
    }
  };

  const handleNicknameChange = text => {
    if (text.length > 6) {
      setNicknameError('6자리 이내로 입력하세요');
      setNickname(text.slice(0, 6)); // 6자까지만 입력
    } else {
      setNicknameError('');
      setNickname(text);
    }
  };

  const handleKidneyDiseaseSelect = option => {
    setSelectedKidneyDisease(option);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.customHeaderContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../images/chevronArrowLeft.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>내 프로필</Text>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={20 * height_ratio}
        scrollEnabled={true}>
        <View style={styles.innerContainer}>
          <View style={styles.genderWrapper}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                onPress={() => setGender('female')}
                style={styles.genderButton}>
                <Image
                  source={require('../../images/login/female.png')}
                  style={[
                    styles.genderImageFemale,
                    gender === 'male' && styles.desaturated,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('male')}
                style={styles.genderButton}>
                <Image
                  source={require('../../images/login/male.png')}
                  style={[
                    styles.genderImageMale,
                    gender === 'female' && styles.desaturated,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                backgroundColor="#F1F1F1"
                placeholder="홍길동"
                placeholderTextColor="#828287"
                value={name}
                onChangeText={handleNameChange}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                backgroundColor="#F1F1F1"
                placeholder="6자리 이내로 입력"
                placeholderTextColor="#828287"
                value={nickname}
                onChangeText={handleNicknameChange}
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              style={styles.input}
              backgroundColor="#F1F1F1"
              placeholder="YYYY/MM/DD"
              placeholderTextColor="#828287"
              value={birthdate}
              onChangeText={handleBirthdateChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>키</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="0"
                  placeholderTextColor="#828287"
                  value={height}
                  onChangeText={handleHeightChange}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>체중</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="00.0"
                  placeholderTextColor="#828287"
                  value={weight}
                  onChangeText={handleWeightChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </View>

          <View style={styles.kidneyDiseaseWrapper}>
            <Text style={styles.label}>만성콩팥병 진단</Text>
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedKidneyDisease === '해당사항 없음' &&
                  styles.selectedButton,
              ]}
              onPress={() => handleKidneyDiseaseSelect('해당사항 없음')}>
              <Text
                style={[
                  styles.optionText,
                  selectedKidneyDisease === '해당사항 없음' &&
                    styles.selectedText,
                ]}>
                해당사항 없음
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedKidneyDisease === '만성콩팥병 (투석 전)' &&
                  styles.selectedButton,
              ]}
              onPress={() => handleKidneyDiseaseSelect('만성콩팥병 (투석 전)')}>
              <Text
                style={[
                  styles.optionText,
                  selectedKidneyDisease === '만성콩팥병 (투석 전)' &&
                    styles.selectedText,
                ]}>
                만성콩팥병 (투석 전)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedKidneyDisease === '혈액투석 중' &&
                  styles.selectedButton,
              ]}
              onPress={() => handleKidneyDiseaseSelect('혈액투석 중')}>
              <Text
                style={[
                  styles.optionText,
                  selectedKidneyDisease === '혈액투석 중' &&
                    styles.selectedText,
                ]}>
                혈액투석 중
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedKidneyDisease === '복막투석 중' &&
                  styles.selectedButton,
              ]}
              onPress={() => handleKidneyDiseaseSelect('복막투석 중')}>
              <Text
                style={[
                  styles.optionText,
                  selectedKidneyDisease === '복막투석 중' &&
                    styles.selectedText,
                ]}>
                복막투석 중
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedKidneyDisease === '신장 이식 받음' &&
                  styles.selectedButton,
              ]}
              onPress={() => handleKidneyDiseaseSelect('신장 이식 받음')}>
              <Text
                style={[
                  styles.optionText,
                  selectedKidneyDisease === '신장 이식 받음' &&
                    styles.selectedText,
                ]}>
                신장 이식 받음
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* 하단에 고정된 컨테이너 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          onPress={
            isFormValid
              ? handleSave
              : () =>
                  Alert.alert(
                    '입력 오류',
                    '모든 필드를 형식에 맞게 입력해주세요.',
                  )
          }
          style={[
            styles.button,
            isFormValid ? styles.buttonEnabled : styles.buttonDisabled,
          ]}>
          <Text
            style={[
              styles.buttonText,
              isFormValid
                ? styles.buttonTextEnabled
                : styles.buttonTextDisabled,
            ]}>
            저장
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100 * height_ratio,
  },
  innerContainer: {
    paddingTop: 20 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    alignItems: 'center',
  },
  customHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20 * height_ratio, // Adjusted for space at the top
    paddingBottom: 10 * height_ratio, // Ensure there's enough space below
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 20, // Ensure the button is positioned correctly on the left
  },
  backButtonImage: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
  },
  title: {
    fontSize: 20 * width_ratio,
    ...theme.fonts.Bold,
    color: 'black',
    textAlign: 'center',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    borderRadius: 13 * width_ratio,
    paddingRight: 24 * width_ratio,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 8 * width_ratio,
    marginBottom: 24 * height_ratio,
  },
  inputGroupFullWidth: {
    width: '100%',
    marginBottom: 24 * height_ratio,
  },
  label: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
    marginBottom: 12 * height_ratio,
    color: 'black',
  },
  input: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 13 * width_ratio,
    paddingVertical: 17 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
    color: 'black',
  },
  unit: {
    fontSize: 16 * width_ratio,
    color: '#828287',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8 * width_ratio,
  },
  fixedButtonContainer: {
    paddingVertical: 20 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#EDEDED',
    width: '100%',
  },
  button: {
    paddingVertical: 17 * height_ratio,
    borderRadius: 24 * width_ratio,
    alignItems: 'center',
    width: '100%',
  },
  buttonEnabled: {
    backgroundColor: '#EBEFFE',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Bold,
  },
  buttonTextEnabled: {
    color: '#7596FF',
  },
  buttonTextDisabled: {
    color: '#828287',
  },
  genderWrapper: {
    width: '100%',
    marginBottom: 24 * height_ratio,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    alignItems: 'center',
    padding: 10 * width_ratio,
  },
  genderImageFemale: {
    marginLeft: 26 * width_ratio,
    width: 109 * width_ratio,
    height: 117.63 * height_ratio,
    resizeMode: 'contain',
  },
  genderImageMale: {
    marginTop: 17 * height_ratio,
    marginRight: 28 * width_ratio,
    width: 102 * width_ratio,
    height: 101 * height_ratio,
    resizeMode: 'contain',
  },
  desaturated: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 12 * width_ratio,
    marginTop: 4 * height_ratio,
  },
  kidneyDiseaseWrapper: {
    width: '100%',
    marginTop: 20 * height_ratio,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    borderRadius: 12 * width_ratio,
    marginVertical: 8 * height_ratio,
  },
  selectedButton: {
    backgroundColor: '#7596FF',
  },
  optionText: {
    fontSize: 16 * width_ratio,
    color: '#666666',
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});

export default Get_User_Info_Two;
