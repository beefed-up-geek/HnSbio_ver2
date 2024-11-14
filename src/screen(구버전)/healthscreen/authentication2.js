// src\screen(구버전)\healthscreen\authentication2.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const telecomOptions = [
  'SKT',
  'KT',
  'LGU+',
  '알뜰폰 (SKT)',
  '알뜰폰 (KT)',
  '알뜰폰 (LGU+)',
];

const Authentication2Screen = () => {
  const [name, setName] = useState(''); // 이름
  const [birthdate, setBirthdate] = useState(''); // 생년월일
  const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호
  const [selectedTelecom, setSelectedTelecom] = useState(''); // Selected Telecom을 빈 문자열로 초기화
  const [nameFocused, setNameFocused] = useState(false);
  const [birthdateFocused, setBirthdateFocused] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [telecomModalVisible, setTelecomModalVisible] = useState(false);

  const route = useRoute();
  const { selectedValue, selectedLabel, selectedImage, fetchData } = route.params; // fetchData 받음
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          console.log('userId를 성공적으로 가져옴:', storedUserId);
          setUserId(storedUserId);
        } else {
          console.log('userId가 존재하지 않음');
        }
      } catch (error) {
        console.error('userId를 가져오는 중 오류 발생:', error);
      }
    };

    getUserId();
  }, []);

  const isValidBirthdate = (birthdate) => {
    if (birthdate.length !== 8) {
      return false;
    }
    const year = parseInt(birthdate.slice(0, 4), 10);
    const month = parseInt(birthdate.slice(4, 6), 10);
    const day = parseInt(birthdate.slice(6, 8), 10);

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length === 11 && phoneNumber.startsWith('010');
  };

  useEffect(() => {
    if (
      name.length > 0 && // 이름이 입력되었는지 확인
      isValidBirthdate(birthdate) && // 유효한 생년월일인지 확인
      isValidPhoneNumber(phoneNumber) && // 유효한 휴대폰 번호인지 확인
      !birthdateError &&
      !phoneNumberError &&
      selectedTelecom.length > 0 // 통신사가 선택되었는지 확인
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [
    userId,
    name,
    birthdate,
    phoneNumber,
    birthdateError,
    phoneNumberError,
    selectedTelecom,
  ]);

  const handleAuthentication = async () => {
    console.log('인증 요청 함수가 호출되었습니다.');

    if (!formValid) {
      console.log('폼이 유효하지 않음.');
    }
    if (!formValid) return;

    let telecom = '';
    if (selectedTelecom === 'KT' || selectedTelecom === '알뜰폰 (KT)') {
      telecom = '1';
    } else if (
      selectedTelecom === 'SKT' ||
      selectedTelecom === '알뜰폰 (SKT)'
    ) {
      telecom = '0';
    } else if (
      selectedTelecom === 'LGU+' ||
      selectedTelecom === '알뜰폰 (LGU+)'
    ) {
      telecom = '2';
    }

    try {
      const request_data = {
        providerId: userId,
        userName: name,
        identity: birthdate,
        phoneNo: phoneNumber,
        telecom: telecom,
        loginTypeLevel: selectedValue.toString(), // loginTypeLevel을 문자열로 변환
      };
      console.log(request_data);
      const response = await axios.post(
        'http://54.79.61.80:3000/health_checkup/step1',
        request_data,
      );
      console.log(response.data);
      const { result, data } = response.data;
      if (result.code === 'CF-03002') {
        
        navigation.navigate('Authentication3', {
          providerId: userId,
          jti: data.jti,
          twoWayTimestamp: data.twoWayTimestamp,
          name: name,
          birthdate: birthdate,
          phoneNo: phoneNumber,
          telecom: telecom,
          loginTypeLevel: selectedValue.toString(),
          selectedLabel: selectedLabel,
          selectedImage: selectedImage,
          fetchData
        });
      } else {
        setBirthdateError(true);
        setPhoneNumberError(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //Alert.alert('API 호출 에러', '더미 데이터로 대체합니다.');
        navigation.navigate('Authentication3', {
          providerId: userId,
          jti: 'dummyJti',
          twoWayTimestamp: Date.now().toString(),
          name: name,
          birthdate: birthdate,
          phoneNo: phoneNumber,
          telecom: telecom,
          loginTypeLevel: selectedValue.toString(),
          selectedLabel: selectedLabel,
          selectedImage: selectedImage,
          fetchData
        });
      } else {
        console.error(error);
      }
    }
  };

  const handleTelecomSelect = (provider) => {
    setSelectedTelecom(provider);
    setTelecomModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../images/chevronArrowLeft.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Text style={styles.title}>개인정보 입력</Text>
      <Text style={styles.subtitle}>
        본인인증을 진행하기 위해 개인정보를 입력해주세요.
      </Text>

      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            nameFocused && styles.inputWrapperFocused,
          ]}>
          <Text style={styles.floatingLabel}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text.slice(0, 8))}
            placeholder={!nameFocused ? '이름 입력' : ''}
            placeholderTextColor="#777"
            maxLength={8} // Set max length to 8
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            birthdateFocused && styles.inputWrapperFocused,
            birthdateError && styles.inputWrapperError,
          ]}>
          <Text style={styles.floatingLabel}>생년월일 8자리</Text>
          <TextInput
            style={styles.input}
            value={birthdate}
            onChangeText={(text) => {
              setBirthdate(text.slice(0, 8));
              setBirthdateError(false);
            }}
            placeholder={!birthdateFocused ? '생년월일' : ''}
            keyboardType="numeric"
            placeholderTextColor="#777"
            maxLength={8} // Set max length to 8
            onFocus={() => {
              setBirthdateFocused(true);
              setBirthdateError(false);
            }}
            onBlur={() => {
              setBirthdateFocused(false);
              if (!isValidBirthdate(birthdate)) {
                setBirthdateError(true);
              }
            }}
          />
        </View>
        {!birthdateFocused && birthdateError && (
          <Text style={styles.errorText}>유효한 생년월일을 입력해주세요</Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            phoneNumberFocused && styles.inputWrapperFocused,
            phoneNumberError && styles.inputWrapperError,
          ]}>
          <Text style={styles.floatingLabel}>휴대폰번호</Text>
          <View style={styles.phoneInputRow}>
            <TouchableOpacity
              style={styles.telecomButton}
              onPress={() => setTelecomModalVisible(true)}>
              <Text style={styles.telecomButtonText}>
                {selectedTelecom || '통신사'}
              </Text>
              <Image
                source={require('../../images/login/underTriangle.png')}
                style={styles.underTriangleButtonImage}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text.slice(0, 11));
                setPhoneNumberError(false);
              }} // Set max length to 11
              placeholder={!phoneNumberFocused ? '휴대폰번호 입력' : ''}
              keyboardType="phone-pad"
              placeholderTextColor="#777"
              maxLength={11} // Set max length to 11
              onFocus={() => {
                setPhoneNumberFocused(true);
                setPhoneNumberError(false);
              }}
              onBlur={() => {
                setPhoneNumberFocused(false);
                if (!isValidPhoneNumber(phoneNumber)) {
                  setPhoneNumberError(true);
                }
              }}
            />
            {phoneNumber.length > 0 && (
              <TouchableOpacity onPress={() => setPhoneNumber('')}>
                <Image
                  source={require('../../images/xButton.png')}
                  style={styles.xButtonImage}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!phoneNumberFocused && phoneNumberError && (
          <Text style={styles.errorText}>유효한 휴대폰번호를 입력해주세요</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.authButton,
          formValid ? styles.authButtonEnabled : styles.authButtonDisabled,
        ]}
        onPress={handleAuthentication}
        disabled={!formValid}>
        <Text
          style={[
            styles.authButtonText,
            formValid
              ? styles.authButtonTextEnabled
              : styles.authButtonTextDisabled,
          ]}>
          인증 요청
        </Text>
      </TouchableOpacity>

      {/* Telecom Selection Modal */}
      <Modal
        visible={telecomModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTelecomModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTop}>
              <Text style={styles.modalTitle}>통신사 선택</Text>
              <TouchableOpacity
                style={styles.xButton}
                onPress={() => setTelecomModalVisible(false)}>
                <Image
                  source={require('../../images/xButton.png')}
                  style={styles.xButtonImage}
                />
              </TouchableOpacity>
            </View>
            {telecomOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.telecomOption}
                onPress={() => handleTelecomSelect(option)}>
                <Text style={styles.telecomOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    backgroundColor: 'white',
  },
  backButton: {
    marginLeft: -8,
    marginTop: 12,
    marginBottom: 40,
  },
  backButtonImage: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
  },
  title: {
    textAlign: 'left',
    fontSize: 24 * height_ratio,
    ...theme.fonts.SemiBold,
    marginBottom: 10 * height_ratio,
    color: '#000',
  },
  subtitle: {
    textAlign: 'left',
    fontSize: 14 * height_ratio,
    marginBottom: 20 * height_ratio,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20 * height_ratio,
  },
  inputWrapper: {
    marginBottom: 12 * height_ratio,
    borderColor: '#F1F1F1',
    borderWidth: 1,
    borderRadius: 13 * width_ratio,
    paddingVertical: 8 * height_ratio,
    paddingHorizontal: 18 * width_ratio,
  },
  inputWrapperFocused: {
    borderColor: 'black',
  },
  inputWrapperError: {
    borderColor: '#F53E50',
  },
  floatingLabel: {
    fontSize: 12 * height_ratio,
    color: '#828287',
    marginBottom: 2,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16 * height_ratio,
    paddingTop: 0,
    paddingBottom: 2 * height_ratio,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telecomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8 * width_ratio,
    paddingVertical: 4 * height_ratio,
    paddingHorizontal: 8 * width_ratio,
    backgroundColor: '#F1F1F1',
    borderRadius: 8 * width_ratio,
  },
  telecomButtonText: {
    fontSize: 12,
    ...theme.fonts.Medium,
    color: theme.colors.textGray,
  },
  underTriangleButtonImage: {
    width: 7 * width_ratio,
    height: 7 * width_ratio,
    marginLeft: 8 * width_ratio,
  },
  xButtonImage: {
    width: 20 * width_ratio,
    height: 20 * width_ratio,
    marginLeft: 8 * width_ratio,
  },
  authButton: {
    paddingVertical: 18 * height_ratio,
    borderRadius: 13 * width_ratio,
    alignItems: 'center',
  },
  authButtonDisabled: {
    backgroundColor: '#F1F1F1',
  },
  authButtonEnabled: {
    backgroundColor: '#EBEFFE',
  },
  authButtonText: {
    fontWeight: 'bold',
    fontSize: 16 * height_ratio,
  },
  authButtonTextDisabled: {
    color: '#828287',
  },
  authButtonTextEnabled: {
    color: '#7596FF',
  },
  errorText: {
    color: '#F53E50',
    fontSize: 12 * height_ratio,
    marginTop: -8 * height_ratio,
    marginBottom: 12 * height_ratio,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingTop: 20 * height_ratio,
    paddingBottom: 30 * height_ratio,
    paddingHorizontal: 24 * width_ratio,
    borderTopLeftRadius: 20 * width_ratio,
    borderTopRightRadius: 20 * width_ratio,
  },
  modalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24 * height_ratio,
  },
  modalTitle: {
    fontSize: 18 * height_ratio,
    fontWeight: 'bold',
  },
  xButtonImage: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
  },
  telecomOption: {
    paddingVertical: 12 * height_ratio,
  },
  telecomOptionText: {
    fontSize: 14 * height_ratio,
    color: '#000',
  },
});

export default Authentication2Screen;
