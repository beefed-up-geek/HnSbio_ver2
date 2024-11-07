// src/navigation/navigation_without_tabs.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, BackHandler } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from './navigation_without_tabs_styles';

// Import your screen components
import Health_checkup_specifics_screen from '../screens/health_checkup/health_checkup_specifics/index';
import Health_checkup_screen from '../screens/health_checkup/index';
import Daily_check_screen from '../screens/home/daily_check/index';
import Home_screen from '../screens/home/index';
import Kidney_info_screen from '../screens/home/kidney_info/index';
import My_profile_screen from '../screens/home/my_profile/index';
import Set_push_alarm_screen from '../screens/home/set_push_alarm/index';
import Hospital_screen from '../screens/hospital/index';
import Kit_screen from '../screens/kit/index';
import Kit_guide_1_screen from '../screens/kit/kit_suide_1/index';
import Kit_guide_2_screen from '../screens/kit/kit_guide_2/index';
import Kit_test_screen from '../screens/kit/kit_test/index';
import Medicine_screen from '../screens/medicine/index';
import Medicine_specifics_screen from '../screens/medicine/medicine_specifics/index';
import Authentication_1_screen from '../screens/health_checkup/authentication_1/index';
import Authentication_2_screen from '../screens/health_checkup/authentication_2/index';
import Authentication_3_screen from '../screens/health_checkup/authentication_3/index';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('BottomNavigation');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBackPress} style={styles.leftButtonContainer}>
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
  return {
    header: ({ options }) => {
      const title = options.title || route.name;
      return <CustomHeader title={title} />;
    },
  };
};

const NavigationWithoutTabs = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('BottomNavigation');
        }
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
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
        name="medicine_specifics"
        component={Medicine_specifics_screen}
        options={{ title: '의약품 상세정보' }}
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
        name="kidney_info"
        component={Kidney_info_screen}
        options={{ title: '내 콩팥 건강' }}
      />
      <Stack.Screen
        name="my_profile"
        component={My_profile_screen}
        options={{ title: '내 프로필' }}
      />
      <Stack.Screen
        name="set_push_alarm"
        component={Set_push_alarm_screen}
        options={{ title: '키트 검사 주기' }}
      />
      <Stack.Screen
        name="HealthCheckupSpecifics"
        component={Health_checkup_specifics_screen}
        options={{ title: '건강 검진 결과' }}
      />
    </Stack.Navigator>
  );
};

export default NavigationWithoutTabs;
