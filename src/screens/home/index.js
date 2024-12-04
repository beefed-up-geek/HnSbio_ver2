// src\screens\home\index.js

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import DevButton from '../../components/devButton.js';
import styles from './styles.js'; // 스타일 분리
import {
  parseDateString,
  parseHealthCheckupDate,
  formatDate,
  calculateAge,
  calculateGFR,
  getLatestGFR,
} from '../../components/dataUtils';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

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
  const [latestBloodTest, setLatestBloodTest] = useState(null);
  const [latestGFR, setLatestGFR] = useState(null);
  const [latestCheckupDate, setLatestCheckupDate] = useState('');
  const [latestRecordSource, setLatestRecordSource] = useState('');

  // 홈화면 메인 글자를 위한 상태변수
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [repeatInterval, setRepeatInterval] = useState(null);
  const [daysToNextKitTest, setDaysToNextKitTest] = useState(null);
  const [latestKitTest, setLatestKitTest] = useState(null);
  const [lastKitTestDaysAgo, setLastKitTestDaysAgo] = useState(null);
  const [checkCompletedToday, setCheckCompletedToday] = useState(false);

  const characterOpacity = useState(new Animated.Value(1))[0];

  const getKidneyImage = gfrValue => {
    if (gfrValue >= 90) {
      return require('../../images/home/콩팥_정상.png');
    } else if (gfrValue >= 60) {
      return require('../../images/home/콩팥_주의.png');
    } else if (gfrValue >= 30) {
      return require('../../images/home/콩팥_중등도.png');
    } else if (gfrValue >= 15) {
      return require('../../images/home/콩팥_위험.png');
    } else {
      return require('../../images/home/콩팥_매우위험.png');
    }
  };

  // Functions for kit test calculations
  const calculateNextKitTest = () => {
    if (alarmEnabled && startDate && repeatInterval) {
      const currentDate = new Date();
      const start = new Date(startDate);
      const repeatDays = parseInt(repeatInterval);

      const diffTime = currentDate.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      const periodsElapsed = Math.floor(diffDays / repeatDays);

      const nextTestDate = new Date(start.getTime());
      nextTestDate.setDate(start.getDate() + (periodsElapsed + 1) * repeatDays);

      const daysLeft = Math.ceil(
        (nextTestDate - currentDate) / (1000 * 3600 * 24),
      );

      setDaysToNextKitTest(daysLeft);
    } else {
      setDaysToNextKitTest(null);
    }
  };

  const calculateLastKitTest = () => {
    if (latestKitTest) {
      const lastTestDate = parseDateString(latestKitTest.datetime);
      lastTestDate.setHours(0, 0, 0, 0);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const timeDiff = currentDate - lastTestDate;
      const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysAgo >= 0) {
        setLastKitTestDaysAgo(daysAgo);
      } else {
        setLastKitTestDaysAgo(null);
      }
    } else {
      setLastKitTestDaysAgo(null);
    }
  };

  // // homeScreenData가 변경될 때마다 데이터 업데이트
  // useEffect(() => {
  //   if (route.params?.homeScreenData) {
  //     const data = route.params.homeScreenData;
  //     setName(data.name);
  //     setGender(data.gender);
  //     setHeight(data.height);
  //     setWeight(data.weight);
  //     setBirthdate(data.birthdate);
  //     setNickname(data.nickname);
  //     setChronicKidneyDisease(data.chronic_kidney_disease);
  //     setUnderlyingDisease(data.underlying_disease);

  //     if (data.healthCheckup && data.healthCheckup.length > 0) {
  //       const sortedHealthCheckup = data.healthCheckup.sort((a, b) => {
  //         const dateA = new Date(
  //           a.resCheckupYear,
  //           a.resCheckupDate.substring(0, 2) - 1,
  //           a.resCheckupDate.substring(2),
  //         );
  //         const dateB = new Date(
  //           b.resCheckupYear,
  //           b.resCheckupDate.substring(0, 2) - 1,
  //           b.resCheckupDate.substring(2),
  //         );
  //         return dateB - dateA;
  //       });

  //       const latestCheckup = sortedHealthCheckup[0];
  //       const serumCreatinine = parseFloat(latestCheckup.resSerumCreatinine);
  //       if (!isNaN(serumCreatinine) && serumCreatinine > 0) {
  //         let estimatedFunction;
  //         if (data.gender === 'male') {
  //           estimatedFunction = (0.9 / serumCreatinine) * 100;
  //         } else {
  //           estimatedFunction = (0.7 / serumCreatinine) * 100;
  //         }
  //         setEstimatedKidneyFunction(Math.round(estimatedFunction));
  //       }

  //       const dateString = `${
  //         latestCheckup.resCheckupYear
  //       }.${latestCheckup.resCheckupDate.substring(
  //         0,
  //         2,
  //       )}.${latestCheckup.resCheckupDate.substring(2)}`;
  //       setLatestCheckupDate(dateString);
  //     }
  //   }
  // }, [route.params?.homeScreenData]);

  useEffect(() => {
    calculateNextKitTest();
    calculateLastKitTest();
  }, [alarmEnabled, startDate, repeatInterval, latestKitTest]);

  // AsyncStorage에서 사용자 정보를 불러오는 함수
  const loadUserData = async () => {
    console.log('홈 화면 갱신!');
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

        // Retrieve pushNotificationSettings
        if (parsedData.pushNotificationSettings) {
          const {alarmEnabled, startDate, repeatInterval} =
            parsedData.pushNotificationSettings;
          setAlarmEnabled(alarmEnabled);
          setStartDate(startDate);
          setRepeatInterval(repeatInterval);
        } else {
          setAlarmEnabled(false);
          setStartDate(null);
          setRepeatInterval(null);
        }

        // 가장 최근 키트검사 결과를 latestKitTest 변수로 설정
        if (parsedData.kit_result && parsedData.kit_result.length > 0) {
          const validKitResults = parsedData.kit_result.filter(kit => {
            const date = parseDateString(kit.datetime);
            if (date) {
              kit.parsedDate = date; // Store parsed date for sorting
              return true;
            } else {
              console.warn(`Invalid datetime in kit_result: ${kit.datetime}`);
              return false;
            }
          });

          if (validKitResults.length > 0) {
            validKitResults.sort((a, b) => b.parsedDate - a.parsedDate);
            setLatestKitTest(validKitResults[0]);
          } else {
            setLatestKitTest(null);
          }
        } else {
          setLatestKitTest(null);
        }

        // Get latest GFR
        const {latestGFR, latestCheckupDate, latestRecordSource} = getLatestGFR(
          parsedData,
          parsedData.birthdate,
          parsedData.gender,
        );

        setLatestGFR(latestGFR);
        setLatestCheckupDate(latestCheckupDate);
        setLatestRecordSource(latestRecordSource);
      }
    } catch (error) {
      console.error('Error loading user data from AsyncStorage:', error);
    }
  };

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
    loadUserData(); // Load user data when the component mounts
    checkDailyCompletionStatus(); // Also check daily completion status
  }, []);

  return (
    <LinearGradient
      colors={['#EBEFFE', '#B7C8FF']}
      start={{x: 0, y: 0.54}} // 그라데이션 시작점 (위쪽)
      end={{x: 0, y: 1.2}} // 그라데이션 끝점 (아래쪽)
      style={styles.gradient}>
      <View style={styles.logoContainer}>
        <DevButton loadUserData={loadUserData} />
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('NoTabs', {screen: 'my_profile'})}>
        <Text style={styles.profileText}>내 프로필</Text>
        <Image
          source={require('../../images/home/user.png')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: characterOpacity}}}],
          {
            useNativeDriver: false,
            listener: event => {
              const offsetY = event.nativeEvent.contentOffset.y;
              characterOpacity.setValue(1 - Math.min(offsetY / 100, 1));
            },
          },
        )}>
        <Animated.View style={[styles.character, {opacity: characterOpacity}]}>
          <Image
            source={require('../../images/home/sampleimage2.png')}
            style={styles.characterImage}
          />
        </Animated.View>

        {alarmEnabled && daysToNextKitTest !== null ? (
          <>
            <Text style={styles.nextCheckupText1}>다음 키트 검사일까지</Text>
            <View style={styles.lineWrapper}>
              <Text style={styles.nextCheckupText2}>
                {daysToNextKitTest}일 남았습니다
              </Text>
              <TouchableOpacity
                style={styles.setPushAlarmButton}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'set_push_alarm',
                    params: { 
                      refreshHome: loadUserData 
                    },
                  })
                }>
                <Image
                  source={require('../../images/home/gearIcon.png')}
                  style={styles.setPushAlarmIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : latestKitTest ? (
          <>
            <Text style={styles.nextCheckupText1}>마지막 키트 검사일은</Text>
            <View style={styles.lineWrapper}>
              <Text style={styles.nextCheckupText2}>
                {lastKitTestDaysAgo !== null
                  ? `${lastKitTestDaysAgo}일 전입니다`
                  : '오늘입니다'}
              </Text>
              <TouchableOpacity
                style={styles.setPushAlarmButton}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'set_push_alarm',
                    params: { 
                      refreshHome: loadUserData 
                    },
                  })
                }>
                <Image
                  source={require('../../images/home/gearIcon.png')}
                  style={styles.setPushAlarmIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.nextCheckupText1}>
              아직 검사를 하지 않았어요.
            </Text>
            <View style={styles.lineWrapper}>
              <Text style={styles.nextCheckupText2}>
                콩팥 건강 관리를 시작해보세요
              </Text>
              <TouchableOpacity
                style={styles.setPushAlarmButton}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'set_push_alarm',
                    params: { 
                      refreshHome: loadUserData 
                    },
                  })
                }>
                
                <Image
                  source={require('../../images/home/gearIcon.png')}
                  style={styles.setPushAlarmIcon}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://hnsbiolab.com/device')}>
            <Image
              source={require('../../images/home/storeButton.png')}
              style={styles.button}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NoTabs', {screen: 'kit_guide_1'})
            }>
            <Image
              source={require('../../images/home/testButton.png')}
              style={styles.button}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.roundedButtonBox}
          onPress={() =>
            navigation.navigate('BottomNavigation', {screen: 'Kit'})
          }>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/kit.png')}
              style={styles.bodyImage}
            />
            <View style={styles.titleLines}>
              <Text style={styles.boxText}>콩팥 진단 키트 결과</Text>
              <View style={styles.subLines}>
                {latestKitTest ? (
                  <>
                    <Text style={styles.boxSubTextLight}>
                      {formatDate(parseDateString(latestKitTest.datetime))} 키트
                      결과 기준
                    </Text>
                  </>
                ) : (
                  <Text style={styles.boxSubTextLight}>
                    최근 검사 결과가 없습니다.
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.imageContainer}>
            {latestKitTest ? (
              latestKitTest.result === 1 ? (
                <Image
                  source={require('../../images/home/양성.png')} // 양성일 때 표시
                  style={styles.kidneyImage}
                />
              ) : (
                <Image
                  source={require('../../images/home/음성.png')} // 음성일 때 표시
                  style={styles.kidneyImage}
                />
              )
            ) : (
              <Image
                source={require('../../images/home/데이터없음.png')} // 결과가 없을 때 표시
                style={styles.noDataImage}
              />
            )}
          </View>
        </TouchableOpacity>

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
              <Text style={styles.boxText}>나의 콩팥 건강</Text>
              <View style={styles.subLines}>
                <Text style={styles.boxSubTextLight}>
                  {latestCheckupDate
                    ? latestRecordSource === 'health_checkup'
                      ? `${latestCheckupDate} 건강검진 결과 기준`
                      : `${latestCheckupDate} 혈액검사 결과 기준`
                    : '최근 검진 기록이 없습니다.'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.imageContainer}>
            {latestGFR !== null ? (
              <Image
                source={getKidneyImage(latestGFR)}
                style={styles.kidneyImage}
              />
            ) : (
              <Image
                source={require('../../images/home/데이터없음.png')}
                style={styles.noDataImage}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundedButtonBox}
          onPress={() =>
            navigation.navigate('NoTabs', {
              screen: 'daily_check',
              params: { 
                refreshHome: loadUserData 
              },
            })
          }>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/check.png')}
              style={styles.checkImage}
            />
            <View style={styles.titleLines}>
              <Text style={styles.boxText}>오늘의 콩팥 상태 체크하기</Text>
              <Text style={styles.boxSubTextLight}>
                매일 체크하는 것을 권장해요.
              </Text>
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
