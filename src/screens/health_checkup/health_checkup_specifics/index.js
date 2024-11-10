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
    Modal,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const Health_checkup_specifics_screen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [gender, setGender] = useState('');
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

    // PDF Viewer 컴포넌트
    const PDFViewer = ({ base64Data }) => {
        if (!base64Data) return null;

        const source = {
            uri: `data:application/pdf;base64,${base64Data}`,
            cache: true
        };

        return (
            <View style={styles.pdfContainer}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`PDF loaded: ${numberOfPages} pages`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                        Alert.alert('오류', 'PDF를 불러오는 중 오류가 발생했습니다.');
                    }}
                    style={styles.pdf}
                />
            </View>
        );
    };

    // PDF 모달
    const PDFModal = () => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={pdfVisible}
            onRequestClose={() => setPdfVisible(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity 
                        onPress={() => setPdfVisible(false)}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
                <PDFViewer base64Data={healthData.resOriGinalData} />
            </SafeAreaView>
        </Modal>
    );

    // 성별 정보 가져오기
    useEffect(() => {
        const getUserGender = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const { gender } = JSON.parse(userData);
                    setGender(gender);
                }
            } catch (error) {
                console.error('Gender fetch error:', error);
            }
        };
        getUserGender();
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
                    onPress={() => setPdfVisible(true)}
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

                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>기본 정보</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>검진일자</Text>
                        <Text style={styles.value}>{healthData.formattedCheckupDate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>키</Text>
                        <Text style={styles.value}>{healthData.resHeight} cm</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>체중</Text>
                        <Text style={styles.value}>{healthData.resWeight} kg</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>BMI</Text>
                        <Text style={styles.value}>{healthData.resBMI}</Text>
                    </View>
                </View>
            </ScrollView>

            <PDFModal />
        </SafeAreaView>
    );
};

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
        width: (Dimensions.get('window').width - (16 * 2 * width_ratio) - (8 * 3 * width_ratio)) / 4-10,
        height: (Dimensions.get('window').width - (16 * 2 * width_ratio) - (8 * 3 * width_ratio)) / 4-10,
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
    },modalContainer: {
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
};

export default Health_checkup_specifics_screen;
