// src/screens/home/set_push_alarm/index.js

import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-switch';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

import ModalComponent from '../../../components/ModalComponent';
import styles from './styles.js';

// ★ Context import
import { HomeContext } from '../../../components/homeContext';

const SetPushAlarmScreen = () => {
  const navigation = useNavigation();
  
  // ★ HomeContext에서 전역 변수/함수 가져오기
  const { rerenderHome, setRerenderHome } = useContext(HomeContext);

  // 화면 상태 변수
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [nextAlarmDate, setNextAlarmDate] = useState(new Date());
  const [initialSettings, setInitialSettings] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [_id, setId] = useState('');

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

  // 변경 사항 여부
  const hasChanges = () => {
    return (
      initialSettings.alarmEnabled !== alarmEnabled ||
      formatDate(initialSettings.nextAlarmDate) !== formatDate(nextAlarmDate)
    );
  };

  // 사용자 데이터 불러오기
  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setId(parsedData._id);

      const localSettings = parsedData.pushNotificationSettings;
      if (localSettings) {
        setAlarmEnabled(localSettings.alarmEnabled);
        setNextAlarmDate(
          new Date(localSettings.nextAlarmDate) || 
          new Date(Date.now() + 24 * 60 * 60 * 1000)
        );
        setInitialSettings({
          alarmEnabled: localSettings.alarmEnabled,
          nextAlarmDate: new Date(localSettings.nextAlarmDate) || 
                         new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      } else {
        setAlarmEnabled(false);
        setNextAlarmDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
        setInitialSettings({
          alarmEnabled: false,
          nextAlarmDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 알람 상태 토글
  const toggleAlarm = async () => {
    setAlarmEnabled((prev) => !prev);
    if (!alarmEnabled) {
      setNextAlarmDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    }
  };

  // 키트 알림 스케줄
  const scheduleKitNotifications = async (date) => {
    const dayOf = new Date(nextAlarmDate);
    dayOf.setHours(0, 0, 0, 0);
    dayOf.setHours(9);

    const dayBefore = new Date(dayOf);
    dayBefore.setDate(dayBefore.getDate() - 1);

    const now = new Date();  
    console.log('dayOf:', dayOf.toString());
    console.log('now:', now.toString());
    console.log('dayBefore:', dayBefore.toString());

    // 하루 전 알림
    if (dayBefore > now) {
      const triggerBefore = {
        type: TriggerType.TIMESTAMP,
        timestamp: dayBefore.getTime(),
      };
      try {
        const triggerId = await notifee.createTriggerNotification(
          {
            title: '키트 검사 예정일 알림',
            body: '내일은 키트 검사일이에요! 키트가 준비되었는지 확인해보세요',
            android: { channelId: 'default', smallIcon: 'hns', color: '#4CAF50' },
            ios: { sound: 'default', badgeCount: 1 },
          },
          triggerBefore
        );
        console.log('Created Trigger Notification ID (dayBefore):', triggerId);
      } catch (error) {
        console.error('Error creating trigger notification (dayBefore):', error);
      }
    }
    // 당일 알림
    if (dayOf > now) {
      const triggerDayOf = {
        type: TriggerType.TIMESTAMP,
        timestamp: dayOf.getTime(),
      };
      try {
        const triggerId = await notifee.createTriggerNotification(
          {
            title: '키트 검사 예정일 알림',
            body: '오늘은 키트 검사일이에요!',
            android: { channelId: 'default', smallIcon: 'hns', color: '#4CAF50' },
            ios: { sound: 'default', badgeCount: 1 },
          },
          triggerDayOf
        );
        console.log('Created Trigger Notification ID (dayOf):', triggerId);
      } catch (error) {
        console.error('Error creating trigger notification (dayOf):', error);
      }
    }
  };

  // 알림 설정 저장
  const savePushNotificationSettings = async () => {
    if (!_id) {
      Alert.alert('Error', 'Provider ID를 찾을 수 없습니다.');
      return;
    }

    try {
      setConfirmationModalVisible(true);
      setInitialSettings({ alarmEnabled, nextAlarmDate });

      // AsyncStorage에 저장
      await AsyncStorage.mergeItem(
        'user',
        JSON.stringify({
          pushNotificationSettings: {
            alarmEnabled,
            nextAlarmDate,
          },
        })
      );

      // 알람 On이면 검사일 전날+당일 알림 예약
      if (alarmEnabled) {
        await notifee.cancelAllNotifications();
        await scheduleKitNotifications(nextAlarmDate);
      } else {
        // 알람 Off이면 예약된 알림 모두 취소
        await notifee.cancelAllNotifications();
      }

      // ★ 여기에서 HomeContext의 rerenderHome을 토글 => 홈화면 재렌더 트리거
      setRerenderHome((prev) => !prev);

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

// DetailRow 컴포넌트
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
