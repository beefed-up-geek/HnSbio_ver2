// src\screens\login\get_usr_info.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Get_User_Info = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Destructure initial values from route.params
  const {
    provider,
    providerId,
  } = route.params || {};

  // State variables initialized with received values
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

  // References for scrolling to each input
  const nameInputRef = useRef(null);
  const nicknameInputRef = useRef(null);
  const birthdateInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Form 유효성 검사
    validateForm();
  }, [name, nickname, birthdate, height, weight, gender, birthdate]);
  

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

  const handleSave = () => {
    let errorMessage = '';

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
    }

    if (errorMessage) {
      Alert.alert('입력 오류', errorMessage);
      return;
    }

    // Navigate to the next screen with all parameters
    navigation.navigate('GetKidneyInfo', {
      name: trimmedName,
      nickname: trimmedNickname,
      birthdate,
      height,
      weight,
      gender,
      provider,
      providerId,
    });
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
      setName(text.slice(0, 6));
    } else {
      setNameError('');
      setName(text);
    }
  };

  const handleNicknameChange = text => {
    if (text.length > 6) {
      setNicknameError('6자리 이내로 입력하세요');
      setNickname(text.slice(0, 6));
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
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref = {scrollViewRef}
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
                ref={nameInputRef}
                style={styles.input}
                backgroundColor="#F1F1F1"
                placeholder="홍길동"
                placeholderTextColor="#828287"
                value={name}
                onChangeText={handleNameChange}
                textAlign={name ? 'left' : nameTextAlign}
                onFocus={() => setNameTextAlign('left')}
                onBlur={() => !name && setNameTextAlign('center')}
                blurOnSubmit={false}
                onSubmitEditing={() => nicknameInputRef.current && nicknameInputRef.current.focus()}
                returnKeyType="next"
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                ref={nicknameInputRef}
                style={styles.input}
                backgroundColor="#F1F1F1"
                placeholder="6자리 이내"
                placeholderTextColor="#828287"
                value={nickname}
                onChangeText={handleNicknameChange}
                textAlign={nickname ? 'left' : nicknameTextAlign}
                onFocus={() => setNicknameTextAlign('left')}
                onBlur={() => !nickname && setNicknameTextAlign('center')}
                blurOnSubmit={false}
                onSubmitEditing={() => birthdateInputRef.current && birthdateInputRef.current.focus()}
                returnKeyType="next"
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              ref={birthdateInputRef}
              style={styles.input}
              backgroundColor="#F1F1F1"
              placeholder="YYYY/MM/DD"
              placeholderTextColor="#828287"
              value={birthdate}
              onChangeText={handleBirthdateChange}
              keyboardType="numeric"
              maxLength={10}
              textAlign={birthdate ? 'left' : birthdateTextAlign}
              onFocus={() => setBirthdateTextAlign('left')}
              onBlur={() => !birthdate && setBirthdateTextAlign('center')}
              blurOnSubmit={false}
              onSubmitEditing={() => heightInputRef.current && heightInputRef.current.focus()}
              returnKeyType="next"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>키</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  ref={heightInputRef}
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="0"
                  placeholderTextColor="#828287"
                  value={height}
                  onChangeText={handleHeightChange}
                  keyboardType="numeric"
                  maxLength={3}
                  textAlign={height ? 'left' : heightTextAlign}
                  onFocus={() => setHeightTextAlign('left')}
                  onBlur={() => !height && setHeightTextAlign('center')}
                  blurOnSubmit={false}
                  onSubmitEditing={() => weightInputRef.current && weightInputRef.current.focus()}
                  returnKeyType="next"
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>체중</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  ref={weightInputRef}
                  style={styles.input}
                  backgroundColor="#F1F1F1"
                  placeholder="00.0"
                  placeholderTextColor="#828287"
                  value={weight}
                  onChangeText={handleWeightChange}
                  keyboardType="numeric"
                  maxLength={5}
                  textAlign={weight ? 'left' : weightTextAlign}
                  onFocus={() => setWeightTextAlign('left')}
                  onBlur={() => !weight && setWeightTextAlign('center')}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType="done"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </View>
        </View>
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
    ...theme.fonts.Bold,
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
