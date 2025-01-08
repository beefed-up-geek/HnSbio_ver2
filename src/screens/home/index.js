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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
  const [nextAlarmDate, setNextAlarmDate] = useState(null);
  const [daysToNextAlarm, setDaysToNextAlarm] = useState(null);
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

  // 다음 키트 검사일 계산 함수
  const calculateDaysToNextAlarm = () => {
    if (nextAlarmDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const nextDateMidnight = new Date(nextAlarmDate);
      nextDateMidnight.setHours(0, 0, 0, 0);
      const diffTime = nextDateMidnight.getTime() - currentDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysToNextAlarm(diffDays); // 음수 값도 반영
    } else {
      setDaysToNextAlarm(null);
    }
  };

  // 지난 키트 검사일 계산 함수
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

  useEffect(() => {
    calculateLastKitTest();
    calculateDaysToNextAlarm();
  }, [latestKitTest, nextAlarmDate]);

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
          const {alarmEnabled, nextAlarmDate} =
            parsedData.pushNotificationSettings;
          setAlarmEnabled(alarmEnabled);
          setNextAlarmDate(nextAlarmDate);
        } else {
          setAlarmEnabled(false);
          setNextAlarmDate(null);
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

  // 데일리체크
  useEffect(() => {
    loadUserData(); // Load user data when the component mounts
    checkDailyCompletionStatus(); // Also check daily completion status
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      checkDailyCompletionStatus();
    }, []),
  );

  return (
    <LinearGradient
      colors={['#EBEFFE', '#B7C8FF']}
      start={{x: 0, y: 0.54}} // 그라데이션 시작점 (위쪽)
      end={{x: 0, y: 1.2}} // 그라데이션 끝점 (아래쪽)
      style={styles.gradient}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          paddingTop: insets.top,
        }}>
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
          <Animated.View
            style={[styles.character, {opacity: characterOpacity}]}>
            <Image
              source={require('../../images/home/sampleimage2.png')}
              style={styles.characterImage}
            />
          </Animated.View>

          {/* 홈 화면 메인 텍스트 */}
          {alarmEnabled && nextAlarmDate !== null ? (
            // [Case A] 알림이 설정되어 있고, nextAlarmDate도 존재하는 경우
            <>
              {daysToNextAlarm > 0 ? (
                // “다음 키트 검사일까지 N일 남았습니다”
                <>
                  <Text style={styles.nextCheckupText1}>
                    다음 키트 검사일까지
                  </Text>
                  <View style={styles.lineWrapper}>
                    <Text style={styles.nextCheckupText2}>
                      {daysToNextAlarm}일 남았습니다
                    </Text>
                    <TouchableOpacity
                      style={styles.setPushAlarmButton}
                      onPress={() =>
                        navigation.navigate('NoTabs', {
                          screen: 'set_push_alarm',
                        })
                      }>
                      <Image
                        source={require('../../images/home/gearIcon.png')}
                        style={styles.setPushAlarmIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : daysToNextAlarm === 0 ? (
                // “오늘은 검사일이에요!”
                <>
                  <Text style={styles.nextCheckupText1}>
                    오늘은 키트 검사일이에요!
                  </Text>
                  <View style={styles.lineWrapper}>
                    <Text style={styles.nextCheckupText2}>
                      지금 바로 검사를 받아보세요
                    </Text>
                    <TouchableOpacity
                      style={styles.setPushAlarmButton}
                      onPress={() =>
                        navigation.navigate('NoTabs', {
                          screen: 'set_push_alarm',
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
                // 예정일이 지나버린 경우 “키트 검사 예정일로부터 N일이 지났어요”
                <>
                  <Text style={styles.nextCheckupText1}>
                    키트 검사 예정일로부터
                  </Text>
                  <View style={styles.lineWrapper}>
                    <Text style={styles.nextCheckupText2}>
                      {Math.abs(daysToNextAlarm)}일이 지났어요
                    </Text>
                    <TouchableOpacity
                      style={styles.setPushAlarmButton}
                      onPress={() =>
                        navigation.navigate('NoTabs', {
                          screen: 'set_push_alarm',
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
            </>
          ) : !alarmEnabled && latestKitTest && lastKitTestDaysAgo === 0 ? (
            // [Case B] 알림 미설정 && 마지막 키트 검사일이 “오늘”인 경우
            <>
              <Text style={styles.nextCheckupText1}>다음 키트 검사일을</Text>
              <View style={styles.lineWrapper}>
                <Text style={styles.nextCheckupText2}>
                  미리 설정하고 알림을 받아보세요
                </Text>
                <TouchableOpacity
                  style={styles.setPushAlarmButton}
                  onPress={() =>
                    navigation.navigate('NoTabs', {
                      screen: 'set_push_alarm',
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
            // [Case C] 알림 미설정 && 마지막 검사일이 “오늘”이 아닌 경우 (n일 전)
            <>
              <Text style={styles.nextCheckupText1}>마지막 키트 검사일은</Text>
              <View style={styles.lineWrapper}>
                <Text style={styles.nextCheckupText2}>
                  {`${lastKitTestDaysAgo}일 전입니다`}
                </Text>
                <TouchableOpacity
                  style={styles.setPushAlarmButton}
                  onPress={() =>
                    navigation.navigate('NoTabs', {
                      screen: 'set_push_alarm',
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
            // [Case D] 키트 검사 이력이 전혀 없을 때
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
                        {formatDate(parseDateString(latestKitTest.datetime))}{' '}
                        키트 결과 기준
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
                    source={require('../../images/home/_pos.png')} // 양성일 때 표시
                    style={styles.kidneyImage}
                  />
                ) : latestKitTest.result === 0 ? (
                  <Image
                    source={require('../../images/home/_neg.png')} // 양성일 때 표시
                    style={styles.kidneyImage}
                  />
                ) : (
                  <Image
                    source={require('../../images/home/_unkn.png')} // 음성일 때 표시
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
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
