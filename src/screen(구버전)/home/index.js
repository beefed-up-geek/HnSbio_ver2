// src\screen(구버전)\home\index.js
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Circle, Svg, Polygon, Image as SvgImage } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import animationData from '../../images/home/click.json';
import KitScreen from '../kit';

const { width } = Dimensions.get('screen');
import theme from '../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

const HomeScreen = () => {
  const [userName, setUserName] = useState('');
  const [lastCheckupDate, setLastCheckupDate] = useState('');
  const [daysSinceLastCheckup, setDaysSinceLastCheckup] = useState(null);
  const rotation = useSharedValue(0);
  const navigation = useNavigation();

  const handleProfileNavigation = () => {
    navigation.navigate('NoTabs', { screen: 'UserInfo' });
  };

  const printAllAsyncStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 0) {
        console.log('AsyncStorage에 저장된 데이터가 없습니다.');
        return;
      }

      const result = await AsyncStorage.multiGet(keys);
      result.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value: ${value}`);
      });

      return result;
    } catch (error) {
      console.error('AsyncStorage 데이터를 불러오는 중 에러가 발생했습니다:', error);
    }
  };

  const handleKitPurchase = () => {
    Linking.openURL('https://hnsbiolab.com/device');
  };

  useEffect(() => {
    
    const fetchUserInfoAndLastCheckupDate = async () => {
      try {
        await printAllAsyncStorageData()
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          setUserName(userInfo.name);
        }

        const storedDate = await AsyncStorage.getItem('last_kit_checkup');
        if (storedDate) {
          setLastCheckupDate(storedDate);
          const daysDifference = calculateDaysDifference(storedDate);
          setDaysSinceLastCheckup(daysDifference);
        }
      } catch (error) {
        console.error('Failed to load user info or last checkup date', error);
      }

      rotation.value = withTiming(
        180,
        {
          duration: 200,
          easing: Easing.linear,
        },
        () => {
          rotation.value = withSpring(20, {
            damping: 4,
            stiffness: 400,
            mass: 1,
            overshootClamping: false,
            restDisplacementThreshold: 0.007,
            restSpeedThreshold: 0.01,
          });
        },
      );
    };

    fetchUserInfoAndLastCheckupDate();
  }, []);

  const calculateDaysDifference = (dateString) => {
    const checkupDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today - checkupDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const animatedProps = useAnimatedProps(() => {
    const angleInRadians = (rotation.value * Math.PI) / 180;
    const radius = 100;
    const xTip = 150 - radius * Math.cos(angleInRadians);
    const yTip = 150 - radius * Math.sin(angleInRadians);

    const baseWidth = 7;
    const xBase1 = 150 + (baseWidth / 2) * Math.sin(angleInRadians);
    const yBase1 = 150 - (baseWidth / 2) * Math.cos(angleInRadians);
    const xBase2 = 150 - (baseWidth / 2) * Math.sin(angleInRadians);
    const yBase2 = 150 + (baseWidth / 2) * Math.cos(angleInRadians);

    return {
      points: `${xTip},${yTip} ${xBase1},${yBase1} ${xBase2},${yBase2}`,
    };
  });

  const carbs = 300;
  const protein = 40;
  const fat = 80;
  const sodium = 2000;
  const potassium = 2500;
  const phosphorus = 900;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfileNavigation}>
          <Text style={styles.profileText}>내 프로필</Text>
          <Image
            source={require('../../images/home/user.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoTitleContainer}>
          <Image
            source={require('../../images/home/exclamation.png')}
            style={styles.infoIcon}
          />
          <Text style={styles.infoTitle}>아직 검사를 하지 않았어요</Text>
        </View>
        {lastCheckupDate ? (
          <Text style={styles.infoText}>
            마지막 검사가 {daysSinceLastCheckup}일 전이에요. 지금 검사하고 꾸준히
            콩팥 건강을 관리해 보세요.
          </Text>
        ) : (
          <Text style={styles.infoText}>
            빠르고 간편한 신장기능 진단키트로{'\n'}지금 검사하고 꾸준히 신장
            건강을 관리해 보세요.
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.kitButton}>
            <LottieView
              source={animationData}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.testButton} onPress={handleKitPurchase}>
            <Text style={styles.buttonText}>키트 구매하기</Text>
            <Image
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => navigation.navigate('KitStack')}
          >
            <Text style={styles.buttonText}>검사하러 가기</Text>
            <Image
              source={require('../../images/home/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dialBox}>
        <Svg justifyContent="center" alignItems="center" width="300" height="180">
          <SvgImage
            href={require('../../images/home/state.png')}
            x="0"
            y="0"
            width="300"
            height="180"
          />
          <AnimatedPolygon
            points="150,150 150,40 160,150"
            fill="#ACACAC"
            animatedProps={animatedProps}
          />
          <Circle cx="150" cy="150" r="7" fill="#ACACAC" />
          <Circle cx="150" cy="150" r="3" fill="white" />
        </Svg>
        <Text style={styles.dialText1}>
          {userName}님의 콩팥 건강은 ? 단계에요.
        </Text>
        <Text style={styles.dialText2}>
          자가진단키트로 검사하고 {userName}님의 콩팥 기능 단계를 알아보세요.
        </Text>
      </View>
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionHeader}>
          <Text style={styles.nutritionTitle}>맞춤 영양 정보</Text>
          <TouchableOpacity style={styles.nutritionInfoButton}>
            <Image
              source={require('../../images/home/nutrition.png')}
              style={styles.nutritionIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.nutritionBoxContainer}>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>탄수화물</Text>
            <Text style={styles.nutritionValue}>{carbs}g</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>단백질</Text>
            <Text style={styles.nutritionValue}>{protein}g</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>지방</Text>
            <Text style={styles.nutritionValue}>{fat}g</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>나트륨</Text>
            <Text style={styles.nutritionValue}>{sodium}mg</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>칼륨</Text>
            <Text style={styles.nutritionValue}>{potassium}mg</Text>
          </View>
          <View style={styles.nutritionBox}>
            <Text style={styles.nutritionLabel}>인</Text>
            <Text style={styles.nutritionValue}>{phosphorus}mg</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16 * width_ratio,
    paddingTop: 16 * height_ratio,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16 * height_ratio,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24 * height_ratio,
  },
  profileText: {
    ...theme.fonts.Regular,
    marginRight: 8 * width_ratio,
    fontSize: 14 * width_ratio,
    color: '#72777A',
  },
  profileIcon: {
    width: 24 * width_ratio,
    height: 24 * height_ratio,
    resizeMode: 'contain',
  },
  infoBox: {
    backgroundColor: '#EBEFFE',
    borderRadius: 8 * width_ratio,
    padding: 24 * width_ratio,
    marginBottom: 24 * height_ratio,
    width: width - 32 * width_ratio,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20 * height_ratio,
  },
  infoIcon: {
    width: 24 * width_ratio,
    height: 24 * height_ratio,
    marginRight: 8 * width_ratio,
    resizeMode: 'contain',
  },
  infoTitle: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.SemiBold,
    color: '#4D495A',
  },
  infoText: {
    fontSize: 14 * width_ratio,
    ...theme.fonts.Medium,
    color: '#666',
    marginBottom: 18 * height_ratio,
    marginLeft: 6 * width_ratio,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  testButton: {
    backgroundColor: 'white',
    borderColor: '#7596FF',
    paddingVertical: 12 * height_ratio,
    paddingLeft: 22 * width_ratio,
    paddingRight: 20 * width_ratio,
    borderRadius: 30 * width_ratio,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#7596FF',
    fontSize: 14 * width_ratio,
    ...theme.fonts.Bold,
  },
  goIcon: {
    width: 16 * width_ratio,
    height: 16 * height_ratio,
    marginLeft: 11 * width_ratio,
    resizeMode: 'contain',
  },
  dialBox: {
    backgroundColor: 'white',
    borderRadius: 8 * width_ratio,
    marginBottom: 42 * height_ratio,
    paddingVertical: 38 * height_ratio,
    paddingHorizontal: 32 * width_ratio,
    shadowColor: '#BFBFBF',
    elevation: 60,
    zIndex: 0,
  },
  dialText1: {
    fontSize: 14 * width_ratio,
    marginTop: 30 * height_ratio,
    marginBottom: 4 * height_ratio,
    textAlign: 'left',
    color: '#666',
  },
  dialText2: {
    ...theme.fonts.Regular,
    fontSize: 14 * width_ratio,
    color: '#666',
  },
  nutritionContainer: {
    marginBottom: 16 * height_ratio,
    padding: 16 * width_ratio,
    borderRadius: 16 * width_ratio,
    zIndex: 1,
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20 * height_ratio,
  },
  nutritionTitle: {
    fontSize: 18 * width_ratio,
    ...theme.fonts.Bold,
    color: '#5D5D62',
    marginRight: 4 * width_ratio,
  },
  nutritionInfoButton: {
    padding: 4 * width_ratio,
  },
  nutritionIcon: {
    width: 20 * width_ratio,
    height: 20 * height_ratio,
    resizeMode: 'contain',
  },
  nutritionBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  nutritionBox: {
    backgroundColor: 'white',
    borderRadius: 12 * width_ratio,
    paddingHorizontal: 18 * width_ratio,
    width: (width - 72 * width_ratio) / 3,
    height: (width - 72 * width_ratio) / 4,
    justifyContent: 'center',
    alignItems: 'left',
    marginBottom: 8 * height_ratio,
    zIndex: 0,
    shadowColor: '#BFBFBF',
    elevation: 10,
  },
  nutritionLabel: {
    fontSize: 14 * width_ratio,
    color: '#666',
    marginBottom: 4 * height_ratio,
  },
  nutritionValue: {
    fontSize: 16 * width_ratio,
    ...theme.fonts.Bold,
    color: '#333',
  },
  bottomSpacer: {
    height: 100 * height_ratio,
  },
});

export default HomeScreen;
