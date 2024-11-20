// src/screens/examin_record/index.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles.js'; // 스타일 분리

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Examin_record_screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [providerId, setProviderId] = useState('');
  const [healthCheckupData, setHealthCheckupData] = useState([]);
  const [bloodTestData, setBloodTestData] = useState([]);
  const [userGender, setUserGender] = useState('');
  const tapCount = useRef(0);
  const [addingData, setAddingData] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { refreshHomeScreen } = route.params || {};

  const refreshHealthData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setProviderId(parsedData.providerId);
      setUserGender(parsedData.gender);
      setHealthCheckupData(parsedData.healthCheckup || []);
      setBloodTestData(parsedData.blood_test_result || []);
      setAddingData(false);
      refreshHomeScreen && refreshHomeScreen();
    }
  };

  useEffect(() => {
    refreshHealthData();
  }, [refreshKey]);

  useFocusEffect(
    useCallback(() => {
      refreshHealthData();
    }, [])
  );

  const isValueOutOfRange = (value, type) => {
    if (type === 'BUN') {
      return value < 7 || value > 20;
    } else if (type === 'Creatinine') {
      if (userGender === 'male') return value < 0.6 || value > 1.2;
      if (userGender === 'female') return value < 0.5 || value > 1.1;
    } else if (type === 'GFR') {
      return value < 90;
    }
    return false;
  };

  const renderBloodTestCard = ({ item }) => {
    if (!item) return null;

    const abnormalLabels = [];

    const addAbnormalLabel = (value, type) => {
      if (isValueOutOfRange(value, type)) {
        abnormalLabels.push(
          <View key={type} style={styles.abnormalTag}>
            <Text style={styles.abnormalTagText}>
              {type}: {value}
            </Text>
          </View>
        );
      }
    };

    addAbnormalLabel(item.BUN, 'BUN');
    addAbnormalLabel(item.creatinine, 'Creatinine');
    addAbnormalLabel(item.GFR, 'GFR');

    const displayDate = item.date.substring(5, 10);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NoTabs', {
            screen: 'blood_test_specifics',
            params: { bloodTestResult: item },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{displayDate} 검사 결과</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.moreText}>더보기</Text>
            <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
          </View>
        </View>
        <View style={styles.cardContent}>
          {abnormalLabels.length > 0 ? (
            <View style={styles.tagsContainer}>{abnormalLabels}</View>
          ) : (
            <Text style={styles.normalText}>모든 항목이 정상입니다</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getHealthTags = (item) => {
    const healthTags = [];
    const [systolic, diastolic] = (item.resBloodPressure || '0/0').split('/').map(Number);

    if (item.resUrinaryProtein === '양성') healthTags.push('신장질환');
    if (parseFloat(item.resSerumCreatinine) > 1.6 || parseFloat(item.resGFR) > 83) healthTags.push('만성신장질환');
    if (systolic > 120 || diastolic > 80) healthTags.push('고혈압');
    if (parseInt(item.resFastingBloodSuger) >= 100) healthTags.push('당뇨');
    if (
      (item.resTotalCholesterol && parseInt(item.resTotalCholesterol) >= 200) ||
      (item.resHDLCholesterol && parseInt(item.resHDLCholesterol) <= 60) ||
      (item.resLDLCholesterol && parseInt(item.resLDLCholesterol) >= 130)
    ) {
      healthTags.push('이상지질혈증');
    }

    const bmi = parseFloat(item.resBMI);
    if (bmi >= 30) {
      healthTags.push('비만');
    } else if (bmi >= 23) {
      healthTags.push('과체중');
    }

    const hemoglobin = parseFloat(item.resHemoglobin);
    if ((userGender === 'male' && hemoglobin <= 13) || (userGender === 'female' && hemoglobin <= 12)) {
      healthTags.push('빈혈');
    }

    if (
      (item.resAST && parseInt(item.resAST) >= 40) ||
      (item.resALT && parseInt(item.resALT) >= 35) ||
      (item.resyGPT &&
        ((userGender === 'male' && parseInt(item.resyGPT) >= 77) ||
          (userGender === 'female' && parseInt(item.resyGPT) >= 45)))
    ) {
      healthTags.push('간장질환');
    }

    return healthTags;
  };

  const renderHealthCheckupCard = ({ item }) => {
    if (!item) return null;

    const healthTags = getHealthTags(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NoTabs', {
            screen: 'HealthCheckupSpecifics',
            params: { healthCheckupResult: item },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{item.resCheckupYear} 검진 결과</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.moreText}>더보기</Text>
            <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.tagsContainer}>
            {healthTags.map((tag, index) => (
              <View key={index} style={styles.abnormalTag}>
                <Text style={styles.abnormalTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#EBEFFE', '#B7C8FF']}
      start={{ x: 0, y: 0.54 }}
      end={{ x: 0, y: 1.2 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.fixedHeaderContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>나의 검진 기록</Text>
            <View style={styles.headerBorder} />
          </View>
        </View>
        <View style={styles.contentWrapper}>
          {/* 혈액검사 섹션 */}
          <View style={styles.bloodTestContainer}>
            <View style={styles.bloodTestHeader}>
              <Text style={styles.sectionTitle}>혈액 검사 기록</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'blood_test_input',
                    params: { refreshHealthData: refreshHealthData },
                  })
                }
              >
                <FontAwesome5 name="plus" size={17 * width_ratio} color="#8EAFF6" />
                <Text style={styles.buttonText}>새로운 검사결과 기록</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.viewAllButtonInline}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'BloodTestList',
                    params: { refreshHealthData: refreshHealthData },
                  })
                }
              >
                <Text style={styles.viewAllText}>전체 기록 보기</Text>
                <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
              </TouchableOpacity>
            </View>
            {(!bloodTestData || bloodTestData.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Image
                  source={require('../../images/health_screen/document.png')}
                  style={styles.noDataImage}
                />
                <Text style={styles.noDataText}>데이터가 없어요</Text>
                <Text style={styles.infoText}>혈액검사를 기록하면 분석을 제공해드려요!</Text>
              </View>
            ) : (
              // 스크롤뷰를 제거하고 첫 번째 아이템만 표시
              <View>
                {renderBloodTestCard({ item: bloodTestData[0] })}
              </View>
            )}
          </View>

          {/* 건강검진 섹션 */}
          <View style={styles.healthCheckupContainer}>
            <View style={styles.healthCheckupHeader}>
              <Text style={styles.sectionTitle}>건강검진 기록</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'authentication_1',
                    params: { refreshHealthData: refreshHealthData },
                  })
                }
              >
                <FontAwesome5 name="redo" size={17 * width_ratio} color="#8EAFF6" />
                <Text style={styles.buttonText}>건강검진 불러오기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.viewAllButtonInline}
                onPress={() =>
                  navigation.navigate('NoTabs', {
                    screen: 'HealthCheckupList',
                    params: { healthCheckupData },
                  })
                }
              >
                <Text style={styles.viewAllText}>전체 기록 보기</Text>
                <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
              </TouchableOpacity>
            </View>
            {(!healthCheckupData || healthCheckupData.length === 0) ? (
              <View style={styles.noDataContainer}>
                <Image
                  source={require('../../images/health_screen/document.png')}
                  style={styles.noDataImage}
                />
                <Text style={styles.noDataText}>데이터가 없어요</Text>
                <Text style={styles.infoText}>건강검진을 불러오면 분석을 제공해드려요!</Text>
              </View>
            ) : (
              // 스크롤뷰를 제거하고 첫 번째 아이템만 표시
              <View>
                {renderHealthCheckupCard({ item: healthCheckupData[0] })}
              </View>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );

};


export default Examin_record_screen;
