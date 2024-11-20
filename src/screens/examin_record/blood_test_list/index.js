// Blood_test_list_screen.js
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../../theme.js';
import styles from './styles.js'; // 스타일 분리

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Blood_test_list_screen = ({ route }) => {
  const navigation = useNavigation();
  const { refreshHealthData } = route.params || {};
  const [userGender, setUserGender] = useState('');
  const [bloodTestData, setBloodTestData] = useState([]);

  // Define fetchUserData as a separate function
  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserGender(parsedData.gender);
        setBloodTestData(parsedData.blood_test_result || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
    
    refreshHealthData();
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const isValueOutOfRange = (value, type) => {
    if (type === 'BUN') {
      return value < 7 || value > 20;
    } else if (type === 'Creatinine') {
      if (userGender === 'male') return value < 0.6 || value > 1.2;
      if (userGender === 'female') return value < 0.5 || value > 1.1;
    } else if (type === 'GFR') {
      return value < 90;
    }
    return false;
  };

  const renderBloodTestCard = ({ item }) => {
    const abnormalLabels = [];

    const addAbnormalLabel = (value, type) => {
      if (isValueOutOfRange(value, type)) {
        abnormalLabels.push(
          <View key={type} style={styles.abnormalTag}>
            <Text style={styles.abnormalTagText}>
              {type}: {value}
            </Text>
          </View>
        );
      }
    };

    addAbnormalLabel(item.BUN, 'BUN');
    addAbnormalLabel(item.creatinine, 'Creatinine');
    addAbnormalLabel(item.GFR, 'GFR');

    const displayDate = item.date;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NoTabs', {
            screen: 'blood_test_specifics',
            params: {
              bloodTestResult: item,
              userGender: userGender, // Pass userGender if needed
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{displayDate} 검사 결과</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.moreText}>더보기</Text>
            <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
          </View>
        </View>
        <View style={styles.cardContent}>
          {abnormalLabels.length > 0 ? (
            <View style={styles.tagsContainer}>{abnormalLabels}</View>
          ) : (
            <Text style={styles.normalText}>모든 항목이 정상입니다</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        총 {bloodTestData.length}개의 혈액검사 기록
      </Text>
      <FlatList
        data={bloodTestData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBloodTestCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


export default Blood_test_list_screen;
