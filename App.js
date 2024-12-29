// App.js

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigation from './src/navigation/navigation_with_tabs';
import NavigationWithoutTabs from './src/navigation/navigation_without_tabs';
import Login1 from './src/screens/login/index';
import Login2 from './src/screens/login/login';
import GetKidneyInfo from './src/screens/login/get_kidney_info';
import GetUserInfo from './src/screens/login/get_usr_info';
import GetUnderlyingDiseaseInfo from './src/screens/login/get_underlying_disease_info';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { LogBox, Alert } from 'react-native';
import PushNotification from './src/pushnotification';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { HomeProvider } from './src/components/homeContext';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initializeKakaoSDK('1f96718a8d259618eec427c10f31719c');
    LogBox.ignoreAllLogs();

    const initNotification = async () => {
      await checkApplicationPermission(); // 권한 요청
    };

    const displayStoredUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log('async-storage에 저장된 사용자 정보 가져옴!');
          
          // healthCheckup 배열이 있는 경우 resOriginalData 처리
          if (parsedData.healthCheckup && Array.isArray(parsedData.healthCheckup)) {
            const processedData = {
              ...parsedData,
              healthCheckup: parsedData.healthCheckup.map(item => ({
                ...item,
                resOriGinalData: item.resOriGinalData 
                  ? `${item.resOriGinalData.substring(0, 5)}...`
                  : item.resOriGinalData
              }))
            };
            console.log('user: ', JSON.stringify(processedData, null, 2));
          } else {
            console.log('user: ', JSON.stringify(parsedData, null, 2));
          }
        } else {
          console.log('async-storage에 사용자 정보 없음...');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    displayStoredUserData();
  }, []);

  return (
    <HomeProvider>
      <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent'}} edges={['top', 'bottom']}>
        <NavigationContainer>
          <PushNotification />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login1" component={Login1} />
            <Stack.Screen name="Login2" component={Login2} />
            <Stack.Screen name="GetUserInfo" component={GetUserInfo} />
            <Stack.Screen name="GetKidneyInfo" component={GetKidneyInfo} />
            <Stack.Screen name="GetUnderlyingDiseaseInfo" component={GetUnderlyingDiseaseInfo} />
            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
            <Stack.Screen name="NoTabs" component={NavigationWithoutTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider> 
    </HomeProvider>
    
  );
};

export default App;