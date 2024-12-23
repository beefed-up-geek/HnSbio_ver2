import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20 * width_ratio,
        paddingBottom: 20 * height_ratio,
    },
    headerContainer: {
        height: 76 * height_ratio,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
    },
    backButton: {
        position: 'absolute',
        left: 16 * width_ratio,
        top: '50%',
        transform: [{ translateY: -12 }], // 아이콘 수직 중앙 정렬
    },
    backIcon: {
        width: 24 * width_ratio,
        height: 24 * width_ratio,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 18 * height_ratio,
        ...theme.fonts.Bold,
        color: '#333',
    },
    gradientHeader: {  // 기존 headerContainer 대신 새로 추가된 그라데이션 헤더 스타일
        height: 153 * height_ratio,
        borderRadius: 12,
        paddingHorizontal: 22,
        marginVertical: 22,
        justifyContent: 'center', // 수직 중앙 정렬
    },
    koreanName: {
        fontSize: 24 * height_ratio,
        color: '#FFFFFF',
        ...theme.fonts.SemiBold,
    },
    englishName: {
        fontSize: 18 * height_ratio,
        color: '#FFFFFF',
        marginTop: 10,
        ...theme.fonts.Regular,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 22,
        justifyContent: 'center',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#7596FF',
        width: 78 * width_ratio,
        height: 34 * height_ratio,
        alignItems: 'center',
        ...theme.fonts.Medium,
        marginHorizontal: 6,  // 버튼 간격을 일정하게 설정
    },
    activeTabButton: {
        backgroundColor: '#7596FF',
    },
    tabText: {
        color: '#7596FF',
        fontSize: 13 * height_ratio,
        ...theme.fonts.Medium,
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    infoContainer: {
        backgroundColor: '#F1F1F1',
        paddingVertical: 35,
        paddingHorizontal: 24,
        borderColor: '#fff',
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 20,
        ...theme.fonts.SemiBold,
        color: 'black',
    },
    sectionContent: {
        fontSize: 13,
        color: 'black',
        lineHeight: 18,
        ...theme.fonts.Medium,
    },
    sectionFooter: {
        marginTop: 20,
        padding: 12,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        ...theme.fonts.Medium,
    },
});

export default styles;
