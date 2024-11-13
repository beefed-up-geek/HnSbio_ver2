// src\screen(구버전)\healthscreen\index.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';
import KidneyScreen from './tabs/tab_kidney';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const HealthScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  const [lastUpdate, setLastUpdate] = useState(null);
  const [lastCheckupDate, setLastCheckupDate] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false); // 새로고침 트리거

  const formattedCheckupDate = lastCheckupDate
  ? `${lastCheckupDate.split('-')[0]}년 ${lastCheckupDate.split('-')[1]}월 ${lastCheckupDate.split('-')[2]}일`
  : '';

  const fetchData = async () => {
    console.log("src/screen/healthscreen/index.js에 있는 fetchData 실행됨!");
    try {
      const storedDate = await AsyncStorage.getItem('healthscreen_last_update');
      setLastUpdate(storedDate);

      const storedData = await AsyncStorage.getItem('healthscreen_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setHealthData(parsedData);

        // Get the latest checkup date
        const latestRecord = parsedData[parsedData.length - 1];
        if (latestRecord) {
          const { resCheckupYear, resCheckupDate } = latestRecord;
          const formattedDate = `${resCheckupYear}-${resCheckupDate.slice(0, 2)}-${resCheckupDate.slice(2, 4)}`;
          setLastCheckupDate(formattedDate);
        }
      }
      setDataUpdated((prev) => !prev); // 데이터가 업데이트되었음을 트리거
    } catch (error) {
      console.error('데이터를 불러오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={styles.box}
          // navigation.navigate('NoTabs', {
          //   screen: 'UserInfo',
          //   params: {
          //     // 여기에 전달할 매개변수를 넣습니다.
          //     userId: '12345',
          //     userName: '홍길동',
          //   },
          // });
          //onPress={() => navigation.navigate('Authentication1', { fetchData })}
          onPress={() => navigation.navigate('NoTabs', {
            screen: 'Authentication1',
            params: {
              fetchData
            },
          })}
        >
          <View style={styles.textContainer}>
            <Text style={styles.boxTitle}>건강검진 불러오기</Text>
            {lastUpdate ? (
              <>
                {/* <View style={styles.row}>
                  <Text style={styles.boxSubtitle}>최근 불러온 건강검진: </Text>
                  <Text style={styles.boxSubtitle}>{lastUpdate}</Text>
                </View> */}
                {lastCheckupDate && (
                  <View style={styles.row}>
                    <Text style={styles.boxSubtitle}>최근 불러온 건강검진</Text>
                    <Text style={styles.boxSubtitle}>{formattedCheckupDate}</Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.boxSubtitle}>
                데이터를 불러오면{'\n'}분석을 제공해드려요
              </Text>
            )}
          </View>
          <Image
            source={require('../../images/health_screen/running.png')}
            style={styles.image}
          />
          <Image
            source={require('../../images/health_screen/Circle.png')}
            style={styles.arrowButtonContainer}
          />
        </TouchableOpacity>
      </View>

      {/* KidneyScreen 컴포넌트에 healthData와 dataUpdated 상태 전달 */}
      <View style={styles.blueBox}>
        <View style={styles.contentContainer}>
          <KidneyScreen healthData={healthData} dataUpdated={dataUpdated} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  boxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 25,
  },
  box: {
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(89,126,247,0.12)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  boxTitle: {
    ...theme.fonts.Bold,
    fontSize: 20,
    color: '#5D5D62',
    textAlign: 'left',
    marginBottom: 8,
    paddingVertical: 3,
  },
  row: {
    alignItems: 'left',
  },
  boxSubtitle: {
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#7F7F7F',
  },
  image: {
    width: 140,
    height: 130,
    resizeMode: 'contain',
    marginLeft: 10,
    position: 'absolute',
    right: 46,
    bottom: 18,
  },
  arrowButtonContainer: {
    position: 'absolute',
    right: 11,
    bottom: 12,
    borderRadius: 25,
    width: 83,
    height: 56,
  },
  blueBox: {
    flex: 1,
    backgroundColor: '#F4F5FB',
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
});

export default HealthScreen;
