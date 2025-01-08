// src/screens/examin_record/blood_test_specifics/index.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Context
import { HomeContext } from '../../../components/homeContext';

// 스타일
import styles from './styles.js';
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Blood_test_specifics_screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bloodTestResult, index, refreshHealthData } = route.params;

  // 전역 Context
  const { setRerenderHome } = useContext(HomeContext);

  // state
  const [date, setDate] = useState(bloodTestResult.date || '');
  const [id, setId] = useState(bloodTestResult.id || '');
  const [bun, setBun] = useState(bloodTestResult.BUN.toString() || '');
  const [creatinine, setCreatinine] = useState(bloodTestResult.creatinine.toString() || '');
  const [gfr, setGfr] = useState(bloodTestResult.GFR.toString() || '');
  const [prevDate, setPrevDate] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [isBackspace, setIsBackspace] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 날짜 입력
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

  // 입력값 검증
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

  // "저장하기"
  const saveTestResult = async () => {
    if (isSaving) return; 
    if (!validateInputs()) {
      Alert.alert('오류', '입력값을 확인해주세요.');
      return;
    }

    setIsSaving(true);

    // 수정될 결과
    const updatedTestResult = {
      id,    // 기존 결과의 id
      date,
      BUN: parseFloat(bun),
      creatinine: parseFloat(creatinine),
      GFR: parseFloat(gfr),
    };

    try {
      // (1) 로컬 userData 가져오기
      const userDataString = await AsyncStorage.getItem('user');
      let parsedData = userDataString ? JSON.parse(userDataString) : {};

      const _id = parsedData._id;

      // (2) 서버에 업데이트 요청 (id 기준)
      await axios.put('http://98.82.55.237/blood_test/editBloodTestResultById', {
        _id,
        id,  // 기존 혈액검사 결과의 식별자
        ...updatedTestResult,    // date, BUN, creatinine, GFR
      });

      // (3) 로컬 DB 수정
      let bloodTestResults = parsedData.blood_test_result || [];

      // index 대신 id로 찾기 (혹시 order가 변했을 수도 있음)
      const targetIndex = bloodTestResults.findIndex(item => item.id === bloodTestResult.id);
      if (targetIndex >= 0) {
        bloodTestResults[targetIndex] = updatedTestResult;
      }

      // 날짜 내림차순 정렬
      bloodTestResults.sort((a, b) => {
        const dateA = new Date(a.date.replace(/\//g, '-'));
        const dateB = new Date(b.date.replace(/\//g, '-'));
        return dateB - dateA;
      });

      parsedData.blood_test_result = bloodTestResults;
      await AsyncStorage.setItem('user', JSON.stringify(parsedData));

      // (4) refreshHealthData (리스트 화면 새로고침)
      refreshHealthData?.();

      // (5) 홈화면 재렌더링
      setRerenderHome((prev) => !prev);

      // (6) 이전 화면 복귀
      navigation.goBack();
    } catch (error) {
      console.error('Error saving blood test result:', error);
      Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // "기록 삭제"
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
              // (1) 로컬 userData
              const userDataString = await AsyncStorage.getItem('user');
              let parsedData = userDataString ? JSON.parse(userDataString) : {};

              const _id = parsedData._id;

              // (2) 서버에 삭제 요청 (id 기준)
              await axios.delete('http://98.82.55.237/blood_test/deleteBloodTestResultById', {
                data: { _id, id: bloodTestResult.id },
              });

              // (3) 로컬에서 해당 항목 제거
              let bloodTestResults = parsedData.blood_test_result || [];
              bloodTestResults = bloodTestResults.filter(item => item.id !== bloodTestResult.id);

              parsedData.blood_test_result = bloodTestResults;
              await AsyncStorage.setItem('user', JSON.stringify(parsedData));

              // (4) refreshHealthData
              refreshHealthData?.();

              // (5) 홈화면 재렌더링
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
