import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../theme.js';

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

  const renderBloodTestCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>혈액 검사</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.bloodTestText}>BUN: {item.BUN}</Text>
        <Text style={styles.bloodTestText}>Creatinine: {item.creatinine}</Text>
        <Text style={styles.bloodTestText}>GFR: {item.GFR}</Text>
      </View>
    </View>
  );

  const renderHealthCheckupCard = ({ item }) => {
    const healthTags = getHealthTags(item);

    const formatDate = (year, date) => {
      if (!year || !date) return '';
      const month = date.substring(0, 2);
      const day = date.substring(2);
      return `${year}/${month}/${day}`;
    };

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
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardType}>일반건강검진</Text>
            <Text style={styles.cardDate}>
              {formatDate(item.resCheckupYear, item.resCheckupDate)}
            </Text>
          </View>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.moreText}>더보기</Text>
            <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
          </View>
        </View>
  
        <View style={styles.cardContent}>
          <View style={styles.tagsContainer}>
            {healthTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getHealthTags = (item) => {
    const healthTags = [];
    const [systolic, diastolic] = (item.resBloodPressure || '0/0').split('/').map(Number);

    if (item.resUrinaryProtein === "양성") healthTags.push("신장질환");
    if (parseFloat(item.resSerumCreatinine) > 1.6 || parseFloat(item.resGFR) > 83) healthTags.push("만성신장질환");
    if (systolic > 120 || diastolic > 80) healthTags.push("고혈압");
    if (parseInt(item.resFastingBloodSuger) >= 100) healthTags.push("당뇨");
    if (
      (item.resTotalCholesterol && parseInt(item.resTotalCholesterol) >= 200) ||
      (item.resHDLCholesterol && parseInt(item.resHDLCholesterol) <= 60) ||
      (item.resLDLCholesterol && parseInt(item.resLDLCholesterol) >= 130)
    ) {
      healthTags.push("이상지질혈증");
    }
    
    const bmi = parseFloat(item.resBMI);
    if (bmi >= 30) {
      healthTags.push("비만");
    } else if (bmi >= 23) {
      healthTags.push("과체중");
    }
    
    const hemoglobin = parseFloat(item.resHemoglobin);
    if ((userGender === 'male' && hemoglobin <= 13) || 
        (userGender === 'female' && hemoglobin <= 12)) {
      healthTags.push("빈혈");
    }
    
    if (
      (item.resAST && parseInt(item.resAST) >= 40) ||
      (item.resALT && parseInt(item.resALT) >= 35) ||
      (item.resyGPT && 
        ((userGender === 'male' && parseInt(item.resyGPT) >= 77) ||
         (userGender === 'female' && parseInt(item.resyGPT) >= 45)))
    ) {
      healthTags.push("간장질환");
    }

    return healthTags;
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>나의 검진 기록</Text>
        </View>
      </View>
      <View style={styles.contentWrapper}>
        {/* 혈액 검사 기록 상단 1/3 */}
        <View style={styles.bloodTestContainer}>
          <Text style={styles.sectionTitle}>혈액 검사 기록</Text>
          {(!bloodTestData || bloodTestData.length === 0) ? (
            <View style={styles.noDataContainer}>
              <Image
                source={require('../../images/health_screen/document.png')}
                style={styles.noDataImage}
              />
              <Text style={styles.noDataText}>데이터가 없어요</Text>
            </View>
          ) : (
            <FlatList
              data={bloodTestData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderBloodTestCard}
              ListFooterComponent={<View style={styles.footerMargin} />}
            />
          )}
        </View>

        {/* 건강검진 기록 하단 2/3 */}
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
              <FontAwesome5 name="redo" size={20 * width_ratio} color="#8EAFF6" />
              <Text style={styles.buttonText}>건강검진정보 불러오기</Text>
            </TouchableOpacity>
          </View>
          {(!healthCheckupData || healthCheckupData.length === 0) ? (
            <View style={styles.noDataContainer}>
              <Image
                source={require('../../images/health_screen/document.png')}
                style={styles.noDataImage}
              />
              <Text style={styles.noDataText}>데이터가 없어요</Text>
            </View>
          ) : (
            <FlatList
              data={healthCheckupData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHealthCheckupCard}
              ListFooterComponent={<View style={styles.footerMargin} />}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FB',
  },
  fixedHeaderContainer: {
    backgroundColor: '#ffffff',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerContainer: {
    height: 76 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.fonts.SemiBold,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    marginTop: 100 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    paddingBottom: 20 * height_ratio,
  },
  bloodTestContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12 * width_ratio,
    padding: 20 * width_ratio,
    marginBottom: 10 * height_ratio,
  },
  healthCheckupContainer: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: 12 * width_ratio,
    padding: 20 * width_ratio,
  },
  healthCheckupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
  },
  sectionTitle: {
    ...theme.fonts.Bold,
    fontSize: 18,
    color: '#333',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFFD',
    padding: 10 * width_ratio,
    borderRadius: 20 * width_ratio,
  },
  buttonText: {
    marginLeft: 5 * width_ratio,
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#4a4a4f',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10 * height_ratio,
    padding: 20 * width_ratio,
    borderRadius: 12 * width_ratio,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardType: {
    ...theme.fonts.Bold,
    fontSize: 18 * width_ratio,
    color: '#333',
  },
  cardDate: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#828282',
  },
  cardContent: {
    marginTop: 10 * height_ratio,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 * width_ratio,
  },
  tag: {
    backgroundColor: '#FEE7E7',
    borderRadius: 12 * width_ratio,
    paddingHorizontal: 12 * width_ratio,
    paddingVertical: 6 * height_ratio,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  tagText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: '#FF6B6B',
  },
  bloodTestText: {
    fontSize: 14 * width_ratio,
    color: '#333',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20 * width_ratio,
    borderRadius: 10 * width_ratio,
    marginHorizontal: 20 * width_ratio,
  },
  noDataImage: {
    width: 90 * width_ratio,
    height: 90 * width_ratio,
    marginBottom: 10 * height_ratio,
    resizeMode: 'contain',
  },
  noDataText: {
    ...theme.fonts.Medium,
    fontSize: 16 * width_ratio,
    color: '#555',
  },
  footerMargin: {
    height: 100 * height_ratio,
  },
});

export default Examin_record_screen;
