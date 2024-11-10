import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import theme from '../../theme.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_screen = () => {
  const navigation = useNavigation();
  const [providerId, setProviderId] = useState('');
  const [healthCheckupData, setHealthCheckupData] = useState([]);
  const tapCount = useRef(0);
  const [addingData, setAddingData] = useState(true);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProviderId(parsedData.providerId);
        if (parsedData.healthCheckup && parsedData.healthCheckup.length > 0) {
          setHealthCheckupData(parsedData.healthCheckup);
          setAddingData(false);
        }
      }
    })();
  }, []);

  const handleTap = async () => {
    tapCount.current += 1;

    if (tapCount.current === 7) {
      tapCount.current = 0;
      if (addingData) {
        try {
          console.log('Fetching health checkup data from /healthCheckupDev API');
          const response = await axios.post(
            'http://54.79.61.80:5000/health_checkup/healthCheckupDev',
            { providerId },
          );

          if (response.data && response.data.data) {
            const healthCheckupData = response.data.data;
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              parsedUserData.healthCheckup = healthCheckupData;
              await AsyncStorage.setItem('user', JSON.stringify(parsedUserData));
              console.log('User information updated successfully in AsyncStorage');
              console.log(parsedUserData);
              setHealthCheckupData(healthCheckupData);
              setAddingData(false);
            } else {
              console.error('User data not found in AsyncStorage');
            }
          } else {
            console.error('No health checkup data received from API');
          }
        } catch (error) {
          console.error('Error fetching health checkup data:', error);
        }
      } else {
        try {
          console.log('Removing health checkup data via /healthCheckupDevRemove API');
          const response = await axios.post(
            'http://54.79.61.80:5000/health_checkup/healthCheckupDevRemove',
            { providerId },
          );

          if (response.data) {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              delete parsedUserData.healthCheckup;
              await AsyncStorage.setItem('user', JSON.stringify(parsedUserData));
              console.log('User healthCheckup data removed successfully from AsyncStorage');
              setHealthCheckupData([]);
              setAddingData(true);
            } else {
              console.error('User data not found in AsyncStorage');
            }
          } else {
            console.error('No response data received from API');
          }
        } catch (error) {
          console.error('Error removing health checkup data:', error);
        }
      }
    }
  };

  const renderHealthCheckupCard = ({ item }) => {
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
        <Text style={styles.cardTitle}>
          검진일자: {item.resCheckupYear}.{item.resCheckupDate}
        </Text>
        <Text style={styles.cardText}>BMI: {item.resBMI}</Text>
        <Text style={styles.cardText}>혈압: {item.resBloodPressure}</Text>
        <Text style={styles.cardText}>혈당: {item.resFastingBloodSuger}</Text>
      </TouchableOpacity>
    );
  };

  const fetchData = (async () => {
    useEffect();
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>건강검진</Text>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleTap}>
            <Text style={styles.recentRecordText}>최근 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() =>
              navigation.navigate('NoTabs', {
                screen: 'authentication_1',
                params: { fetchData },
              })
            }
          >
            <FontAwesome5 name="redo" size={20 * width_ratio} color="#8EAFF6" />
            <Text style={styles.buttonText}>건강검진정보 불러오기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentWrapper}>
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
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * width_ratio,
    paddingTop: 10 * height_ratio,
    backgroundColor: '#F4F5FB',
  },
  recentRecordText: {
    ...theme.fonts.Bold,
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20 * height_ratio,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFFD',
    padding: 10 * width_ratio,
    borderRadius: 20 * width_ratio,
    height: 44,
  },
  buttonText: {
    marginLeft: 5 * width_ratio,
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#4a4a4f',
  },
  contentWrapper: {
    paddingTop: 160 * height_ratio,
    paddingBottom: 20 * height_ratio,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20 * width_ratio,
    marginBottom: 10 * height_ratio,
    padding: 15 * width_ratio,
    borderRadius: 10 * width_ratio,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    ...theme.fonts.Bold,
    fontSize: 16 * width_ratio,
    color: '#333',
    marginBottom: 5 * height_ratio,
  },
  cardText: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#333',
    marginBottom: 3 * height_ratio,
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
    maxWidth: '100%',
    maxHeight: '100%',
  },
  noDataText: {
    ...theme.fonts.Medium,
    fontSize: 16 * width_ratio,
    color: '#555',
  },
  footerMargin: {
    height: 100 * height_ratio,  // 하단바 높이보다 조금 더 큰 값으로 설정
  },
});

export default Health_checkup_screen;