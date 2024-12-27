// src/screens/examin_record/blood_test_input/index.js
import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Context import
import { HomeContext } from '../../../components/homeContext';

// 스타일 (기존 styles.js를 쓰고 있다면 import 그대로 유지)
import styles from './styles.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Blood_test_input_screen = ({ route }) => {
  const navigation = useNavigation();
  const { refreshHealthData } = route.params || {};

  // Context
  const { setRerenderHome } = useContext(HomeContext);

  // 입력값 상태
  const [date, setDate] = useState('');
  const [bun, setBun] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gfr, setGfr] = useState('');
  const [prevDate, setPrevDate] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackspace, setIsBackspace] = useState(false);

  // ref
  const bunRef = useRef(null);
  const creatinineRef = useRef(null);
  const gfrRef = useRef(null);

  // 날짜 입력 가공
  const handleDateChange = (text) => {
    const isDeletingSlash =
      prevDate.length > text.length && prevDate.endsWith('/') && !text.endsWith('/');

    if (text.length < prevDate.length) {
      setDate(text);
      setPrevDate(text);
      setIsBackspace(isDeletingSlash);
      return;
    }

    if (isBackspace && text.length > prevDate.length) {
      // 백스페이스 직후 숫자가 입력된 경우
      if (text.length === 5) {
        text = text.slice(0, 4) + '/' + text.slice(4);
      } else if (text.length === 8) {
        text = text.slice(0, 7) + '/' + text.slice(7);
      }
      setIsBackspace(false);
    } else if (text.length === 4 || text.length === 7) {
      text += '/';
    }

    if (text.length <= 10) {
      setDate(text);
    }
    setPrevDate(text);
  };

  // 입력값 검증
  const validateInputs = () => {
    const errors = [];
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

    if (!dateRegex.test(date)) {
      errors.push('date');
    } else {
      const [yearStr, monthStr, dayStr] = date.split('/');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // 유효 범위 검사
      if (year < 1950 || month < 1 || month > 12 || day < 1 || day > 31) {
        errors.push('date');
      }
      // 미래 날짜 제한
      const enteredDate = new Date(date.replace(/\//g, '-'));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (enteredDate > today) {
        errors.push('date');
      }
    }

    if (!bun || isNaN(bun) || bun <= 0 || bun > 200) {
      errors.push('bun');
    }
    if (!creatinine || isNaN(creatinine) || creatinine <= 0 || creatinine > 20) {
      errors.push('creatinine');
    }
    if (!gfr || isNaN(gfr) || gfr <= 0 || gfr > 300) {
      errors.push('gfr');
    }

    setInvalidFields(errors);
    return errors.length === 0;
  };

  // "검사 결과 추가" 버튼
  const addTestResult = async () => {
    if (isSaving) return;
    if (!validateInputs()) {
      Alert.alert('오류', '입력값을 확인해주세요.');
      return;
    }

    setIsSaving(true);

    const newTestResult = {
      date,
      BUN: parseFloat(bun),
      creatinine: parseFloat(creatinine),
      GFR: parseFloat(gfr),
    };

    try {
      // 1) 로컬(AsyncStorage)에서 user 불러옴
      const userData = await AsyncStorage.getItem('user');
      let parsedData = userData ? JSON.parse(userData) : {};

      const _id = parsedData._id;
      let bloodTestResults = parsedData.blood_test_result || [];

      // 2) 로컬에 새 검사 결과 추가
      bloodTestResults.push(newTestResult);

      // 3) 최근 날짜가 앞에 오도록 내림차순 정렬
      bloodTestResults.sort((a, b) => {
        const dateA = new Date(a.date.replace(/\//g, '-'));
        const dateB = new Date(b.date.replace(/\//g, '-'));
        return dateB - dateA; // 날짜가 더 큰(최근) 쪽이 앞
      });

      // 4) AsyncStorage에 업데이트
      parsedData.blood_test_result = bloodTestResults;
      await AsyncStorage.setItem('user', JSON.stringify(parsedData));

      // 5) 백엔드에 검사 결과 추가 (중복 방지: 여기서만 한 번)
      await axios.put('http://98.82.55.237/blood_test/addBloodTestResultById', {
        _id,
        ...newTestResult,
      });

      // 6) 다른 화면을 새로 갱신하는 함수(데이터 추가 X)
      refreshHealthData?.();

      // 7) 홈화면이 다시 렌더링되도록 Context 토글
      setRerenderHome((prev) => !prev);

      // 8) 이동
      navigation.navigate('BottomNavigation', { screen: 'Examin_record_screen' });
    } catch (error) {
      console.error('Error adding blood test result:', error);
      Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>검사 일자</Text>
      <TextInput
        style={[
          styles.input,
          invalidFields.includes('date') && styles.invalidInput,
        ]}
        placeholder="YYYY/MM/DD"
        placeholderTextColor="#828287"
        value={date}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        maxLength={10}
        returnKeyType="next"
        onSubmitEditing={() => bunRef.current?.focus()}
      />

      <Text style={styles.label}>BUN</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={bunRef}
          style={[
            styles.input,
            invalidFields.includes('bun') && styles.invalidInput,
          ]}
          placeholder="0 ~ 200"
          placeholderTextColor="#828287"
          value={bun}
          onChangeText={setBun}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => creatinineRef.current?.focus()}
        />
        <Text style={styles.unitText}>mg/dL</Text>
      </View>

      <Text style={styles.label}>혈청 크레아티닌</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={creatinineRef}
          style={[
            styles.input,
            invalidFields.includes('creatinine') && styles.invalidInput,
          ]}
          placeholder="0 ~ 20"
          placeholderTextColor="#828287"
          value={creatinine}
          onChangeText={setCreatinine}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => gfrRef.current?.focus()}
        />
        <Text style={styles.unitText}>mg/dL</Text>
      </View>

      <Text style={styles.label}>GFR</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={gfrRef}
          style={[
            styles.input,
            invalidFields.includes('gfr') && styles.invalidInput,
          ]}
          placeholder="0 ~ 300"
          placeholderTextColor="#828287"
          value={gfr}
          onChangeText={setGfr}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={addTestResult}
        />
        <Text style={styles.unitText}>mL/min/1.73m²</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={addTestResult}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>검사 결과 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Blood_test_input_screen;
