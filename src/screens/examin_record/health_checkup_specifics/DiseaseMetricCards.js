// src/screens/health_checkup/health_checkup_specifics/DiseaseMetricCards.js
import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import styles from './styles';             // styles.js
import theme from '../../../theme';        // 폰트, 색상 테마 등

// 화면 비율 상수
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

/**
 * 공통 카드 레이아웃 컴포넌트
 */
const MetricCard = ({ title, children }) => {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// 신장질환
// ─────────────────────────────────────────────────────────────
export const KidneyDiseaseCard = ({ healthData }) => {
  return (
    <MetricCard title="신장질환">
      <View
        style={[
          styles.diseaseStatusBox,
          {
            backgroundColor:
              healthData.resUrinaryProtein === '양성' ? '#FFF6F9' : '#F7F8FB',
            borderColor:
              healthData.resUrinaryProtein === '양성' ? '#FEB9B5' : '#DADADA',
          },
        ]}
      >
        <Text style={styles.metricLabel}>요단백</Text>
        <Text
          style={[
            styles.metricValue,
            {
              color:
                healthData.resUrinaryProtein === '양성'
                  ? '#FF5252'
                  : '#000000',
            },
          ]}
        >
          {healthData.resUrinaryProtein || '데이터 없음'}
        </Text>
      </View>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 만성신장질환
// ─────────────────────────────────────────────────────────────
export const ChronicKidneyDiseaseCard = ({ healthData }) => {

  //
  // 혈청크레아티닌
  //
  const serumCreatinine = parseFloat(healthData.resSerumCreatinine) || 0;
  
  // 크레아티닌 전체 범위
  const creatinineOverallMin = 0.0;
  const creatinineOverallMax = 2.0;
  // 참고치
  const creatinineRefMin = 0.5;
  const creatinineRefMax = 1.5;

  // 그래프 실제 너비
  const graphWidth = 200;

  // clamp 함수
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // 사용자 값(크레아티닌)
  const creatinineClampedValue = clamp(serumCreatinine, creatinineOverallMin, creatinineOverallMax);
  const creatinineLineLeft =
    ((creatinineClampedValue - creatinineOverallMin) /
      (creatinineOverallMax - creatinineOverallMin)) *
    graphWidth;

  // 참고치 막대
  const creatinineRefLeft =
    ((creatinineRefMin - creatinineOverallMin) /
      (creatinineOverallMax - creatinineOverallMin)) *
    graphWidth;
  const creatinineRefWidth =
    ((creatinineRefMax - creatinineRefMin) /
      (creatinineOverallMax - creatinineOverallMin)) *
    graphWidth;

  //
  // 신사구체여과율(GFR)
  //
  const userGFR = parseFloat(healthData.resGFR) || 0;
  
  // GFR 전체 범위 (예: 0 ~ 150 mL/min)
  //  -> 실제로는 0~200 등 필요에 맞춰 조정 가능
  const gfrOverallMin = 0;
  const gfrOverallMax = 150;

  // GFR 참고치 (90 ~ 120)
  const gfrRefMin = 90;
  const gfrRefMax = 120;

  // GFR 그래프 좌표 계산
  const gfrClampedValue = clamp(userGFR, gfrOverallMin, gfrOverallMax);
  const gfrLineLeft =
    ((gfrClampedValue - gfrOverallMin) /
      (gfrOverallMax - gfrOverallMin)) *
    graphWidth;

  const gfrRefLeft =
    ((gfrRefMin - gfrOverallMin) /
      (gfrOverallMax - gfrOverallMin)) *
    graphWidth;
  const gfrRefWidth =
    ((gfrRefMax - gfrRefMin) /
      (gfrOverallMax - gfrOverallMin)) *
    graphWidth;


  return (
    <MetricCard title="만성신장질환">
      {/* 첫 번째 줄: '혈청크레아티닌' 박스 */}
      <View style={styles.diseaseRow}>
        {/* 혈청크레아티닌 */}
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor:
                serumCreatinine > 1.6 ? '#FFF6F9' : '#F7F8FB',
              borderColor:
                serumCreatinine > 1.6 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>혈청크레아티닌</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color:
                      serumCreatinine > creatinineRefMax
                        ? '#FF0000'
                        : '#000000',
                  },
                ]}
              >
                {healthData.resSerumCreatinine || '데이터 없음'}
              </Text>
              {healthData.resSerumCreatinine ? (
                <Text style={styles.metricUnit}>mg/dL</Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* 참고치 범위(초록색) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    {
                      left: creatinineRefLeft,
                      width: creatinineRefWidth,
                    },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: creatinineLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: creatinineLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (0.5 / 1.5) */}
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: creatinineRefLeft },
                ]}
              >
                {creatinineRefMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: creatinineRefLeft + creatinineRefWidth },
                ]}
              >
                {creatinineRefMax}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 두 번째 줄: '사구체여과율(GFR)' 박스 */}
      <View style={styles.diseaseRow}>
        {/* GFR */}
        <View
          style={[
            styles.diseaseStatusBox,
            {
              // 정상 범위를 벗어나면 붉은 배경
              backgroundColor:
                userGFR < 90 || userGFR > 120
                  ? '#FFF6F9'
                  : '#F7F8FB',
              borderColor:
                userGFR < 90 || userGFR > 120
                  ? '#FEB9B5'
                  : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>사구체여과율</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color:
                      userGFR < gfrRefMin || userGFR > gfrRefMax
                        ? '#FF0000'
                        : '#000000',
                  },
                ]}
              >
                {healthData.resGFR || '데이터 없음'}
              </Text>
              {healthData.resGFR ? (
                <Text style={styles.metricUnit}>
                  mL/min/1.73m²
                </Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* GFR 참고치 범위(90~120) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    {
                      left: gfrRefLeft,
                      width: gfrRefWidth,
                    },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: gfrLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: gfrLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (90 / 120) */}
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: gfrRefLeft },
                ]}
              >
                {gfrRefMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: gfrRefLeft + gfrRefWidth },
                ]}
              >
                {gfrRefMax}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 고혈압
