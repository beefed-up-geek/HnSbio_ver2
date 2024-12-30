// src/screens/health_checkup/health_checkup_specifics/DiseaseMetricCards.js
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';       // styles.js
import theme from '../../../theme';  // 폰트, 색상 테마 등
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

// 신장질환
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
                  : '#4CAF50',
            },
          ]}
        >
          {healthData.resUrinaryProtein || '데이터 없음'}
        </Text>
      </View>
    </MetricCard>
  );
};

// 만성신장질환
export const ChronicKidneyDiseaseCard = ({ healthData }) => {
  const serumCreatinine = parseFloat(healthData.resSerumCreatinine) || 0;
  const gfr = parseFloat(healthData.resGFR) || 0;

  return (
    <MetricCard title="만성신장질환">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: serumCreatinine > 1.6 ? '#FFF6F9' : '#F7F8FB',
              borderColor: serumCreatinine > 1.6 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>혈청크레아틴</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                { color: serumCreatinine > 1.6 ? '#FF5252' : '#4CAF50' },
              ]}
            >
              {healthData.resSerumCreatinine || '데이터 없음'}
            </Text>
            {healthData.resSerumCreatinine ? (
              <Text style={styles.metricUnit}> mg/dL</Text>
            ) : null}
          </View>
        </View>

        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: gfr > 83 ? '#FFF6F9' : '#F7F8FB',
              borderColor: gfr > 83 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>GFR</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                { color: gfr > 83 ? '#FF5252' : '#4CAF50' },
              ]}
            >
              {healthData.resGFR || '데이터 없음'}
            </Text>
            {healthData.resGFR ? (
              <Text style={styles.metricUnit}> mL/min</Text>
            ) : null}
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// 고혈압
export const HypertensionCard = ({ healthData }) => {
  const systolic = parseFloat(healthData.resBloodPressureSystolic) || 0;
  const diastolic = parseFloat(healthData.resBloodPressureDiastolic) || 0;

  return (
    <MetricCard title="고혈압">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: systolic > 120 ? '#FFF6F9' : '#F7F8FB',
              borderColor: systolic > 120 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>수축기 혈압</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: systolic > 120 ? '#FF5252' : '#4CAF50',
                },
              ]}
            >
              {healthData.resBloodPressureSystolic || '데이터 없음'}
            </Text>
            {healthData.resBloodPressureSystolic ? (
              <Text style={styles.metricUnit}> mmHg</Text>
            ) : null}
          </View>
        </View>

        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: diastolic > 80 ? '#FFF6F9' : '#F7F8FB',
              borderColor: diastolic > 80 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>이완기 혈압</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: diastolic > 80 ? '#FF5252' : '#4CAF50',
                },
              ]}
            >
              {healthData.resBloodPressureDiastolic || '데이터 없음'}
            </Text>
            {healthData.resBloodPressureDiastolic ? (
              <Text style={styles.metricUnit}> mmHg</Text>
            ) : null}
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// 당뇨
export const DiabetesCard = ({ healthData }) => {
  const fastingSugar = parseFloat(healthData.resFastingBloodSuger) || 0;
  return (
    <MetricCard title="당뇨">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: fastingSugar >= 100 ? '#FFF6F9' : '#F7F8FB',
              borderColor: fastingSugar >= 100 ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>공복혈당</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: fastingSugar >= 100 ? '#FF5252' : '#4CAF50',
                },
              ]}
            >
              {healthData.resFastingBloodSuger || '데이터 없음'}
            </Text>
            {healthData.resFastingBloodSuger ? (
              <Text style={styles.metricUnit}> mg/dL</Text>
            ) : null}
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// 이상지질혈증
export const DyslipidemiaCard = ({ healthData }) => {
  const totalChol = parseFloat(healthData.resTotalCholesterol) || 0;
  const hdl = parseFloat(healthData.resHDLCholesterol) || 0;
  const ldl = parseFloat(healthData.resLDLCholesterol) || 0;

  const noTestData =
    !healthData.resTotalCholesterol &&
    !healthData.resHDLCholesterol &&
    !healthData.resLDLCholesterol;

  return (
    <MetricCard title="이상지질혈증">
      {noTestData ? (
        <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
      ) : (
        <>
          <View style={styles.diseaseRow}>
            {healthData.resTotalCholesterol ? (
              <View
                style={[
                  styles.diseaseStatusBox,
                  {
                    backgroundColor: totalChol >= 200 ? '#FFF6F9' : '#F7F8FB',
                    borderColor: totalChol >= 200 ? '#FEB9B5' : '#DADADA',
                  },
                ]}
              >
                <Text style={styles.metricLabel}>총콜레스테롤</Text>
                <View style={styles.valueContainer}>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: totalChol >= 200 ? '#FF5252' : '#4CAF50' },
                    ]}
                  >
                    {healthData.resTotalCholesterol}
                  </Text>
                  <Text style={styles.metricUnit}> mg/dL</Text>
                </View>
              </View>
            ) : null}

            {healthData.resHDLCholesterol ? (
              <View
                style={[
                  styles.diseaseStatusBox,
                  {
                    backgroundColor: hdl <= 60 ? '#FFF6F9' : '#F7F8FB',
                    borderColor: hdl <= 60 ? '#FEB9B5' : '#DADADA',
                  },
                ]}
              >
                <Text style={styles.metricLabel}>HDL</Text>
                <View style={styles.valueContainer}>
                  <Text
                    style={[
                      styles.metricValue,
                      {
                        color: hdl <= 60 ? '#FF5252' : '#4CAF50',
                      },
                    ]}
                  >
                    {healthData.resHDLCholesterol}
                  </Text>
                  <Text style={styles.metricUnit}> mg/dL</Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.diseaseRow}>
            {healthData.resLDLCholesterol ? (
              <View
                style={[
                  styles.diseaseStatusBox,
                  {
                    backgroundColor: ldl >= 130 ? '#FFF6F9' : '#F7F8FB',
                    borderColor: ldl >= 130 ? '#FEB9B5' : '#DADADA',
                  },
                ]}
              >
                <Text style={styles.metricLabel}>LDL</Text>
                <View style={styles.valueContainer}>
                  <Text
                    style={[
                      styles.metricValue,
                      {
                        color: ldl >= 130 ? '#FF5252' : '#4CAF50',
                      },
                    ]}
                  >
                    {healthData.resLDLCholesterol}
                  </Text>
                  <Text style={styles.metricUnit}> mg/dL</Text>
                </View>
              </View>
            ) : null}
          </View>
        </>
      )}
    </MetricCard>
  );
};

