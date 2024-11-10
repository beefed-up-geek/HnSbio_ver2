// src/screens/home/set_push_alarm/index.js

import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Switch } from 'react-native-switch'; 

import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const Set_push_alarm_screen = () => {
  const navigation = useNavigation();

  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [startDate, setStartDate] = useState('2024.9.7');
  const [repeatInterval, setRepeatInterval] = useState('28일');

  const toggleAlarm = () => setAlarmEnabled(previousState => !previousState);

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
              barHeight={31}  // 스위치 바 높이
              circleBorderWidth={0}  // 원 둘레 색
              backgroundActive={'#7697FF'}  // 켜짐 배경색
              backgroundInactive={'#7F7F7F'}  // 꺼짐 배경색
              circleActiveColor={'white'}  // 켜짐 원 내부 색
              circleInActiveColor={'white'}  // 꺼짐 원 내부 색
              switchLeftPx={4}  // 스위치의 왼쪽 패딩
              switchRightPx={4}  // 스위치의 오른쪽 패딩
              switchWidthMultiplier={1.9}  // 스위치 바 너비 
            />
          }
        />
        <DetailRow
          icon={require('../../../images/home/set_push_alarm/시작날짜.png')}
          label="시작 날짜"
          value={startDate}
        />
        <DetailRow
          icon={require('../../../images/home/set_push_alarm/반복주기.png')}
          label="반복 주기"
          value={repeatInterval}
          last
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>변경사항 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailRow = ({ icon, label, value, last }) => (
    <View style={last ? styles.detailLastRow : styles.detailRow}>
      <View style={styles.labelContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        {typeof value === 'string' ? (
          <Text style={styles.detailValue}>{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );

export default Set_push_alarm_screen;
