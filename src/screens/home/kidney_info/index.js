// src\screens\home\kidney_info\index.js
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js';

import {
  parseDateString,
  parseHealthCheckupDate,
  formatDate,
  calculateAge,
  calculateGFR,
  getLatestGFR,
} from '../../../components/dataUtils';

const getKidneyRiskLevels = () => {
  return [
    {
      level: '정상',
      minGFR: 90,
      maxGFR: Infinity,
      criteriaText: '사구체여과율 90 이상',
      description: '콩팥이 정상적으로 작동하고 있는 상태입니다.',
      color: '#5E9DFF',
      chart: require('../../../images/home/kidney_info/정상.png'),
      onImage: require('../../../images/home/kidney_info/on_1.png'),
      offImage: require('../../../images/home/kidney_info/off_1.png'),
    },
    {
      level: '주의',
      minGFR: 60,
      maxGFR: 89,
      criteriaText: '사구체여과율 60 이상 및 90 미만',
      description:
        '콩팥 건강이 약간 저하되었습니다. 정기적인 관리가 필요합니다.',
      color: '#91D78C',
      chart: require('../../../images/home/kidney_info/주의.png'),
      onImage: require('../../../images/home/kidney_info/on_2.png'),
      offImage: require('../../../images/home/kidney_info/off_2.png'),
    },
    {
      level: '중등도',
      minGFR: 30,
      maxGFR: 59,
      criteriaText: '사구체여과율 30 이상 및 60 미만',
      description: '콩팥 기능이 감소된 상태로, 의료적인 관찰이 필요합니다.',
      color: '#FFD26E',
      chart: require('../../../images/home/kidney_info/중등도.png'),
      onImage: require('../../../images/home/kidney_info/on_3.png'),
      offImage: require('../../../images/home/kidney_info/off_3.png'),
    },
    {
      level: '위험',
      minGFR: 15,
      maxGFR: 29,
      criteriaText: '사구체여과율 15 이상 및 30 미만',
      description:
        '콩팥 건강이 심각하게 저하되었습니다. 즉각적인 치료가 필요합니다.',
      color: '#FFB36E',
      chart: require('../../../images/home/kidney_info/위험.png'),
      onImage: require('../../../images/home/kidney_info/on_4.png'),
      offImage: require('../../../images/home/kidney_info/off_4.png'),
    },
    {
      level: '매우위험',
      minGFR: 0,
      maxGFR: 14,
      criteriaText: '사구체여과율 15 미만',
      description:
        '콩팥 기능이 거의 상실된 상태입니다. 긴급한 치료가 필요합니다.',
      color: '#FF6B6B',
      chart: require('../../../images/home/kidney_info/매우위험.png'),
      onImage: require('../../../images/home/kidney_info/on_5.png'),
      offImage: require('../../../images/home/kidney_info/off_5.png'),
    },
  ];
};

const Kidney_info_screen = () => {
  const navigation = useNavigation();

  // User state variables
  const [userName, setUserName] = useState('');
  const [userGFR, setUserGFR] = useState(null);
  const [userCheckupDate, setUserCheckupDate] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');

  const [selectedRiskLevel, setSelectedRiskLevel] = useState(null);
  const [currentRiskLevel, setCurrentRiskLevel] = useState(null);
  const [riskLevelsData, setRiskLevelsData] = useState(null);
  const [latestRecordSource, setLatestRecordSource] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name || '사용자');
          setBirthdate(parsedData.birthdate);
          setGender(parsedData.gender);

          // Get latest GFR
          const {latestGFR, latestCheckupDate, latestRecordSource} =
            getLatestGFR(parsedData, parsedData.birthdate, parsedData.gender);

          setUserGFR(latestGFR);
          setUserCheckupDate(latestCheckupDate);
          setLatestRecordSource(latestRecordSource);

          // Get risk levels data
          const riskLevels = getKidneyRiskLevels();
          setRiskLevelsData(riskLevels);

          // Determine the user's current risk level
          const initialRiskLevel = riskLevels.find(level => {
            return (
              latestGFR !== null &&
              latestGFR >= level.minGFR &&
              latestGFR <= level.maxGFR
            );
          });

          setCurrentRiskLevel(initialRiskLevel || riskLevels[0]);
          setSelectedRiskLevel(initialRiskLevel || riskLevels[0]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  if (!selectedRiskLevel || !riskLevelsData || !currentRiskLevel) {
    return (
      <View style={styles.container}>
        <Text>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상태 카드 */}
      <View style={styles.statusCard}>
        {userGFR !== null ? (
          <>
            <Image
              source={currentRiskLevel.chart}
              style={styles.statusChartImage}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.lightText}>
                {latestRecordSource === 'health_checkup'
                  ? `${userCheckupDate} 건강검진 기준`
                  : `${userCheckupDate} 혈액검사 기준`}
              </Text>
              <View style={styles.lines}>
                <Text style={styles.MiddleText}>
                  {userName}님의 사구체여과율:
                </Text>
                <Text style={styles.gfrText}>
                  <Text>{userGFR}</Text>
                  <Text style={styles.lightText}> ml/min/1.73㎡</Text>
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Image
              source={require('../../../images/home/kidney_info/데이터없음.png')}
              style={styles.statusChartImage}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.MiddleText}>
                아직 사구체 여과율 데이터가 없어요.
              </Text>
              <Text style={styles.MiddleText}>
                검진 기록을 입력하고 콩팥 건강 상태를 알아보세요
              </Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>콩팥 건강 단계 기준</Text>

      {/* 콩팥 건강 위험도 */}
      <View style={styles.criteriaCard}>
        <View style={styles.riskGraph}>
          {riskLevelsData &&
            riskLevelsData.map((level, index) => (
              <View key={index} style={styles.riskItem}>
                <TouchableOpacity
                  onPress={() => setSelectedRiskLevel(level)}
                  activeOpacity={0.8}>
                  <Image
                    source={
                      selectedRiskLevel.level === level.level
                        ? level.onImage
                        : level.offImage
                    }
                    style={[
                      level.level === '정상'
                        ? styles.riskImageNormal
                        : level.level === '주의'
                        ? styles.riskImageCaution
                        : level.level === '중등도'
                        ? styles.riskImageModerate
                        : level.level === '위험'
                        ? styles.riskImageSevere
                        : styles.riskImageCritical, // 매우위험
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.selectedRiskLabel]}>
            {selectedRiskLevel.level}
          </Text>
          <Text style={styles.gfrCriteria}>
            {selectedRiskLevel.criteriaText}
          </Text>
          <Text style={styles.descriptionText}>
            {selectedRiskLevel.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Kidney_info_screen;
