// src/navigation/navigation_without_tabs.js

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, BackHandler } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ★ Context import
import { HomeContext } from '../components/homeContext';

import styles from './navigation_without_tabs_styles';

// Import your screen components
import Health_checkup_specifics_screen from '../screens/examin_record/health_checkup_specifics';
import Authentication_1_screen from '../screens/examin_record/authentication_1';
import Authentication_2_screen from '../screens/examin_record/authentication_2';
import Authentication_3_screen from '../screens/examin_record/authentication_3';
import Blood_test_specifics_screen from '../screens/examin_record/blood_test_specifics';
import Blood_test_input_screen from '../screens/examin_record/blood_test_input';
import Medicine_specifics_screen from '../screens/medicine/medicine_specifics';
import Kit_guide_1_screen from '../screens/kit/kit_guide_1';
import Kit_guide_2_screen from '../screens/kit/kit_guide_2';
import Kit_test_screen from '../screens/kit/kit_test';
import Daily_check_screen from '../screens/home/daily_check';
import My_profile_screen from '../screens/home/my_profile';
import Manage_account_screen from '../screens/home/manage_account';
import Set_push_alarm_screen from '../screens/home/set_push_alarm';
import Kidney_info_screen from '../screens/home/kidney_info';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleBackPress = () => {
    if (route.name === 'authentication_3') {
      navigation.pop(3);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('BottomNavigation');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.leftButtonContainer}
      />
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.leftButtonContainer}
      >
        <Image
          source={require('../images/back.png')}
          style={styles.leftButton}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <Image
        source={require('../images/back.png')}
        style={styles.leftButtonFake}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const stackScreenOptions = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  
  return {
    header: ({ options }) => {
      let title = options.title || route.name;
      if (
        route.name === 'HealthCheckupSpecifics' &&
        route.params?.healthCheckupResult
      ) {
        const { resCheckupYear, resCheckupDate } = route.params.healthCheckupResult;
        if (resCheckupYear && resCheckupDate) {
          const year = resCheckupYear;
          const month = resCheckupDate.substring(0, 2);
          const day = resCheckupDate.substring(2);
          title = `${year}년 ${month}월 ${day}일 검진 결과`;
        }
      }
      return (
        <View style={{ paddingTop: insets.top, backgroundColor: 'white' }}>
          <CustomHeader title={title} />
        </View>
      );
    },
  };
};

const NavigationWithoutTabs = () => {
  const navigation = useNavigation();
  
  // ★ Context 사용 (원한다면)
  const { rerenderHome, setRerenderHome } = useContext(HomeContext);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const routes = navigation.getState()?.routes;
        const currentRoute = routes[routes.length - 1];

        if (currentRoute.name === 'authentication_3') {
          navigation.pop(3);
          return true;
        }

        if (!navigation.canGoBack()) {
          navigation.navigate('BottomNavigation');
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="authentication_1"
        component={Authentication_1_screen}
        options={{ title: '내 건강검진 기록 불러오기' }}
      />
      <Stack.Screen
        name="authentication_2"
        component={Authentication_2_screen}
        options={{ title: '내 건강검진 기록 불러오기' }}
      />
      <Stack.Screen
        name="authentication_3"
        component={Authentication_3_screen}
        options={{ title: '내 건강검진 기록 불러오기' }}
      />
      <Stack.Screen
        name="blood_test_specifics"
        component={Blood_test_specifics_screen}
        options={{ title: '혈액검사 상세 정보' }}
      />
      <Stack.Screen
        name="blood_test_input"
        component={Blood_test_input_screen}
        options={{ title: '혈액검사 결과 기록' }}
      />
      <Stack.Screen
        name="medicine_specifics"
        component={Medicine_specifics_screen}
        options={{
          title: '의약품 상세정보',
        }}
      />
      <Stack.Screen
        name="kit_guide_1"
        component={Kit_guide_1_screen}
        options={{ title: '소변 검사 가이드' }}
      />
      <Stack.Screen
        name="kit_guide_2"
        component={Kit_guide_2_screen}
        options={{ title: '소변 검사 가이드' }}
      />
      <Stack.Screen
        name="kit_test"
        component={Kit_test_screen}
        options={{ title: '촬영하기' }}
      />
      <Stack.Screen
        name="daily_check"
        component={Daily_check_screen}
        options={{ title: '매일매일 건강 체크' }}
      />
      <Stack.Screen
        name="my_profile"
        component={My_profile_screen}
        options={{ title: '내 프로필' }}
      />
      <Stack.Screen
        name="manage_account"
        component={Manage_account_screen}
        options={{ title: '내 계정 관리' }}
      />
      <Stack.Screen
        name="set_push_alarm"
        component={Set_push_alarm_screen}
        options={{ title: '키트 검사 주기' }}
      />
      <Stack.Screen
        name="kidney_info"
        component={Kidney_info_screen}
        options={{ title: '나의 콩팥 건강' }}
      />
      <Stack.Screen
        name="HealthCheckupSpecifics"
        component={Health_checkup_specifics_screen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default NavigationWithoutTabs;
