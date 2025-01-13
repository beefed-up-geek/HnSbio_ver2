// src/screens/home/my_profile/index.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, formDataApi} from '../../../utils/api';
import styles from './styles.js';
import ModalComponent from '../../../components/ModalComponent';

const MyProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [kidneyStatus, setKidneyStatus] = useState('해당사항 없음');
  const [underlyingCondition, setUnderlyingCondition] = useState([]);
  const [initialSettings, setInitialSettings] = useState({});

  const [modalVisible, setModalVisible] = useState({
    nickname: false,
    birthdate: false,
    height: false,
    weight: false,
    kidneyStatus: false,
    underlyingCondition: false,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setId(user._id || '');
          setName(user.name || '');
          setNickname(user.nickname || '');
          setBirthdate(user.birthdate || '');
          setHeight(user.height || '');
          setWeight(user.weight || '');
          setGender(user.gender === 'male' ? '남자' : '여자');
          setKidneyStatus(user.chronic_kidney_disease || '');

          if (user.profile_image) {
            setProfileImage(user.profile_image);
          }

          const diseases = [];
          if (user.underlying_disease) {
            const diseaseMap = {
              hypertension: '고혈압',
              diabetes: '당뇨',
              hyperlipidemia: '고지혈증',
              retinal_complication: '망막합병증',
            };
            Object.keys(user.underlying_disease).forEach(disease => {
              if (user.underlying_disease[disease]) {
                diseases.push(diseaseMap[disease]);
              }
            });
          }
          setUnderlyingCondition(diseases);

          setInitialSettings({
            nickname: user.nickname || '',
            birthdate: user.birthdate || '',
            height: user.height || '',
            weight: user.weight || '',
            kidneyStatus: user.chronic_kidney_disease || '',
            profileImage: user.profile_image || null,
            underlyingCondition: diseases,
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const saveUserData = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem('user');
      if (!currentUserData) {
        throw new Error('현재 사용자 데이터를 찾을 수 없습니다.');
      }

      const currentUser = JSON.parse(currentUserData);
      const updatedUserData = {
        ...currentUser,
        nickname,
        birthdate,
        height,
        weight,
        chronic_kidney_disease: kidneyStatus,
        underlying_disease: {
          hypertension: underlyingCondition.includes('고혈압') ? 1 : 0,
          diabetes: underlyingCondition.includes('당뇨') ? 1 : 0,
          hyperlipidemia: underlyingCondition.includes('고지혈증') ? 1 : 0,
          retinal_complication: underlyingCondition.includes('망막합병증') ? 1 : 0,
        },
      };

      if (profileImage && profileImage !== currentUser.profile_image) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: profileImage,
          type: 'image/jpeg',
          name: `profile_${id}.jpg`,
        });
        formData.append('_id', id);

        const response = await formDataApi.put('/user_info/uploadProfileImageById', formData);
        updatedUserData.profile_image = response.data.profileImage;
      }

      await api.put('/user_info/updateUserById', updatedUserData);

      await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
      Alert.alert('알림', '변경사항이 저장되었습니다.');

      setInitialSettings({
        nickname,
        birthdate,
        height,
        weight,
        kidneyStatus,
        profileImage: updatedUserData.profile_image,
        underlyingCondition,
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('오류', '변경사항 저장에 실패하였습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{uri: profileImage}} style={styles.profileImage} />
        ) : (
          <Image
            source={require('../../../images/home/my_profile/sampleProfile.png')}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity
          style={styles.cameraIconContainer}
          onPress={handleChooseProfilePicture}>
          <Image
            source={require('../../../images/home/my_profile/camera.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          {backgroundColor: '#7596FF'},
        ]}
        onPress={saveUserData}>
        <Text style={styles.saveButtonText}>변경사항 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyProfileScreen;
