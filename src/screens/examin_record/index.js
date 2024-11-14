// src/screens/examin_record/index.js
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
import LinearGradient from 'react-native-linear-gradient';
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

  const renderBloodTestCard = ({ item }) => {
    const abnormalLabels = [];
  
    const addAbnormalLabel = (value, type) => {
      let isOutOfRange = false;
  
      if (type === "BUN") {
        isOutOfRange = value < 7 || value > 20;
      } else if (type === "Creatinine") {
        if (userGender === "male") isOutOfRange = value < 0.6 || value > 1.2;
        else if (userGender === "female") isOutOfRange = value < 0.5 || value > 1.1;
      } else if (type === "GFR") {
        isOutOfRange = value < 90;
      }
  
      if (isOutOfRange) {
        abnormalLabels.push(
          <View key={type} style={styles.abnormalTag}>
            <Text style={styles.abnormalTagText}>
              {type}: {value}
            </Text>
          </View>
        );
      }
    };
  
    addAbnormalLabel(item.BUN, "BUN");
    addAbnormalLabel(item.creatinine, "Creatinine");
    addAbnormalLabel(item.GFR, "GFR");
  
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

  const renderHealthCheckupCard = ({ item }) => {
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
    <LinearGradient
      colors={['#EBEFFE', '#B7C8FF']}
      start={{x: 0, y: 0.54}}
      end={{x: 0, y: 1.2}}
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
            <Text style={styles.infoText}>혈액검사를 기록하면 분석을 제공해드려요!</Text>
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
                <Text style={styles.buttonText}>건강검진정보 불러오기</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>건강검진을 불러오면 분석을 제공해드려요!</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedHeaderContainer: {
    backgroundColor: '#FFFFFF',
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
  headerBorder: {
    height: 1,
    backgroundColor: '#E9E9E9',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 100 * height_ratio,
    paddingHorizontal: 20 * width_ratio,
    paddingBottom: 20 * height_ratio,
  },
  bloodTestContainer: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * width_ratio,
    padding: 20 * width_ratio,
    marginBottom: 10 * height_ratio,

  },
  healthCheckupContainer: {
    flex: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 20 * width_ratio,
    padding: 20 * width_ratio,
  },
  bloodTestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * height_ratio,
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
    color: '#7596FF',
  },
  infoText: {
    fontSize: 12,
    color: '#72777A',
    marginBottom: 10 * height_ratio,
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
    fontSize: 12,
    color: '#4a4a4f',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10 * height_ratio,
    padding: 16 * width_ratio,
    borderRadius: 25 * width_ratio,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardType: {
    ...theme.fonts.Bold,
    fontSize: 16 * width_ratio,
    color: '#333',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    ...theme.fonts.Medium,
    fontSize: 12 * width_ratio,
    color: '#828282',
    marginRight: 4 * width_ratio,
  },
  cardContent: {
    marginTop: 8 * height_ratio,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6 * width_ratio,
  },
  abnormalTag: {
    backgroundColor: '#FEE7E7',
    borderRadius: 10 * width_ratio,
    paddingHorizontal: 10 * width_ratio,
    paddingVertical: 5 * height_ratio,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  abnormalTagText: {
    ...theme.fonts.Medium,
    fontSize: 10 * width_ratio,
    color: '#FF6B6B',
  },
  normalText: {
    fontSize: 12 * width_ratio,
    color: '#333',
  },
  footerMargin: {
    height: 100 * height_ratio,
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
});

export default Examin_record_screen;
