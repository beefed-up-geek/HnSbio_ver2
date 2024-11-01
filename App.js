// /App.js
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigation from './src/navigation/navigation_with_tabs';
import NavigationWithoutTabs from './src/navigation/navigation_without_tabs';
import Login1 from './src/screens/login/index';
import Login2 from './src/screens/login/login';
import GetKidneyInfo from './src/screens/login/get_kidney_info';
import GetUserInfo from './src/screens/login/get_usr_info';
import {initializeKakaoSDK} from '@react-native-kakao/core';
import {LogBox} from 'react-native';
import PushNotification from './src/pushnotification';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initializeKakaoSDK('1f96718a8d259618eec427c10f31719c');
    LogBox.ignoreAllLogs();
  }, []);

  return (
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
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
        <Stack.Screen name="NoTabs" component={NavigationWithoutTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
