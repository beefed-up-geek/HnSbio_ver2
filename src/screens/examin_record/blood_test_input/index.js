// src/screens/examin_record/blood_test_input/index.js
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
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

  const bunRef = useRef(null);
  const creatinineRef = useRef(null);
  const gfrRef = useRef(null);

  const handleDateChange = (text) => {
    if (text.length === 4 || text.length === 7) {
      text += '/';
    }
    if (text.length <= 10) {
      setDate(text);
    }
  };

  const addTestResult = async () => {
    if (date.length !== 10 || !bun || !creatinine || !gfr) {
      Alert.alert('모든 필드를 올바르게 입력해주세요');
      return;
    }

    const newTestResult = {
      date,
      BUN: parseFloat(bun),
      creatinine: parseFloat(creatinine),
      GFR: parseFloat(gfr),
    };

    try {
      // Get providerId from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      let parsedData = userData ? JSON.parse(userData) : {};

      if (!parsedData.providerId) {
        Alert.alert('오류', 'providerId를 찾을 수 없습니다.');
        return;
      }

      const providerId = parsedData.providerId;

      // Update blood_test_result in AsyncStorage
      if (!parsedData.blood_test_result) {
        parsedData.blood_test_result = [];
      }
      parsedData.blood_test_result.unshift(newTestResult);
      parsedData.blood_test_result.sort((a, b) => new Date(b.date) - new Date(a.date));

      await AsyncStorage.setItem('user', JSON.stringify(parsedData));

      // Call addBloodTestResult API
      await axios.put('http://54.79.61.80:5000/blood_test/addBloodTestResult', {
        providerId,
        ...newTestResult,
      });
      // Refresh data and navigate to the desired screen
      refreshHealthData();
      navigation.navigate('BottomNavigation', { screen: 'Examin_record_screen' }); // Replace with the actual screen name
    } catch (error) {
      console.error('Error adding blood test result:', error);
      Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>검사 일자</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY / MM / DD"
        placeholderTextColor="#828287"
        cursorColor="black"
        value={date}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => bunRef.current.focus()}
        maxLength={10}
      />

      <Text style={styles.label}>BUN</Text>
      <TextInput
        ref={bunRef}
        style={styles.input}
        placeholder="mg/dL"
        placeholderTextColor="#828287"
        cursorColor="black"
        value={bun}
        onChangeText={setBun}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => creatinineRef.current.focus()}
      />

      <Text style={styles.label}>혈청 크레아티닌</Text>
      <TextInput
        ref={creatinineRef}
        style={styles.input}
        placeholder="mg/dL"
        placeholderTextColor="#828287"
        cursorColor="black"
        value={creatinine}
        onChangeText={setCreatinine}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => gfrRef.current.focus()}
      />

      <Text style={styles.label}>GFR</Text>
      <TextInput
        ref={gfrRef}
        style={styles.input}
        placeholder="mL/min/1.73m²"
        placeholderTextColor="#828287"
        cursorColor="black"
        value={gfr}
        onChangeText={setGfr}
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={addTestResult}
      />

      <TouchableOpacity style={styles.button} onPress={addTestResult}>
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
  input: {
    height: 50 * height_ratio,
    borderRadius: 10 * width_ratio,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 15 * width_ratio,
    fontSize: 14 * width_ratio,
    color: '#333',
    marginBottom: 15 * height_ratio,
    ...theme.fonts.Regular,
  },
  button: {
    height: 50 * height_ratio,
    borderRadius: 25 * width_ratio,
    backgroundColor: '#E8EFFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16 * width_ratio,
    color: theme.colors.mainBlue,
    ...theme.fonts.SemiBold,
  },
});

export default Blood_test_input_screen;
