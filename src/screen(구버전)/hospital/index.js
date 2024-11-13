// src\screen(구버전)\hospital\index.js
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles'; // assuming the styles are imported from a separate file

export default function HospitalScreen({navigation}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const [hospitalStatus, setHospitalStatus] = useState({
    상급종합병원: false,
    종합병원: false,
    요양병원: false,
    병원: false,
    의원: false,
  });

  const [openNearby, setOpenNearby] = useState(false);
  const [valueNearby, setValueNearby] = useState('전체');
  const [itemsNearby, setItemsNearby] = useState([
    {label: '전체', value: '전체'},
    {label: '1등급', value: '1'},
    {label: '2등급', value: '2'},
    {label: '3등급', value: '3'},
    {label: '4등급', value: '4'},
    {label: '5등급', value: '5'},
  ]);

  const [openDistance, setOpenDistance] = useState(false);
  const [valueDistance, setValueDistance] = useState('5');
  const [itemsDistance, setItemsDistance] = useState([
    {label: '5km 이내', value: '5'},
    {label: '10km 이내', value: '10'},
    {label: '20km 이내', value: '20'},
  ]);

  const [hospitalData, setHospitalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
      fetchHospitalData(searchQuery);
    }
  }, [searchQuery, hospitalStatus, valueNearby, valueDistance, loading]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한',
            message:
              '지도에서 사용자님의 위치를 보여드리기 위해 권한이 필요합니다.',
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
        const hasPermission = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (hasPermission === 'denied' || hasPermission === 'restricted') {
          console.error('Location permission denied on iOS');
          setLoading(false);
          return;
        }
      }
      // 위치 정보를 가져오는 함수 호출
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
      const address = response.data.documents[0].address.address_name;
      setAddress(address);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const fetchHospitalData = async query => {
    try {
      const response = await axios.post(
        `http://54.79.61.80:3000/hospital`,
        {
          hospitalName: query,
          user_latitude: latitude,
          user_longitude: longitude,
          hospitalStatus: hospitalStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const filteredData = response.data.results.filter(
        hospital => hospital.distance < parseInt(valueDistance),
      );

      // Get favorite hospital IDs from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('favoriteHospitals');
      const favoriteHospitals = jsonValue != null ? JSON.parse(jsonValue) : [];

      // Generate unique IDs and add isFavorite and originalIndex properties
      const hospitalDataWithFavorites = filteredData.map((hospital, index) => {
        const id = generateUniqueId(hospital, index);
        const isFavorite = favoriteHospitals.includes(id);
        return {...hospital, id, isFavorite, originalIndex: index};
      });

      // Sort hospitals
      const sortedHospitalData = sortHospitals(hospitalDataWithFavorites);

      setHospitalData(sortedHospitalData);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  };

  const generateUniqueId = (hospital, index) => {
    // Use hospital name and phone number to generate a unique ID
    return `${hospital['요양기관명']}-${hospital['전화번호']}-${index}`;
  };

  const toggleHospitalStatus = hospital => {
    setHospitalStatus(prevStatus => ({
      ...prevStatus,
      [hospital]: !prevStatus[hospital],
    }));
  };

  const handleFavoritePress = async hospital => {
    // Update the isFavorite status
    const updatedHospitalData = hospitalData.map(h => {
      if (h.id === hospital.id) {
        const newFavoriteStatus = !h.isFavorite;
        // Save the new favorite status to AsyncStorage
        saveFavoriteStatus(h.id, newFavoriteStatus);
        return {...h, isFavorite: newFavoriteStatus};
      } else {
        return h;
      }
    });
    // Re-order the hospitalData array
    const sortedHospitalData = sortHospitals(updatedHospitalData);
    // Update state
    setHospitalData(sortedHospitalData);
  };

  const saveFavoriteStatus = async (hospitalId, isFavorite) => {
    try {
      // Get the existing favorites from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('favoriteHospitals');
      let favoriteHospitals = jsonValue != null ? JSON.parse(jsonValue) : [];
      if (isFavorite) {
        // Add to favorites if not already there
        if (!favoriteHospitals.includes(hospitalId)) {
          favoriteHospitals.push(hospitalId);
        }
      } else {
        // Remove from favorites
        favoriteHospitals = favoriteHospitals.filter(id => id !== hospitalId);
      }
      // Save updated favorites to AsyncStorage
      await AsyncStorage.setItem(
        'favoriteHospitals',
        JSON.stringify(favoriteHospitals),
      );
    } catch (e) {
      console.error('Error saving favorite status', e);
    }
  };

  const sortHospitals = hospitals => {
    return hospitals.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      if (a.isFavorite && b.isFavorite) {
        // Both are favorites, maintain original order
        return a.originalIndex - b.originalIndex;
      } else {
        // Neither is favorite, maintain original order
        return a.originalIndex - b.originalIndex;
      }
    });
  };

  const filteredHospitals = hospitalData.filter(hospital => {
    // Filter by grade
    if (valueNearby === '전체') return true;
    return hospital.rating === parseInt(valueNearby);
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
      </View>
      <View style={styles.locationContainer}>
        <Icon name="location-on" size={20} color="#5D5D62" />
        <Text style={styles.locationText}>{address}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.pickerWrapper}>
          <View style={styles.distancePicker}>
            <DropDownPicker
              open={openDistance}
              value={valueDistance}
              items={itemsDistance}
              setOpen={setOpenDistance}
              setValue={setValueDistance}
              setItems={setItemsDistance}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList1}
              textStyle={styles.dropdownText}
              arrowIconStyle={styles.arrowIcon}
              dropDownDirection="BOTTOM"
            />
          </View>

          <View style={styles.gradePicker}>
            <DropDownPicker
              open={openNearby}
              value={valueNearby}
              items={itemsNearby}
              setOpen={setOpenNearby}
              setValue={setValueNearby}
              setItems={setItemsNearby}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList1}
              textStyle={styles.dropdownText}
              arrowIconStyle={styles.arrowIcon}
              dropDownDirection="BOTTOM"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {Object.keys(hospitalStatus).map(hospital => (
            <TouchableOpacity
              key={hospital}
              style={[
                styles.button,
                hospitalStatus[hospital] && styles.buttonActive,
              ]}
              onPress={() => toggleHospitalStatus(hospital)}>
              <Text style={styles.buttonText}>{hospital}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredHospitals.length === 0 ? (
          <View style={styles.blankox}>
            <View>
              <Text style={styles.noHospitalText}>병원을 검색하세요!</Text>
            </View>
          </View>
        ) : (
          <>
            {filteredHospitals.map((hospital, index) => (
              <HospitalCard
                key={hospital.id} // Use the unique id as key
                hospital={hospital}
                isFavorite={hospital.isFavorite}
                handleFavoritePress={handleFavoritePress}
              />
            ))}
            <View style={styles.placeholder}></View>
          </>
        )}
      </ScrollView>

      <View style={styles.whiteBox}></View>
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
        return 'rgba(255, 255, 255, 1)';
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
        return 'rgba(255, 255, 255, 1)';
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
        return 'rgba(255, 255, 255, 1)';
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
      <Text style={styles.phone}>{hospital['전화번호']}</Text>
    </View>
  );
}
