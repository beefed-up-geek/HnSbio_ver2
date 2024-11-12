// src/screens/home/index.js
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

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

  const [estimatedKidneyFunction, setEstimatedKidneyFunction] = useState(null);
  const [latestCheckupDate, setLatestCheckupDate] = useState('');

  // 신기능 단계에 따른 스타일 설정 함수
  const getKidneyFunctionStyle = functionValue => {
    if (functionValue >= 90) {
      return {
        backgroundColor: '#DFEEFF',
        color: '#4099FF',
        description: '신장이 정상적으로 기능하고 있습니다.',
      };
    } else if (functionValue >= 60) {
      return {
        backgroundColor: '#D9F9CF',
        color: '#5E8254',
        description:
          '약간의 신기능 감소가 있습니다.',
      };
    } else if (functionValue >= 30) {
      return {
        backgroundColor: '#FFF5AC',
        color: '#B4AA05',
        description:
          '신기능이 중등도로 감소하여 일부 증상이 나타날 수 있습니다.',
      };
    } else if (functionValue >= 15) {
      return {
        backgroundColor: '#FFDDA2',
        color: '#E49509',
        description:
          '신기능이 심각하게 감소하여 전문적인 의료 관리가 필요합니다.',
      };
    } else {
      return {
        backgroundColor: '#FFECEC',
        color: '#EA4447',
        description:
          '신장이 거의 기능하지 않는 상태로, 투석이나 이식이 필요할 수 있습니다.',
      };
    }
  };

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

        // 가장 최근의 resSerumCreatinine 값 가져오기
        if (parsedData.healthCheckup && parsedData.healthCheckup.length > 0) {
          const sortedHealthCheckup = parsedData.healthCheckup.sort((a, b) => {
            const dateA = new Date(
              a.resCheckupYear,
              a.resCheckupDate.substring(0, 2) - 1,
              a.resCheckupDate.substring(2),
            );
            const dateB = new Date(
              b.resCheckupYear,
              b.resCheckupDate.substring(0, 2) - 1,
              b.resCheckupDate.substring(2),
            );
            return dateB - dateA;
          });

          const latestCheckup = sortedHealthCheckup[0];
          const serumCreatinine = parseFloat(latestCheckup.resSerumCreatinine);
          if (!isNaN(serumCreatinine) && serumCreatinine > 0) {
            let estimatedFunction;
            if (parsedData.gender === 'male') {
              estimatedFunction = (0.9 / serumCreatinine) * 100;
            } else {
              estimatedFunction = (0.7 / serumCreatinine) * 100;
            }
            setEstimatedKidneyFunction(Math.round(estimatedFunction));
          } else {
            setEstimatedKidneyFunction(null);
          }

          // 날짜 문자열 형식화
          const dateString = `${
            latestCheckup.resCheckupYear
          }.${latestCheckup.resCheckupDate.substring(
            0,
            2,
          )}.${latestCheckup.resCheckupDate.substring(2)}`;
          setLatestCheckupDate(dateString);
        }
      }
    } catch (error) {
      console.error('Error loading user data from AsyncStorage:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkDailyCompletionStatus();
    }, []),
  );

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
            onPress={() =>
              navigation.navigate('NoTabs', {screen: 'kit_guide_1'})
            }>
            <Image
              source={require('../../images/home/testButton.png')}
              style={styles.button}
            />
          </TouchableOpacity>
        </View>

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
            navigation.navigate('BottomNavigation', {screen: 'HealthStack'})
          }>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/body.png')}
              style={styles.bodyImage}
            />
            <View style={styles.titleLines}>
              <Text style={styles.boxText}>신기능 추정치</Text>
              <View style={styles.subLines}>
                <Text style={styles.boxSubTextDark}>
                  {latestCheckupDate} 건강검진 결과 기준
                </Text>
                {estimatedKidneyFunction !== null && (
                  <Text style={styles.boxSubLight}>
                    {getKidneyFunctionStyle(estimatedKidneyFunction).description}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={[
              styles.percentageContainer,
              {
                backgroundColor: getKidneyFunctionStyle(estimatedKidneyFunction)
                  .backgroundColor,
              },
            ]}>
            {estimatedKidneyFunction !== null ? (
              <Text
                style={[
                  styles.percentageText,
                  {
                    color: getKidneyFunctionStyle(estimatedKidneyFunction)
                      .color,
                  },
                ]}>
                {estimatedKidneyFunction}%
              </Text>
            ) : (
              <Text style={styles.noDataText}>데이터 없음</Text>
            )}
          </View>
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
              <Text style={styles.boxSubLight}>매일 체크하는 것을 권장해요</Text>
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
