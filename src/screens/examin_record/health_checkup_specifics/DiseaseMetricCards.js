// src\screens\health_checkup\health_checkup_specifics\DiseaseMetricCards.js
import React from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Dimensions, 
    TouchableOpacity, 
    Image, 
    SafeAreaView, 
    StatusBar, 
    Alert, 
    Modal, 
} from 'react-native';
import theme from '../../../theme'; 
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

export const KidneyDiseaseCard = ({ MetricCard, MetricRow, healthData }) => (
    <MetricCard title="신장질환">
        <View style={styles.urinaryProteinContainer}>
            <Text style={styles.metricLabel}>요단백</Text>
            <Text style={[
                styles.metricValue,
                { color: healthData.resUrinaryProtein === "양성" ? '#FF5252' : '#4CAF50' }
            ]}>
                {healthData.resUrinaryProtein}
            </Text>
        </View>
    </MetricCard>
);

export const ChronicKidneyDiseaseCard = ({ MetricCard, MetricRow, healthData }) => (
    <MetricCard title="만성신장질환">
        <MetricRow 
            label="혈청크레아틴" 
            value={healthData.resSerumCreatinine} 
            unit="mg/dL"
            isAbnormal={parseFloat(healthData.resSerumCreatinine) > 1.6}
            normalRange="0.5~1.6"
        />
        <MetricRow 
            label="GFR" 
            value={healthData.resGFR} 
            unit="mL/min"
            isAbnormal={parseFloat(healthData.resGFR) > 83}
            normalRange="60~83"
        />
    </MetricCard>
);

export const HypertensionCard = ({ MetricCard, MetricRow, healthData }) => (
    <MetricCard title="고혈압">
        <MetricRow 
            label="수축기 혈압" 
            value={healthData.resBloodPressureSystolic} 
            unit="mmHg"
            isAbnormal={parseFloat(healthData.resBloodPressureSystolic) > 120}
            normalRange="90~120"
        />
        <MetricRow 
            label="이완기 혈압" 
            value={healthData.resBloodPressureDiastolic} 
            unit="mmHg"
            isAbnormal={parseFloat(healthData.resBloodPressureDiastolic) > 80}
            normalRange="60~80"
        />
    </MetricCard>
);

export const DiabetesCard = ({ MetricCard, MetricRow, healthData }) => (
    <MetricCard title="당뇨">
        <MetricRow 
            label="공복혈당" 
            value={healthData.resFastingBloodSuger} 
            unit="mg/dL"
            isAbnormal={parseFloat(healthData.resFastingBloodSuger) >= 100}
            normalRange="70~99"
        />
    </MetricCard>
);

export const DyslipidemiaCard = ({ MetricCard, MetricRow, healthData }) => {
    // 모든 값이 0이거나 없는지 확인
    const noTestData = !healthData.resTotalCholesterol && 
                      !healthData.resHDLCholesterol && 
                      !healthData.resLDLCholesterol;

    return (
        <MetricCard title="이상지질혈증">
            {noTestData ? (
                <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
            ) : (
                <>
                    {healthData.resTotalCholesterol ? (
                        <MetricRow 
                            label="총콜레스테롤" 
                            value={healthData.resTotalCholesterol} 
                            unit="mg/dL"
                            isAbnormal={parseFloat(healthData.resTotalCholesterol) >= 200}
                            normalRange="0~199"
                        />
                    ) : null}
                    {healthData.resHDLCholesterol ? (
                        <MetricRow 
                            label="HDL" 
                            value={healthData.resHDLCholesterol} 
                            unit="mg/dL"
                            isAbnormal={parseFloat(healthData.resHDLCholesterol) <= 60}
                            normalRange="60~"
                        />
                    ) : null}
                    {healthData.resLDLCholesterol ? (
                        <MetricRow 
                            label="LDL" 
                            value={healthData.resLDLCholesterol} 
                            unit="mg/dL"
                            isAbnormal={parseFloat(healthData.resLDLCholesterol) >= 130}
                            normalRange="0~129"
                        />
                    ) : null}
                </>
            )}
        </MetricCard>
    );
};

export const ObesityCard = ({ MetricCard, MetricRow, healthData }) => {
    const getBmiStatus = (bmi) => {
        const bmiValue = parseFloat(bmi);
        if (bmiValue <= 18.5) return { text: '저체중', color: '#FFA726' };
        if (bmiValue < 23) return { text: '정상', color: '#4CAF50' };
        if (bmiValue < 30) return { text: '과체중', color: '#FF7043' };
        return { text: '비만', color: '#FF5252' };
    };

    const bmiStatus = getBmiStatus(healthData.resBMI);

    return (
        <MetricCard title="비만도">
            <MetricRow 
                label="신장" 
                value={healthData.resHeight} 
                unit="cm"
            />
            <MetricRow 
                label="체중" 
                value={healthData.resWeight} 
                unit="kg"
            />
            <MetricRow 
                label={`체질량지수 (${bmiStatus.text})`}
                value={healthData.resBMI}
                isAbnormal={parseFloat(healthData.resBMI) < 18.5 || parseFloat(healthData.resBMI) >= 23}
                normalRange="18.5~22.9"
                customColor={bmiStatus.color}
            />
            <MetricRow 
                label="허리둘레" 
                value={healthData.resWaist} 
                unit="cm"
                normalRange="남성: ~90, 여성: ~85"
            />
        </MetricCard>
    );
};

