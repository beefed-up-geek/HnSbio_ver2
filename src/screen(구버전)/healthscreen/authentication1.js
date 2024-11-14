// src\screen(구버전)\healthscreen\authentication1.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute  } from '@react-navigation/native';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;
const buttonWidth = (Dimensions.get('screen').width - 65 * width_ratio) / 3; // Adjusted for 3 buttons per row with equal margins

const Authentication1Screen = () => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState(-1);
  const navigation = useNavigation();
  const route = useRoute(); // route를 사용하여 params 접근
  const { fetchData } = route.params; // HealthScreen에서 전달된 fetchData 함수를 받음
  

  const handleButtonPress = (index) => {
    setSelectedButtonIndex(index);
    setSelectedValue(index + 1); // 1~8 값 설정
    // navigation.navigate('NoTabs', {
    //   screen: 'Authentication2',
    //   params: {
    //     selectedValue: index + 1, 
    //     selectedLabel: labels[index],
    //     selectedImage: images[index], 
    //     fetchData
    //   },
    // });
    navigation.navigate('Authentication2', { 
      selectedValue: index + 1, 
      selectedLabel: labels[index],
      selectedImage: images[index], 
      fetchData
    });
  };

  const images = [
    require('../../images/health_screen/kakao.png'),
    require('../../images/health_screen/payco.png'),
    require('../../images/health_screen/samsungpass.png'),
    require('../../images/health_screen/kb.png'),
    require('../../images/health_screen/pass.png'),
    require('../../images/health_screen/naver.png'),
    require('../../images/health_screen/sinhan.png'),
    require('../../images/health_screen/toss.png'),
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={require('../../images/chevronArrowLeft.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
    paddingVertical: 20 * height_ratio,
    paddingHorizontal: 24 * width_ratio, 
  },
  title: {
    ...theme.fonts.SemiBold,
    fontSize: 20 * height_ratio,
    marginBottom: 40 * height_ratio,
    marginLeft: 2 * width_ratio,
  },
  backButton: {
    marginLeft: -8,
    marginTop: 12,
    marginBottom: 40,
  },
  backButtonImage: {
    width: 24 * width_ratio,
    height: 24 * width_ratio,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-around',
  // },
  // button: {
  //   width: (Dimensions.get('screen').width / 3) - 24 * width_ratio, // Adjust width to fit 3 per row
  //   height: 100 * width_ratio,
  //   marginBottom: 12 * height_ratio,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#FAFAFB',
  //   borderRadius: 13 * width_ratio,
  // },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginRight: -8 * width_ratio,
    },
  button: {
    width: buttonWidth, // Adjust width to fit 3 per row
    height: 100 * width_ratio,
    marginBottom: 12 * height_ratio,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderRadius: 13 * width_ratio,
    marginRight: 8 * width_ratio,
  },
  buttonImage: {
    width: 40 * width_ratio,
    height: 40 * width_ratio,
    borderRadius: 10 * width_ratio,
  },
  buttonText: {
    marginTop: 4 * height_ratio,
    fontSize: 12 * height_ratio,
    color: '#828287',
    textAlign: 'center',
  },
});


export default Authentication1Screen;
