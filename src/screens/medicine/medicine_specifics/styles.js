// src\screens\medicine\medicine_specifics\styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    headerContainer: {
        height: 153,
        borderRadius: 12,
        paddingHorizontal: 22,
        marginBottom: 22,
        justifyContent: 'center', // 수직 중앙 정렬
    },
    koreanName: {
        fontSize: 24,
        color: '#FFFFFF',
        ...theme.fonts.SemiBold,
    },
    englishName: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 10,
        ...theme.fonts.Regular,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 22,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#7596FF',
        marginRight: 9,
        width: 97,
        alignItems: 'center',
        ...theme.fonts.Medium,
    },
    activeTabButton: {
        backgroundColor: '#7596FF',
    },
    tabText: {
        color: '#7596FF',
        fontSize: 14,
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
    cautionText: {
        fontSize: 14,
        color: '#EA4447',
        marginVertical: 4,
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
