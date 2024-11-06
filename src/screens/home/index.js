import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용

import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const { width } = Dimensions.get('screen');
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 기존 코드 */}
      <View style={styles.profileContainer}>
        <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('NoTabs', { screen: 'my_profile' })}
        >
          <Text style={styles.profileText}>내 프로필</Text>
          <Image
            source={require('../../images/home/user.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoTitleContainer}>
          <TouchableOpacity 
            style={styles.setPushAlarmButton}
            onPress={() => navigation.navigate('NoTabs', { screen: 'set_push_alarm' })}
          >
            <Image
              source={require('../../images/home/gearIcon.png')}
              style={styles.setPushAlarmIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.kitButton}>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress = {() => {Linking.openURL('https://hnsbiolab.com/device')}}>
            <Text style={styles.buttonText}>키트 구매하기</Text>
            <Image
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={() => navigation.navigate('KitStack')}
            >
            <Text style={styles.buttonText}>검사하러 가기</Text>
            <Image
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.roundedButtonBox}
        onPress={() => navigation.navigate('NoTabs', { screen: 'kidney_info' })}>
        <Text style={styles.boxText}>만성콩팥병 위험도</Text>
        <Text style={styles.boxStatus}>정상</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.roundedButtonBox}
        onPress={() => navigation.navigate('NoTabs', { screen: 'daily_check' })}>
        <Text style={styles.boxText}>오늘의 콩팥 상태 체크하기</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default HomeScreen;