export const AnemiaCard = ({ MetricCard, MetricRow, healthData, gender }) => (
    <MetricCard title="빈혈">
        <MetricRow 
            label="혈색소" 
            value={healthData.resHemoglobin} 
            unit="g/dL"
            isAbnormal={gender === 'male' ? 
                parseFloat(healthData.resHemoglobin) <= 13 : 
                parseFloat(healthData.resHemoglobin) <= 12}
            normalRange={gender === 'male' ? "13~17" : "12~16"}
        />
    </MetricCard>
);

export const LiverDiseaseCard = ({ MetricCard, MetricRow, healthData, gender }) => {
    // 모든 값이 0이거나 없는지 확인
    const noTestData = !healthData.resAST && 
                      !healthData.resALT && 
                      !healthData.resyGPT;

    return (
        <MetricCard title="간장질환">
            {noTestData ? (
                <Text style={styles.noTestText}>검사를 실시하지 않았습니다</Text>
            ) : (
                <>
                    {healthData.resAST ? (
                        <MetricRow 
                            label="AST" 
                            value={healthData.resAST} 
                            unit="U/L"
                            isAbnormal={parseFloat(healthData.resAST) >= 40}
                            normalRange="0~39"
                        />
                    ) : null}
                    {healthData.resALT ? (
                        <MetricRow 
                            label="ALT" 
                            value={healthData.resALT} 
                            unit="U/L"
                            isAbnormal={parseFloat(healthData.resALT) >= 35}
                            normalRange="0~34"
                        />
                    ) : null}
                    {healthData.resyGPT ? (
                        <MetricRow 
                            label="γ-GTP" 
                            value={healthData.resyGPT} 
                            unit="U/L"
                            isAbnormal={gender === 'male' ? 
                                parseFloat(healthData.resyGPT) >= 77 : 
                                parseFloat(healthData.resyGPT) >= 45}
                            normalRange={gender === 'male' ? "11~76" : "8~44"}
                        />
                    ) : null}
                </>
            )}
        </MetricCard>
    );
};

// MetricRow.js
const MetricRow = ({ label, value, unit = "", normalRange = "", isAbnormal = false, customColor }) => (
    <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <View style={styles.metricValueContainer}>
            <View style={styles.progressBarContainer}>
                <View 
                    style={[
                        styles.progressBar,
                        { backgroundColor: customColor || (isAbnormal ? '#FF5252' : '#4CAF50') },
                        { width: `${Math.min((parseFloat(value)/200) * 100, 100)}%` }
                    ]}
                />
            </View>
            <Text style={[
                styles.metricValue,
                { color: customColor || (isAbnormal ? '#FF5252' : '#333333') }
            ]}>
                {value}{unit}
            </Text>
        </View>
        {normalRange && (
            <Text style={styles.normalRange}>정상범위: {normalRange}</Text>
        )}
    </View>
);

// MetricCard.js
const MetricCard = ({ title, children }) => (
    <View style={styles.metricCard}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
    </View>
);

// styles.js
const styles = {
    metricRow: {
        marginBottom: 12 * height_ratio,
    },
    metricLabel: {
        ...theme.fonts.Medium,
        fontSize: 14 * width_ratio,
        color: '#666666',
        marginBottom: 8 * height_ratio,
    },
    metricValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarContainer: {
        flex: 1,
        height: 8 * height_ratio,
        backgroundColor: '#F5F5F5',
        borderRadius: 4 * width_ratio,
        marginRight: 12 * width_ratio,
    },
    progressBar: {
        height: '100%',
        borderRadius: 4 * width_ratio,
    },
    metricValue: {
        ...theme.fonts.Medium,
        fontSize: 14 * width_ratio,
        minWidth: 60 * width_ratio,
        textAlign: 'right',
    },
    normalRange: {
        ...theme.fonts.Regular,
        fontSize: 12 * width_ratio,
        color: '#999999',
        marginTop: 4 * height_ratio,
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12 * width_ratio,
        padding: 16 * width_ratio,
        marginBottom: 16 * height_ratio,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        ...theme.fonts.Bold,
        fontSize: 16 * width_ratio,
        color: '#000000',
        marginBottom: 16 * height_ratio,
    },
    metricRow: {
        marginBottom: 20 * height_ratio,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4 * height_ratio,
    },
    metricLabel: {
        ...theme.fonts.Medium,
        fontSize: 14 * width_ratio,
        color: '#666666',
    },
    metricValue: {
        ...theme.fonts.Medium,
        fontSize: 14 * width_ratio,
        color: '#333333',
    },
    progressContainer: {
        marginTop: 4 * height_ratio,
    },
    progressBarBackground: {
        position: 'relative',
        height: 8 * height_ratio,
        backgroundColor: '#F5F5F5',
        borderRadius: 4 * width_ratio,
    },
    normalRangeIndicator: {
        position: 'absolute',
        height: '100%',
        width: '60%',  // 정상 범위 표시 영역
        left: '20%',   // 중앙 정렬을 위해
    },
    normalRangeBar: {
        height: '100%',
        backgroundColor: '#E8F5E9',
        borderRadius: 4 * width_ratio,
    },
    progressBar: {
        position: 'absolute',
        height: '100%',
        borderRadius: 4 * width_ratio,
    },
    valueMarker: {
        position: 'absolute',
        width: 2 * width_ratio,
        height: 12 * height_ratio,
        top: -2 * height_ratio,
        transform: [{ translateX: -1 * width_ratio }],
    },
    normalRange: {
        ...theme.fonts.Regular,
        fontSize: 12 * width_ratio,
        color: '#999999',
        marginTop: 4 * height_ratio,
    },
    urinaryProteinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8 * height_ratio,
    },
    noTestText: {
        ...theme.fonts.Regular,
        fontSize: 14 * width_ratio,
        color: '#999999',
        textAlign: 'center',
        paddingVertical: 16 * height_ratio,
    },
};