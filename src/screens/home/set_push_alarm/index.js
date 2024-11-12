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

  const [alarmEnabled, setAlarmEnabled] = useState(false);
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

  const formatDate = date => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // 변경사항 유무 확인 함수
  const hasChanges = () => {
    return (
      initialSettings.alarmEnabled !== alarmEnabled ||
      formatDate(initialSettings.startDate) !== formatDate(startDate) ||
      initialSettings.repeatInterval !== repeatInterval
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProviderId(parsedData.providerId);

        // 서버에서 알림 설정 가져오기
        fetchPushNotificationSettings(parsedData.providerId);
      }
    };

    const fetchPushNotificationSettings = async providerId => {
      try {
        const response = await axios.get(
          `http://54.79.61.80:5000/user_info/getPushNotificationSettings?providerId=${providerId}`,
        );

        if (response.data) {
          const {alarmEnabled, startDate, repeatInterval} = response.data;

          // Ensure startDate is a Date object
          const parsedStartDate = new Date(startDate);

          setAlarmEnabled(alarmEnabled);
          setStartDate(parsedStartDate);
          setRepeatInterval(String(repeatInterval));

          // 초기 설정값 설정
          setInitialSettings({
            alarmEnabled,
            startDate: parsedStartDate,
            repeatInterval: String(repeatInterval),
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Default settings applied due to missing user data.');
          setAlarmEnabled(false); // 디폴트 알림 설정을 "꺼짐"으로 설정
          setStartDate(new Date());
          setRepeatInterval('28');

          // Set initialSettings with default values
          setInitialSettings({
            alarmEnabled: false,
            startDate: new Date(),
            repeatInterval: '28',
          });
        } else {
          console.error('Error fetching push notification settings:', error);
          Alert.alert('Error', '알림 설정을 불러오는 중 오류가 발생했습니다.');
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleAlarm = () => setAlarmEnabled(previousState => !previousState);

  const openModal = key => {
    setModalVisible(prevState => ({...prevState, [key]: true}));
  };

  const closeModal = key => {
    setModalVisible(prevState => ({...prevState, [key]: false}));
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
      // Ensure startDate is a Date object when updating initialSettings
      setInitialSettings({
        alarmEnabled,
        startDate,
        repeatInterval,
      });
    } catch (error) {
      console.error('Error saving push notification settings:', error);
      Alert.alert('Error', '설정을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        {alarmEnabled !== null && ( // alarmEnabled가 null이 아닌 경우에만 렌더링
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
                circleSize={27}
                barHeight={31}
                circleBorderWidth={0}
                backgroundActive={'#7697FF'}
                backgroundInactive={'#7F7F7F'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                switchLeftPx={4}
                switchRightPx={4}
                switchWidthMultiplier={1.9}
              />
            }
            last={!alarmEnabled}
          />
        )}
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
            {color: hasChanges() ? '#7596FF' : '#7F7F7F'},
          ]}>
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
