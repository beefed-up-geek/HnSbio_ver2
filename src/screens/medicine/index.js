// src/screens/medicine/index.js
import React, { useState, useEffect } from 'react';
import { 
  Dimensions, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Keyboard, 
  Modal, 
  Image, 
  ScrollView, 
  TouchableWithoutFeedback 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

// 기기 화면 비율(필요하다면 사용)
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const MedicineScreen = () => {
  const navigation = useNavigation();

  // 검색과 관련된 상태값
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);

  // 최근 검색어와 관련된 상태값
  const [recentSearches, setRecentSearches] = useState([]);

  // 모달 표시 유무
  const [modalVisible, setModalVisible] = useState(false);

  // 앱 시작 시 최근 검색어 로드
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // 앱 시작 시 기본 검색 실행 (전체 목록 혹은 초기 상태)
  useEffect(() => {
    searchMedicine();
  }, []);

  /**
   * 최근 검색어 로드
   */
  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem('recentSearches');
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  /**
   * 최근 검색어 저장
   */
  const saveRecentSearches = async (newSearches) => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  /**
   * 최근 검색어 목록에 추가
   */
  const addRecentSearch = (text) => {
    const updatedSearches = [text, ...recentSearches.filter(item => item !== text)];
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  /**
   * 최근 검색어에서 개별 삭제
   */
  const handleRecentSearchDelete = (text) => {
    const updatedSearches = recentSearches.filter(item => item !== text);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  /**
   * 자동완성 목록 가져오기
   */
  const fetchAutocompleteSuggestions = async (query) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch('http://98.82.55.237/medicine/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, searchType }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  /**
   * 입력값이 바뀔 때마다 자동완성 요청
   */
  const handleInputChange = (text) => {
    setSearchText(text);
    fetchAutocompleteSuggestions(text);
  };

  /**
   * 검색 텍스트 초기화
   */
  const clearSearchText = () => {
    setSearchText('');
    setSuggestions([]);
  };

  /**
   * 검색 실행
   * @param {string} [query] 검색어 (없으면 searchText 사용)
   */
  const searchMedicine = async (query) => {
    const searchQuery = query || searchText;
    if (!searchQuery.trim()) {
      setMedications([]);
      return;
    }

    addRecentSearch(searchQuery);

    try {
      const response = await fetch('http://98.82.55.237/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          cautionaryIngr: item.cautionaryIngr && item.cautionaryIngr !== '[]'
            ? item.cautionaryIngr.replace(/[\[\]']/g, '').split(', ')
            : [],
          ingredients: item.ingredient && item.ingredient !== '[]'
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

  /**
   * 검색 탭(이름/성분) 변경
   */
  const handleTabChange = (type) => {
    setSearchType(type);
  };

  /**
   * 최근 검색어 클릭 시 실행
   */
  const handleRecentSearch = (text) => {
    setSearchText(text);
    setSuggestions([]);

    // 검색 타입 판단 (임시 로직 - 필요한 경우 개선)
    if (medications.some(item => item.name === text)) {
      setSearchType('name');
    } else if (
      medications.some(item => 
        item.ingredients.includes(text) || item.cautionaryIngr.includes(text)
      )
    ) {
      setSearchType('ingredient');
    } else {
      setSearchType('name');
    }

    Keyboard.dismiss();
    searchMedicine(text);
  };

  /**
   * 검색어 클릭 시 검색량 증가 API 호출
   */
  const incrementSearchCount = async (selectedItem) => {
    try {
      await fetch('http://98.82.55.237/medicine/increment-search-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedItem }),
      });
      console.log(`Search count incremented for: ${selectedItem}`);
    } catch (error) {
      console.error('Error incrementing search count:', error);
    }
  };

  /**
   * 자동완성 항목 클릭 시
   */
  const handleSuggestionClick = async (item) => {
    setSearchText(item);
    setSuggestions([]);
    await incrementSearchCount(item);
    searchMedicine(item);
  };

  /**
   * 모달 열기/닫기
   */
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  /**
   * 검색 결과 아이템 렌더링
   */
  const renderMedication = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() =>
        navigation.navigate('NoTabs', {
          screen: 'medicine_specifics',
          params: {
            name: item.name,
            englishName: item.englishName,
            efficacy: item.efficacy,
            instruction: item.instruction,
            caution: item.caution,
            sotrageInstruction: item.sotrageInstruction,
          },
        })
      }
    >
      <View style={styles.medicationItem}>
        <Text style={styles.companyName}>{item.companyName}</Text>
        <Text style={styles.medicationName}>{item.name}</Text>

        {/* 주의 성분 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.cautionaryContainer}
        >
          {item.cautionaryIngr.map((ingredient, index) => (
            <Text key={`caution-${index}`} style={styles.cautionaryIngredient}>
              {ingredient}
            </Text>
          ))}
        </ScrollView>

        {/* 일반 성분 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.ingredientsContainer}
        >
          {item.ingredients.map((ingredient, index) => (
            <Text key={`ingredient-${index}`} style={styles.ingredient}>
              {ingredient}
            </Text>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setSuggestions([]); }}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* 검색 영역 */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="약 이름을 검색해 주세요."
              placeholderTextColor="#5D5D5D"
              value={searchText}
              onChangeText={handleInputChange}
              onSubmitEditing={() => {
                if (searchText.trim() !== '') {
                  Keyboard.dismiss();
                  searchMedicine();
                  setSuggestions([]);
                }
              }}
              returnKeyType="search"
              blurOnSubmit
            />

            {/* 닫기(입력값 초기화) 버튼 */}
            {searchText !== '' && (
              <TouchableOpacity onPress={clearSearchText}>
                <Image 
                  source={require('../../images/medicine/eraser.png')} 
                  style={styles.closeIcon} 
                />
              </TouchableOpacity>
            )}

            {/* 검색 버튼 */}
            <TouchableOpacity
              onPress={() => {
                if (searchText.trim() !== '') {
                  Keyboard.dismiss();
                  searchMedicine();
                  setSuggestions([]);
                }
              }}
            >
              <Image 
                source={require('../../images/medicine/돋보기.png')} 
                style={styles.searchIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* 자동완성 목록 */}
          {suggestions.length > 0 && (
            <TouchableWithoutFeedback onPress={() => setSuggestions([])}>
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
                      <Text style={styles.suggestionItem}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* 최근 검색어 영역 */}
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
                        source={require('../../images/xButton.png')}
                        style={styles.removeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 검색 탭 (이름/성분) */}
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

            {/* 주의 성분 안내 모달 열기 버튼 */}
            <TouchableOpacity style={styles.helpButton} onPress={toggleModal}>
              <Image 
                source={require('../../images/medicine/helper.png')} 
                style={styles.helpIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* 검색 결과 리스트 */}
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

          {/* 모달: 주의 성분 안내 */}
          <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>주의 성분 안내</Text>
                <View style={styles.modalContent}>
                  <View style={styles.row}>
                    <Image 
                      source={require('../../images/medicine/red_ingr.png')} 
                      style={styles.icon} 
                    />
                    <Text style={styles.warningText}>은 신장에 부담을 줄 수 있는 성분이에요.</Text>
                  </View>
                  <View style={styles.row}>
                    <Image 
                      source={require('../../images/medicine/grey_ingr.png')} 
                      style={styles.icon} 
                    />
                    <Text style={styles.cautionText}>은 신장에 직접적인 큰 부담을 주지는 않는 성분이지만 주의하세요.</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                  <Image
                    source={require('../../images/xButton.png')}
                    style={styles.closeIcon}
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