// ─────────────────────────────────────────────────────────────
export const HypertensionCard = ({ healthData }) => {
  // 사용자 값
  const systolic = parseFloat(healthData.resBloodPressureSystolic) || 0;
  const diastolic = parseFloat(healthData.resBloodPressureDiastolic) || 0;

  // 그래프 공통 설정
  const graphWidth = 200;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ─────────────────────────────────────────────────────────
  // 수축기 혈압
  // ─────────────────────────────────────────────────────────
  // 전체 범위 예: 0 ~ 200
  const sysOverallMin = 0;
  const sysOverallMax = 200;
  // 참고치(정상): 0 ~ 120
  const sysRefMin = 0;
  const sysRefMax = 120;

  // 값 클램핑
  const sysClamped = clamp(systolic, sysOverallMin, sysOverallMax);
  // 사용자 값(빨간 선) 위치
  const sysLineLeft =
    ((sysClamped - sysOverallMin) / (sysOverallMax - sysOverallMin)) *
    graphWidth;

  // 참고 범위(초록색 바) 위치/너비
  const sysRefLeft =
    ((sysRefMin - sysOverallMin) / (sysOverallMax - sysOverallMin)) *
    graphWidth;
  const sysRefWidth =
    ((sysRefMax - sysRefMin) / (sysOverallMax - sysOverallMin)) *
    graphWidth;

  // ─────────────────────────────────────────────────────────
  // 이완기 혈압
  // ─────────────────────────────────────────────────────────
  // 전체 범위 예: 0 ~ 120
  const diaOverallMin = 0;
  const diaOverallMax = 120;
  // 참고치(정상): 0 ~ 80
  const diaRefMin = 0;
  const diaRefMax = 80;

  const diaClamped = clamp(diastolic, diaOverallMin, diaOverallMax);
  const diaLineLeft =
    ((diaClamped - diaOverallMin) / (diaOverallMax - diaOverallMin)) *
    graphWidth;

  const diaRefLeft =
    ((diaRefMin - diaOverallMin) / (diaOverallMax - diaOverallMin)) *
    graphWidth;
  const diaRefWidth =
    ((diaRefMax - diaRefMin) / (diaOverallMax - diaOverallMin)) *
    graphWidth;

  return (
    <MetricCard title="고혈압">
      {/* 첫 번째 줄: 수축기 혈압 */}
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              // 참고 범위를 벗어나면 붉은 배경
              backgroundColor:
                systolic > 120 ? '#FFF6F9' : '#F7F8FB',
              borderColor:
                systolic > 120 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>수축기 혈압</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color: systolic > sysRefMax ? '#FF0000' : '#000000',
                  },
                ]}
              >
                {healthData.resBloodPressureSystolic || '데이터 없음'}
              </Text>
              {healthData.resBloodPressureSystolic ? (
                <Text style={styles.metricUnit}>mmHg</Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* 참고 범위(0 ~ 120) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    {
                      left: sysRefLeft,
                      width: sysRefWidth,
                    },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: sysLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: sysLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (0 / 120) */}
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: sysRefLeft },
                ]}
              >
                {sysRefMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: sysRefLeft + sysRefWidth },
                ]}
              >
                {sysRefMax}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 두 번째 줄: 이완기 혈압 */}
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor:
                diastolic > 80 ? '#FFF6F9' : '#F7F8FB',
              borderColor:
                diastolic > 80 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>이완기 혈압</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color: diastolic > diaRefMax ? '#FF0000' : '#000000',
                  },
                ]}
              >
                {healthData.resBloodPressureDiastolic || '데이터 없음'}
              </Text>
              {healthData.resBloodPressureDiastolic ? (
                <Text style={styles.metricUnit}>mmHg</Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* 참고 범위(0 ~ 80) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    {
                      left: diaRefLeft,
                      width: diaRefWidth,
                    },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: diaLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: diaLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (0 / 80) */}
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: diaRefLeft },
                ]}
              >
                {diaRefMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: diaRefLeft + diaRefWidth },
                ]}
              >
                {diaRefMax}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.warningText}>
       ※ 혈압이 너무 낮은 경우에는 전문가와 상담하세요.
      </Text>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 당뇨
