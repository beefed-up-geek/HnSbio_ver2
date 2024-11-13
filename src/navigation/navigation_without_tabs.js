// src\navigation\navigation_without_tabs.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';

import styles from './navigation_without_tabs_styles';

// Import your screen components
import Health_checkup_specifics_screen from '../screens/health_checkup/health_checkup_specifics';
import Authentication_1_screen from '../screens/health_checkup/authentication_1';
import Authentication_2_screen from '../screens/health_checkup/authentication_2';
import Authentication_3_screen from '../screens/health_checkup/authentication_3';
import Medicine_specifics_screen from '../screens/medicine/medicine_specifics';
import Kit_guide_1_screen from '../screens/kit/kit_guide_1';
import Kit_guide_2_screen from '../screens/kit/kit_guide_2';
import Kit_test_screen from '../screens/kit/kit_test';
import Daily_check_screen from '../screens/home/daily_check';
import My_profile_screen from '../screens/home/my_profile';
import Manage_account_screen from '../screens/home/manage_account';
import Set_push_alarm_screen from '../screens/home/set_push_alarm';

const CustomHeader = ({title}) => {
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
        style={styles.leftButtonContainer}>
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

const stackScreenOptions = ({route, navigation}) => {
  return {
    header: ({ options }) => {
      let title = options.title || route.name;
      if (route.name === 'HealthCheckupSpecifics' && route.params?.healthCheckupResult) {
        const { resCheckupYear, resCheckupDate } = route.params.healthCheckupResult;
        if (resCheckupYear && resCheckupDate) {
          const year = resCheckupYear;
          const month = resCheckupDate.substring(0, 2);
          const day = resCheckupDate.substring(2);
          title = `${year}년 ${month}월 ${day}일 검진 결과`;
        }
      }
      return <CustomHeader title={title} />;
    },
  };
};

const NavigationWithoutTabs = () => {
  const navigation = useNavigation();

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

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="authentication_1"
        component={Authentication_1_screen}
        options={{title: '내 건강검진 기록 불러오기'}}
      />
      <Stack.Screen
        name="authentication_2"
        component={Authentication_2_screen}
        options={{title: '내 건강검진 기록 불러오기'}}
      />
      <Stack.Screen
        name="authentication_3"
        component={Authentication_3_screen}
        options={{title: '내 건강검진 기록 불러오기'}}
      />
      <Stack.Screen
        name="medicine_specifics"
        component={Medicine_specifics_screen}
        options={{title: '의약품 상세정보'}}
      />
      <Stack.Screen
        name="Kit"
        component={Kit_screen}
        options={{title: '키트 검사'}}
      />
      <Stack.Screen
        name="kit_guide_1"
        component={Kit_guide_1_screen}
        options={{title: '소변 검사 가이드'}}
      />
      <Stack.Screen
        name="kit_guide_2"
        component={Kit_guide_2_screen}
        options={{title: '소변 검사 가이드'}}
      />
      <Stack.Screen
        name="kit_test"
        component={Kit_test_screen}
        options={{title: '촬영하기'}}
      />
      <Stack.Screen
        name="daily_check"
        component={Daily_check_screen}
        options={{title: '매일매일 건강 체크'}}
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
        options={{title: '키트 검사 주기'}}
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