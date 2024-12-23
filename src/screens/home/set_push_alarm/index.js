import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-switch';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModalComponent from '../../../components/ModalComponent';
import styles from './styles.js';

const SetPushAlarmScreen = ({ route }) => {
  const navigation = useNavigation();

  // 전달된 refreshHome 함수: "변경사항 저장" 버튼에서만 호출
  const refreshHome = route.params?.refreshHome || (() => {});

  // 화면 상태 변수
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [nextAlarmDate, setNextAlarmDate] = useState(new Date());
  const [initialSettings, setInitialSettings] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [providerId, setProviderId] = useState('');

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // 변경 사항이 있는지 확인
  const hasChanges = () => {
    return (
      initialSettings.alarmEnabled !== alarmEnabled ||
      formatDate(initialSettings.nextAlarmDate) !== formatDate(nextAlarmDate)
    );
  };

  // 사용자 데이터 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProviderId(parsedData.providerId);

        const localSettings = parsedData.pushNotificationSettings;
        if (localSettings) {
          setAlarmEnabled(localSettings.alarmEnabled);
          setNextAlarmDate(new Date(localSettings.nextAlarmDate) || new Date());
          setInitialSettings({
            alarmEnabled: localSettings.alarmEnabled,
            nextAlarmDate: new Date(localSettings.nextAlarmDate) || new Date(),
          });
        } else {
          setAlarmEnabled(false);
          setNextAlarmDate(new Date());
          setInitialSettings({
            alarmEnabled: false,
            nextAlarmDate: new Date(),
          });
        }
      }
    };

    fetchUserData();
  }, []);

  // 알람 상태 토글
  const toggleAlarm = () => setAlarmEnabled((prev) => !prev);

  // 알림 설정 저장
  const savePushNotificationSettings = async () => {
    if (!providerId) {
      Alert.alert('Error', 'Provider ID를 찾을 수 없습니다.');
      return;
    }

    try {
      setConfirmationModalVisible(true);
      setInitialSettings({ alarmEnabled, nextAlarmDate });

      // AsyncStorage에 데이터 저장
      await AsyncStorage.mergeItem(
        'user',
        JSON.stringify({
          pushNotificationSettings: {
            alarmEnabled,
            nextAlarmDate,
          },
        })
      );

      // "변경사항 저장" 시에만 홈 화면 갱신 함수 호출
      refreshHome();
    } catch (error) {
      console.error('Error saving push notification settings:', error);
      Alert.alert('Error', '설정을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        {/* 알림 설정 */}
        {alarmEnabled !== null && (
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
        {/* 다음 알림 날짜 */}
        {alarmEnabled && (
          <DetailRow
            icon={require('../../../images/home/set_push_alarm/반복주기.png')}
            label="다음 키트 검사일"
            value={nextAlarmDate.toLocaleDateString('ko-KR')}
            onPress={() => setShowDatePicker(true)}
            last
          />
        )}
      </View>
      
      {/* 날짜 선택기 */}
      {showDatePicker && (
        <DateTimePicker
          value={nextAlarmDate}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setNextAlarmDate(selectedDate);
            }
          }}
        />
      )}

      {/* 확인 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>알림 설정이 저장되었습니다.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={() => setConfirmationModalVisible(false)}>
                <Image
                  source={require('../../../images/home/set_push_alarm/확인.png')}
                  style={styles.modalButtonImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 저장 버튼 */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: hasChanges() ? '#EBEFFE' : '#E8E8E8',
          },
        ]}
        onPress={savePushNotificationSettings}
        disabled={!hasChanges()}
      >
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

const DetailRow = ({ icon, label, value, last, onPress }) => (
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

export default SetPushAlarmScreen;
