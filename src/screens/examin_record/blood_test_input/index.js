// src/screens/examin_record/blood_test_input/index.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import theme from '../../../theme.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Blood_test_input_screen = ({ route }) => {
  const navigation = useNavigation();
  const { refreshHealthData } = route.params || {};

  const [date, setDate] = useState('');
  const [bun, setBun] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gfr, setGfr] = useState('');
  const [prevDate, setPrevDate] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackspace, setIsBackspace] = useState(false);

  const bunRef = useRef(null);
  const creatinineRef = useRef(null);
  const gfrRef = useRef(null);

  const handleDateChange = (text) => {
    const isDeletingSlash =
      prevDate.length > text.length && prevDate.endsWith('/') && !text.endsWith('/');

    if (text.length < prevDate.length) {
      // 백스페이스 입력 처리
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

  const validateInputs = () => {
    const errors = [];
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

    // 날짜 형식 및 미래 날짜 검사
    if (!dateRegex.test(date)) {
      errors.push('date');
    } else {
      const enteredDate = new Date(date.replace(/\//g, '-'));
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 0시로 설정
      if (enteredDate > today) {
        errors.push('date');
      }
    }

    // 범위 검사
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

  const addTestResult = async () => {
    if (isSaving) return; // 중복 저장 방지
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
      const userData = await AsyncStorage.getItem('user');
      let parsedData = userData ? JSON.parse(userData) : {};

      if (!parsedData.providerId) {
        Alert.alert('오류', 'providerId를 찾을 수 없습니다.');
        setIsSaving(false);
        return;
      }

      const providerId = parsedData.providerId;
      let bloodTestResults = parsedData.blood_test_result || [];

      const isDuplicate = bloodTestResults.some(
        (result) =>
          result.date === newTestResult.date &&
          result.BUN === newTestResult.BUN &&
          result.creatinine === newTestResult.creatinine &&
          result.GFR === newTestResult.GFR
      );

      if (isDuplicate) {
        Alert.alert('오류', '이미 동일한 데이터가 존재합니다.');
        setIsSaving(false);
        return;
      }

      bloodTestResults.push(newTestResult);
      bloodTestResults.sort((a, b) => new Date(b.date) - new Date(a.date));
      parsedData.blood_test_result = bloodTestResults;

      await AsyncStorage.setItem('user', JSON.stringify(parsedData));

      await axios.put('http://98.82.55.237/blood_test/addBloodTestResult', {
        providerId,
        ...newTestResult,
      });

      refreshHealthData();
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
        onSubmitEditing={() => bunRef.current.focus()}
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
          onSubmitEditing={() => creatinineRef.current.focus()}
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
          onSubmitEditing={() => gfrRef.current.focus()}
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

      <TouchableOpacity style={styles.button} onPress={addTestResult} disabled={isSaving}>
        <Text style={styles.buttonText}>검사 결과 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20 * width_ratio,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14 * width_ratio,
    color: theme.colors.textGray,
    marginBottom: 5 * height_ratio,
    ...theme.fonts.Medium,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15 * height_ratio,
  },
  input: {
    height: 50 * height_ratio,
    borderRadius: 10 * width_ratio,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15 * width_ratio,
    fontSize: 14 * width_ratio,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    color: '#333',
    ...theme.fonts.Regular,
  },
  invalidInput: {
    borderColor: '#F53E50',
  },
  unitText: {
    position: 'absolute',
    right: 15 * width_ratio,
    top: 15 * height_ratio,
    fontSize: 14 * width_ratio,
    color: '#828287',
    ...theme.fonts.Regular,
  },
  button: {
    height: 50 * height_ratio,
    borderRadius: 25 * width_ratio,
    backgroundColor: '#E8EFFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20 * height_ratio,
  },
  buttonText: {
    fontSize: 16 * width_ratio,
    color: theme.colors.mainBlue,
    ...theme.fonts.SemiBold,
  },
});

export default Blood_test_input_screen;
