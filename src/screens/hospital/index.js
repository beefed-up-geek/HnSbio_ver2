// src\screens\hospital\index.js
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
  Linking,
  ScrollView
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterModal from './FilterModal';
import styles from './styles';

export default function Hospital_Screen({navigation}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    distance: 100,
    rating: [],
    type: '모든 병원',
    info: [],
  });
  const [hospitalStatus, setHospitalStatus] = useState({
    상급종합병원: false,
    종합병원: false,
    요양병원: false,
    병원: false,
    의원: false,
  });
  const [hospitalData, setHospitalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const ITEMS_PER_PAGE = 30;
  const [totalItems, setTotalItems] = useState(null);
  const searchTimeout = useRef(null);
  const [activeFilters, setActiveFilters] = useState([]);

  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchAddress();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!loading) {
      fetchHospitalData();
    }
  }, [loading, page, filters]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한',
            message: '지도에서 사용자님의 위치를 보여드리기 위해 권한이 필요합니다.',
            buttonNegative: '아니요',
            buttonPositive: '네',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Location permission denied');
          setLoading(false);
          return;
        }
      } else if (Platform.OS === 'ios') {
        const hasPermission = await Geolocation.requestAuthorization('whenInUse');
        if (hasPermission === 'denied' || hasPermission === 'restricted') {
          console.error('Location permission denied on iOS');
          setLoading(false);
          return;
        }
      }
      getCurrentLocation();
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setLoading(false);
      },
      error => {
        console.error(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`,
        {
          headers: {
            Authorization: 'KakaoAK 9ad78febe2e7118089f1c23240bfb973',
          },
        },
      );
      const address = response.data.documents[0]?.address?.address_name;
      const addressParts = address?.split(' ');
      const dongName = (addressParts?.[2] || '') + ' ' + (addressParts?.[3] || address);
      setAddress(dongName);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const fetchHospitalData = async () => {
    try {
      setIsFetchingMore(true);
  
      const response = await axios.post(
        'http://98.82.55.237/hospital',
        {
          hospitalName: searchQuery,
          user_latitude: latitude,
          user_longitude: longitude,
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE,
          filters: {
            distance: filters.distance,
            rating: filters.rating,
            type: filters.type,
            info: filters.info,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('[FETCH]', { page, offset: (page - 1) * ITEMS_PER_PAGE, filters });
      const filteredData = response.data.results;
  
      // AsyncStorage에서 "즐겨찾기된 병원 ID 목록" 가져오기
      const jsonValue = await AsyncStorage.getItem('favoriteHospitals');
      const favoriteHospitals = jsonValue != null ? JSON.parse(jsonValue) : [];
  
      // 병원 목록에 "고정 ID"와 "isFavorite" 및 "정렬용 originalIndex" 추가
      const hospitalDataWithFavorites = filteredData.map((hospital, index) => {
        // (1) 병원 고유 ID 생성
        const stableId = generateUniqueId(hospital);
        
        // (2) "이번 페이지"에서 몇 번째인지 (정렬용 임시 값)
        const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
  
        // (3) 즐겨찾기 여부
        const isFavorite = favoriteHospitals.includes(stableId);
  
        return {
          ...hospital,
          id: stableId,           // 고유 ID
          isFavorite,
          originalIndex: globalIndex, 
        };
      });
  
      setTotalItems(response.data.total);
  
      // 페이지가 1이면 새로 세팅, 아니면 기존 데이터 뒤에 이어붙임
      setHospitalData(prevData => {
        const merged = page === 1
          ? hospitalDataWithFavorites
          : [...prevData, ...hospitalDataWithFavorites];
      
        // stableId(=hospital.id) 기준 중복 제거
        const deduplicated = merged.filter(
          (item, idx, self) => self.findIndex(el => el.id === item.id) === idx
        );
      
        return deduplicated;
      });
      
  
      setIsFetchingMore(false);
  
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setIsFetchingMore(false);
    }
  };
  

  const handleSearchQueryChange = text => {
    setSearchQuery(text);
    setPage(1);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchHospitalData();
    }, 500);
  };

  const applyFilters = () => {
    setPage(1); // 페이지를 초기화합니다.
    setHospitalData([]); // 기존 병원 데이터를 초기화합니다.
    fetchHospitalData(); // 새로운 데이터를 불러옵니다.
    closeFilter(); // 필터 모달을 닫습니다.
  };
  

  function generateUniqueId(hospital) {
    // "병원명-전화번호" 형태로 ID를 만든다.
    return `${hospital['요양기관명']}-${hospital['전화번호']}`;
  }
  

  const toggleHospitalStatus = hospital => {
    setHospitalStatus(prevStatus => ({
      ...prevStatus,
      [hospital]: !prevStatus[hospital],
    }));
  };

  const handleFavoritePress = async (hospital) => {
    try {
      // 토글할 병원의 id
      const hospitalId = hospital.id;
  
      // 로컬 스토리지에서 즐겨찾기 목록 불러오기
      const jsonValue = await AsyncStorage.getItem('favoriteHospitals');
      let favoriteHospitals = jsonValue != null ? JSON.parse(jsonValue) : [];
  
      let isCurrentlyFavorite = favoriteHospitals.includes(hospitalId);
      if (isCurrentlyFavorite) {
        // 이미 즐겨찾기면 제거
        favoriteHospitals = favoriteHospitals.filter(id => id !== hospitalId);
      } else {
        // 즐겨찾기가 아니면 추가
        favoriteHospitals.push(hospitalId);
      }
  
      // 업데이트된 배열을 저장
      await AsyncStorage.setItem('favoriteHospitals', JSON.stringify(favoriteHospitals));
  
      // 프론트 state도 업데이트
      const updatedHospitalData = hospitalData.map(h => {
        if (h.id === hospitalId) {
          return { ...h, isFavorite: !isCurrentlyFavorite };
        }
        return h;
      });
  
      // 정렬 후 setState
      const sorted = sortHospitals(updatedHospitalData);
      setHospitalData(sorted);
  
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  
  const saveFavoriteStatus = async (hospitalId, isFavorite) => {
    try {
      // AsyncStorage에서 즐겨찾기 데이터 가져오기
      const jsonValue = await AsyncStorage.getItem('favoriteHospitals');
      let favoriteHospitals = jsonValue != null ? JSON.parse(jsonValue) : [];
  
      if (isFavorite) {
        if (!favoriteHospitals.includes(hospitalId)) {
          favoriteHospitals.push(hospitalId);
        }
      } else {
        favoriteHospitals = favoriteHospitals.filter(id => id !== hospitalId);
      }
  
      // 업데이트된 즐겨찾기 데이터 저장
      await AsyncStorage.setItem('favoriteHospitals', JSON.stringify(favoriteHospitals));
    } catch (error) {
      console.error('Error saving favorite status:', error);
    }
  };
  
  const sortHospitals = hospitals => {
    return hospitals.sort((a, b) => {
      // isFavorite=true가 먼저
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      // 둘 다 즐겨찾기거나 둘 다 일반이면, originalIndex 오름차순
      return a.originalIndex - b.originalIndex;
    });
  };
  
  

  const handleLoadMore = () => {
    if (!isFetchingMore && (totalItems === null || hospitalData.length < totalItems)) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  // 필터 적용 시 활성화된 필터 업데이트
  const updateActiveFilters = (filters) => {
    const newActiveFilters = [];
    
    // 거리 필터
    if (filters.distance !== 100) {
      newActiveFilters.push(`${filters.distance}km 이내`);
    }
    
    // 병원 종류 필터
    if (filters.type !== '모든 병원') {
      newActiveFilters.push(filters.type);
    }
    
    // 병원 정보 필터
    if (filters.info && filters.info.length > 0) {
      newActiveFilters.push(...filters.info);
    }
    
    // 등급 필터
    if (filters.rating && filters.rating.length > 0) {
      newActiveFilters.push(...filters.rating);
    }
    
    setActiveFilters(newActiveFilters);
  };

  // FilterModal onApply 수정
  const handleFilterApply = (newFilters) => {
  setFilters(newFilters); // 새로운 필터를 저장합니다.
  setPage(1); // 페이지를 초기화합니다.
  setHospitalData([]); // 기존 병원 데이터를 초기화합니다.
  updateActiveFilters(newFilters); // 활성화된 필터 목록 업데이트
};

const filterLabels = {
  '1': '1등급',
  '2': '2등급',
  '3': '3등급',
  '4': '4등급',
  '5': '5등급',
  '5km': '5km 이내',
  '10km': '10km 이내',
  '20km': '20km 이내',
  '50km': '50km 이내',
  '100km': '100km 이내',
  '전국': '전국',
  // 필요한 다른 필터들도 여기에 추가할 수 있습니다.
};

return (
  <View style={styles.container}>
    {/* 항상 표시되는 검색 섹션 */}
    <View style={styles.searchSection}>
      <View style={styles.searchInputContainer}>
        <Image
          source={require('../../images/hospital/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="병원 이름을 검색하세요"
          placeholderTextColor="#8E9098"
          onChangeText={handleSearchQueryChange}
        />
      </View>
    </View>

    {/* 항상 표시되는 필터 섹션 */}
    <View style={styles.filtersection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
      >
        <View style={styles.filterChipsContainer}>
          <View style={styles.filterChip}>
            <Icon name="gps-fixed" size={20} color="#5D5D62" />
            <Text style={styles.filterChipText}>{address}</Text>
          </View>
          {activeFilters.map((filter, index) => (
            <View key={index} style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                {filterLabels[filter] || filter}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={openFilter} style={styles.filterButton}>
        <Image
          source={require('./assets/filter_icon.png')}
          style={styles.filterIcon}
        />
      </TouchableOpacity>
    </View>
    <Image
        source={require('./assets/background.png')} // 배경 이미지 경로
        style={styles.backgroundImage}
      />
    {/* 로딩 상태에 따라 병원 목록 렌더링 */}
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
      <FlatList
        data={hospitalData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <HospitalCard
            hospital={item}
            isFavorite={item.isFavorite}
            handleFavoritePress={handleFavoritePress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.blankBox}>
            <Text style={styles.noHospitalText}>병원을 검색하세요!</Text>
          </View>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    )}

    {/* 필터 모달 */}
    <FilterModal
      visible={isFilterVisible}
      onClose={closeFilter}
      filters={filters}
      setFilters={setFilters}
      onApply={handleFilterApply}
    />
  </View>
);
}

function HospitalCard({hospital, isFavorite, handleFavoritePress}) {
  const getGradeColor = rating => {
    switch (rating) {
      case 1:
        return 'rgba(240, 245, 255, 1)';
      case 2:
        return 'rgba(208, 188, 255, 0.16)';
      case 3:
        return 'rgba(208, 188, 255, 0.16)';
      case 4:
        return 'rgba(208, 188, 255, 0.16)';
      case 5:
        return 'rgba(208, 188, 255, 0.16)';
      default:
        return '#fafafa';
    }
  };

  const getGradeTextColor = rating => {
    switch (rating) {
      case 1:
        return 'rgba(47, 84, 235, 1)';
      case 2:
        return 'rgba(103, 80, 164, 1)';
      case 3:
        return 'rgba(103, 80, 164, 1)';
      case 4:
        return 'rgba(103, 80, 164, 1)';
      case 5:
        return 'rgba(103, 80, 164, 1)';
      default:
        return '#fafafa';
    }
  };

  const getGradeBorderColor = rating => {
    switch (rating) {
      case 1:
        return 'rgba(173, 198, 255, 1)';
      case 2:
        return 'rgba(103, 80, 164, 0.22)';
      case 3:
        return 'rgba(103, 80, 164, 0.22)';
      case 4:
        return 'rgba(103, 80, 164, 0.22)';
      case 5:
        return 'rgba(103, 80, 164, 0.22)';
      default:
        return '#fafafa';
    }
  };

  const handlePhonePress = async () => {
    try {
      const cleanPhoneNumber = hospital['전화번호'].replace(/[^0-9]/g, '');
      const url = `tel:${cleanPhoneNumber}`;

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.error('전화를 걸 수 없습니다');
      }
    } catch (error) {
      console.error('전화 연결 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.grade,
            {backgroundColor: getGradeColor(hospital.rating)},
            {color: getGradeTextColor(hospital.rating)},
            {borderColor: getGradeBorderColor(hospital.rating)},
          ]}>
          {hospital.rating ? `${hospital.rating}등급` : '등급 없음'}
        </Text>
        
        <TouchableOpacity
          onPress={() => handleFavoritePress(hospital)}
          style={styles.favoriteButton}>
          <Image
            source={
              isFavorite
                ? require('../../images/hospital/filledStar.png')
                : require('../../images/hospital/emptyStar.png')
            }
            style={styles.starIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.hospitalInfoContainer}>
        <Text style={styles.hospitalName}>{hospital['요양기관명']}</Text>
        <Text style={styles.distanceText}>
          {hospital.distance ? `${hospital.distance.toFixed(1)}km` : '거리 정보 없음'}
        </Text>
      </View>
      <View style={styles.hospitalAddressContainer}>
        <Image
          source={require('./assets/location.png')}
          style={styles.locationImage}
        />
        <Text style={styles.hospitalAddress}>{hospital['주소']}</Text>
      </View>
      <TouchableOpacity onPress={handlePhonePress} style={styles.phonecontainer}>
        <Icon name="phone" size={20} color="#5D5D62"/>
          <Text style={styles.phone}>
            {hospital['전화번호']} 전화걸기
          </Text>
      </TouchableOpacity>
    </View>
  );
}
