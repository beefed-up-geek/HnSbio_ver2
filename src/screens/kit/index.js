// src\screens\kit\index.js
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
import {useState, useEffect} from 'react';
import {Alert} from 'react-native';

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const Kit_screen = ({onPress, navigation, route}) => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
    const date = today.getDate();
    return `${year}년 ${month}월 ${date}일`;
  };

  const getCurrentDateTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    return `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분`;
  };

  const handleKitPurchase = () => {
    Linking.openURL('https://hnsbiolab.com/device');
  };
  const [results, setResults] = useState([
    // 여기에 실제 검사 결과를 넣을 수 있음
  ]);

  useEffect(() => {
    loadResults();
    if (route.params) {
      const {status} = route.params;
      const formattedDate = getCurrentDateTime();
      const newResult = {date: formattedDate, status};
      const updatedResults = [newResult, ...results];
      setResults(updatedResults);
      saveResults(updatedResults); // 결과 저장
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
        setResults(JSON.parse(jsonResults));
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
        <Text style={styles.resultDate}>{result.date}</Text>
        <Text
          style={[
            styles.resultStatus,
            result.status === '비정상'
              ? styles.statusAbnormal
              : styles.statusNormal,
          ]}>
          {result.status}
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
    <>
    <View style={styles.fixedHeaderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>키트 검사</Text>
          <View style={styles.headerBorder} /> 
        </View>
    </View>
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.topRow} />
            <View style={styles.secondRow} />
            <View style={styles.cardContainer}>
              <ImageBackground
                style={styles.profileImage}
                source={require('./assets/images/35dfdd72ec7b06088f1aa32a7f0e4db35347eabf.png')}
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
                    <Text style={styles.cardDateText}>{getCurrentDate()}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.roundButtonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('NoTabs', {screen: 'kit_guide_1'})}>
                  <View style={styles.roundButton}>
                    <View style={styles.roundButtonInner}>
                      <ImageBackground
                        style={styles.roundButtonImage}
                        source={require('./assets/images/ad153a78-1510-497d-8dad-61ee25759ee6.png')}
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
                  source={require('./assets/images/1bd18327-449a-421c-a713-db8473a9045a.png')}
                />
                <Text style={styles.linkText}>스토어 바로가기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>검사 결과</Text>
              {renderResults()}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
    
  );
};

export default Kit_screen;
