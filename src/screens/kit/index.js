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

  // Kit_screen
  useEffect(() => {
    if (route.params) {
      const {status, photo, id} = route.params;
      if (status && photo && id) {
        const isoDate = new Date().toISOString();

        const newResult = {
          id: id, // 여기 추가!
          date: isoDate, // ISO 날짜
          status,
          photoUri: photo,
        };

        const updatedResults = [newResult, ...results];
        setResults(updatedResults);
        saveResults(updatedResults);
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
  // 기본값을 2로 두고, 필요할 때 5를 넘길 수도 있음.
  /**
   * "YYYY/MM/DD HH:mm:ss"를 KST 기준으로 보고, 이를 UTC로 변환한 뒤 ISO 8601 형태로 반환.
   * 예) "2024/12/30 20:15:31" (KST) -> "2024-12-30T11:15:31.000Z" (UTC)
   */
  function parseKSTtoUTC(dateStr) {
    if (!dateStr) return null;

    // 날짜 문자열이 ISO 형식("2024-12-30T11:03:25.429Z")일 수도 있으니,
    // 먼저 'T' 또는 '-'가 있는지 확인해서 바로 new Date() -> toISOString() 가능하게 할 수 있음.
    if (dateStr.includes('T') || dateStr.includes('-')) {
      // 이미 ISO 8601로 들어온 경우
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
        console.error('유효하지 않은 ISO 날짜:', dateStr);
        return null;
      }
      return parsed.toISOString(); // 그대로 반환
    }

    // -----------------------------
    // 이제 슬래시(`/`) 형식인 경우 ("YYYY/MM/DD HH:mm:ss") 처리
    // -----------------------------
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) {
      console.error('유효하지 않은 날짜 형식:', dateStr);
      return null;
    }

    const [year, month, day] = datePart.split('/');
    const [hour, min, sec] = timePart.split(':');

    // 한국 시각(KST)이라고 가정
    // Android/iOS가 로컬 시간을 KST로 인식한다면,
    //  new Date(y, m, d, hh, mm, ss)는 이미 KST를 기준으로 내부 UTC를 계산할 수도 있습니다.
    // 하지만 환경별 차이가 있을 수 있으므로,
    //  9시간을 빼 주어 강제로 UTC로 만드는 것이 가장 확실합니다.
    //
    // Step 1) JS Date 객체 생성 (로컬 시간)
    const kstDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(min, 10),
      parseInt(sec, 10),
    );

    // Step 2) kstDate.getTime()은 JS 내부적으로 UTC 타임스탬프
    //         만약 로컬 타임존이 KST가 아니라면 값이 다를 수 있음.
    //         따라서 강제로 9시간 차이를 조정해 UTC로 맞춰 줌.
    const utcTime = kstDate.getTime() - 9 * 3600000;
    const utcDate = new Date(utcTime);

    return utcDate.toISOString(); // "2024-12-30T11:15:31.000Z" 형태
  }

  /**
   * 두 ISO 문자열(UTC) 간의 시간 차이가 특정 초 이하인지 판단
   * 기본값: 5초
   */
  function isAlmostSameTime(isoStr1, isoStr2, toleranceSeconds = 5) {
    if (!isoStr1 || !isoStr2) return false;

    const date1 = new Date(isoStr1).getTime();
    const date2 = new Date(isoStr2).getTime();

    const diff = Math.abs(date1 - date2);
    return diff <= toleranceSeconds * 1000;
  }

  function parseCustomDate(dateStr) {
    if (!dateStr) return null;

    // 1) ISO 형식인지 확인 (예: "2024-12-30T11:03:25.429Z")
    if (dateStr.includes('T') || dateStr.includes('-')) {
      // 그냥 new Date()로 파싱
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
        console.error('유효하지 않은 ISO 날짜:', dateStr);
        return null;
      }
      return parsed.toISOString();
    }

    // 2) 슬래시(`/`) 기반인지 확인 (예: "2024/12/30 20:03:24")
    //    아예 분해해서 파싱
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) {
      console.error('유효하지 않은 날짜 형식:', dateStr);
      return null;
    }

    const [year, month, day] = datePart.split('/');
    const [hour, min, sec] = timePart.split(':');

    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);
    const hh = parseInt(hour, 10);
    const mm = parseInt(min, 10);
    const ss = parseInt(sec, 10);

    const parsedDate = new Date(y, m, d, hh, mm, ss);
    if (isNaN(parsedDate.getTime())) {
      console.error('유효하지 않은 슬래시 날짜:', dateStr);
      return null;
    }

    return parsedDate.toISOString();
  }

  const deleteResult = async idToDelete => {
    try {
      // 1) (현재 화면에서) results 배열에서 해당 id 삭제
      const updatedResults = results.filter(item => item.id !== idToDelete);
      setResults(updatedResults);
      await saveResults(updatedResults);

      // 2) userData 에서도 동일한 id를 가진 항목 삭제
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);

        // (a) userData.kit_result가 배열인지 확인
        if (Array.isArray(userData.kit_result)) {
          // (b) 필터링하여 idToDelete를 가진 아이템 제거
          const updatedUserKitResult = userData.kit_result.filter(
            item => item.id !== idToDelete,
          );
          // (c) 다시 userData에 넣고 저장
          userData.kit_result = updatedUserKitResult;
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          console.log(
            `ID=${idToDelete}인 결과가 userData.kit_result에서 삭제되었습니다.`,
          );
        }
      }
    } catch (error) {
      console.error('결과 삭제 중 오류:', error);
    }
  };

  const confirmDelete = id => {
    Alert.alert(
      '삭제 확인',
      '이 결과를 삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => deleteResult(id)},
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
          onPress={() => confirmDelete(result.id)}
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
