// src/screens/home/index.js
import React, { useEffect, useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import styles from './styles.js'; // 스타일 분리
import theme from '../../theme'; // 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const HomeScreen = () => {
  const navigation = useNavigation();

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
    loadUserData(); // 컴포넌트가 마운트될 때 사용자 데이터 로드
  }, []);

  return (
    <LinearGradient
      colors={['#EBEFFE','#B7C8FF']}
      start={{ x: 0, y: 0.54 }} // 그라데이션 시작점 (위쪽)
      end={{ x: 0, y: 1.2}} // 그라데이션 끝점 (아래쪽)
      style={styles.gradient}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        scrollEventThrottle={16} 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: characterOpacity } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              // 스크롤 위치에 따라 characterOpacity 변경
              const offsetY = event.nativeEvent.contentOffset.y;
              characterOpacity.setValue(1 - Math.min(offsetY / 100, 1)); // 스크롤에 따라 투명도 변경
            }
          }
        )}
      >
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

        <View style={styles.character}>
          <Image
            source={require('../../images/home/sampleimage.png')}
            style={styles.characterImage}
          />  
        </View>

        <Animated.View style={[styles.character, { opacity: characterOpacity }]}>
          <Image
            source={require('../../images/home/sampleimage.png')}
            style={styles.characterImage}
          />  
        </Animated.View>

        <Text style={styles.nextCheckupText}>
          다음 검사까지 13일 남았어요
        </Text>

        <View style={styles.infoBox}>
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
        </View>

        <View style={styles.resultsContainer}>
          <TouchableOpacity 
                style={styles.pastResultGo} 
                onPress={() => navigation.navigate('KitStack')}
          >
            <Text style={styles.sectionTitle}>지난 결과</Text>    
            <Image
              source={require('../../images/home/resultGo.png')}
              style={styles.resultGoIcon}
            />  
          </TouchableOpacity>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.resultBoxContainer}
          >
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
              <Text style={styles.dateText}>8월 27일</Text>
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
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.roundedButtonBox}
          onPress={() => navigation.navigate('NoTabs', { screen: 'kidney_info' })}
        >
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/body.png')}
              style={styles.bodyImage}
            />  
            <Text style={styles.boxText}>만성콩팥병 위험도</Text>
          </View>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../images/home/낮음.png')}
              style={styles.CKDstage1Image}
            />  
            <Image
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />  
          </View>

        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roundedButtonBox}
          onPress={() => navigation.navigate('NoTabs', { screen: 'daily_check' })}
        >
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
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />  
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;
