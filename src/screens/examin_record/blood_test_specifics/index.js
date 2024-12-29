// src/screens/examin_record/blood_test_specifics/index.js

import React, { useState, useContext } from 'react';           // ←★ useContext 추가
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import theme from '../../../theme.js';

// ★ HomeContext import
import { HomeContext } from '../../../components/homeContext';

import styles from './styles.js';
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Blood_test_specifics_screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bloodTestResult, index, refreshHealthData } = route.params;

  // ★ 전역 Context에서 rerenderHome 세터 가져오기
  const { setRerenderHome } = useContext(HomeContext);

  const [date, setDate] = useState(bloodTestResult.date || '');
  const [bun, setBun] = useState(bloodTestResult.BUN.toString() || '');
  const [creatinine, setCreatinine] = useState(bloodTestResult.creatinine.toString() || '');
  const [gfr, setGfr] = useState(bloodTestResult.GFR.toString() || '');
  const [prevDate, setPrevDate] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [isBackspace, setIsBackspace] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    if (!dateRegex.test(date)) {
      errors.push('date');
    }

    if (!bun || isNaN(bun) || bun <= 0) {
      errors.push('bun');
    }

    if (!creatinine || isNaN(creatinine) || creatinine <= 0) {
      errors.push('creatinine');
    }

    if (!gfr || isNaN(gfr) || gfr <= 0) {
      errors.push('gfr');
    }

    setInvalidFields(errors);
    return errors.length === 0;
  };

  // "저장하기" 버튼 로직
  const saveTestResult = async () => {
    if (isSaving) return; // 중복 저장 방지
    if (!validateInputs()) {
      Alert.alert('오류', '입력값을 확인해주세요.');
      return;
    }

    setIsSaving(true);

    const updatedTestResult = {
      date,
      BUN: parseFloat(bun),
      creatinine: parseFloat(creatinine),
      GFR: parseFloat(gfr),
    };

    try {
      // 기존 데이터 가져오기
      const userData = await AsyncStorage.getItem('user');
      let parsedData = userData ? JSON.parse(userData) : {};

      const _id = parsedData._id;
      const originalDate = bloodTestResult.date; // 기존 날짜

      // 서버에 업데이트 요청
      await axios.put('http://98.82.55.237/blood_test/editBloodTestResultById', {
        _id,
        originalDate,
        ...updatedTestResult,
      });

      // 로컬 검사 결과 업데이트
      let bloodTestResults = parsedData.blood_test_result || [];
      bloodTestResults[index] = updatedTestResult;

      // 날짜 내림차순 정렬
      bloodTestResults.sort((a, b) => {
        const dateA = new Date(a.date.replace(/\//g, '-'));
        const dateB = new Date(b.date.replace(/\//g, '-'));
        return dateB - dateA;
      });

      parsedData.blood_test_result = bloodTestResults;
      await AsyncStorage.setItem('user', JSON.stringify(parsedData));

      // 기존 콜백(리스트 화면 새로고침 등)
      refreshHealthData?.();

      // ★ 홈화면 재렌더링 트리거
      setRerenderHome((prev) => !prev);

      navigation.goBack();
    } catch (error) {
      console.error('Error saving blood test result:', error);
      Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // "기록 삭제" 버튼 로직
  const deleteTestResult = async () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 검사 결과를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const userData = await AsyncStorage.getItem('user');
              let parsedData = userData ? JSON.parse(userData) : {};

              const _id = parsedData._id;
              const dateToDelete = bloodTestResult.date;

              // 서버에 삭제 요청
              await axios.delete('http://98.82.55.237/blood_test/deleteBloodTestResultById', {
                data: { _id, date: dateToDelete },
              });

              // 로컬 검사 결과 삭제
              let bloodTestResults = parsedData.blood_test_result || [];
              bloodTestResults.splice(index, 1);
              parsedData.blood_test_result = bloodTestResults;

              await AsyncStorage.setItem('user', JSON.stringify(parsedData));

              // 기존 콜백(리스트 화면 새로고침 등)
              refreshHealthData?.();

              // ★ 홈화면 재렌더링 트리거
              setRerenderHome((prev) => !prev);

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting blood test result:', error);
              Alert.alert('오류', '데이터 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>검사 일자</Text>
        <TextInput
          style={[
            styles.input,
            invalidFields.includes('date') && styles.invalidInput,
          ]}
          placeholder="YYYY/MM/DD"
          placeholderTextColor="#828287"
          cursorColor="black"
          value={date}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          returnKeyType="next"
          maxLength={10}
        />

        <Text style={styles.label}>BUN</Text>
        <TextInput
          style={[
            styles.input,
            invalidFields.includes('bun') && styles.invalidInput,
          ]}
          placeholder="mg/dL"
          placeholderTextColor="#828287"
          cursorColor="black"
          value={bun}
          onChangeText={setBun}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <Text style={styles.label}>혈청 크레아티닌</Text>
        <TextInput
          style={[
            styles.input,
            invalidFields.includes('creatinine') && styles.invalidInput,
          ]}
          placeholder="mg/dL"
          placeholderTextColor="#828287"
          cursorColor="black"
          value={creatinine}
          onChangeText={setCreatinine}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <Text style={styles.label}>GFR</Text>
        <TextInput
          style={[
            styles.input,
            invalidFields.includes('gfr') && styles.invalidInput,
          ]}
          placeholder="mL/min/1.73m²"
          placeholderTextColor="#828287"
          cursorColor="black"
          value={gfr}
          onChangeText={setGfr}
          keyboardType="numeric"
          returnKeyType="done"
        />
      </ScrollView>

      {/* 하단 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveTestResult}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteTestResult}
          disabled={isSaving}
        >
          <Text style={styles.deleteButtonText}>기록 삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Blood_test_specifics_screen;
