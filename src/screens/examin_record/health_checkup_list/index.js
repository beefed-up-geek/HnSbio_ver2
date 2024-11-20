import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../../theme.js';
import styles from './styles.js'; // 스타일 분리

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_list_screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { healthCheckupData } = route.params || {}; // 전달받은 건강검진 데이터

  const getHealthTags = (item) => {
    const healthTags = [];
    const [systolic, diastolic] = (item.resBloodPressure || '0/0').split('/').map(Number);

    if (item.resUrinaryProtein === '양성') healthTags.push('신장질환');
    if (parseFloat(item.resSerumCreatinine) > 1.6 || parseFloat(item.resGFR) > 83) healthTags.push('만성신장질환');
    if (systolic > 120 || diastolic > 80) healthTags.push('고혈압');
    if (parseInt(item.resFastingBloodSuger) >= 100) healthTags.push('당뇨');
    if (
      (item.resTotalCholesterol && parseInt(item.resTotalCholesterol) >= 200) ||
      (item.resHDLCholesterol && parseInt(item.resHDLCholesterol) <= 60) ||
      (item.resLDLCholesterol && parseInt(item.resLDLCholesterol) >= 130)
    ) {
      healthTags.push('이상지질혈증');
    }

    const bmi = parseFloat(item.resBMI);
    if (bmi >= 30) {
      healthTags.push('비만');
    } else if (bmi >= 23) {
      healthTags.push('과체중');
    }

    const hemoglobin = parseFloat(item.resHemoglobin);
    if ((item.gender === 'male' && hemoglobin <= 13) || (item.gender === 'female' && hemoglobin <= 12)) {
      healthTags.push('빈혈');
    }

    if (
      (item.resAST && parseInt(item.resAST) >= 40) ||
      (item.resALT && parseInt(item.resALT) >= 35) ||
      (item.resyGPT &&
        ((item.gender === 'male' && parseInt(item.resyGPT) >= 77) ||
          (item.gender === 'female' && parseInt(item.resyGPT) >= 45)))
    ) {
      healthTags.push('간장질환');
    }

    return healthTags;
  };

  const renderHealthCheckupCard = ({ item }) => {
    const healthTags = getHealthTags(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NoTabs', {
            screen: 'HealthCheckupSpecifics',
            params: { healthCheckupResult: item },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{item.resCheckupYear} 검진 결과</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.moreText}>더보기</Text>
            <FontAwesome5 name="chevron-right" size={12 * width_ratio} color="#828282" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.tagsContainer}>
            {healthTags.map((tag, index) => (
              <View key={index} style={styles.abnormalTag}>
                <Text style={styles.abnormalTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>총 {healthCheckupData.length}개의 건강검진 기록</Text>
      <FlatList
        data={healthCheckupData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHealthCheckupCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


export default Health_checkup_list_screen;
