// src\screens\login\index.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import theme from '../../theme';

const Login1 = () => {
  const navigation = useNavigation();
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 2000 }); // 로고 페이드인 애니메이션

    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setTimeout(() => {
          if (user) {
            navigation.replace('BottomNavigation');
          } else {
            navigation.replace('Login2');
          }
        }, 3000);
      } catch (error) {
        console.error('Error checking user in AsyncStorage:', error);
      }
    };

    checkUser();
  }, [navigation, logoOpacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../images/login/splash1.png')}
        style={[styles.logo, logoAnimatedStyle]}
      />
      <Text style={styles.titleText}>간편한 신장기능 관리 어플</Text>
      <ActivityIndicator size="large" color="#1677FF" style={styles.loadingIndicator} />
      <Text style={styles.footerText}>HNSBio.lab</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titleText: {
    color: '#767B80',
    fontSize: 15,
    ...theme.fonts.SemiBold,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: 'gray',
  },
});

export default Login1;
