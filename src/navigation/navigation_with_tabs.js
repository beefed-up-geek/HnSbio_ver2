// src\navigation\navigation_with_tabs.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Easing,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';

import styles from './navigation_with_tabs_styles';

// Import your screen components
import Health_checkup_specifics_screen from '../screens/health_checkup/health_checkup_specifics/index';
import Health_checkup_screen from '../screens/health_checkup/index';
import Daily_check_screen from '../screens/home/daily_check/index';
import Home_screen from '../screens/home/index';
import My_profile_screen from '../screens/home/my_profile/index';
import Set_push_alarm_screen from '../screens/home/set_push_alarm/index';
import Hospital_screen from '../screens/hospital/index';
import Kit_screen from '../screens/kit/index';
import Kit_guide_1_screen from '../screens/kit/kit_guide_1/index';
import Kit_guide_2_screen from '../screens/kit/kit_guide_2/index';
import Kit_test_screen from '../screens/kit/kit_test/index';
import Medicine_screen from '../screens/medicine/index';
import Medicine_specifics_screen from '../screens/medicine/medicine_specifics/index';
import Authentication_1_screen from '../screens/health_checkup/authentication_1/index';
import Authentication_2_screen from '../screens/health_checkup/authentication_2/index';
import Authentication_3_screen from '../screens/health_checkup/authentication_3/index';

// Create global event emitter
export const navigationEventEmitter = new EventEmitter();

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const iconSources = {
  HomeStack: require('../images/bottm_navigation/home.png'),
  KitStack: require('../images/bottm_navigation/kit.png'),
  HealthStack: require('../images/bottm_navigation/health.png'),
  HospitalStack: require('../images/bottm_navigation/hospital.png'),
  MedicineStack: require('../images/bottm_navigation/drug.png'),
};

const selectedIconSources = {
  HomeStack: require('../images/bottm_navigation/homewhite.png'),
  KitStack: require('../images/bottm_navigation/kitwhite.png'),
  HealthStack: require('../images/bottm_navigation/healthwhite.png'),
  HospitalStack: require('../images/bottm_navigation/hospitalwhite.png'),
  MedicineStack: require('../images/bottm_navigation/drugwhite.png'),
};

const CustomHeader = ({title, leftIcon, onLeftPress, isHomeScreen}) => {
  return (
    <View
      style={[
        styles.headerContainer,
        isHomeScreen && {backgroundColor: '#EBEFFE'},
      ]}>
      {isHomeScreen && (
        <TouchableOpacity
          onPress={onLeftPress}
          style={styles.leftButtonContainer}>
          <Image source={leftIcon} style={styles.homeLeftButton} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const stackScreenOptions = ({route, navigation}) => {
  const isHomeScreen = route.name === 'Home';
  const leftIcon = require('../images/hns.png');

  return {
    headerShown: false,
    header: props => {
      const title = props.options.title || route.name;
      return (
        <CustomHeader
          title={title}
          leftIcon={leftIcon}
          onLeftPress={() => {}}
          isHomeScreen={isHomeScreen}
        />
      );
    },
  };
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen 
      name="Home" 
      component={Home_screen}
      options={{title: ' '}} 
    />
  </Stack.Navigator>
);

const KitStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Kit"
      component={Kit_screen}
      options={{title: '키트 검사'}}
    />
  </Stack.Navigator>
);

const HealthStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="HealthCheckup"
      component={Health_checkup_screen}
      options={{title: '건강검진'}}
    />
  </Stack.Navigator>
);

const HospitalStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Hospital"
      component={Hospital_screen}
      options={{title: '병원 찾기'}}
    />
  </Stack.Navigator>
);

const MedicineStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Medicine"
      component={Medicine_screen}
      options={{title: '의약품 검색'}}
    />
  </Stack.Navigator>
);

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 24,
          elevation: 5,
          backgroundColor: '#fff',
          height: 64,
        },
        unmountOnBlur: true
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{title: '홈 화면'}}
      />
      <Tab.Screen
        name="KitStack"
        component={KitStack}
        options={{title: '키트 결과'}}
      />
      <Tab.Screen
        name="HealthStack"
        component={HealthStack}
        options={{title: '건강검진'}}
      />
      <Tab.Screen
        name="HospitalStack"
        component={HospitalStack}
        options={{title: '병원찾기'}}
      />
      <Tab.Screen
        name="MedicineStack"
        component={MedicineStack}
        options={{title: '약 검색'}}
      />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const {options} = descriptors[route.key];
          const label = options.title || route.name;

          const iconSource = isFocused
            ? selectedIconSources[route.name]
            : iconSources[route.name];

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TabDesign
              key={route.key}
              label={label}
              iconSource={iconSource}
              isSelected={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabDesign = ({label, iconSource, isSelected, onPress}) => {
  const [width] = useState(new Animated.Value(isSelected ? 120 : 50));

  useEffect(() => {
    Animated.timing(width, {
      toValue: isSelected ? 120 : 50,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.tabButton,
          {
            width,
            backgroundColor: isSelected ? '#000' : '#fff',
            borderWidth: isSelected ? 0 : 1,
            borderColor: '#fff',
          },
        ]}>
        <Image
          source={iconSource}
          style={[
            styles.tabIcon,
            {tintColor: isSelected ? '#FFFFFF' : '#828287'},
          ]}
        />
        {isSelected && <Text style={styles.tabLabel}>{label}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BottomNavigation;