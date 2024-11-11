// src/screens/home/index.js
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import styles from './styles.js'; // 스타일 분리

const HomeScreen = () => {
  const navigation = useNavigation();
  const [checkCompletedToday, setCheckCompletedToday] = useState(false);

  // 사용자 정보를 저장할 상태 변수들
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [nickname, setNickname] = useState('');
  const [chronicKidneyDisease, setChronicKidneyDisease] = useState('');
  const [underlyingDisease, setUnderlyingDisease] = useState({
    hypertension: 0,
    diabetes: 0,
    hyperlipidemia: 0,
    retinal_complication: 0,
  });

  const characterOpacity = useState(new Animated.Value(1))[0];

  // AsyncStorage에서 사용자 정보를 불러오는 함수
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setName(parsedData.name);
        setGender(parsedData.gender);
        setHeight(parsedData.height);
        setWeight(parsedData.weight);
        setBirthdate(parsedData.birthdate);
        setNickname(parsedData.nickname);
        setChronicKidneyDisease(parsedData.chronic_kidney_disease);
        setUnderlyingDisease(parsedData.underlying_disease);
      }
    } catch (error) {
      console.error('Error loading user data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    checkDailyCompletionStatus();
  }, []);

  const checkDailyCompletionStatus = async () => {
    const today = new Date().toDateString(); // today's date as a string
    try {
      const savedDate = await AsyncStorage.getItem('dailyCheckComplete');
      if (savedDate === today) {
        setCheckCompletedToday(true);
      } else {
        setCheckCompletedToday(false); // reset if not completed today
      }
    } catch (error) {
      console.error('Failed to load check completion status:', error);
    }
  };

  useEffect(() => {
    loadUserData(); // 컴포넌트가 마운트될 때 사용자 데이터 로드
  }, []);

  return (
    <LinearGradient
      colors={['#EBEFFE', '#B7C8FF']}
      start={{x: 0, y: 0.54}} // 그라데이션 시작점 (위쪽)
      end={{x: 0, y: 1.2}} // 그라데이션 끝점 (아래쪽)
      style={styles.gradient}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../images/home/logo.png')}
          style={styles.logoImage}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: characterOpacity}}}],
          {
            useNativeDriver: false,
            listener: event => {
              const offsetY = event.nativeEvent.contentOffset.y;
              characterOpacity.setValue(1 - Math.min(offsetY / 300, 1));
            },
          },
        )}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('NoTabs', {screen: 'my_profile'})}>
          <Text style={styles.profileText}>내 프로필</Text>
          <Image
            source={require('../../images/home/user.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>

        <Animated.View style={[styles.character, {opacity: characterOpacity}]}>
          <Image
            source={require('../../images/home/sampleimage2.png')}
            style={styles.characterImage}
          />
        </Animated.View>

        <Text style={styles.nextCheckupText1}>다음 키트 검사일까지</Text>
        <View style={styles.lineWrapper}>
          <Text style={styles.nextCheckupText2}>13일 남았어요</Text>
          <TouchableOpacity
            style={styles.setPushAlarmButton}
            onPress={() =>
              navigation.navigate('NoTabs', {screen: 'set_push_alarm'})
            }>
            <Image
              source={require('../../images/home/gearIcon.png')}
              style={styles.setPushAlarmIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://hnsbiolab.com/device')}>
            <Image
              source={require('../../images/home/storeButton.png')}
              style={styles.button}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NoTabs', {screen: 'kit_guide_1'})}>
            <Image
              source={require('../../images/home/testButton.png')}
              style={styles.button}
            />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.infoTitleContainer}>
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
            <TouchableOpacity style={styles.kitButton} />
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={() => Linking.openURL('https://hnsbiolab.com/device')}
            >
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
          </View> */}

        {/* <View style={styles.resultsContainer}>
          <TouchableOpacity
            style={styles.pastResultGo}
            onPress={() => navigation.navigate('KitStack')}>
            <Text style={styles.sectionTitle}>지난 결과</Text>
            <Image
              source={require('../../images/home/resultGo.png')}
              style={styles.resultGoIcon}
            />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resultBoxContainer}>
            <View style={styles.resultBox}>
              <Text style={styles.dateText}>10월 22일</Text>
              <Image
                source={require('../../images/home/abnormal.png')}
                style={styles.kitStatusImage}
              />
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.dateText}>9월 24일</Text>
              <Image
                source={require('../../images/home/normal.png')}
                style={styles.kitStatusImage}
              />
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.dateText}>8월 27일</Text>
              <Image
                source={require('../../images/home/normal.png')}
                style={styles.kitStatusImage}
              />
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.dateText}>7월 30일</Text>
              <Image
                source={require('../../images/home/normal.png')}
                style={styles.kitStatusImage}
              />
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.dateText}>7월 2일</Text>
              <Image
                source={require('../../images/home/normal.png')}
                style={styles.kitStatusImage}
              />
            </View>
          </ScrollView>
        </View> */}

        <TouchableOpacity
          style={styles.roundedButtonBox}
          onPress={() =>
            navigation.navigate('NoTabs', {screen: 'kidney_info'})
          }>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/body.png')}
              style={styles.bodyImage}
            />
            <View style={styles.titleLines}>
              <Text style={styles.boxText}>만성콩팥병 위험도</Text>
              <Text style={styles.boxSubText}>
                2024.10.17 건강검진 결과 기준
              </Text>
            </View>
          </View>
          <Image
            source={require('../../images/home/낮음.png')}
            style={styles.CKDstage1Image}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundedButtonBox}
          onPress={() =>
            navigation.navigate('NoTabs', {screen: 'daily_check'})
          }>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/check.png')}
              style={styles.checkImage}
            />
            <View style={styles.titleLines}>
              <Text style={styles.boxText}>오늘의 콩팥 상태 체크하기</Text>
              <Text style={styles.boxSubText}>매일 체크하는 것을 권장해요</Text>
            </View>
          </View>
          <Image
            source={
              checkCompletedToday
                ? require('../../images/home/완료.png')
                : require('../../images/home/미완료.png')
            }
            style={styles.checkStatusImage}
          />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