// ─────────────────────────────────────────────────────────────
export const DiabetesCard = ({ healthData }) => {
  const fastingSugar = parseFloat(healthData.resFastingBloodSuger) || 0;

  // 전체 그래프 범위(예: 0 ~ 200)
  const overallMin = 0;
  const overallMax = 200;
  // 참고 범위(70 ~ 110)
  const refMin = 70;
  const refMax = 110;

  const graphWidth = 200;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const clampedValue = clamp(fastingSugar, overallMin, overallMax);
  const userLineLeft =
    ((clampedValue - overallMin) / (overallMax - overallMin)) * graphWidth;

  const refLeft =
    ((refMin - overallMin) / (overallMax - overallMin)) * graphWidth;
  const refWidth =
    ((refMax - refMin) / (overallMax - overallMin)) * graphWidth;

  return (
    <MetricCard title="당뇨">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor:
                fastingSugar < refMin || fastingSugar > refMax
                  ? '#FFF6F9'
                  : '#F7F8FB',
              borderColor:
                fastingSugar < refMin || fastingSugar > refMax
                  ? '#FEB9B5'
                  : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>공복혈당</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color:
                      fastingSugar < refMin || fastingSugar > refMax
                        ? '#FF0000'
                        : '#000000',
                  },
                ]}
              >
                {healthData.resFastingBloodSuger || '데이터 없음'}
              </Text>
              {healthData.resFastingBloodSuger ? (
                <Text style={styles.metricUnit}>mg/dL</Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* 참고치(70~110) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    { left: refLeft, width: refWidth },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: userLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: userLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (70 / 110) */}
              <Text style={[styles.referenceEdgeLabel, { left: refLeft }]}>
                {refMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: refLeft + refWidth },
                ]}
              >
                {refMax}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 이상지질혈증
