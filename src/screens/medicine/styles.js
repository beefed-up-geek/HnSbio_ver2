// src/screens/medicine/styles.js

import { StyleSheet, Dimensions } from 'react-native';

import theme from '../../theme'; // 개발 규칙: 폰트 적용

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20 * width_ratio,
    },
    flatListContainer: {
        position: 'absolute',
        top: 136,
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 24,
        paddingHorizontal: 10,
        marginBottom: 16
    },
    searchIcon: {
        width: 25,
        height: 25,
        marginHorizontal: 10,
        tintColor: '#8E9098',
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: '#8E9098',
        ...theme.fonts.Regular,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center', // 중앙 정렬
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
        width: 342,
        alignSelf: 'center',
    },
    medicationName: {
        fontSize: 16,
        marginBottom: 12,
        ...theme.fonts.SemiBold,
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
        width: 330 * width_ratio,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
    },
    modalContent: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        ...theme.fonts.Bold,
        marginBottom: 20,
        color: '#333',
    },
    warningText: {
        fontSize: 14,
        color: 'black',
        ...theme.fonts.Regular,
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 2
    },
    cautionText: {
        fontSize: 14,
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
    closeButtonText: {
        fontSize: 18,
        color: '#888',
    },
});

export default styles;
