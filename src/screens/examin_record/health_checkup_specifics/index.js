// src\screens\health_checkup\health_checkup_specifics\index.js
import React, { useState, useEffect } from 'react';
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
    Linking,
    Modal,
    Platform,
    ActivityIndicator  // 추가된 부분
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import {
    KidneyDiseaseCard,
    ChronicKidneyDiseaseCard,
    HypertensionCard,
    DiabetesCard,
    DyslipidemiaCard,
    ObesityCard,
    AnemiaCard,
    LiverDiseaseCard
} from './DiseaseMetricCards';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_specifics_screen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [gender, setGender] = useState('');
    const [providerId, setProviderId] = useState('');  // 추가된 부분
    const [pdfVisible, setPdfVisible] = useState(false);
    
    // 상태 변수들
    const [healthData, setHealthData] = useState({
        resOriGinalData: '',
        resAST: '',
        resALT: '',
        resBMI: '',
        resBloodPressure: '',
        resBloodPressureSystolic: '',
        resBloodPressureDiastolic: '',
        resCheckupDate: '',
        resCheckupYear: '',
        formattedCheckupDate: '',
        resFastingBloodSuger: '',
        resGFR: '',
        resHDLCholesterol: '',
        resHeight: '',
        resHemoglobin: '',
        resLDLCholesterol: '',
        resSerumCreatinine: '',
        resTotalCholesterol: '',
        resUrinaryProtein: '',
        resWaist: '',
        resWeight: '',
        resyGPT: '',
    });

    // 질환 상태
    const [diseases, setDiseases] = useState({
        kidneyDisease: false,
        chronicKidneyDisease: false,
        hypertension: false,
        diabetes: false,
        dyslipidemia: false,
        obesity: false,
        overweight: false,
        anemia: false,
        liverDisease: false
    });
    
    const openPDFInBrowser = async () => {
        console.log(healthData.resOriGinalData);
        if (!healthData.resOriGinalData) {
            Alert.alert('오류', 'PDF URL을 가져올 수 없습니다.');
            return;
        }
        try {
            const supported = await Linking.canOpenURL(healthData.resOriGinalData);
            if (supported) {
                
                await Linking.openURL(healthData.resOriGinalData);
            } else {
                Alert.alert('오류', '이 링크를 열 수 없습니다.');
            }
        } catch (error) {
            Alert.alert('오류', 'PDF를 여는 중 문제가 발생했습니다.');
        }
    };
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const { gender, providerId } = JSON.parse(userData);
                    setGender(gender);
                    setProviderId(providerId);
                }
            } catch (error) {
                console.error('User data fetch error:', error);
            }
        };
        getUserData();
    }, []);

    // 날짜 포맷팅 함수
    const formatDate = (year, date) => {
        if (!year || !date) return '';
        const month = date.substring(0, 2);
        const day = date.substring(2);
        return `${year}/${month}/${day}`;
    };

    // 질환 상태 체크
    const checkDiseases = () => {
        const {
            resUrinaryProtein,
            resSerumCreatinine,
            resGFR,
            resBloodPressureSystolic,
            resBloodPressureDiastolic,
            resFastingBloodSuger,
            resTotalCholesterol,
            resHDLCholesterol,
            resLDLCholesterol,
            resBMI,
            resHemoglobin,
            resAST,
            resALT,
            resyGPT
        } = healthData;

        setDiseases({
            kidneyDisease: resUrinaryProtein === "양성",
            chronicKidneyDisease: parseFloat(resSerumCreatinine) > 1.6 || parseFloat(resGFR) > 83,
            hypertension: parseFloat(resBloodPressureSystolic) > 120 || parseFloat(resBloodPressureDiastolic) > 80,
            diabetes: parseFloat(resFastingBloodSuger) >= 100,
            dyslipidemia: parseFloat(resTotalCholesterol) >= 200 || 
                         parseFloat(resHDLCholesterol) <= 60 || 
                         parseFloat(resLDLCholesterol) >= 130,
            obesity: parseFloat(resBMI) >= 30,
            overweight: parseFloat(resBMI) >= 23 && parseFloat(resBMI) < 30,
            anemia: gender === 'male' ? parseFloat(resHemoglobin) <= 13 : parseFloat(resHemoglobin) <= 12,
            liverDisease: parseFloat(resAST) >= 40 || 
                         parseFloat(resALT) >= 35 || 
                         (gender === 'male' ? parseFloat(resyGPT) >= 77 : parseFloat(resyGPT) >= 45)
        });
    };

    // 데이터 초기화
    useEffect(() => {
        if (route.params?.healthCheckupResult) {
            const result = route.params.healthCheckupResult;
            
            // 혈압 분리
            let systolic = '', diastolic = '';
            if (result.resBloodPressure) {
                [systolic, diastolic] = result.resBloodPressure.split('/');
            }

            const newData = {
                ...result,
                resBloodPressureSystolic: systolic,
                resBloodPressureDiastolic: diastolic,
                formattedCheckupDate: formatDate(result.resCheckupYear, result.resCheckupDate)
            };

            setHealthData(newData);
        }
    }, [route.params]);

    // 질환 상태 업데이트
    useEffect(() => {
        checkDiseases();
    }, [healthData, gender]);

    

    const DiseaseBox = ({ title, isActive }) => (
        <View style={[styles.diseaseBox, isActive && styles.activeDiseaseBox]}>
            <Text style={[styles.diseaseText, isActive && styles.activeDiseaseText]}>
                {title}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <ScrollView>
                <TouchableOpacity 
                    style={styles.pdfButton} 
                    onPress={openPDFInBrowser}  // 수정된 부분
                >
                    <Image
                        source={require('../../../images/health_screen/pdficon.png')}
                        style={styles.pdfIcon}
                    />
                    <Text style={styles.pdfButtonText}>PDF로 보기</Text>
                </TouchableOpacity>

                
                <View style={styles.summaryContainer}>
    <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>요약</Text>
        <View style={styles.indicators}>
            <View style={styles.indicator}>
                <View style={styles.circleRed} />
                <Text style={styles.indicatorText}>비정상</Text>
            </View>
        </View>
    </View>
    <View style={styles.diseaseGrid}>
        <DiseaseBox title="신장질환" isActive={diseases.kidneyDisease} />
        <DiseaseBox title="만성신장질환" isActive={diseases.chronicKidneyDisease} />
        <DiseaseBox title="고혈압" isActive={diseases.hypertension} />
        <DiseaseBox title="당뇨" isActive={diseases.diabetes} />
        <DiseaseBox title="이상지질혈증" isActive={diseases.dyslipidemia} />
        <DiseaseBox
            title={diseases.obesity ? "비만" : "과체중"}
            isActive={diseases.obesity || diseases.overweight}
        />
        <DiseaseBox title="빈혈" isActive={diseases.anemia} />
        <DiseaseBox title="간장질환" isActive={diseases.liverDisease} />
    </View>
</View>
<View style={[styles.cardsContainer, { marginTop: 16 * height_ratio }]}>
    <KidneyDiseaseCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <ChronicKidneyDiseaseCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <HypertensionCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <DiabetesCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <DyslipidemiaCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <ObesityCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData} 
    />
    <AnemiaCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData}
        gender={gender}
    />
    <LiverDiseaseCard 
        MetricCard={MetricCard} 
        MetricRow={MetricRow} 
        healthData={healthData}
        gender={gender}
    />
