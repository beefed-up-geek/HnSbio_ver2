// src\screen(구버전)\login\get_usr_info.js
import React, {useState, useEffect, useRef} from 'react';
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
  ScrollView,
  KeyboardAvoidingView,
  Keyboard, // 추가된 부분
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Get_User_Info = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [nameTextAlign, setNameTextAlign] = useState('center');
  const [nicknameTextAlign, setNicknameTextAlign] = useState('center');
  const [birthdateTextAlign, setBirthdateTextAlign] = useState('center');
  const [heightTextAlign, setHeightTextAlign] = useState('center');
  const [weightTextAlign, setWeightTextAlign] = useState('center');

  const navigation = useNavigation();

  // 추가된 부분: 각 TextInput에 대한 참조 생성
  const nameInputRef = useRef(null);
  const nicknameInputRef = useRef(null);
  const birthdateInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo !== null) {
          const userInfo = JSON.parse(storedUserInfo);
          setName(userInfo.name || '');
          setNickname(userInfo.nickname || '');
        } else {
          const userId = await AsyncStorage.getItem('userId');
          const username = await AsyncStorage.getItem('username');
          if (username !== null) {
            setName(username);
            setNickname(userId);
          }
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

    // 이름과 닉네임의 앞뒤 공백 및 줄바꿈 제거
    const trimmedName = name.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedName) {
      errorMessage += '이름을 입력해주세요.\n';
    }
    if (!trimmedNickname) {
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
      //Alert.alert('입력 오류', errorMessage);
      return;
    }

    const userInfo = {
      name: trimmedName,
      nickname: trimmedNickname,
      birthdate,
      height,
      weight,
      gender,
    };
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('<<< Get_User_Info화면 사용자 정보 저장됨 >>>');
      console.log(await AsyncStorage.getItem('userInfo'));
      navigation.navigate('GetKidneyInfo'); // Navigate to GetKidneyInfo screen
    } catch (error) {
      //Alert.alert('사용자 정보 저장 실패');
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

  const handleFocus = inputName => {
    let yOffset = 0;
    switch (inputName) {
      case 'name':
        yOffset = 0;
        break;
      case 'nickname':
        yOffset = 100 * height_ratio;
        break;
      case 'birthdate':
        yOffset = 200 * height_ratio;
        break;
      case 'height':
        yOffset = 300 * height_ratio;
        break;
      case 'weight':
        yOffset = 400 * height_ratio;
        break;
      default:
        yOffset = 0;
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: yOffset, animated: true});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            더 정확한 건강 관리를 위해 {'\n'}기본 정보를 알려주세요
          </Text>

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
                    gender !== 'female' && styles.desaturated,
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
                    gender !== 'male' && styles.desaturated,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                ref={nameInputRef} // 추가된 부분
                style={styles.input}
                backgroundColor="#F1F1F1"
                placeholder="홍길동"
                placeholderTextColor="#828287"
                value={name}
                onChangeText={setName}
                textAlign={name ? 'left' : nameTextAlign} // Placeholder centered, text left
                onFocus={() => setNameTextAlign('left')}
                onBlur={() => !name && setNameTextAlign('center')}
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  nicknameInputRef.current && nicknameInputRef.current.focus()
                } // 추가된 부분
                returnKeyType="next" // 추가된 부분
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                ref={nicknameInputRef} // 추가된 부분
                style={styles.nickname_input}
                backgroundColor="#F1F1F1"
                placeholder="6자리 이내로 입력"
                placeholderTextColor="#828287"
                value={nickname}
                onChangeText={setNickname}
                textAlign={nickname ? 'left' : nicknameTextAlign} // Placeholder centered, text left
                onFocus={() => setNicknameTextAlign('left')}
                onBlur={() => !nickname && setNicknameTextAlign('center')}
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  birthdateInputRef.current && birthdateInputRef.current.focus()
                } // 추가된 부분
                returnKeyType="next" // 추가된 부분
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              ref={birthdateInputRef} // 추가된 부분
              style={styles.input}
              backgroundColor="#F1F1F1"
              placeholder="YYYY/MM/DD"
              placeholderTextColor="#828287"
              value={birthdate}
              onChangeText={handleBirthdateChange}
              keyboardType="numeric"
              maxLength={10}
              textAlign={birthdate ? 'left' : birthdateTextAlign} // Placeholder centered, text left
              onFocus={() => setBirthdateTextAlign('left')}
              onBlur={() => !birthdate && setBirthdateTextAlign('center')}
              blurOnSubmit={false}
              onSubmitEditing={() =>
                heightInputRef.current && heightInputRef.current.focus()
              } // 추가된 부분
              returnKeyType="next" // 추가된 부분
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>키</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  ref={heightInputRef} // 추가된 부분
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="0"
                  placeholderTextColor="#828287"
                  value={height}
                  onChangeText={handleHeightChange}
                  keyboardType="numeric"
                  maxLength={3}
                  textAlign={height ? 'left' : heightTextAlign} // Placeholder centered, text left
                  onFocus={() => setHeightTextAlign('left')}
                  onBlur={() => !height && setHeightTextAlign('center')}
                  blurOnSubmit={false}
                  onSubmitEditing={() =>
                    weightInputRef.current && weightInputRef.current.focus()
                  } // 추가된 부분
                  returnKeyType="next" // 추가된 부분
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>체중</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  ref={weightInputRef} // 추가된 부분
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="00.0"
                  placeholderTextColor="#828287"
                  value={weight}
                  onChangeText={handleWeightChange}
                  keyboardType="numeric"
                  maxLength={5}
                  textAlign={weight ? 'left' : weightTextAlign} // Placeholder centered, text left
                  onFocus={() => setWeightTextAlign('left')}
                  onBlur={() => !weight && setWeightTextAlign('center')}
                  onSubmitEditing={() => Keyboard.dismiss()} // 추가된 부분
                  returnKeyType="done" // 추가된 부분
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            // onPress={
            //   isFormValid
            //     ? handleSave
            //     : () =>
            //         Alert.alert(
            //            '입력 오류',
            //            '모든 필드를 형식에 맞게 입력해주세요.',
            //          )
            // }
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
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 100 * height_ratio, // Ensure there's space for the button
  },
  innerContainer: {
    paddingTop: 80 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    alignItems: 'center',
  },
  title: {
    marginLeft: 4 * width_ratio,
    fontSize: 20 * width_ratio,
    marginLeft: 4 * width_ratio,
    fontSize: 20 * width_ratio,
    ...theme.fonts.Bold,
    marginBottom: 50 * height_ratio,
    color: '#49494F',
    alignSelf: 'flex-start',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    borderRadius: 13 * width_ratio,
    paddingRight: 24 * width_ratio,
    borderRadius: 13 * width_ratio,
    paddingRight: 24 * width_ratio,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 8 * width_ratio,
    marginBottom: 24 * height_ratio,
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
  nickname_input: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 13 * width_ratio,
    paddingVertical: 17 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    fontSize: 14 * width_ratio,
    ...theme.fonts.Regular,
    color: 'black',
  },
  unit: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
    color: '#828287',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8 * width_ratio,
    marginHorizontal: -8 * width_ratio,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 10 * height_ratio,
    paddingBottom: 20 * height_ratio,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 17 * height_ratio,
    borderRadius: 24 * width_ratio,
    paddingVertical: 17 * height_ratio,
    borderRadius: 24 * width_ratio,
    alignItems: 'center',
    width: '66.67%',
  },
  buttonEnabled: {
    backgroundColor: '#EBEFFE',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16 * width_ratio,
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
    marginBottom: 24 * height_ratio,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    alignItems: 'center',
    padding: 10 * width_ratio,
    padding: 10 * width_ratio,
  },
  genderImageFemale: {
    marginLeft: 26 * width_ratio,
    width: 109 * width_ratio,
    height: 117.63 * height_ratio,
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
});

export default Get_User_Info;
