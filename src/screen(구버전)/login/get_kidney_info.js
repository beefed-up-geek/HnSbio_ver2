// src\screen(구버전)\login\get_kidney_info.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // axios to handle HTTP requests

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const GetKidneyInfo = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

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

  const printAllAsyncStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 0) {
        console.log('AsyncStorage에 저장된 데이터가 없습니다.');
        return;
      }

      const result = await AsyncStorage.multiGet(keys);
      result.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value: ${value}`);
      });

      return result;
    } catch (error) {
      console.error(
        'AsyncStorage 데이터를 불러오는 중 에러가 발생했습니다:',
        error,
      );
    }
  };

  const handleNext = async () => {
    console.log(selectedOption);
    // if (selectedOption === null) {
    //   Alert.alert('선택 오류', '하나의 옵션을 선택해주세요.');
    //   return;
    // }

    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      const loginMethod = await AsyncStorage.getItem('loginMethod');
      const providerID = await AsyncStorage.getItem('userId');
      if (storedUserInfo !== null) {
        const userInfo = JSON.parse(storedUserInfo);
        userInfo.kidneyDisease = selectedOption;
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        // Alert.alert(
        //   '정보 저장 완료',
        //   '사용자 정보가 성공적으로 저장되었습니다.',
        // );
        console.log('<<< GetKidneyInfo화면 사용자 정보 저장됨 >>>');

        const asyncData = await printAllAsyncStorageData();

        let provider = -1;
        if (loginMethod === 'kakao') {
          provider = 2;
        } else if (loginMethod === 'naver') {
          provider = 1;
        } else if (loginMethod === 'google') {
          provider = 0;
        }

        if (provider === -1) {
          //Alert.alert('로그인 오류', '유효하지 않은 로그인 방법입니다.');
          return;
        }

        const apiPayload = {
          providerId: providerID,
          provider,
          name: userInfo.name,
          nickname: userInfo.nickname,
          birthdate: userInfo.birthdate.replace(/\//g, ''),
          gender: userInfo.gender === 'male' ? 1 : 0, 
          height: parseInt(userInfo.height, 10),
          weight: parseInt(userInfo.weight, 10),
          kidneyInfo: userInfo.kidneyDisease,
        };

        const response = await axios.post(
          'http://54.79.61.80:3000/login/register/',
          apiPayload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API 응답 성공:', response.data);
        navigation.navigate('BottomNavigation');
      }
    } catch (error) {
      if (error.response) {
        console.error('API 응답 에러:', error.response.data);
      } else if (error.request) {
        console.error('요청 실패:', error.request);
      } else {
        console.error('에러 메시지:', error.message);
      }
      //Alert.alert('API 오류', '서버와의 통신 중 오류가 발생했습니다.');
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

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16 * width_ratio,
    backgroundColor: '#FFFFFF',
    padding: 24 * width_ratio,
  },
  title: {
    fontSize: 20 * width_ratio,
    marginLeft: 2 * width_ratio,
    marginTop: 80 * height_ratio,
    marginBottom: 47 * height_ratio,
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
  },
  selectedText: {
    color: '#7596FF',
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
  },
});

export default GetKidneyInfo;
