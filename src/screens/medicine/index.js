// src\screens\medicine\index.js

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Keyboard, Modal, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js';

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const MedicineScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchType, setSearchType] = useState('name');
    const [medications, setMedications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    const fetchAutocompleteSuggestions = async (query) => {
        if (query.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch('http://98.82.55.237/medicine/autocomplete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, searchType })
            });
            const data = await response.json();
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
        }
    };

    const handleInputChange = (text) => {
        setSearchText(text);
        fetchAutocompleteSuggestions(text);
    };

    const loadRecentSearches = async () => {
        try {
            const savedSearches = await AsyncStorage.getItem('recentSearches');
            if (savedSearches) {
                setRecentSearches(JSON.parse(savedSearches));
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    };

    const saveRecentSearches = async (newSearches) => {
        try {
            await AsyncStorage.setItem('recentSearches', JSON.stringify(newSearches));
        } catch (error) {
            console.error('Error saving recent searches:', error);
        }
    };

    const addRecentSearch = (text) => {
        const updatedSearches = [text, ...recentSearches.filter(item => item !== text)];
        setRecentSearches(updatedSearches);
        saveRecentSearches(updatedSearches);
    };

    const handleRecentSearchDelete = (text) => {
        const updatedSearches = recentSearches.filter(item => item !== text);
        setRecentSearches(updatedSearches);
        saveRecentSearches(updatedSearches);
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const clearSearchText = () => {
        setSearchText(''); // 입력값 초기화
        setSuggestions([]); // 자동완성 목록 초기화
    };

    const searchMedicine = async (query) => {
        const searchQuery = query || searchText;
    
        if (searchQuery.trim() === '') {
            setMedications([]);
            return;
        }
    
        addRecentSearch(searchQuery);
    
        try {
            const response = await fetch('http://98.82.55.237/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ medicine_name: searchQuery }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching data:', errorText);
                Alert.alert('데이터를 가져오는 중 오류가 발생했습니다.');
                return;
            }
    
            const data = await response.json();
            if (data.results) {
                const formattedMedications = data.results.map((item, index) => ({
                    id: String(index),
                    name: item.itemName,
                    englishName: item.ITEM_ENG_NAME,
                    companyName: item.companyName,
                    cautionaryIngr: item.cautionaryIngr && item.cautionaryIngr !== "[]" 
                        ? item.cautionaryIngr.replace(/[\[\]']/g, '').split(', ') 
                        : [],
                    ingredients: item.ingredient && item.ingredient !== "[]" 
                        ? item.ingredient.replace(/[\[\]']/g, '').split(', ') 
                        : [],
                    efficacy: item.efficacy,
                    instruction: item.instruction,
                    caution: item.caution,
                    sotrageInstruction: item.sotrageInstruction,
                }));
                setMedications(formattedMedications);
            } else {
                Alert.alert('검색 결과가 없습니다.');
                setMedications([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        searchMedicine();
    }, []);

    const handleTabChange = (type) => {
        setSearchType(type);
    };

    const renderMedication = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => navigation.navigate('NoTabs', {
                screen: 'medicine_specifics', 
                params : {
                    name: item.name,
                    englishName: item.englishName,
                    efficacy: item.efficacy,
                    instruction: item.instruction,
                    caution: item.caution,
                    sotrageInstruction: item.sotrageInstruction,
                }
            })}
        >
            <View style={styles.medicationItem}>
                <Text style={styles.companyName}>{item.companyName}</Text>
                <Text style={styles.medicationName}>{item.name}</Text>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cautionaryContainer}>
                    {item.cautionaryIngr.map((ingredient, index) => (
                        <Text key={`caution-${index}`} style={styles.cautionaryIngredient}>{ingredient}</Text>
                    ))}
                </ScrollView>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsContainer}>
                    {item.ingredients.map((ingredient, index) => (
                        <Text key={`ingredient-${index}`} style={styles.ingredient}>{ingredient}</Text>
                    ))}
                </ScrollView>
            </View>
        </TouchableOpacity>
    );

    const handleRecentSearch = (text) => {
        setSearchText(text);    // 선택한 최근 검색어로 검색어 설정
        setSuggestions([]);      // 자동완성 목록 지우기

        // 검색 타입 판단
        if (medications.some((item) => item.name === text)) {
            setSearchType('name'); // 이름으로 검색된 경우
        } else if (
            medications.some(
                (item) =>
                    item.ingredients.includes(text) || item.cautionaryIngr.includes(text)
            )
        ) {
            setSearchType('ingredient'); // 성분으로 검색된 경우
        } else {
            setSearchType('name'); // 기본값으로 이름 검색 설정
        }

        Keyboard.dismiss();      // 키보드 숨기기
        searchMedicine(text);    // 검색 실행
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setSuggestions([]); }}>
            <View style={{ flex: 1 }}>
                {/* <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>약 검색</Text>
                </View> */}
    
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="약 이름을 검색해 주세요."
                            placeholderTextColor={'#5D5D5D'}
                            value={searchText}
                            onChangeText={handleInputChange}
                            onSubmitEditing={() => {
                                if (searchText.trim() !== '') {
                                    Keyboard.dismiss();
                                    searchMedicine();
                                    setSuggestions([]); // 검색 완료 시 자동완성 목록 숨기기
                                }
                            }}
                            blurOnSubmit={true}
                            keyboardType="default"
                            returnKeyType="search"
                        />
                        {/* 닫기 버튼 */}
                        {searchText !== '' && (
                            <TouchableOpacity onPress={clearSearchText}>
                                <Image source={require('../../images/medicine/eraser.png')} style={styles.closeIcon} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => {
                            if (searchText.trim() !== '') {
                                Keyboard.dismiss();
                                searchMedicine();
                                setSuggestions([]); // 검색 완료 시 자동완성 목록 숨기기
                            }
                            }}>
                            <Image source={require('../../images/medicine/돋보기.png')} style={styles.searchIcon} />
                        </TouchableOpacity>
                    </View>
    
                    {/* 자동완성 목록 */}
                    {suggestions.length > 0 && (
                        <TouchableWithoutFeedback onPress={() => setSuggestions([])}>
                            <View style={styles.suggestionsContainer}>
                                <FlatList
                                    data={suggestions}
                                    keyExtractor={(item, index) => index.toString()}
                                    // onScroll={() => setSuggestions([])} // 스크롤 시 자동완성 목록 숨기기
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            onPress={() => {
                                                setSearchText(item);  // 선택한 항목으로 검색어 설정
                                                setSuggestions([]);    // 자동완성 목록 지우기
                                                searchMedicine();      // 검색 실행
                                                addRecentSearch(item);
                                            }}
                                        >
                                            <Text style={styles.suggestionItem}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}

    
                    {/* 최근 검색어 컨테이너 */}
                    {recentSearches.length > 0 && (
                        <View style={styles.recentSearchContainer}>
                            <Text style={styles.recentSearchTitle}>최근검색어</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {recentSearches.map((item, index) => (
                                    <View key={index} style={styles.recentSearchItem}>
                                        <TouchableOpacity onPress={() => handleRecentSearch(item)}>
                                            <Text style={styles.recentSearchText}>{item}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleRecentSearchDelete(item)}>
                                            <Image
                                                source={require('../../images/xButton.png')} // 이미지 경로
                                                style={styles.removeIcon} // 스타일 정의
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                    
                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, searchType === 'name' && styles.activeTab]}
                            onPress={() => handleTabChange('name')}
                        >
                            <Text style={styles.tabText}>이름으로 검색</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, searchType === 'ingredient' && styles.activeTab]}
                            onPress={() => handleTabChange('ingredient')}
                        >
                            <Text style={styles.tabText}>성분으로 검색</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.helpButton} onPress={toggleModal}>
                            <Image source={require('../../images/medicine/helper.png')} style={styles.helpIcon} />
                        </TouchableOpacity>
                    </View>
    
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={medications}
                            renderItem={renderMedication}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ 
                                paddingTop: 16,
                                paddingBottom: 285,
                             }}
                            onScroll={() => setSuggestions([])}
                        />
                    </View>
    
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={toggleModal}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>주의 성분 안내</Text>
                                <View style={styles.modalContent}>
                                    <View style={styles.row}>
                                        <Image source={require('../../images/medicine/red_ingr.png')} style={styles.icon} />
                                        <Text style={styles.warningText}>은 신장에 부담을 줄 수 있는 성분이에요.</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Image source={require('../../images/medicine/grey_ingr.png')} style={styles.icon} />
                                        <Text style={styles.cautionText}>은 신장에 직접적인 큰 부담을 주지는 않는 성분이지만 주의하세요.</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                                    <Image
                                        source={require('../../images/xButton.png')} // xButton 이미지 경로
                                        style={styles.closeIcon} // 적절한 스타일 추가
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default MedicineScreen;
