// src/screens/home/daily_check/index.js

import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles.js';
import {HomeContext} from '../../../components/homeContext';

const Daily_check_screen = () => {
  const navigation = useNavigation();

  const {rerenderHome, setRerenderHome} = useContext(HomeContext);

  // 체크리스트 상태 관리
  const [checks, setChecks] = useState(Array(6).fill(false));
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  const checklistItems = [
    '자다가 일어나 소변을 자주 본다.',
    '소변이 탁하고 거품이 많이 나타난다.',
    '눈 주위나 손발이 부어 오른다.',
    '입맛이 없다.',
    '쉽게 피곤해진다.',
    '몸 전체가 가렵다.',
  ];

  // 1) 오늘 날짜 구하기
  const todayStr = new Date().toDateString();

  // -----------------------------------------
  // 2) 컴포넌트 마운트 시, 저장된 체크상태를 불러오는 함수
  // -----------------------------------------
  const loadDailyCheck = async () => {
    try {
      const savedData = await AsyncStorage.getItem('saveDailyCheckChanges');
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        // { date: 'Mon Dec 30 2024', checks: [true, false, ...] }
        if (parsedData.date === todayStr) {
          // 날짜가 오늘이면 저장된 체크 상태 불러오기
          setChecks(parsedData.checks);
        } else {
          // 날짜가 다르면 체크리스트 초기화
          setChecks(Array(6).fill(false));
        }
      } else {
        // 저장된 값이 없으면 체크리스트 초기화
        setChecks(Array(6).fill(false));
      }
    } catch (error) {
      console.error('Failed to load check changes:', error);
    }
  };

  // -----------------------------------------
  // 3) 체크 변경 시 => 상태 변경 후 Async Storage 저장
  // -----------------------------------------
  const handleCheckChange = async index => {
    try {
      const newChecks = [...checks];
      newChecks[index] = !newChecks[index];
      setChecks(newChecks);

      // 날짜와 체크 상태를 함께 저장
      const dataToSave = {date: todayStr, checks: newChecks};
      await AsyncStorage.setItem(
        'saveDailyCheckChanges',
        JSON.stringify(dataToSave),
      );
    } catch (error) {
      console.error('Failed to save daily check changes:', error);
    }
  };

  // -----------------------------------------
  // 4) "완료" 버튼 클릭 시 => 체크된 항목 수 + 완료 날짜만 따로 저장
  // -----------------------------------------
  const calculateChecked = async () => {
    const count = checks.filter(Boolean).length;
    setCheckedCount(count);
    setModalVisible(true);

    // dailyCheckComplete에 오늘 날짜 저장
    try {
      await AsyncStorage.setItem('dailyCheckComplete', todayStr);
      // HomeContext에 있는 rerenderHome을 토글
      setRerenderHome(prev => !prev);
    } catch (error) {
      console.error('Failed to save check completion status:', error);
    }
  };

  // 모달 내용
  const renderModalContent = () => {
    if (checkedCount < 3) {
      return (
        <>
          <Text style={styles.modalMessage}>
            아직 심각한 증상이 없어요.{'\n'}
            꾸준히 생활 습관을 지키며 콩팥 건강을 관리해보세요.
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.modalMessage}>
            6가지 항목 중{' '}
            <Text style={styles.boldText}>{checkedCount}가지</Text>에 해당해요.
            {'\n'}
            지금 바로 키트 검사를 하거나 병원에 방문해보는 것을 권장해요.
          </Text>
        </>
      );
    }
  };

  // -----------------------------------------
  // 5) 화면 첫 진입 시, 기존 체크 상태 로드
  // -----------------------------------------
  useEffect(() => {
    loadDailyCheck();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 체크리스트 */}
      <View style={styles.checklist}>
        {checklistItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checklistItem}
            onPress={() => handleCheckChange(index)}>
            <Image
              source={
                checks[index]
                  ? require('../../../images/home/daily_check/checked.png')
                  : require('../../../images/home/daily_check/unchecked.png')
              }
              style={styles.checkBoxImage}
            />
            <Text style={styles.checklistText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 완료 버튼 */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={calculateChecked}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 결과 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderModalContent()}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                  source={require('../../../images/home/daily_check/확인.png')}
                  style={styles.modalButtonImage1}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BottomNavigation', {screen: 'KitStack'})
                }>
                <Image
                  source={require('../../../images/home/daily_check/키트.png')}
                  style={styles.modalButtonImage2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Daily_check_screen;
