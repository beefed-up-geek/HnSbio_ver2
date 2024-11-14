// src\screens\health_checkup\authentication_1\index.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute  } from '@react-navigation/native';
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
import theme from '../../../theme.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Authentication_1_screen = () => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState(-1);
  const navigation = useNavigation();
  const route = useRoute(); // route를 사용하여 params 접근
  const { refreshHealthData } = route.params; // HealthScreen에서 전달된 fetchData 함수를 받음
  

  const handleButtonPress = (index) => {
    setSelectedButtonIndex(index);
    setSelectedValue(index + 1); // 1~8 값 설정
    
    navigation.navigate('authentication_2', { 
      selectedValue: index + 1, 
      selectedLabel: labels[index],
      selectedImage: images[index], 
      refreshHealthData
    });
  };

  const images = [
    require('../../../images/health_screen/kakao.png'),
    require('../../../images/health_screen/payco.png'),
    require('../../../images/health_screen/samsungpass.png'),
    require('../../../images/health_screen/kb.png'),
    require('../../../images/health_screen/pass.png'),
    require('../../../images/health_screen/naver.png'),
    require('../../../images/health_screen/sinhan.png'),
    require('../../../images/health_screen/toss.png'),
  ];

  const labels = [
    "카카오",
    "PAYCO",
    "삼성패스",
    "KB",
    "PASS",
    "네이버",
    "신한",
    "토스"
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ ...styles.title }}>건강 검진 내역을 불러오기 위해{"\n"}본인인증이 필요합니다.</Text>
      <View style={styles.buttonContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleButtonPress(index)}
          >
            <Image
              source={image}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{labels[index]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};



export default Authentication_1_screen;
