// src/screens/home/manage_account/index.js

import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './styles';

const ManageAccountScreen = () => {
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