// ─────────────────────────────────────────────────────────────
export const DyslipidemiaCard = ({ healthData }) => {
  // --- 사용자 값 ---
  const totalChol = parseFloat(healthData.resTotalCholesterol) || 0;
  const hdl = parseFloat(healthData.resHDLCholesterol) || 0;
  const ldl = parseFloat(healthData.resLDLCholesterol) || 0;

  // “검사를 실시하지 않음” 경우
  const noTestData = 
    !healthData.resTotalCholesterol &&
    !healthData.resHDLCholesterol &&
    !healthData.resLDLCholesterol;
  
  if (noTestData) {
    return (
      <MetricCard title="이상지질혈증">
        <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
      </MetricCard>
    );
  }

  // 공통 그래프 너비, clamp 함수
  const graphWidth = 200;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ─────────────────────────────────────────────────────────
  // ① 총콜레스테롤
  // ─────────────────────────────────────────────────────────
  const totalCholOverallMin = 0;   // 전체 범위 (예: 0~300)
  const totalCholOverallMax = 300;
  const totalCholRefMin = 130;     // 참고 범위 130~230
  const totalCholRefMax = 230;

  const totalCholClamped = clamp(totalChol, totalCholOverallMin, totalCholOverallMax);
  const totalCholLineLeft =
    ((totalCholClamped - totalCholOverallMin) /
      (totalCholOverallMax - totalCholOverallMin)) *
    graphWidth;

  const totalCholRefLeft =
    ((totalCholRefMin - totalCholOverallMin) /
      (totalCholOverallMax - totalCholOverallMin)) *
    graphWidth;
  const totalCholRefWidth =
    ((totalCholRefMax - totalCholRefMin) /
      (totalCholOverallMax - totalCholOverallMin)) *
    graphWidth;

  // ─────────────────────────────────────────────────────────
  // ② HDL
  // ─────────────────────────────────────────────────────────
  const hdlOverallMin = 0;   // 전체 범위 (예: 0~120)
  const hdlOverallMax = 120;
  const hdlRefMin = 35;      // 참고 범위 35~99
  const hdlRefMax = 99;

  const hdlClamped = clamp(hdl, hdlOverallMin, hdlOverallMax);
  const hdlLineLeft =
    ((hdlClamped - hdlOverallMin) /
      (hdlOverallMax - hdlOverallMin)) *
    graphWidth;

  const hdlRefLeft =
    ((hdlRefMin - hdlOverallMin) /
      (hdlOverallMax - hdlOverallMin)) *
    graphWidth;
  const hdlRefWidth =
    ((hdlRefMax - hdlRefMin) /
      (hdlOverallMax - hdlOverallMin)) *
    graphWidth;

  // ─────────────────────────────────────────────────────────
  // ③ LDL
  // ─────────────────────────────────────────────────────────
  const ldlOverallMin = 0;   // 전체 범위 (예: 0~200)
  const ldlOverallMax = 200;
  const ldlRefMin = 45;      // 참고 범위 45~150
  const ldlRefMax = 150;

  const ldlClamped = clamp(ldl, ldlOverallMin, ldlOverallMax);
  const ldlLineLeft =
    ((ldlClamped - ldlOverallMin) /
      (ldlOverallMax - ldlOverallMin)) *
    graphWidth;

  const ldlRefLeft =
    ((ldlRefMin - ldlOverallMin) /
      (ldlOverallMax - ldlOverallMin)) *
    graphWidth;
  const ldlRefWidth =
    ((ldlRefMax - ldlRefMin) /
      (ldlOverallMax - ldlOverallMin)) *
    graphWidth;

  return (
    <MetricCard title="이상지질혈증">
      {/* 첫 번째 줄: 총콜레스테롤 */}
      {healthData.resTotalCholesterol && (
        <View style={styles.diseaseRow}>
          <View
            style={[
              styles.diseaseStatusBox,
              {
                // 참고 범위를 벗어나면 붉은색
                backgroundColor:
                  totalChol < 130 || totalChol > 230
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  totalChol < 130 || totalChol > 230
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>총콜레스테롤</Text>

            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        totalChol < totalCholRefMin || totalChol > totalCholRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {totalChol || '데이터 없음'}
                </Text>
                {totalChol ? (
                  <Text style={styles.metricUnit}>mg/dL</Text>
                ) : null}
              </View>

              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 130~230 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      {
                        left: totalCholRefLeft,
                        width: totalCholRefWidth,
                      },
                    ]}
                  />
                  {/* 사용자 값(빨간 선) */}
                  <View
                    style={[
                      styles.userValueLine,
                      { left: totalCholLineLeft },
                    ]}
                  />
                  {/* 마커 이미지 */}
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: totalCholLineLeft },
                    ]}
                  />
                </View>

                {/* 참고치 라벨 (130 / 230) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: totalCholRefLeft },
                  ]}
                >
                  {totalCholRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: totalCholRefLeft + totalCholRefWidth },
                  ]}
                >
                  {totalCholRefMax}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 두 번째 줄: HDL */}
      {healthData.resHDLCholesterol && (
        <View style={styles.diseaseRow}>
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor:
                  hdl < 35 || hdl > 99
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  hdl < 35 || hdl > 99
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>HDL</Text>

            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        hdl < hdlRefMin || hdl > hdlRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {hdl || '데이터 없음'}
                </Text>
                {hdl ? (
                  <Text style={styles.metricUnit}>mg/dL</Text>
                ) : null}
              </View>

              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 35~99 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      {
                        left: hdlRefLeft,
                        width: hdlRefWidth,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.userValueLine,
                      { left: hdlLineLeft },
                    ]}
                  />
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: hdlLineLeft },
                    ]}
                  />
                </View>

                {/* 참고치 라벨 (35 / 99) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: hdlRefLeft },
                  ]}
                >
                  {hdlRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: hdlRefLeft + hdlRefWidth },
                  ]}
                >
                  {hdlRefMax}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 세 번째 줄: LDL */}
      {healthData.resLDLCholesterol && (
        <View style={styles.diseaseRow}>
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor:
                  ldl < 45 || ldl > 150
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  ldl < 45 || ldl > 150
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>LDL</Text>

            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        ldl < ldlRefMin || ldl > ldlRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {ldl || '데이터 없음'}
                </Text>
                {ldl ? (
                  <Text style={styles.metricUnit}>mg/dL</Text>
                ) : null}
              </View>

              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 45~150 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      {
                        left: ldlRefLeft,
                        width: ldlRefWidth,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.userValueLine,
                      { left: ldlLineLeft },
                    ]}
                  />
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: ldlLineLeft },
                    ]}
                  />
                </View>

                {/* 참고치 라벨 (45 / 150) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: ldlRefLeft },
                  ]}
                >
                  {ldlRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: ldlRefLeft + ldlRefWidth },
                  ]}
                >
                  {ldlRefMax}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 비만도
// ─────────────────────────────────────────────────────────────
export const ObesityCard = ({ healthData }) => {
  const bmiValue = parseFloat(healthData.resBMI) || 0;

  const getBmiStatus = (bmi) => {
    if (bmi <= 18.5) return { text: '저체중', color: '#FFA726' };
    if (bmi < 23) return { text: '정상', color: '#4CAF50' };
    if (bmi < 30) return { text: '과체중', color: '#FF7043' };
    return { text: '비만', color: '#FF5252' };
  };

  const bmiStatus = getBmiStatus(bmiValue);

  return (
    <MetricCard title="비만도">
      <View style={styles.diseaseRow}>
        {/* 신장 */}
        <View
          style={[
            styles.diseaseStatusBox,
            { backgroundColor: '#F7F8FB', borderColor: '#DADADA' },
          ]}
        >
          <Text style={styles.metricLabel}>신장</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.metricValue}>
              {healthData.resHeight || '데이터 없음'}
            </Text>
            {healthData.resHeight && <Text style={styles.metricUnit}> cm</Text>}
          </View>
        </View>

        {/* 체중 */}
        <View
          style={[
            styles.diseaseStatusBox,
            { backgroundColor: '#F7F8FB', borderColor: '#DADADA' },
          ]}
        >
          <Text style={styles.metricLabel}>체중</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.metricValue}>
              {healthData.resWeight || '데이터 없음'}
            </Text>
            {healthData.resWeight && <Text style={styles.metricUnit}> kg</Text>}
          </View>
        </View>
      </View>

      <View style={styles.diseaseRow}>
        {/* BMI */}
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: bmiValue >= 23 ? '#FFF6F9' : '#F7F8FB',
              borderColor: bmiValue >= 23 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>체질량지수 ({bmiStatus.text})</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.metricValue, { color: bmiStatus.color }]}>
              {healthData.resBMI || '데이터 없음'}
            </Text>
            {healthData.resBMI && <Text style={styles.metricUnit}> kg/m²</Text>}
          </View>
        </View>

        {/* 허리둘레 */}
        <View
          style={[
            styles.diseaseStatusBox,
            { backgroundColor: '#F7F8FB', borderColor: '#DADADA' },
          ]}
        >
          <Text style={styles.metricLabel}>허리둘레</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.metricValue}>
              {healthData.resWaist || '데이터 없음'}
            </Text>
            {healthData.resWaist && <Text style={styles.metricUnit}> cm</Text>}
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 빈혈
// ─────────────────────────────────────────────────────────────
export const AnemiaCard = ({ healthData, gender }) => {
  // 사용자 값(혈색소)
  const hemoglobinValue = parseFloat(healthData.resHemoglobin) || 0;

  // 검사 안 했을 경우
  if (!healthData.resHemoglobin) {
    return (
      <MetricCard title="빈혈">
        <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
      </MetricCard>
    );
  }

  // 그래프용 상수/함수
  const graphWidth = 200;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // 전체 그래프 범위(예: 0~20 g/dL)
  const hbOverallMin = 0.0;
  const hbOverallMax = 20.0;

  // 참고치(0 ~ 16.1 g/dL)
  const hbRefMin = 0.0;     // 가령 0.0이라고 가정
  const hbRefMax = 16.1;

  // 사용자 값 클램핑
  const hbClamped = clamp(hemoglobinValue, hbOverallMin, hbOverallMax);
  const hbLineLeft =
    ((hbClamped - hbOverallMin) / (hbOverallMax - hbOverallMin)) *
    graphWidth;

  // 참고 범위 막대(초록색)
  const hbRefLeft =
    ((hbRefMin - hbOverallMin) / (hbOverallMax - hbOverallMin)) *
    graphWidth;
  const hbRefWidth =
    ((hbRefMax - hbRefMin) / (hbOverallMax - hbOverallMin)) *
    graphWidth;

  return (
    <MetricCard title="빈혈">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              // 참고 범위를 벗어나면 붉은 배경
              backgroundColor:
                hemoglobinValue > hbRefMax
                  ? '#FFF6F9'
                  : '#F7F8FB',
              borderColor:
                hemoglobinValue > hbRefMax
                  ? '#FEB9B5'
                  : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>혈색소</Text>

          <View style={styles.valueAndGraphContainer}>
            {/* 값 + 단위 (세로 배치) */}
            <View style={styles.valueContainerColumn}>
              <Text
                style={[
                  styles.metricValue,
                  {
                    color:
                      hemoglobinValue > hbRefMax
                        ? '#FF0000'
                        : '#000000',
                  },
                ]}
              >
                {hemoglobinValue || '데이터 없음'}
              </Text>
              {hemoglobinValue ? (
                <Text style={styles.metricUnit}>g/dL</Text>
              ) : null}
            </View>

            {/* 그래프 */}
            <View style={styles.graphContainer}>
              <View style={styles.graphBar}>
                {/* 참고치(0 ~ 16.1) */}
                <View
                  style={[
                    styles.referenceRangeBar,
                    {
                      left: hbRefLeft,
                      width: hbRefWidth,
                    },
                  ]}
                />
                {/* 사용자 값(빨간 선) */}
                <View
                  style={[
                    styles.userValueLine,
                    { left: hbLineLeft },
                  ]}
                />
                {/* 마커 이미지 */}
                <Image
                  source={require('../../../images/health_screen/marker.png')}
                  style={[
                    styles.userValueMarkerImage,
                    { left: hbLineLeft },
                  ]}
                />
              </View>

              {/* 참고치 라벨 (0 / 16.1) */}
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: hbRefLeft },
                ]}
              >
                {hbRefMin}
              </Text>
              <Text
                style={[
                  styles.referenceEdgeLabel,
                  { left: hbRefLeft + hbRefWidth },
                ]}
              >
                {hbRefMax}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// ─────────────────────────────────────────────────────────────
