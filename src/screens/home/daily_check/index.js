// src/screens/home/daily_check/index.js

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const Daily_check_screen = () => {
  const navigation = useNavigation();

  const [checks, setChecks] = useState(Array(7).fill(false));
  const [modalVisible, setModalVisible] = useState(false); // 모달 가시성 상태
  const [checkedCount, setCheckedCount] = useState(0);

  const checklistItems = [
    '자다가 일어나 소변을 자주 본다.',
    '소변이 탁하고 거품이 많이 나타난다.',
    '눈 주위나 손발이 부어 오른다.',
    '입맛이 없다.',
    '쉽게 피곤해진다.',
    '몸 전체가 가렵다.',
  ];

  const handleCheckChange = index => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const calculateChecked = () => {
    const count = checks.filter(Boolean).length;
    setCheckedCount(count);
    setModalVisible(true);
  };

  // 개수에 따른 모달
  const renderModalContent = () => {
    if (checkedCount === 0) {
      return (
        <>
          <Text style={styles.modalMessage}>
            아직 해당하는 증상이 없어요.{'\n'}
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={calculateChecked}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity onPress={() => navigation.navigate('BottomNavigation', {screen: 'Kit_screen'})}>
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
