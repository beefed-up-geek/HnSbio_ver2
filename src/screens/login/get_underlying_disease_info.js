// src/screens/login/get_underlying_disease_info.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const GetUnderlyingDiseaseInfo = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    name,
    gender,
    height,
    weight,
    birthdate,
    nickname,
    provider,
    providerId,
    chronic_kidney_disease,
  } = route.params || {};

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const agreementOptions = [
    '모두 동의하기',
    '이용 약관 동의',
    '개인정보 보호방침 동의',
    '민감정보수집 및 이용동의',
    '만 14세 이상입니다',
  ];
  const [agreements, setAgreements] = useState(new Array(agreementOptions.length).fill(false));

  const options = [
    '해당사항 없음',
    '고혈압',
    '당뇨',
    '고지혈증',
    '망막합병증',
  ];

  const handleOptionToggle = (option) => {
    if (option === '해당사항 없음') {
      setSelectedOptions(selectedOptions.includes(option) ? [] : [option]);
    } else {
      setSelectedOptions((prevSelectedOptions) => {
        if (prevSelectedOptions.includes(option)) {
          return prevSelectedOptions.filter((opt) => opt !== option);
        } else {
          return [...prevSelectedOptions.filter((opt) => opt !== '해당사항 없음'), option];
        }
      });
    }
  };

  const handleNext = async () => {
    if (selectedOptions.length === 0) {
      Alert.alert('선택 오류', '하나 이상의 옵션을 선택해주세요.');
      return;
    }

    setIsModalVisible(true);
  };

  const handleAgreementToggle = (index) => {
    const updatedAgreements = [...agreements];

    if (index === 0) {
      const newValue = !updatedAgreements[0];
      updatedAgreements.fill(newValue);
    } else {
      updatedAgreements[index] = !updatedAgreements[index];
      updatedAgreements[0] = updatedAgreements.slice(1).every(Boolean);
    }

    setAgreements(updatedAgreements);
  };

  const allAgreed = agreements.slice(1).every(Boolean);

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleAgreeAndProceed = async () => {
    if (!allAgreed) {
      Alert.alert('동의 필요', '모든 필수 항목에 동의해주세요.');
      return;
    }

    const hypertension = selectedOptions.includes('고혈압') ? 1 : 0;
    const diabetes = selectedOptions.includes('당뇨') ? 1 : 0;
    const hyperlipidemia = selectedOptions.includes('고지혈증') ? 1 : 0;
    const retinal_complication = selectedOptions.includes('망막합병증') ? 1 : 0;
    const userData = {
      name,
      gender,
      height,
      weight,
      birthdate,
      nickname,
      provider,
      providerId,
      chronic_kidney_disease,
      createdAt: getFormattedDate(),
      underlying_disease: {
        hypertension,
        diabetes,
        hyperlipidemia,
        retinal_complication,
      },
    };

    try {
      const response = await axios.post(
        'http://98.82.55.237/login/registerByBirthdateAndName',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const newUser = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(newUser));

        const { provider, createdAt } = newUser.account[0];
        const formattedDate = `20${createdAt.slice(0, 2)}년 ${parseInt(createdAt.slice(2, 4), 10)}월 ${parseInt(createdAt.slice(4, 6), 10)}일`;
        Alert.alert(
          '알림',
          `${formattedDate}에 생성한 동일 명의의 ${provider} 계정과 통합합니다.`,

          [
            {
              text: '확인',
              onPress: () => navigation.navigate('BottomNavigation'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('API 요청 오류:', error.message);
      Alert.alert('오류', '데이터 전송 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>어떤 기저질환이 있으신가요?</Text>

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOptions.includes(option) && styles.selectedButton,
          ]}
          onPress={() => handleOptionToggle(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOptions.includes(option) && styles.selectedText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setIsModalVisible(false)} />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>서비스 이용 필수 동의</Text>
          {agreementOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.agreementItem,
                index === 0 && styles.allAgreeItem,
              ]}
              onPress={() => handleAgreementToggle(index)}
            >
              <Image
                source={
                  agreements[index]
                    ? require('../../images/login/checkmark.png')
                    : require('../../images/login/unchecked.png')
                }
                style={styles.checkIcon}
              />
              <Text
                style={[
                  styles.agreementText,
                  index === 0 && styles.allAgreeText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.agreeButton, allAgreed ? styles.agreeButtonActive : styles.agreeButtonInactive]}
            onPress={handleAgreeAndProceed}
            disabled={!allAgreed}
          >
            <Text style={styles.agreeButtonText}>네, 모두 동의해요</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16 * width_ratio,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20 * width_ratio,
    marginLeft: 2 * width_ratio,
    marginTop: 80 * height_ratio,
    marginBottom: 47 * height_ratio,
    color: '#49494F',
    ...theme.fonts.Bold,
  },
  optionButton: {
    backgroundColor: '#F1F1F1',
    paddingVertical: 18 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    borderRadius: 12 * width_ratio,
    marginVertical: 4 * height_ratio,
    ...theme.fonts.Regular,
  },
  selectedButton: {
    backgroundColor: '#E3EAFD',
  },
  optionText: {
    fontSize: 16 * width_ratio,
    color: '#646464',
    textAlign: 'center',
    ...theme.fonts.Regular,
  },
  selectedText: {
    color: '#7596FF',
    ...theme.fonts.Regular,
  },
  nextButton: {
    marginTop: 24 * height_ratio,
    backgroundColor: '#E3EAFD',
    paddingVertical: 18 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    borderRadius: 24 * width_ratio,
  },
  nextButtonText: {
    fontSize: 14 * width_ratio,
    color: '#4A61ED',
    textAlign: 'center',
    ...theme.fonts.Regular,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20 * width_ratio,
    borderTopRightRadius: 20 * width_ratio,
    padding: 20 * width_ratio,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16 * width_ratio,
    fontWeight: 'bold',
    marginBottom: 16 * height_ratio,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 12 * height_ratio,
  },
  allAgreeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12 * height_ratio,
    marginBottom: 16 * height_ratio,
    width: '100%',
  },
  checkIcon: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
    marginRight: 12 * width_ratio,
  },
  agreementText: {
    fontSize: 14 * width_ratio,
    color: '#333',
  },
  allAgreeText: {
    fontSize: 16 * width_ratio,
    fontWeight: 'bold',
  },
  agreeButton: {
    marginTop: 20 * height_ratio,
    paddingVertical: 15 * height_ratio,
    borderRadius: 24 * width_ratio,
    width: '80%',
    alignItems: 'center',
  },
  agreeButtonActive: {
    backgroundColor: '#7596FF',
  },
  agreeButtonInactive: {
    backgroundColor: '#C0C0C0',
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 16 * width_ratio,
  },
});

export default GetUnderlyingDiseaseInfo;
