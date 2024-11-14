// src\screens\login\get_kidney_info.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const GetKidneyInfo = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Destructure initial values from route.params
  const {
    name,
    nickname,
    birthdate,
    height,
    weight,
    gender,
    provider,
    providerId,
  } = route.params || {};

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    '해당사항 없음',
    '만성콩팥병 (투석 전)',
    '혈액투석 중',
    '복막투석 중',
    '신장 이식 받음',
  ];

  const handleOptionSelect = optionIndex => {
    setSelectedOption(optionIndex);
  };

  const handleNext = async () => {
    if (selectedOption === null) {
      Alert.alert('선택 오류', '하나의 옵션을 선택해주세요.');
      return;
    }

    try {
      const chronic_kidney_disease = options[selectedOption];
      navigation.navigate('GetUnderlyingDiseaseInfo', {
        name,
        gender,
        height,
        weight,
        birthdate,
        nickname,
        provider,
        providerId,
        chronic_kidney_disease,
      });
    } catch (error) {
      console.error('Navigation error:', error.message);
      Alert.alert('오류', '화면 이동 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>만성콩팥병 진단을 받으셨나요?</Text>

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === index && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect(index)}>
          <Text
            style={[
              styles.optionText,
              selectedOption === index && styles.selectedText,
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedOption === null && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        disabled={selectedOption === null}
      >
        <Text
          style={[
            styles.nextButtonText,
            selectedOption === null && styles.nextButtonTextDisabled,
          ]}
        >
          다음
        </Text>
      </TouchableOpacity>
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
    ...theme.fonts.Bold,
    color: '#49494F',
  },
  optionButton: {
    backgroundColor: '#F1F1F1',
    paddingVertical: 18 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    borderRadius: 12 * width_ratio,
    marginVertical: 4 * height_ratio,
  },
  selectedButton: {
    backgroundColor: '#E4EDFF',
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
  nextButtonDisabled: {
    backgroundColor: '#828287',
  },
  nextButtonText: {
    fontSize: 14 * width_ratio,
    color: '#4A61ED',
    textAlign: 'center',
    ...theme.fonts.Regular,
  },
  nextButtonTextDisabled: {
    color: '#FFFFFF',
  },
});

export default GetKidneyInfo;
