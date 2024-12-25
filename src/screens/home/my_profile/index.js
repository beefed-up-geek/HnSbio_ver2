// src\screens\home\my_profile\index.js
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
import ModalComponent from '../../../components/ModalComponent';

const My_profile_screen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [genderAsync, setGenderAsync] = useState('');
  const [kidneyStatus, setKidneyStatus] = useState('해당사항 없음');
  const [underlyingCondition, setUnderlyingCondition] = useState([]);
  const [initialSettings, setInitialSettings] = useState({}); // 변경사항 유무 확인

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
        if (userData != null) {
          const user = JSON.parse(userData);

          // 사용자 데이터 설정
          setId(user._id || '');
          setName(user.name || '');
          setGenderAsync(user.gender || '');
          setNickname(user.nickname || '');
          setBirthdate(user.birthdate || '');
          setCreatedAt(user.createdAt || '');
          setHeight(user.height || '');
          setWeight(user.weight || '');
          setGender(user.gender === 'male' ? '남자' : '여자');
          setKidneyStatus(user.chronic_kidney_disease || '');

          // 프로필 이미지 설정
          if (user.profile_image) {
            setProfileImage(user.profile_image);
          }

          // 기저질환 데이터 설정
          const underlyingDiseases = [];
          if (user.underlying_disease) {
            const diseaseMap = {
              hypertension: '고혈압',
              diabetes: '당뇨',
              hyperlipidemia: '고지혈증',
              retinal_complication: '망막합병증',
            };
            Object.keys(user.underlying_disease).forEach(disease => {
              if (user.underlying_disease[disease]) {
                underlyingDiseases.push(diseaseMap[disease]);
              }
            });
          }
          setUnderlyingCondition(underlyingDiseases);

          // 초기 상태 저장
          setInitialSettings({
            nickname: user.nickname || '',
            birthdate: user.birthdate || '',
            height: user.height || '',
            weight: user.weight || '',
            kidneyStatus: user.chronic_kidney_disease || '',
            profileImage: user.profile_image || null,
            underlyingCondition: underlyingDiseases,
          });
        }
      } catch (error) {
        console.log('Error loading user data', error);
      }
    };

    loadUserData();
  }, []);

  // 변경사항 여부 확인 함수
  const hasChanges = () => {
    return (
      initialSettings.nickname !== nickname ||
      initialSettings.birthdate !== birthdate ||
      initialSettings.height !== height ||
      initialSettings.weight !== weight ||
      initialSettings.kidneyStatus !== kidneyStatus ||
      initialSettings.profileImage !== profileImage ||
      JSON.stringify(initialSettings.underlyingCondition) !==
        JSON.stringify(underlyingCondition)
    );
  };

  const handleChooseProfilePicture = async () => {
    const options = {mediaType: 'photo', includeBase64: false};
    ImagePicker.launchImageLibrary(options, async response => {
      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];

        try {
          // 이미지를 리사이즈하여 가로 해상도를 512로 조정
          const resizedImage = await ImageResizer.createResizedImage(
            file.uri,
            512, // 가로 해상도를 512로 설정
            file.height / (file.width / 512), // 비율 유지
            'JPEG', // 포맷 설정
            80, // 퀄리티 설정
          );
          setProfileImage(resizedImage.uri); // 리사이즈된 이미지의 URI를 상태에 저장
        } catch (error) {
          console.error('이미지 리사이즈 중 오류 발생:', error);
          Alert.alert('오류', '이미지를 처리할 수 없습니다.');
        }
      }
    });
  };

  const toggleModal = field => {
    setModalVisible(prevState => ({...prevState, [field]: !prevState[field]}));
  };

  const closeModal = field => {
    setModalVisible(prevState => ({...prevState, [field]: false}));
  };

  const saveUserData = async () => {
    try {
      // 먼저 현재 AsyncStorage의 user 데이터를 가져옴
      const currentUserData = await AsyncStorage.getItem('user');
      if (!currentUserData) {
        throw new Error('현재 사용자 데이터를 찾을 수 없습니다.');
      }

      const currentUser = JSON.parse(currentUserData);
      const updatedUserData = {
        ...currentUser, // 기존 데이터를 모두 유지
        nickname,
        birthdate,
        height,
        weight,
        chronic_kidney_disease: kidneyStatus,
        underlying_disease: {
          hypertension: underlyingCondition.includes('고혈압') ? 1 : 0,
          diabetes: underlyingCondition.includes('당뇨') ? 1 : 0,
          hyperlipidemia: underlyingCondition.includes('고지혈증') ? 1 : 0,
          retinal_complication: underlyingCondition.includes('망막합병증')
            ? 1
            : 0,
        },
      };

      // 프로필 이미지가 변경되었는지 확인
      if (profileImage && profileImage !== currentUser.profile_image) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: profileImage,
          type: 'image/jpeg', // 파일 타입
          name: `profile_${id}.jpg`, // 파일 이름
        });
        formData.append('_id', id);

        try {
          // 프로필 이미지 업로드 API 호출
          const apiResponse = await axios.put(
            'http://98.82.55.237/user_info/uploadProfileImageById',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          // API에서 반환된 이미지 URL 저장
          updatedUserData.profile_image = apiResponse.data.profileImage;
        } catch (error) {
          console.log('프로필 이미지 업로드 중 오류 발생:', error);
          Alert.alert('오류', '프로필 이미지 저장에 실패했습니다.');
          return;
        }
      }

      // 사용자 정보 업데이트 API 호출
      await axios.put(
        'http://98.82.55.237/user_info/updateUserById',
        updatedUserData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // AsyncStorage 업데이트
      await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
      Alert.alert('알림', '변경사항이 저장되었습니다.');

      // 변경사항 저장 후 초기상태 업데이트
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
      console.log('사용자 데이터 저장 중 오류 발생:', error);
      Alert.alert('오류', '변경사항 저장에 실패하였습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <Image
            source={{uri: profileImage}}
            style={styles.profileImage}></Image>
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

      {/* User details */}
      <View style={styles.detailsContainer}>
        <DetailRow
          label="닉네임"
          value={nickname}
          onPress={() => toggleModal('nickname')}
        />
        <DetailRow label="성별" value={gender} />
        <DetailRow
          label="생년월일"
          value={birthdate.replace(/\//g, '.')}
          onPress={() => toggleModal('birthdate')}
        />
        <DetailRow
          label="키"
          value={`${height} cm`}
          onPress={() => toggleModal('height')}
        />
        <DetailRow
          label="몸무게"
          value={`${weight} kg`}
          onPress={() => toggleModal('weight')}
        />
        <DetailRow
          label="콩팥병 상태"
          value={kidneyStatus}
          onPress={() => toggleModal('kidneyStatus')}
        />
        <DetailRow
          label="기저질환 정보"
          value={
            underlyingCondition.length > 0
              ? underlyingCondition.join(', ')
              : '해당사항 없음'
          }
          onPress={() => toggleModal('underlyingCondition')}
          last
        />
      </View>

      <TouchableOpacity
        style={styles.accountManagementContainer}
        onPress={() => navigation.navigate('manage_account')}>
        <Image
          source={require('../../../images/home/gearIcon.png')}
          style={styles.settingsIcon}
        />
        <Text style={styles.accountManagementText}>내 계정 관리</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {backgroundColor: hasChanges() ? '#EBEFFE' : '#E8E8E8'},
        ]}
        onPress={saveUserData}
        disabled={!hasChanges()}>
        <Text
          style={[
            styles.saveButtonText,
            {color: hasChanges() ? '#7596FF' : '#7F7F7F'},
          ]}>
          변경사항 저장
        </Text>
      </TouchableOpacity>

      {/* Modals for editing details */}
      <ModalComponent
        visible={modalVisible.nickname}
        title="닉네임 변경"
        label="닉네임"
        value={nickname}
        setValue={setNickname}
        onClose={() => closeModal('nickname')}
        placeholder="6자리 이내로 입력"
        maxLength={8}
      />

      {/* Updated Modal for Birthdate Input */}
      <BirthdateModal
        visible={modalVisible.birthdate}
        title="생년월일 변경"
        value={birthdate}
        setValue={setBirthdate}
        onClose={() => closeModal('birthdate')}
      />

      <ModalComponent
        visible={modalVisible.height}
        title="키 변경"
        label="키"
        value={height}
        setValue={setHeight}
        onClose={() => closeModal('height')}
        placeholder="키를 입력하세요"
      />
      <ModalComponent
        visible={modalVisible.weight}
        title="몸무게 변경"
        label="몸무게"
        value={weight}
        setValue={setWeight}
        onClose={() => closeModal('weight')}
        placeholder="몸무게를 입력하세요"
      />
      <SelectionModalComponent
        visible={modalVisible.kidneyStatus}
        title="만성콩팥병 진단을 받으셨나요?"
        options={[
          '해당사항 없음',
          '만성콩팥병 (투석 전)',
          '혈액투석 중',
          '복막투석 중',
          '신장 이식 받음',
        ]}
        selectedValue={kidneyStatus}
        onSelect={value => {
          setKidneyStatus(value);
        }}
        onClose={() => closeModal('kidneyStatus')}
      />
      <SelectionModalComponent
        visible={modalVisible.underlyingCondition}
        title="어떤 기저질환이 있으신가요?"
        options={['해당사항 없음', '고혈압', '당뇨', '고지혈증', '망막합병증']}
        selectedValue={underlyingCondition}
        onSelect={value => {
          setUnderlyingCondition(value);
        }}
        onClose={() => closeModal('underlyingCondition')}
        multiple={true}
      />
    </View>
  );
};

