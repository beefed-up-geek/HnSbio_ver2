import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text } from 'react-native';
import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용


const Hospital_screen = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
    if (filters.grade && filters.grade.length > 0) {
      newActiveFilters.push(...filters.grade);
    }
    
    setActiveFilters(newActiveFilters);
  };

  // FilterModal onApply 수정
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    updateActiveFilters(newFilters);
    fetchHospitalData();
  };

  return (
    <View style={styles.container}>
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
                <Text style={styles.filterChipText}>{filter}</Text>
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
      // 전화번호에서 특수문자 제거
      const cleanPhoneNumber = hospital['전화번호'].replace(/[^0-9]/g, '');
      const url = `tel:${cleanPhoneNumber}`;
      
      // 전화 앱을 열 수 있는지 확인
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.error('전화를 걸 수 없습니다');
        // 여기에 사용자에게 알림을 보여줄 수 있습니다
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
                ? require('../../images/hospital/filledStar.png') // 즐겨찾기 상태일 때 꽉 찬 별 이미지
                : require('../../images/hospital/emptyStar.png') // 즐겨찾기 상태가 아닐 때 빈 별 이미지
            }
            style={styles.starIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.hospitalName}>{hospital['요양기관명']}</Text>
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
