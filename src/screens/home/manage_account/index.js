// src/screens/home/manage_account/index.js

import React from 'react';
import {View, Text, TouchableOpacity, Image, BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import styles from './styles';

const ManageAccountScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('my_profile'); // Explicitly navigate back to my_profile
        return true; // Prevent the default back action
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>계정 정보</Text>
          <Text style={styles.detailValue}>카카오 (가입일: 2024.3.14)</Text>
        </View>
        <TouchableOpacity style={styles.detailRow}>
          <Text style={styles.detailLabel}>로그아웃</Text>
          <Image
            source={require('../../../images/home/my_profile/go.png')}
            style={styles.goIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailLastRow}>
          <Text style={styles.detailLabel}>회원 탈퇴</Text>
          <Image
            source={require('../../../images/home/my_profile/go.png')}
            style={styles.goIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageAccountScreen;