const DetailRow = ({label, value, onPress, last}) => (
  <View style={last ? styles.detailLastRow : styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <TouchableOpacity style={styles.textButtonWrapper} onPress={onPress}>
      <Text style={styles.detailValue}>{value}</Text>
      {onPress && (
        <Image
          source={require('../../../images/home/my_profile/go.png')}
          style={styles.goIcon}
        />
      )}
    </TouchableOpacity>
  </View>
);

const BirthdateModal = ({visible, title, value, setValue, onClose}) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  useEffect(() => {
    if (visible && value) {
      const parts = value.split('/');
      setYear(parts[0] || '');
      setMonth(parts[1] || '');
      setDay(parts[2] || '');
    }
  }, [visible, value]);

  const handleComplete = () => {
    const formattedYear = year.padStart(4, '0');
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    const newBirthdate = `${formattedYear}/${formattedMonth}/${formattedDay}`;
    setValue(newBirthdate);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalVisibleBackground}
        activeOpacity={1}
        onPress={onClose}></TouchableOpacity>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={styles.birthdateInputRow}>
          <TextInput
            style={styles.birthdateInput}
            placeholder="년(4자리)"
            placeholderTextColor="#828287"
            maxLength={4}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <Text style={styles.birthdateSeparator}>/</Text>
          <TextInput
            style={styles.birthdateInput}
            placeholder="월(2자리)"
            placeholderTextColor="#828287"
            maxLength={2}
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
          />
          <Text style={styles.birthdateSeparator}>/</Text>
          <TextInput
            style={styles.birthdateInput}
            placeholder="일(2자리)"
            placeholderTextColor="#828287"
            maxLength={2}
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.modalSaveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleComplete}>
            <Text style={styles.saveButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SelectionModalComponent = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  multiple,
}) => {
  const [tempSelectedValue, setTempSelectedValue] = useState(
    multiple ? [...selectedValue] : selectedValue,
  );

  useEffect(() => {
    if (visible) {
      setTempSelectedValue(multiple ? [...selectedValue] : selectedValue);
    }
  }, [visible, selectedValue]);

  const handleOptionPress = option => {
    if (multiple) {
      if (option === '해당사항 없음') {
        setTempSelectedValue(['해당사항 없음']);
      } else {
        let newSelection = [...tempSelectedValue];

        // Remove '해당사항 없음'
        newSelection = newSelection.filter(item => item !== '해당사항 없음');

        if (newSelection.includes(option)) {
          newSelection = newSelection.filter(item => item !== option);
        } else {
          newSelection.push(option);
        }

        if (newSelection.length === 0) {
          newSelection = ['해당사항 없음'];
        }

        setTempSelectedValue(newSelection);
      }
    } else {
      setTempSelectedValue(option);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalVisibleBackground}
        activeOpacity={1}
        onPress={onClose}></TouchableOpacity>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={styles.optionContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                (multiple
                  ? tempSelectedValue.includes(option)
                  : tempSelectedValue === option) &&
                  styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionPress(option)}>
              <Text
                style={[
                  styles.optionText,
                  (multiple
                    ? tempSelectedValue.includes(option)
                    : tempSelectedValue === option) &&
                    styles.selectedOptionText,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.modalSaveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSelect(tempSelectedValue);
              onClose();
            }}>
            <Text style={styles.saveButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default My_profile_screen;
