// src/navigation/navigation_with_tabs.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './navigation_with_tabs_styles';

// ★ Context import
import { HomeContext } from '../components/homeContext';

import Examin_record_screen from '../screens/examin_record/index';
import Home_screen from '../screens/home/index';
import Hospital_screen from '../screens/hospital/index';
import Kit_screen from '../screens/kit/index';
import Medicine_screen from '../screens/medicine/index';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Tab = createBottomTabNavigator();

const iconSources = {
  Home: require('../images/bottm_navigation/home.png'),
  Kit: require('../images/bottm_navigation/kit.png'),
  Examin_record: require('../images/bottm_navigation/health.png'),
  Hospital: require('../images/bottm_navigation/hospital.png'),
  Medicine: require('../images/bottm_navigation/drug.png'),
};

const selectedIconSources = {
  Home: require('../images/bottm_navigation/homewhite.png'),
  Kit: require('../images/bottm_navigation/kitwhite.png'),
  Examin_record: require('../images/bottm_navigation/healthwhite.png'),
  Hospital: require('../images/bottm_navigation/hospitalwhite.png'),
  Medicine: require('../images/bottm_navigation/drugwhite.png'),
};

const BottomNavigation = () => {
  const insets = useSafeAreaInsets();
  
  // ★ Context 사용 (원한다면)
  const { rerenderHome, setRerenderHome } = useContext(HomeContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: ({ options, route }) => (
          <SafeAreaView style={{ backgroundColor: '#fff' }} edges={['top']}>
            <View
              style={{
                height: 76,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomWidth: 0.8,
                borderBottomColor: '#E9E9E9',
                justifyContent: 'center',
              }}
            >
              <Text style={styles.headerTitle}>
                {options.title || route.name}
              </Text>
            </View>
          </SafeAreaView>
        ),
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
        // unmountOnBlur: true, // => 제거 or false
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home_screen}
        options={{
          title: '홈 화면',
          headerShown: false, // 홈 화면에서는 헤더를 숨김
        }}
      />
      <Tab.Screen
        name="Kit"
        component={Kit_screen}
        options={{
          title: '키트 검사',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Examin_record"
        component={Examin_record_screen}
        options={{
          title: '검진 기록',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Hospital"
        component={Hospital_screen}
        options={{
          title: '병원 검색',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Medicine"
        component={Medicine_screen}
        options={{
          title: '약 검색',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.floatingContainer}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
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

const TabDesign = ({ label, iconSource, isSelected, onPress }) => {
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
        ]}
      >
        <Image
          source={iconSource}
          style={[
            styles.tabIcon,
            { tintColor: isSelected ? '#FFFFFF' : '#828287' },
          ]}
        />
        {isSelected && <Text style={styles.tabLabel}>{label}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BottomNavigation;
