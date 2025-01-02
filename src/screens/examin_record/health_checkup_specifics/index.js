// src/screens/health_checkup/health_checkup_specifics/index.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';

import {
  KidneyDiseaseCard,
  ChronicKidneyDiseaseCard,
  HypertensionCard,
  DiabetesCard,
  DyslipidemiaCard,
  ObesityCard,
  AnemiaCard,
  LiverDiseaseCard,
} from './DiseaseMetricCards';

import theme from '../../../theme';
import styles from './styles';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_specifics_screen = () => {
  const scrollViewRef = useRef(null);
  const cardRefs = useRef({});

  const navigation = useNavigation();
  const route = useRoute();

  const [gender, setGender] = useState('');
  const [providerId, setProviderId] = useState('');
  const [pdfVisible, setPdfVisible] = useState(false);

  // 건강검진 결과
  const [healthData, setHealthData] = useState({
    resOriGinalData: '',
    resAST: '',
    resALT: '',
    resBMI: '',
    resBloodPressure: '',
    resBloodPressureSystolic: '',
    resBloodPressureDiastolic: '',
    resCheckupDate: '',
    resCheckupYear: '',
    formattedCheckupDate: '',
    resFastingBloodSuger: '',
    resGFR: '',
    resHDLCholesterol: '',
    resHeight: '',
    resHemoglobin: '',
    resLDLCholesterol: '',
    resSerumCreatinine: '',
    resTotalCholesterol: '',
    resUrinaryProtein: '',
    resWaist: '',
    resWeight: '',
    resyGPT: '',
  });

  // 질환 상태
  const [diseases, setDiseases] = useState({
    kidneyDisease: false,
    chronicKidneyDisease: false,
    hypertension: false,
    diabetes: false,
    dyslipidemia: false,
    obesity: false,
    overweight: false,
    anemia: false,
    liverDisease: false,
  });

  // PDF 열기 함수
  const openPDFInBrowser = async () => {
    if (!healthData.resOriGinalData) {
      Alert.alert('오류', 'PDF URL을 가져올 수 없습니다.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(healthData.resOriGinalData);
      if (supported) {
        await Linking.openURL(healthData.resOriGinalData);
      } else {
        Alert.alert('오류', '이 링크를 열 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', 'PDF를 여는 중 문제가 발생했습니다.');
    }
  };

  // 특정 카드로 스크롤
  const scrollToCard = (cardKey) => {
    const cardLayout = cardRefs.current[cardKey];
    if (cardLayout && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: cardLayout.y + 65, // 조금 위로 여유
        animated: true,
      });
    }
  };

  // AsyncStorage에서 user 데이터 가져오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const { gender, providerId } = JSON.parse(userData);
          setGender(gender);
          setProviderId(providerId);
        }
      } catch (error) {
        console.error('User data fetch error:', error);
      }
    };
    getUserData();
  }, []);

  // 날짜 포맷팅
  const formatDate = (year, date) => {
    if (!year || !date) return '';
    const month = date.substring(0, 2);
    const day = date.substring(2);
    return `${year}/${month}/${day}`;
  };

  // 질환 상태 체크
  const checkDiseases = () => {
    const {
      resUrinaryProtein,
      resSerumCreatinine,
      resGFR,
      resBloodPressureSystolic,
      resBloodPressureDiastolic,
      resFastingBloodSuger,
      resTotalCholesterol,
      resHDLCholesterol,
      resLDLCholesterol,
      resBMI,
      resHemoglobin,
      resAST,
      resALT,
      resyGPT,
    } = healthData;

    setDiseases({
      kidneyDisease: resUrinaryProtein === '양성',
      chronicKidneyDisease:
        parseFloat(resSerumCreatinine) > 1.6 || parseFloat(resGFR) > 83,
      hypertension:
        parseFloat(resBloodPressureSystolic) > 120 ||
        parseFloat(resBloodPressureDiastolic) > 80,
      diabetes: parseFloat(resFastingBloodSuger) >= 100,
      dyslipidemia:
        parseFloat(resTotalCholesterol) >= 200 ||
        parseFloat(resHDLCholesterol) <= 60 ||
        parseFloat(resLDLCholesterol) >= 130,
      obesity: parseFloat(resBMI) >= 30,
      overweight: parseFloat(resBMI) >= 23 && parseFloat(resBMI) < 30,
      anemia:
        gender === 'male'
          ? parseFloat(resHemoglobin) <= 13
          : parseFloat(resHemoglobin) <= 12,
      liverDisease:
        parseFloat(resAST) >= 40 ||
        parseFloat(resALT) >= 35 ||
        (gender === 'male'
          ? parseFloat(resyGPT) >= 77
          : parseFloat(resyGPT) >= 45),
    });
  };

  // 파라미터로 받아온 데이터 세팅
  useEffect(() => {
    if (route.params?.healthCheckupResult) {
      const result = route.params.healthCheckupResult;
      let systolic = '',
        diastolic = '';
      if (result.resBloodPressure) {
        [systolic, diastolic] = result.resBloodPressure.split('/');
      }
      const newData = {
        ...result,
        resBloodPressureSystolic: systolic,
        resBloodPressureDiastolic: diastolic,
        formattedCheckupDate: formatDate(result.resCheckupYear, result.resCheckupDate),
      };
      setHealthData(newData);
    }
  }, [route.params]);

  // healthData가 바뀔 때마다 질환 상태 체크
  useEffect(() => {
    checkDiseases();
  }, [healthData, gender]);

  // 요약 섹션에서 "신장질환", "고혈압" 등 Box
  const DiseaseBox = ({ title, isActive }) => (
    <View style={[styles.diseaseBox, isActive && styles.activeDiseaseBox]}>
      <Text style={[styles.diseaseText, isActive && styles.activeDiseaseText]}>
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView 
        ref={scrollViewRef} 
        style={{ flex: 1 }}
        stickyHeaderIndices={[1]}
      >
        {/* PDF 보기 버튼 */}
        <TouchableOpacity style={styles.pdfButton} onPress={openPDFInBrowser}>
          <Image
            source={require('../../../images/health_screen/pdficon.png')}
            style={styles.pdfIcon}
          />
          <Text style={styles.pdfButtonText}>PDF로 보기</Text>
        </TouchableOpacity>

        {/* 요약 섹션 */}
        <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 20 }}>
          <View style={styles.summaryContainer}>
            {/* 요약 헤더 부분 */} 
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>요약</Text>
              <View style={styles.indicators}>
                <View style={styles.indicator}>
                  <View style={styles.circleRed} />
                  <Text style={styles.indicatorText}>주의</Text>
                </View>
              </View>
            </View>

            <View style={styles.diseaseGrid}>
              {/* 첫 번째 줄 */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 12 * height_ratio,
                }}
              >
                <TouchableOpacity onPress={() => scrollToCard('kidneyDisease')}>
                  <DiseaseBox title="신장질환" isActive={diseases.kidneyDisease} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('chronicKidneyDisease')}>
                  <DiseaseBox
                    title="만성신장질환"
                    isActive={diseases.chronicKidneyDisease}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('hypertension')}>
                  <DiseaseBox title="고혈압" isActive={diseases.hypertension} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('diabetes')}>
                  <DiseaseBox title="당뇨" isActive={diseases.diabetes} />
                </TouchableOpacity>
              </View>

              {/* 두 번째 줄 */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity onPress={() => scrollToCard('dyslipidemia')}>
                  <DiseaseBox
                    title="이상지질혈증"
                    isActive={diseases.dyslipidemia}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('obesity')}>
                  <DiseaseBox title="비만" isActive={diseases.obesity} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('anemia')}>
                  <DiseaseBox title="빈혈" isActive={diseases.anemia} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToCard('liverDisease')}>
                  <DiseaseBox
                    title="간장질환"
                    isActive={diseases.liverDisease}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 세부 카드들 */}
        <View style={[styles.cardsContainer, { marginTop: 16 * height_ratio }]}>
          
          <View
            style={{
              flexDirection: 'row', // 가로 방향 배치
              alignItems: 'center', // 세로 가운데 정렬
              justifyContent: 'flex-end', // 가로 중앙 정렬
              marginBottom: 16 * height_ratio, // 아래 요소와 간격
              marginRight: 10,
            }}
          >
            {/* 사각형 */}
            <View
              style={{
                width: 10 * width_ratio, // 사각형 가로 크기
                height: 10 * height_ratio, // 사각형 세로 크기
                backgroundColor: '#CCEB75', // 사각형 색상
                marginRight: 8, // 텍스트와 간격
              }}
            />

            {/* 텍스트 */}
            <Text
              style={{
                ...theme.fonts.Bold,
                fontSize: 10 * width_ratio, // 텍스트 크기
                color: '#72777A', // 텍스트 색상
              }}
            >
              참고치
            </Text>
          </View>
          
          
          {/* 신장질환 */}
          <View
            onLayout={(event) =>
              (cardRefs.current.kidneyDisease = event.nativeEvent.layout)
            }
          >
            <KidneyDiseaseCard healthData={healthData} />
          </View>

          {/* 만성신장질환 */}
          <View
            onLayout={(event) =>
              (cardRefs.current.chronicKidneyDisease = event.nativeEvent.layout)
            }
          >
            <ChronicKidneyDiseaseCard healthData={healthData} />
          </View>

          {/* 고혈압 */}
          <View
            onLayout={(event) =>
              (cardRefs.current.hypertension = event.nativeEvent.layout)
            }
          >
            <HypertensionCard healthData={healthData} />
          </View>

          {/* 당뇨 */}
          <View
            onLayout={(event) => (cardRefs.current.diabetes = event.nativeEvent.layout)}
          >
            <DiabetesCard healthData={healthData} />
          </View>

          {/* 이상지질혈증 */}
          <View
            onLayout={(event) =>
              (cardRefs.current.dyslipidemia = event.nativeEvent.layout)
            }
          >
            <DyslipidemiaCard healthData={healthData} />
          </View>

          {/* 비만도 */}
          <View
            onLayout={(event) => (cardRefs.current.obesity = event.nativeEvent.layout)}
          >
            <ObesityCard healthData={healthData} />
          </View>

          {/* 빈혈 */}
          <View
            onLayout={(event) => (cardRefs.current.anemia = event.nativeEvent.layout)}
          >
            <AnemiaCard healthData={healthData} gender={gender} />
          </View>

          {/* 간장질환 */}
          <View
            onLayout={(event) => (cardRefs.current.liverDisease = event.nativeEvent.layout)}
          >
            <LiverDiseaseCard healthData={healthData} gender={gender} />
          </View>
          
          <Text style={styles.footerText}>
            각 항목의 참고치는 실제 병원에서 제공하는 표준값을 기반으로 제공됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Health_checkup_specifics_screen;