// 간장질환
// ─────────────────────────────────────────────────────────────
export const LiverDiseaseCard = ({ healthData, gender }) => {
  // 사용자 값
  const astValue = parseFloat(healthData.resAST) || 0;
  const altValue = parseFloat(healthData.resALT) || 0;
  const gtpValue = parseFloat(healthData.resyGPT) || 0;

  // 검사 안 했을 경우
  const noTestData = !healthData.resAST && !healthData.resALT && !healthData.resyGPT;
  if (noTestData) {
    return (
      <MetricCard title="간장질환">
        <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
      </MetricCard>
    );
  }

  // 그래프용 공통 상수/함수
  const graphWidth = 200;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // ─────────────────────────────────────────────────────────
  // 1) AST
  // ─────────────────────────────────────────────────────────
  // 그래프 전체 범위(예: 0 ~ 80)
  const astOverallMin = 0;
  const astOverallMax = 80; 
  // 참고 범위: 0 ~ 40
  const astRefMin = 0;
  const astRefMax = 40;

  // 사용자 값 clamping
  const astClamped = clamp(astValue, astOverallMin, astOverallMax);
  const astLineLeft =
    ((astClamped - astOverallMin) / (astOverallMax - astOverallMin)) *
    graphWidth;

  // 참고 범위(초록색 막대)
  const astRefLeft =
    ((astRefMin - astOverallMin) / (astOverallMax - astOverallMin)) *
    graphWidth;
  const astRefWidth =
    ((astRefMax - astRefMin) / (astOverallMax - astOverallMin)) *
    graphWidth;

  // ─────────────────────────────────────────────────────────
  // 2) ALT
  // ─────────────────────────────────────────────────────────
  const altOverallMin = 0;
  const altOverallMax = 70; 
  // 참고 범위: 0 ~ 35
  const altRefMin = 0;
  const altRefMax = 35;

  const altClamped = clamp(altValue, altOverallMin, altOverallMax);
  const altLineLeft =
    ((altClamped - altOverallMin) / (altOverallMax - altOverallMin)) *
    graphWidth;

  const altRefLeft =
    ((altRefMin - altOverallMin) / (altOverallMax - altOverallMin)) *
    graphWidth;
  const altRefWidth =
    ((altRefMax - altRefMin) / (altOverallMax - altOverallMin)) *
    graphWidth;

  // ─────────────────────────────────────────────────────────
  // 3) γ-GTP
  // ─────────────────────────────────────────────────────────
  const gtpOverallMin = 0;
  const gtpOverallMax = 100; 
  // 참고 범위: 11 ~ 63
  const gtpRefMin = 11;
  const gtpRefMax = 63;

  const gtpClamped = clamp(gtpValue, gtpOverallMin, gtpOverallMax);
  const gtpLineLeft =
    ((gtpClamped - gtpOverallMin) / (gtpOverallMax - gtpOverallMin)) *
    graphWidth;

  const gtpRefLeft =
    ((gtpRefMin - gtpOverallMin) / (gtpOverallMax - gtpOverallMin)) *
    graphWidth;
  const gtpRefWidth =
    ((gtpRefMax - gtpRefMin) / (gtpOverallMax - gtpOverallMin)) *
    graphWidth;

  return (
    <MetricCard title="간장질환">
      {/* 첫 번째 줄: AST */}
      <View style={styles.diseaseRow}>
        {healthData.resAST && (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor:
                  astValue < astRefMin || astValue > astRefMax
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  astValue < astRefMin || astValue > astRefMax
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>AST</Text>
  
            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 (세로 배치) */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        astValue < astRefMin || astValue > astRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {astValue || '데이터 없음'}
                </Text>
                {astValue ? (
                  <Text style={styles.metricUnit}> U/L</Text>
                ) : null}
              </View>
  
              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 0~40 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      { left: astRefLeft, width: astRefWidth },
                    ]}
                  />
                  {/* 사용자 값(빨간 선) */}
                  <View
                    style={[
                      styles.userValueLine,
                      { left: astLineLeft },
                    ]}
                  />
                  {/* 마커 이미지 */}
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: astLineLeft },
                    ]}
                  />
                </View>
  
                {/* 참고치 라벨 (0 / 40) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: astRefLeft },
                  ]}
                >
                  {astRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: astRefLeft + astRefWidth },
                  ]}
                >
                  {astRefMax}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
  
      {/* 두 번째 줄: ALT */}
      <View style={styles.diseaseRow}>
        {healthData.resALT && (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor:
                  altValue < altRefMin || altValue > altRefMax
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  altValue < altRefMin || altValue > altRefMax
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>ALT</Text>
  
            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 (세로 배치) */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        altValue < altRefMin || altValue > altRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {altValue || '데이터 없음'}
                </Text>
                {altValue ? (
                  <Text style={styles.metricUnit}> U/L</Text>
                ) : null}
              </View>
  
              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 0~35 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      { left: altRefLeft, width: altRefWidth },
                    ]}
                  />
                  <View
                    style={[
                      styles.userValueLine,
                      { left: altLineLeft },
                    ]}
                  />
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: altLineLeft },
                    ]}
                  />
                </View>
  
                {/* 참고치 라벨 (0 / 35) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: altRefLeft },
                  ]}
                >
                  {altRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: altRefLeft + altRefWidth },
                  ]}
                >
                  {altRefMax}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
  
      {/* 세 번째 줄: γ-GTP */}
      <View style={styles.diseaseRow}>
        {healthData.resyGPT && (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor:
                  gtpValue < gtpRefMin || gtpValue > gtpRefMax
                    ? '#FFF6F9'
                    : '#F7F8FB',
                borderColor:
                  gtpValue < gtpRefMin || gtpValue > gtpRefMax
                    ? '#FEB9B5'
                    : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>γ-GTP</Text>
  
            <View style={styles.valueAndGraphContainer}>
              {/* 값 + 단위 (세로 배치) */}
              <View style={styles.valueContainerColumn}>
                <Text
                  style={[
                    styles.metricValue,
                    {
                      color:
                        gtpValue < gtpRefMin || gtpValue > gtpRefMax
                          ? '#FF0000'
                          : '#000000',
                    },
                  ]}
                >
                  {gtpValue || '데이터 없음'}
                </Text>
                {gtpValue ? (
                  <Text style={styles.metricUnit}> U/L</Text>
                ) : null}
              </View>
  
              {/* 그래프 */}
              <View style={styles.graphContainer}>
                <View style={styles.graphBar}>
                  {/* 참고치 11~63 */}
                  <View
                    style={[
                      styles.referenceRangeBar,
                      { left: gtpRefLeft, width: gtpRefWidth },
                    ]}
                  />
                  <View
                    style={[
                      styles.userValueLine,
                      { left: gtpLineLeft },
                    ]}
                  />
                  <Image
                    source={require('../../../images/health_screen/marker.png')}
                    style={[
                      styles.userValueMarkerImage,
                      { left: gtpLineLeft },
                    ]}
                  />
                </View>
  
                {/* 참고치 라벨 (11 / 63) */}
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: gtpRefLeft },
                  ]}
                >
                  {gtpRefMin}
                </Text>
                <Text
                  style={[
                    styles.referenceEdgeLabel,
                    { left: gtpRefLeft + gtpRefWidth },
                  ]}
                >
                  {gtpRefMax}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </MetricCard>
  );
};