</View>
            </ScrollView>

            
        </SafeAreaView>
    );
};

const MetricRow = ({ label, value, unit = "", normalRange = "", isAbnormal = false, customColor }) => {
        const getProgressWidth = (value) => {
            // 정상 범위를 기준으로 게이지 너비 계산
            let maxValue = 200;  // 기본 최대값
            if (normalRange && normalRange.includes('~')) {
                const [min, max] = normalRange.split('~').map(num => parseFloat(num));
                maxValue = max * 1.5;  // 정상 범위 최대값의 1.5배를 전체 너비로 설정
            }
            return `${Math.min((parseFloat(value)/maxValue) * 100, 100)}%`;
        };
    
        return (
            <View style={styles.metricRow}>
                <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>{label}</Text>
                    <Text style={[
                        styles.metricValue,
                        { color: customColor || (isAbnormal ? '#FF5252' : '#333333') }
                    ]}>
                        {value}{unit}
                    </Text>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        {/* 정상 범위 표시 */}
                        {normalRange && (
                            <View style={[styles.normalRangeIndicator]}>
                                <View style={styles.normalRangeBar} />
                            </View>
                        )}
                        {/* 현재 값 표시 */}
                        <View 
                            style={[
                                styles.progressBar,
                                { 
                                    width: getProgressWidth(value),
                                    backgroundColor: customColor || (isAbnormal ? '#FF5252' : '#4CAF50')
                                }
                            ]}
                        />
                        {/* 현재 값 마커 */}
                        <View style={[
                            styles.valueMarker,
                            { 
                                left: getProgressWidth(value),
                                backgroundColor: customColor || (isAbnormal ? '#FF5252' : '#4CAF50')
                            }
                        ]} />
                    </View>
                </View>
                {normalRange && (
                    <Text style={styles.normalRange}>정상범위: {normalRange}</Text>
                )}
            </View>
        );
    };

    const MetricCard = ({ title, children }) => (
        <View style={styles.metricCard}>
            <Text style={styles.cardTitle}>{title}</Text>
            {children}
        </View>
    );
    


const styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    pdfButton: {
        backgroundColor: "#E8EFFD",
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingVertical: 8 * height_ratio,
        paddingHorizontal: 16 * width_ratio,
        margin: 16 * width_ratio,
        borderRadius: 9999, // Makes the button oval-shaped
    },
    pdfIcon: {
        width: 24 * width_ratio,
        height: 24 * height_ratio,
        marginRight: 5 * width_ratio,
    },
    pdfButtonText: {
        ...theme.fonts.Medium,
        color: "#4a4a4f",
        fontSize: 14 * width_ratio,
    },
    summaryContainer: {
        marginHorizontal: 16 * width_ratio,
        backgroundColor: '#FFFFFF',
        borderRadius: 12 * width_ratio,
        padding: 16 * width_ratio,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12 * height_ratio,
    },
    summaryTitle: {
        ...theme.fonts.Bold,
        fontSize: 16 * width_ratio,
        fontWeight: '600',
        color: '#000000',
    },
    indicators: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8 * width_ratio,
    },
    circleRed: {
        width: 10 * width_ratio,
        height: 10 * width_ratio,
        borderRadius: 5 * width_ratio,
        backgroundColor: '#FFF0F0',
        marginRight: 4 * width_ratio,
    },
    indicatorText: {
        ...theme.fonts.Medium,
        fontSize: 12 * width_ratio,
        color: '#000000',
    },
    diseaseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    diseaseBox: {
        width: (Dimensions.get('window').width - (16 * 2 * width_ratio) - (8 * 3 * width_ratio)) / 4 - 10,
        height: (Dimensions.get('window').width - (16 * 2 * width_ratio) - (8 * 3 * width_ratio)) / 4 - 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 8 * width_ratio,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12 * height_ratio,
        marginRight: 8 * width_ratio,
    },
    activeDiseaseBox: {
        backgroundColor: '#FFF0F0',
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    diseaseText: {
        ...theme.fonts.Medium,
        fontSize: 12 * width_ratio,
        textAlign: 'center',
        color: '#333333',
        lineHeight: 16 * height_ratio,
    },
    activeDiseaseText: {
        ...theme.fonts.Bold,
        color: '#D32F2F',
        fontWeight: '500',
    },
    contentContainer: {
        padding: 16 * width_ratio,
    },
    sectionTitle: {
        fontSize: 16 * width_ratio,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12 * height_ratio,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8 * height_ratio,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    label: {
        fontSize: 14 * width_ratio,
        color: '#666666',
        flex: 1,
    },
    value: {
        fontSize: 14 * width_ratio,
        color: '#333333',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        height: 50 * height_ratio,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16 * width_ratio,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    closeButton: {
        padding: 8 * width_ratio,
    },
    closeButtonText: {
        ...theme.fonts.Medium,
        color: '#4a4a4f',
        fontSize: 16 * width_ratio,
    },
    pdfContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    loadingContainer: {  // 추가된 부분
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricRow: {
        marginBottom: 20 * height_ratio,
    },
    cardTitle: {
        ...theme.fonts.Bold,
        fontSize: 16 * width_ratio,
        color: '#000000',
        marginBottom: 16 * height_ratio,
        textAlign: 'left',  // 왼쪽 정렬 명시적 지정
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
    cardsContainer: {
        padding: 16 * width_ratio,  // 좌우 패딩
        gap: 16 * height_ratio,     // 카드들 사이의 간격
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12 * width_ratio,
        padding: 16 * width_ratio,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
};

export default Health_checkup_specifics_screen;
