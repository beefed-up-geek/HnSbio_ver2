// src/screens/login/get_usr_info.js
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
// 만약 KeyboardAwareScrollView를 적극 활용하고 싶다면 활성화
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Get_User_Info = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Destructure initial values from route.params
  const { provider, providerId } = route.params || {};

  // State variables
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // 에러 상태
  const [genderError, setGenderError] = useState(false);
  const [nameHasError, setNameHasError] = useState(false);
  const [nicknameHasError, setNicknameHasError] = useState(false);
  const [birthdateHasError, setBirthdateHasError] = useState(false);
  const [heightHasError, setHeightHasError] = useState(false);
  const [weightHasError, setWeightHasError] = useState(false);

  // 길이 제한 에러 메시지
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // placeholder alignment states
  const [nameTextAlign, setNameTextAlign] = useState('center');
  const [nicknameTextAlign, setNicknameTextAlign] = useState('center');
  const [birthdateTextAlign, setBirthdateTextAlign] = useState('center');
  const [heightTextAlign, setHeightTextAlign] = useState('center');
  const [weightTextAlign, setWeightTextAlign] = useState('center');

  // Refs
  const nameInputRef = useRef(null);
  const nicknameInputRef = useRef(null);
  const birthdateInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  // 유효성 검사
  useEffect(() => {
    validateForm();
  }, [name, nickname, birthdate, height, weight, gender]);

  const validateForm = () => {
    const currentYear = new Date().getFullYear();
    const birthdateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    let isValid = true;

    if (!name.trim()) isValid = false;
    if (!nickname.trim()) isValid = false;
    if (!height) isValid = false;
    if (!weight) isValid = false;
    if (!gender) isValid = false;

    // 생년월일 형식 검사
    if (!birthdateRegex.test(birthdate)) {
      isValid = false;
    } else {
      const [year, month, day] = birthdate.split('/').map(Number);
      if (
        year < currentYear - 150 ||
        year > currentYear ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        isValid = false;
      }
    }
    setIsFormValid(isValid);
  };

  // "다음" 버튼 클릭시 에러 체크
  const handleSave = () => {
    let errorMessage = '';

    setGenderError(false);
    setNameHasError(false);
    setNicknameHasError(false);
    setBirthdateHasError(false);
    setHeightHasError(false);
    setWeightHasError(false);

    const trimmedName = name.trim();
    const trimmedNickname = nickname.trim();
    const birthdateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    const currentYear = new Date().getFullYear();

    // 성별
    if (!gender) {
      setGenderError(true);
      errorMessage += '성별을 선택해주세요.\n';
    }

    // 이름
    if (!trimmedName) {
      setNameHasError(true);
      errorMessage += '이름을 입력해주세요.\n';
    }

    // 닉네임
    if (!trimmedNickname) {
      setNicknameHasError(true);
      errorMessage += '닉네임을 입력해주세요.\n';
    }

    // 생년월일
    if (!birthdate) {
      setBirthdateHasError(true);
      errorMessage += '생년월일을 입력해주세요.\n';
    } else {
      if (!birthdateRegex.test(birthdate)) {
        setBirthdateHasError(true);
        errorMessage +=
          '생년월일 형식이 잘못되었습니다. YYYY/MM/DD 형식으로 입력해주세요.\n';
      } else {
        const [year, month, day] = birthdate.split('/').map(Number);
        if (year < currentYear - 150 || year > currentYear) {
          setBirthdateHasError(true);
          errorMessage += '생년월일의 년도가 유효하지 않습니다.\n';
        }
        if (month < 1 || month > 12) {
          setBirthdateHasError(true);
          errorMessage += '생년월일의 월이 유효하지 않습니다.\n';
        }
        if (day < 1 || day > 31) {
          setBirthdateHasError(true);
          errorMessage += '생년월일의 일이 유효하지 않습니다.\n';
        }
      }
    }

    // 키
    if (!height) {
      setHeightHasError(true);
      errorMessage += '키를 입력해주세요.\n';
    } else {
      const numHeight = parseInt(height, 10);
      if (isNaN(numHeight) || numHeight < 30 || numHeight > 250) {
        setHeightHasError(true);
        errorMessage += '키를 올바르게 입력해주세요.\n';
      }
    }

    // 체중
    if (!weight) {
      setWeightHasError(true);
      errorMessage += '체중을 입력해주세요.\n';
    } else {
      const numWeight = parseFloat(weight);
      if (isNaN(numWeight) || numWeight < 2 || numWeight > 300) {
        setWeightHasError(true);
        errorMessage += '체중을 올바르게 입력해주세요.\n';
      }
    }

    if (errorMessage) {
      Alert.alert('입력 오류', errorMessage);
      return;
    }

    // 모든 입력이 정상인 경우, 다음 화면으로 이동
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

  // 각 입력값 onChangeText
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

  // 이름, 닉네임 글자수 제한
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

  // 포커스시 스크롤 처리 & 에러 해제
  const handleFocus = inputName => {
    let yOffset = 0;
    switch (inputName) {
      case 'name':
        yOffset = 0;
        setNameHasError(false);
        break;
      case 'nickname':
        yOffset = 100 * height_ratio;
        setNicknameHasError(false);
        break;
      case 'birthdate':
        yOffset = 200 * height_ratio;
        setBirthdateHasError(false);
        break;
      case 'height':
        yOffset = 300 * height_ratio;
        setHeightHasError(false);
        break;
      case 'weight':
        yOffset = 400 * height_ratio;
        setWeightHasError(false);
        break;
      default:
        yOffset = 0;
    }
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  return (
    /**
     * KeyboardAvoidingView로 감싸, 키보드가 올라올 때
     * padding/position으로 화면이 살짝 위로 올라가도록 처리
     */
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/*
        ScrollView (또는 KeyboardAwareScrollView)로 감싸
        인풋이 많아도 스크롤 가능하도록
      */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            더 정확한 건강 관리를 위해{'\n'}기본 정보를 알려주세요
          </Text>

          {/* 성별 아이콘 */}
          <View style={styles.genderWrapper}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              {/* 여성 아이콘 */}
              <TouchableOpacity
                onPress={() => {
                  setGender('female');
                  setGenderError(false);
                }}
                style={styles.genderButton}
              >
                <Image
                  source={
                    genderError
                      ? require('../../images/login/female_blurred_error.png')
                      : gender === 'female'
                      ? require('../../images/login/female_selected.png')
                      : require('../../images/login/female_blurred.png')
                  }
                  style={styles.genderImageFemale}
                />
              </TouchableOpacity>

              {/* 남성 아이콘 */}
              <TouchableOpacity
                onPress={() => {
                  setGender('male');
                  setGenderError(false);
                }}
                style={styles.genderButton}
              >
                <Image
                  source={
                    genderError
                      ? require('../../images/login/male_blurred_error.png')
                      : gender === 'male'
                      ? require('../../images/login/male_selected.png')
                      : require('../../images/login/male_blurred.png')
                  }
                  style={styles.genderImageMale}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 이름, 닉네임 */}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                ref={nameInputRef}
                style={[
                  styles.input,
                  nameHasError && styles.errorInput,
                ]}
                backgroundColor="#F1F1F1"
                placeholder="홍길동"
                placeholderTextColor="#828287"
                value={name}
                onChangeText={handleNameChange}
                textAlign={name ? 'left' : nameTextAlign}
                onFocus={() => {
                  setNameTextAlign('left');
                  handleFocus('name');
                }}
                onBlur={() => {
                  if (!name) setNameTextAlign('center');
                }}
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  nicknameInputRef.current && nicknameInputRef.current.focus()
                }
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
                style={[
                  styles.input,
                  nicknameHasError && styles.errorInput,
                ]}
                backgroundColor="#F1F1F1"
                placeholder="6자리 이내"
                placeholderTextColor="#828287"
                value={nickname}
                onChangeText={handleNicknameChange}
                textAlign={nickname ? 'left' : nicknameTextAlign}
                onFocus={() => {
                  setNicknameTextAlign('left');
                  handleFocus('nickname');
                }}
                onBlur={() => {
                  if (!nickname) setNicknameTextAlign('center');
                }}
                blurOnSubmit={false}
                onSubmitEditing={() =>
                  birthdateInputRef.current && birthdateInputRef.current.focus()
                }
                returnKeyType="next"
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : null}
            </View>
          </View>

          {/* 생년월일 */}
          <View style={styles.inputGroupFullWidth}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              ref={birthdateInputRef}
              style={[
                styles.input,
                birthdateHasError && styles.errorInput,
              ]}
              backgroundColor="#F1F1F1"
              placeholder="YYYY/MM/DD"
              placeholderTextColor="#828287"
              value={birthdate}
              onChangeText={handleBirthdateChange}
              keyboardType="numeric"
              maxLength={10}
              textAlign={birthdate ? 'left' : birthdateTextAlign}
              onFocus={() => {
                setBirthdateTextAlign('left');
                handleFocus('birthdate');
              }}
              onBlur={() => {
                if (!birthdate) setBirthdateTextAlign('center');
              }}
              blurOnSubmit={false}
              onSubmitEditing={() =>
                heightInputRef.current && heightInputRef.current.focus()
              }
              returnKeyType="next"
            />
          </View>

          {/* 키, 체중 */}
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>키</Text>
              <View
                style={[
                  styles.inputWithUnit,
                  heightHasError && styles.errorInput,
                ]}
              >
                <TextInput
                  ref={heightInputRef}
                  style={[styles.inputUnit]}
                  backgroundColor="#F1F1F1"
                  placeholder="0"
                  placeholderTextColor="#828287"
                  value={height}
                  onChangeText={handleHeightChange}
                  keyboardType="numeric"
                  maxLength={3}
                  textAlign={height ? 'left' : heightTextAlign}
                  onFocus={() => {
                    setHeightTextAlign('left');
                    handleFocus('height');
                  }}
                  onBlur={() => {
                    if (!height) setHeightTextAlign('center');
                  }}
                  blurOnSubmit={false}
                  onSubmitEditing={() =>
                    weightInputRef.current && weightInputRef.current.focus()
                  }
                  returnKeyType="next"
                />
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>체중</Text>
              <View
                style={[
                  styles.inputWithUnit,
                  weightHasError && styles.errorInput,
                ]}
              >
                <TextInput
                  ref={weightInputRef}
                  style={[styles.inputUnit]}
                  backgroundColor="#F1F1F1"
                  placeholder="00.0"
                  placeholderTextColor="#828287"
                  value={weight}
                  onChangeText={handleWeightChange}
                  keyboardType="numeric"
                  maxLength={5}
                  textAlign={weight ? 'left' : weightTextAlign}
                  onFocus={() => {
                    setWeightTextAlign('left');
                    handleFocus('weight');
                  }}
                  onBlur={() => {
                    if (!weight) setWeightTextAlign('center');
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType="done"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          </View>

          {/* 아래 여백을 좀 주면 스크롤이 끝나도 버튼 영역이 겹치지 않음 */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/** 
       * 하단 고정 버튼 
       * position: 'absolute'로 화면 하단에 고정  
       */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.button,
            isFormValid ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              isFormValid ? styles.buttonTextEnabled : styles.buttonTextDisabled,
            ]}
          >
            다음
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
    // 키보드 때문에 스크롤이 필요할 수 있으므로 flexGrow: 1
    flexGrow: 1,
    // 아래쪽에 추가 공간을 마련해둬도 좋습니다.
    // paddingBottom: 100 * height_ratio,
  },
  innerContainer: {
    paddingTop: 80 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    alignItems: 'center',
  },
  title: {
    marginLeft: 4 * width_ratio,
    fontSize: 20 * width_ratio,
    ...theme.fonts.Bold,
    marginBottom: 50 * height_ratio,
    color: '#49494F',
    alignSelf: 'flex-start',
  },
  // -----------------------------------------------------------------
  // 입력 창 스타일
  // -----------------------------------------------------------------
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
    backgroundColor: '#F1F1F1',
  },
  // 키/체중 같은 경우, TextInput과 단위를 함께 감싸는 박스
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13 * width_ratio,
    paddingRight: 24 * width_ratio,
    backgroundColor: '#F1F1F1',
  },
  inputUnit: {
    borderWidth: 0,
    borderRadius: 13 * width_ratio,
    paddingVertical: 17 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
    color: 'black',
  },
  // 에러 시 테두리를 빨간색
  errorInput: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12 * width_ratio,
    marginTop: 4 * height_ratio,
  },
  // -----------------------------------------------------------------
  // 성별
  // -----------------------------------------------------------------
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
  // -----------------------------------------------------------------
  // 레이아웃
  // -----------------------------------------------------------------
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8 * width_ratio,
  },
  // -----------------------------------------------------------------
  // 하단 고정 버튼
  // -----------------------------------------------------------------
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: 10 * height_ratio,
    paddingBottom: 20 * height_ratio,
    alignItems: 'center',
  },
  button: {
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
    ...theme.fonts.Bold,
  },
  buttonTextEnabled: {
    color: '#7596FF',
  },
  buttonTextDisabled: {
    color: '#828287',
  },
  unit: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Regular,
    color: '#828287',
  },
});

export default Get_User_Info;