// 비만도
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
            {
              backgroundColor: '#F7F8FB',
              borderColor: '#DADADA',
            },
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
            {
              backgroundColor: '#F7F8FB',
              borderColor: '#DADADA',
            },
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
          <Text style={styles.metricLabel}>
            체질량지수 ({bmiStatus.text})
          </Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                { color: bmiStatus.color },
              ]}
            >
              {healthData.resBMI || '데이터 없음'}
            </Text>
            {healthData.resBMI && <Text style={styles.metricUnit}> kg/m²</Text>}
          </View>
        </View>

        {/* 허리둘레 */}
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: '#F7F8FB',
              borderColor: '#DADADA',
            },
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

// 빈혈
export const AnemiaCard = ({ healthData, gender }) => {
  const hemoglobin = parseFloat(healthData.resHemoglobin) || 0;
  const isAbnormal =
    gender === 'male' ? hemoglobin <= 13 : hemoglobin <= 12;

  return (
    <MetricCard title="빈혈">
      <View style={styles.diseaseRow}>
        <View
          style={[
            styles.diseaseStatusBox,
            {
              backgroundColor: isAbnormal ? '#FFF6F9' : '#F7F8FB',
              borderColor: isAbnormal ? '#FEB9B5' : '#DADADA',
            },
          ]}
        >
          <Text style={styles.metricLabel}>혈색소</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.metricValue,
                { color: isAbnormal ? '#FF5252' : '#4CAF50' },
              ]}
            >
              {healthData.resHemoglobin || '데이터 없음'}
            </Text>
            {healthData.resHemoglobin && (
              <Text style={styles.metricUnit}> g/dL</Text>
            )}
          </View>
        </View>
      </View>
    </MetricCard>
  );
};

// 간장질환
export const LiverDiseaseCard = ({ healthData, gender }) => {
  const ast = parseFloat(healthData.resAST) || 0;
  const alt = parseFloat(healthData.resALT) || 0;
  const yGPT = parseFloat(healthData.resyGPT) || 0;

  const noTestData = !healthData.resAST && !healthData.resALT && !healthData.resyGPT;
  if (noTestData) {
    return (
      <MetricCard title="간장질환">
        <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
      </MetricCard>
    );
  }

  const isAbnormalAST = ast >= 40;
  const isAbnormalALT = alt >= 35;
  const isAbnormalyGPT =
    gender === 'male' ? yGPT >= 77 : yGPT >= 45;

  return (
    <MetricCard title="간장질환">
      <View style={styles.diseaseRow}>
        {healthData.resAST ? (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor: isAbnormalAST ? '#FFF6F9' : '#F7F8FB',
                borderColor: isAbnormalAST ? '#FEB9B5' : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>AST</Text>
            <View style={styles.valueContainer}>
              <Text
                style={[
                  styles.metricValue,
                  { color: isAbnormalAST ? '#FF5252' : '#4CAF50' },
                ]}
              >
                {healthData.resAST}
              </Text>
              <Text style={styles.metricUnit}> U/L</Text>
            </View>
          </View>
        ) : null}

        {healthData.resALT ? (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor: isAbnormalALT ? '#FFF6F9' : '#F7F8FB',
                borderColor: isAbnormalALT ? '#FEB9B5' : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>ALT</Text>
            <View style={styles.valueContainer}>
              <Text
                style={[
                  styles.metricValue,
                  { color: isAbnormalALT ? '#FF5252' : '#4CAF50' },
                ]}
              >
                {healthData.resALT}
              </Text>
              <Text style={styles.metricUnit}> U/L</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.diseaseRow}>
        {healthData.resyGPT ? (
          <View
            style={[
              styles.diseaseStatusBox,
              {
                backgroundColor: isAbnormalyGPT ? '#FFF6F9' : '#F7F8FB',
                borderColor: isAbnormalyGPT ? '#FEB9B5' : '#DADADA',
              },
            ]}
          >
            <Text style={styles.metricLabel}>γ-GTP</Text>
            <View style={styles.valueContainer}>
              <Text
                style={[
                  styles.metricValue,
                  { color: isAbnormalyGPT ? '#FF5252' : '#4CAF50' },
                ]}
              >
                {healthData.resyGPT}
              </Text>
              <Text style={styles.metricUnit}> U/L</Text>
            </View>
          </View>
        ) : null}
      </View>
    </MetricCard>
  );
};
