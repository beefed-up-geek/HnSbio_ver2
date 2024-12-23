// src\screens\medicine\styles.js
import { StyleSheet, Dimensions } from 'react-native';

import theme from '../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        height: 76 * height_ratio, // 아이콘 크기에 맞게 헤더 높이 설정
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E9',
    },
    headerTitle: {
        fontSize: 18 * height_ratio,
        ...theme.fonts.Bold,
        color: '#333',
    },
    flatListContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 24,
        paddingHorizontal: 10,
        marginVertical: 19,
        marginHorizontal: 23,
        paddingVertical: 5,
        height: 48 * height_ratio,
    },
    closeIcon: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
    },
    searchIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 10,
        tintColor: '#8E9098',
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: '#000',
        ...theme.fonts.Regular,
        paddingLeft: 10,
        fontSize: 16,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 67,
        left: 25,
        right: 25,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        zIndex: 1,
        maxHeight: 220,
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: '#7F7F7F',
        ...theme.fonts.Regular,
        fontSize: 16,
    },
    recentSearchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#E9E9E9',
        borderTopColor: '#E9E9E9',
        height: 53 * height_ratio,
        alignItems: 'center',
    },
    recentSearchTitle: {
        fontSize: 14 * height_ratio,
        color: '#5D5D62',
        marginLeft: 23,
        marginRight: 7,
        ...theme.fonts.Medium,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 16,
        paddingHorizontal: 12,
        marginRight: 8,
        height: 28 * height_ratio,
    },
    recentSearchText: {
        color: '#5D5D62',
        fontSize: 12 * height_ratio,
        ...theme.fonts.Medium,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center', // 중앙 정렬
        paddingHorizontal: 23,
    },
    removeIcon: {
        width: 18, // 너비
        height: 18, // 높이
        marginLeft: 6, // 텍스트와의 간격
        tintColor: '#5D5D62',
    },
    tabButton: {
        paddingVertical: 10,
        marginRight: 4,
        alignItems: 'center',
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#F1F1F1',
        width: 92,
    },
    activeTab: {
        backgroundColor: '#E4EDFF',
    },
    tabText: {
        color: '#646464',
        fontSize: 12,
        ...theme.fonts.Medium,
    },
    helpButton: {
        marginLeft: 'auto',
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    button: {
        marginTop: 20 * height_ratio,
        backgroundColor: '#7596FF',
        height: 50,
        width: 150 * width_ratio,
        borderRadius: 8 * width_ratio,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    companyName: {
        paddingTop: 16,
        fontSize: 12,
        color: '#7F7F7F',
        marginBottom: 4,
        ...theme.fonts.Medium,
    },
    medicationItem: {
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: 330 * width_ratio,
        alignSelf: 'center',
    },
    medicationName: {
        fontSize: 16,
        marginBottom: 12,
        ...theme.fonts.SemiBold,
        color: '#505054',
    },
    ingredientsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    cautionaryContainer: {
        maxHeight: 30,
        marginBottom: 6,
    },
    cautionaryIngredient: {
        backgroundColor: '#FFECEC',
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 4,
        color: '#EA4447',
        fontSize: 12,
        ...theme.fonts.Medium,
    },
    ingredientsContainer: {
        maxHeight: 30,
        marginBottom: 16,
    },
    ingredient: {
        backgroundColor: '#F1F1F1',
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 4,
        color: '#646464',
        fontSize: 12,
        ...theme.fonts.Medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%', // 화면 너비의 90%로 설정
        paddingHorizontal: 20,
        paddingVertical: 35,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
    },
    modalContent: {
        width: '100%',
        alignItems: 'flex-start', // 왼쪽 정렬
        flexShrink: 1, // 텍스트가 창을 넘어가지 않도록 설정
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16 * width_ratio,
        ...theme.fonts.Bold,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center', // 제목 가운데 정렬
    },
    icon: {
        width: 58 * width_ratio,
        height: 24 * width_ratio, 
        resizeMode: 'contain', 
        marginRight: 10, 
        marginLeft: 5,
    },
    warningText: {
        fontSize: 13 * width_ratio,
        color: 'black',
        ...theme.fonts.Regular,
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 2
    },
    cautionText: {
        fontSize: 13 * width_ratio,
        color: 'black',
        ...theme.fonts.Regular,
        marginLeft: 10,
        marginTop: 15,
        paddingRight: 40, 
    },
    warningLabel: {
        color: '#EA4447',
    },
    cautionLabel: {
        color: '#646464',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
    closeIcon: {
        width: 20 * width_ratio, // 이미지 크기
        height: 20 * width_ratio, // 이미지 크기
        tintColor: '#5D5D62',
    },
});

export default styles;
