// src\screen(구버전)\healthscreen\tabs\tab_kidney.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Bar } from 'react-native-progress';
import { styles } from './styles_tab';
import { metrics_info, analysis_text } from './data'; // 데이터 분석 관련 정보

const KidneyScreen = ({ healthData, dataUpdated }) => {
  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // healthData가 변경되면 데이터를 필터링하고 저장
    if (healthData && healthData.length > 0) {
      // 유효한 데이터 필터링
      const validData = healthData.filter(record => 
        !isNaN(parseFloat(record.resGFR)) &&
        !isNaN(parseFloat(record.resSerumCreatinine))
      );
      setStoredData(validData);
    }
    setLoading(false);
  }, [healthData, dataUpdated]); // healthData 또는 dataUpdated가 변경될 때마다 실행

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!storedData || storedData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>저장된 건강검진 데이터가 없습니다.</Text>
      </View>
    );
  }

  const latestRecord = storedData[storedData.length - 1]; // 최신 레코드 선택
  const eGFR = parseFloat(latestRecord.resGFR) || 0;
  const serumCreatinine = parseFloat(latestRecord.resSerumCreatinine) || 0;

  const eGFRMin = metrics_info.resGFR.normal_range_lower_limit || 0;
  const eGFRMax = eGFRMin * 2 || 100; // eGFR 하한치의 2배로 상한 설정
  const eGFRProgress = eGFRMax !== 0 ? Math.min(eGFR / eGFRMax, 1) : 0;

  const serumCreatinineMax = metrics_info.resSerumCreatinine.normal_range_upper_limit 
    ? metrics_info.resSerumCreatinine.normal_range_upper_limit * 1.3 
    : 100; // 상한치의 1.3배로 상한 설정
  const serumCreatinineProgress = serumCreatinineMax !== 0 ? Math.min(serumCreatinine / serumCreatinineMax, 1) : 0;

  const analyzeMetric = (metric, value) => {
    const info = metrics_info[metric];
    const analysis = analysis_text[metric];

    if (info) {
      if (value < info.normal_range_lower_limit) {
        return analysis.too_low;
      } else if (value > info.normal_range_upper_limit) {
        return analysis.too_high;
      } else {
        return analysis.normal;
      }
    }
    return "분석할 수 없는 값입니다.";
  };

  const getBarColor = (metric, value) => {
    const info = metrics_info[metric];
    if (info) {
      if (value < info.normal_range_lower_limit || value > info.normal_range_upper_limit) {
        return 'rgba(242, 87, 87, 0.27)'; // 빨간색
      }
      return 'rgba(87, 136, 242, 0.27)'; // 파란색 (정상 범위)
    }
    return 'rgba(242, 87, 87, 0.27)'; // 기본 빨간색
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 사구체여과율 (eGFR) 정보 */}
      <View style={styles.recordContainer}>
        <Text style={styles.title}>사구체여과율 (eGFR)</Text>
        <Text style={styles.value}>{eGFR} {metrics_info.resGFR.unit}</Text>
        <View style={styles.barContainer}>
          <Bar
            progress={eGFRProgress}
            width={200}
            height={10}
            color={getBarColor('resGFR', eGFR)}
            unfilledColor="rgba(217, 217, 217, 1)"
            borderColor='white'
          />
          <View style={styles.markerLine(getMarkerPosition(eGFRMin, eGFRMax))} />
          <Text style={styles.markerText(getMarkerPosition(eGFRMin, eGFRMax))}>{eGFRMin}</Text>
        </View>
        <Text style={styles.analysis}>{analyzeMetric("resGFR", eGFR)}</Text>
      </View>

      {/* 혈청 크레아티닌 정보 */}
      <View style={styles.recordContainer}>
        <Text style={styles.title}>혈청 크레아티닌</Text>
        <Text style={styles.value}>{serumCreatinine} {metrics_info.resSerumCreatinine.unit}</Text>
        <View style={styles.barContainer}>
          <Bar
            progress={serumCreatinineProgress}
            width={200}
            height={10}
            color={getBarColor('resSerumCreatinine', serumCreatinine)}
            unfilledColor="rgba(217, 217, 217, 1)"
            borderColor='white'
          />
          <View style={styles.markerLine(getMarkerPosition(metrics_info.resSerumCreatinine.normal_range_upper_limit, serumCreatinineMax))} />
          <Text style={styles.markerText(getMarkerPosition(metrics_info.resSerumCreatinine.normal_range_upper_limit, serumCreatinineMax))}>
            {metrics_info.resSerumCreatinine.normal_range_upper_limit}
          </Text>
        </View>
        <Text style={styles.analysis}>{analyzeMetric("resSerumCreatinine", serumCreatinine)}</Text>
      </View>

      {/* 요단백 정보 */}
      <View style={styles.recordContainer}>
        <Text style={styles.title}>요단백</Text>
        <Text style={styles.value}>{latestRecord.resUrinaryProtein}</Text>
        <Text style={styles.analysis}>
          {analysis_text.resUrinaryProtein[latestRecord.resUrinaryProtein === "음성" ? "negative" : "positive"]}
        </Text>
      </View>
    </ScrollView>
  );
};

const getMarkerPosition = (value, maxValue) => {
  if (isNaN(value) || isNaN(maxValue) || maxValue === 0) {
    return '0%'; // 기본 위치
  }
  return `${(value / maxValue) * 100}%`;
};

export default KidneyScreen;
