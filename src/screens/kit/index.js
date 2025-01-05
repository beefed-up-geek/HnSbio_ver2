// src\screens\kit\index.js
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // 백엔드 API 호출을 위해 axios 추가
import dayjs from 'dayjs';
import {SafeAreaView} from 'react-native';

import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; // stylesheet 분리

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const Kit_screen = ({onPress, navigation, route}) => {
  const [results, setResults] = useState([]);
  const [recentDate, setRecentDate] = useState('');

  // 최근 검사 날짜 로드
  const loadRecentDate = async () => {
    try {
      const dateRecentStr = await AsyncStorage.getItem('@recent_test_date');
      if (dateRecentStr) {
        const dateRecentFormatted = dayjs(
          dateRecentStr,
          'YYYY/MM/DD HH:mm:ss',
        ).format('YYYY/MM/DD');
        setRecentDate(dateRecentFormatted);
      } else {
        setRecentDate('아직 검사하지 않음');
        console.log('최근 검사한 날짜 : ', dateRecentStr);
      }
    } catch (error) {
      console.error('최근 검사 날짜 로드 중 오류:', error);
      setRecentDate('아직 검사하지 않음');
    }
  };

  // 검사 결과 로드
  const loadResults = async () => {
    try {
      const jsonResults = await AsyncStorage.getItem('@kit_results');
      if (jsonResults) {
        const parsedResults = JSON.parse(jsonResults);
        const normalizedResults = normalizeResults(parsedResults);
        console.log('정리된 데이터:', normalizedResults); // 디버깅 로그
        setResults(normalizedResults);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  // 초기 로드: 최근 날짜 + 결과
  useFocusEffect(
    useCallback(() => {
      loadRecentDate();
      loadResults();
    }, []),
  );

  // 추가로 한번 더 호출 (수정 필요 시 제거 가능)
  useEffect(() => {
    loadRecentDate();
  }, []);

  // 결과 데이터 표준화 + 날짜 포맷
  const normalizeResults = (results = []) => {
    return results.map(result => {
      const dateObj = new Date(result.date);
      return {
        ...result,
        photoUri: result.photoUri || result.photo, // photoUri와 photo 통합
        dateFormatted: formatDateTime(dateObj), // 년, 월, 일, 시, 분까지 표시
        dateDay: formatDate(dateObj), // 년, 월, 일까지만 표시
      };
    });
  };

  // 날짜, 시간 포맷
  const formatDateTime = isoDate => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // AsyncStorage에 결과 저장
  const saveResults = async newResults => {
    try {
      const jsonResults = JSON.stringify(newResults);
      await AsyncStorage.setItem('@kit_results', jsonResults);
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  };

  // 새 검사 결과 추가 (route.params에서 넘어온 경우)
  useEffect(() => {
    if (route.params) {
      const {status, photo, id} = route.params;
      if (status && photo && id) {
        const isoDate = new Date().toISOString();
        const newResult = {
          id: id,
          date: isoDate,
          status,
          photoUri: photo,
        };
        const updatedResults = [newResult, ...results];
        setResults(updatedResults);
        saveResults(updatedResults);
      }
    }
  }, [route.params]);

  // --------------------------------------------------------------------------------
  // (중요) 키트 검사 결과 삭제 로직
  // 서버 + 로컬 동기화
  // --------------------------------------------------------------------------------
  const deleteResult = async idToDelete => {
    try {
      // 1) 서버에 삭제 요청
      //    1-1) user._id 가져오기
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        console.log('user가 없음. 로그인 정보가 없는 상태일 수 있습니다.');
        return;
      }
      const userData = JSON.parse(userDataString);
      const {_id} = userData;
      if (!_id) {
        console.log('user._id가 없습니다.');
        return;
      }

      // 1-2) 백엔드 API 호출
      //      /kit/deleteKitResultById  (POST)
      //      body = { _id, id: idToDelete }
      await axios.post('http://98.82.55.237/kit/deleteKitResultById', {
        _id,
        id: idToDelete,
      });

      // 2) 로컬 results 배열에서 제거
      const updatedResults = results.filter(item => item.id !== idToDelete);
      setResults(updatedResults);
      await saveResults(updatedResults);

      // 3) userData.kit_result에서도 제거
      if (Array.isArray(userData.kit_result)) {
        userData.kit_result = userData.kit_result.filter(
          item => item.id !== idToDelete,
        );
        // 다시 AsyncStorage에 저장
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }

      console.log(`ID=${idToDelete} 삭제 완료 (백엔드 + 로컬)`);
    } catch (error) {
      console.error('결과 삭제 중 오류:', error);
      Alert.alert('오류', '결과를 삭제하는 도중 문제가 발생했습니다.');
    }
  };

  // 삭제 확인 팝업
  const confirmDelete = id => {
    Alert.alert(
      '삭제 확인',
      '이 결과를 삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          onPress: () => {
            // 삭제 함수 호출 (비동기)
            deleteResult(id);
          },
        },
      ],
      {cancelable: true},
    );
  };

  // 스토어 링크
  const handleKitPurchase = () => {
    Linking.openURL('https://hnsbiolab.com/device');
  };

  // 결과 목록 렌더링
  const renderResults = () => {
    if (results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>데이터가 없어요</Text>
        </View>
      );
    }

    return results.map((result, index) => (
      <View key={index} style={styles.resultCard}>
        <Text style={styles.resultDate}>{result.dateFormatted}</Text>
        <Text
          style={[
            styles.resultStatus,
            result.status === '비정상'
              ? styles.statusAbnormal
              : result.status === '정상'
              ? styles.statusNormal
              : styles.statusUnknown,
          ]}>
          {result.status === '비정상'
            ? '양성'
            : result.status === '정상'
            ? '음성'
            : '알 수 없음'}
        </Text>
        <TouchableOpacity
          onPress={() => confirmDelete(result.id)}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <ScrollView>
        <View style={[styles.container, {flex: 1}]}>
          <View style={styles.innerContainer}>
            <View style={styles.topRow} />
            <View style={styles.secondRow} />
            <View style={styles.cardContainer}>
              <ImageBackground
                style={styles.profileImage}
                source={require('../../images/kitMain.png')}
                resizeMode="cover"
              />
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>
                      키트 검사하러 가기
                    </Text>
                  </View>
                  <View style={styles.cardDate}>
                    <Text style={styles.cardDateText}>최근 검사한 날짜</Text>
                    <Text style={styles.cardDateText}>{recentDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.roundButtonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('NoTabs', {screen: 'kit_guide_1'})
                  }>
                  <View style={styles.roundButton}>
                    <View style={styles.roundButtonInner}>
                      <ImageBackground
                        style={styles.roundButtonImage}
                        source={require('../../images/arrowRight.png')}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.storeButton}
                onPress={handleKitPurchase}>
                <Image
                  style={styles.linkIcon}
                  source={require('../../images/store.png')}
                />
                <Text style={styles.linkText}>스토어 바로가기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>검사 결과</Text>
              <ScrollView
                style={styles.resultsScroll}
                contentContainerStyle={styles.resultsScrollContent}
                nestedScrollEnabled={true}>
                {renderResults()}
              </ScrollView>
            </View>
          </View>
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Kit_screen;
