// src\screens\kit\index.js
import React from 'react';
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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
import {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import dayjs from 'dayjs';

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const Kit_screen = ({onPress, navigation, route}) => {
  const [results, setResults] = useState([
    // 여기에 실제 검사 결과를 넣을 수 있음
  ]);
  const [recentDate, setRecentDate] = useState('');

  const loadRecentDate = async () => {
    try {
      const dateRecent = await AsyncStorage.getItem('@recent_test_date');
      if (dateRecent) {
        const dateRecent = dayjs(dateRecent, 'YYYY/MM/DD HH:mm:ss').format(
          'YYYY/MM/DD',
        );
        setRecentDate(dateRecent); // 포맷팅된 값을 그대로 사용
      } else {
        setRecentDate('아직 검사하지 않음');
        console.log('최근 검사한 날짜 : ', dateRecent);
      }
    } catch (error) {
      console.error('최근 검사 날짜 로드 중 오류:', error);
      setRecentDate('아직 검사하지 않음');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecentDate();
      loadResults();
    }, []),
  );

  useEffect(() => {
    loadRecentDate(); // 최근 날짜 로드
  }, []);

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

  // 결과 데이터를 표준화하고 날짜를 포맷합니다.
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

  const handleKitPurchase = () => {
    Linking.openURL('https://hnsbiolab.com/device');
  };

  useEffect(() => {
    loadResults();

    if (route.params) {
      const {status, photo} = route.params; // 매개변수 추출
      if (status && photo) {
        // 안전한 조건 검사
        const isoDate = new Date().toISOString();
        const newResult = {date: isoDate, status, photoUri: photo};
        const updatedResults = [newResult, ...results];
        setResults(updatedResults); // 새 결과 추가
        saveResults(updatedResults); // AsyncStorage에 저장
      }
    }
  }, [route.params]);

  // AsyncStorage에 결과 저장
  const saveResults = async newResults => {
    try {
      const jsonResults = JSON.stringify(newResults);
      await AsyncStorage.setItem('@kit_results', jsonResults);
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  };

  // AsyncStorage에서 결과 불러오기
  const loadResults = async () => {
    try {
      const jsonResults = await AsyncStorage.getItem('@kit_results');
      if (jsonResults) {
        const parsedResults = JSON.parse(jsonResults);
        const normalizedResults = normalizeResults(parsedResults); // 데이터 표준화 및 날짜 포맷
        console.log('정리된 데이터:', normalizedResults); // 디버깅 로그
        setResults(normalizedResults);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  const deleteResult = async index => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
    await saveResults(updatedResults); // 삭제 후 AsyncStorage에 업데이트
  };

  // 결과 삭제 확인
  const confirmDelete = index => {
    Alert.alert(
      '삭제 확인',
      '이 결과를 삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => deleteResult(index)},
      ],
      {cancelable: true},
    );
  };

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
          onPress={() => confirmDelete(index)}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View>
      <ScrollView
        scrollEnabled={true}
        //contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.container}>
          {/* <View style={styles.fixedHeaderContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>키트 검사</Text>
                <View style={styles.headerBorder} />
              </View>
            </View> */}
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
                nestedScrollEnabled={true} // 스크롤 뷰 중첩 가능하게 설정
              >
                {renderResults()}
              </ScrollView>
            </View>
          </View>
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Kit_screen;
