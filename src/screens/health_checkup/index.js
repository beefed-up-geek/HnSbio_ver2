// src/screens/health_checkup/index.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../theme.js'; // 개발 규칙: 폰트 적용
import { StyleSheet, Dimensions } from 'react-native';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_screen = () => {
  const navigation = useNavigation();

  const fetchData = () => {
    console.log('fetchData 함수 호출됨');
    // 데이터 가져오기 로직을 여기에 추가할 수 있음
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>건강검진</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.recentRecordText}>최근 기록</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => navigation.navigate('NoTabs', {
            screen: 'authentication_1',
            params: { fetchData },
          })}
        >
          <FontAwesome5 name="redo" size={20 * width_ratio} color="#8EAFF6" />
          <Text style={styles.buttonText}>건강검진정보 불러오기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FB',
  },
  headerContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * width_ratio,
    marginTop: 10 * height_ratio,
  },
  recentRecordText: {
    ...theme.fonts.Bold,
    fontSize: 18,
    color: '#333',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFFD',
    padding: 10 * width_ratio,
    borderRadius: 20 * width_ratio,
  },
  buttonText: {
    marginLeft: 5 * width_ratio,
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#4a4a4f',
  },
});

export default Health_checkup_screen;
