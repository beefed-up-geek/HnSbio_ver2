// src/screens/home/set_push_alarm/index.js

import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Alert, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import ModalComponent from '../../../components/ModalComponent';
import styles from './styles.js'; // 스타일 불러오기 // 개발 규칙: stylesheet 분리

const Set_push_alarm_screen = () => {
  const navigation = useNavigation();

  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [repeatInterval, setRepeatInterval] = useState('28');
  const [initialSettings, setInitialSettings] = useState({}); // 변경사항 유무 확인
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    repeatInterval: false,
  });
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false); // 변경사항 저장 완료 모달
  const [providerId, setProviderId] = useState('');

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProviderId(parsedData.providerId);
        setInitialSettings({
          alarmEnabled,
          startDate,
          repeatInterval: '28',
        });
      }
    })();
  }, []);

  const toggleAlarm = () => setAlarmEnabled(previousState => !previousState);

  const openModal = key => {
    setModalVisible(prevState => ({...prevState, [key]: true}));
  };

  const closeModal = key => {
    setModalVisible(prevState => ({...prevState, [key]: false}));
  };

  // 변경사항 유무 확인 함수
  const hasChanges = () => {
    return (
      initialSettings.alarmEnabled !== alarmEnabled ||
      initialSettings.startDate.toISOString() !== startDate.toISOString() ||
      initialSettings.repeatInterval !== repeatInterval
    );
  };

  const savePushNotificationSettings = async () => {
    if (!providerId) {
      Alert.alert('Error', 'Provider ID를 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await axios.put(
        'http://54.79.61.80:5000/user_info/updatePushNotificationSettings',
        {
          providerId,
          alarmEnabled,
          startDate: startDate.toISOString(),
          repeatInterval: parseInt(repeatInterval),
        },
      );

      setConfirmationModalVisible(true);
      setInitialSettings({ alarmEnabled, startDate, repeatInterval }); // 저장 후 initial setting 초기화
    } catch (error) {
      console.error('Error saving push notification settings:', error);
      Alert.alert('Error', '설정을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <DetailRow
          icon={require('../../../images/home/set_push_alarm/알림.png')}
          label="알림"
          value={
            <Switch
              value={alarmEnabled}
              onValueChange={toggleAlarm}
              disabled={false}
              activeText={''}
              inActiveText={''}
              circleSize={27} // 원 크기
              barHeight={31} // 스위치 바 높이
              circleBorderWidth={0} // 원 둘레 색
              backgroundActive={'#7697FF'} // 켜짐 배경색
              backgroundInactive={'#7F7F7F'} // 꺼짐 배경색
              circleActiveColor={'white'} // 켜짐 원 내부 색
              circleInActiveColor={'white'} // 꺼짐 원 내부 색
              switchLeftPx={4} // 스위치의 왼쪽 패딩
              switchRightPx={4} // 스위치의 오른쪽 패딩
              switchWidthMultiplier={1.9} // 스위치 바 너비
            />
          }
          last={!alarmEnabled} // 알림이 꺼졌을 때 last 스타일 적용
        />
        {alarmEnabled && (
          <>
            <DetailRow
              icon={require('../../../images/home/set_push_alarm/시작날짜.png')}
              label="시작 날짜"
              value={startDate.toLocaleDateString('ko-KR')}
              onPress={() => setShowDatePicker(true)}
            />
            <DetailRow
              icon={require('../../../images/home/set_push_alarm/반복주기.png')}
              label="반복 주기"
              value={`${repeatInterval}일`}
              onPress={() => openModal('repeatInterval')}
              last
            />
          </>
        )}
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {/* Modal for Repeat Interval */}
      <ModalComponent
        visible={modalVisible.repeatInterval}
        title="반복 주기 변경"
        label="반복 주기"
        value={repeatInterval}
        setValue={setRepeatInterval}
        onClose={() => closeModal('repeatInterval')}
        placeholder="반복 주기를 입력하세요"
        keyboardType="numeric"
      />

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>알림 설정이 저장되었습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setConfirmationModalVisible(false)}>
                <Image
                  source={require('../../../images/home/set_push_alarm/확인.png')}
                  style={styles.modalButtonImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: hasChanges() ? '#EBEFFE' : '#E8E8E8',
          },
        ]}
        onPress={savePushNotificationSettings}
        disabled={!hasChanges()}>
        <Text
          style={[
            styles.saveButtonText,
            { color: hasChanges() ? '#7596FF' : '#7F7F7F' },
          ]}
        >
          변경사항 저장
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailRow = ({icon, label, value, last, onPress}) => (
  <View style={last ? styles.detailLastRow : styles.detailRow}>
    <View style={styles.labelContainer}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>
      {typeof value === 'string' ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.detailValue}>{value}</Text>
        </TouchableOpacity>
      ) : (
        value
      )}
    </View>
  </View>
);

export default Set_push_alarm_screen;
