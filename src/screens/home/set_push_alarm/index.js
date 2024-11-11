// src/screens/home/set_push_alarm/index.js

import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const Set_push_alarm_screen = () => {
  const navigation = useNavigation();

  const [alarmEnabled, setAlarmEnabled] = useState(true);
  // const [startDate, setStartDate] = useState('2024.9.7');
  const [repeatInterval, setRepeatInterval] = useState('28');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRepeatPicker, setShowRepeatPicker] = useState(false);

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
        />
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
          onPress={() => setShowRepeatPicker(true)}
          last
        />
      </View>

      {/* Date Picker Modal */}
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

      {/* Repeat Interval Picker Modal */}
      {showRepeatPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showRepeatPicker}
          onRequestClose={() => setShowRepeatPicker(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={repeatInterval}
                onValueChange={(itemValue, itemIndex) =>
                  setRepeatInterval(itemValue)
                }
                style={styles.picker}>
                {Array.from({length: 100}, (_, i) => i + 1).map(value => (
                  <Picker.Item
                    key={value}
                    label={`${value}일`}
                    value={`${value}`}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => setShowRepeatPicker(false)}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>변경사항 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailRow = ({icon, label, value, last, onPress}) => {
  // const RowComponent = onPress ? TouchableOpacity : View;
  const RowComponent = View;
  return (
    <RowComponent
      // onPress={onPress}
      style={last ? styles.detailLastRow : styles.detailRow}>
      <View style={styles.labelContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        {typeof value === 'string' ? (
          <Text style={styles.detailValue} onPress={onPress}>
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </RowComponent>
  );
};

export default Set_push_alarm_screen;
