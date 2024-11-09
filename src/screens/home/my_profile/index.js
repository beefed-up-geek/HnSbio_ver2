// src/screens/home/my_profile/index.js

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import theme from '../../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const My_profile_screen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [kidneyStatus, setKidneyStatus] = useState('해당사항 없음');
  const [underlyingCondition, setUnderlyingCondition] = useState([]);

  const [modalVisible, setModalVisible] = useState({
    nickname: false,
    birthdate: false,
    height: false,
    weight: false,
    kidneyStatus: false,
    underlyingCondition: false,
  });

  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData != null) {
          const user = JSON.parse(userData);

          setNickname(user.nickname || '');
          if (user.birthdate) {
            const formattedBirthdate = user.birthdate.replace(/\//g, '.');
            setBirthdate(formattedBirthdate);

            // Parse birthdate and set selectedDate
            const dateParts = formattedBirthdate.split('.');
            if (dateParts.length === 3) {
              const year = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
              const day = parseInt(dateParts[2], 10);
              setSelectedDate(new Date(year, month, day));
            }
          }

          setHeight(user.height || '');
          setWeight(user.weight || '');
          setGender(user.gender === 'male' ? '남자' : '여자');
          setKidneyStatus(user.chronic_kidney_disease || '');
          if (user.profileImage) {
            setProfileImage(user.profileImage);
          }

          // 기저질환 처리
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
        }
      } catch (error) {
        console.log('Error loading user data', error);
      }
    };

    loadUserData();
  }, []);

  const handleChooseProfilePicture = async () => {
    const options = {mediaType: 'photo', includeBase64: false};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setProfileImage(uri);
      }
    });
  };

  const toggleModal = field => {
    setModalVisible({...modalVisible, [field]: !modalVisible[field]});
    // 생년월일 모달을 열 때 selectedDate를 사용자의 생일로 설정할 필요 없음 (이미 설정됨)
  };

  const saveUserData = async () => {
    try {
      const userData = {
        providerId: 'your_provider_id', // 적절히 providerId를 설정해주세요
        nickname,
        birthdate: birthdate.replace(/\./g, '/'), // 'YYYY/MM/DD' 형식으로 변환
        height,
        weight,
        chronic_kidney_disease: kidneyStatus,
        profileImage,
        underlying_disease: {
          hypertension: underlyingCondition.includes('고혈압') ? 1 : 0,
          diabetes: underlyingCondition.includes('당뇨') ? 1 : 0,
          hyperlipidemia: underlyingCondition.includes('고지혈증') ? 1 : 0,
          retinal_complication: underlyingCondition.includes('망막합병증') ? 1 : 0,
        },
      };

      // 사용자 정보 업데이트 API 호출
      await axios.put('http://54.79.61.80:5000/user_info/updateUser', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('알림', '변경사항이 저장되었습니다.');
    } catch (error) {
      console.log('Error saving user data', error);
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

      {/* 각 행의 정보 */}
      <View style={styles.detailsContainer}>
        <DetailRow
          label="닉네임"
          value={nickname}
          onPress={() => toggleModal('nickname')}
        />
        <DetailRow label="성별" value={gender} />
        <DetailRow
          label="생년월일"
          value={birthdate}
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

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>
      </View>

      {/* 각 행의 수정 모달 */}
      <ModalComponent
        visible={modalVisible.nickname}
        title="닉네임 변경"
        label="닉네임"
        value={nickname}
        setValue={setNickname}
        onClose={() => toggleModal('nickname')}
        placeholder="6자리 이내로 입력"
        maxLength={8}
      />
      {/* 생년월일 모달 */}
      <DatePickerModal
        visible={modalVisible.birthdate}
        title="생년월일 변경"
        date={selectedDate}
        setDate={setSelectedDate}
        setBirthdate={setBirthdate}
        onClose={() => {
          toggleModal('birthdate');
        }}
      />
      <ModalComponent
        visible={modalVisible.height}
        title="키 변경"
        label="키"
        value={height}
        setValue={setHeight}
        onClose={() => toggleModal('height')}
        placeholder="키를 입력하세요"
      />
      <ModalComponent
        visible={modalVisible.weight}
        title="몸무게 변경"
        label="몸무게"
        value={weight}
        setValue={setWeight}
        onClose={() => toggleModal('weight')}
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
        onClose={() => toggleModal('kidneyStatus')}
      />
      <SelectionModalComponent
        visible={modalVisible.underlyingCondition}
        title="어떤 기저질환이 있으신가요?"
        options={['해당사항 없음', '고혈압', '당뇨', '고지혈증', '망막합병증']}
        selectedValue={underlyingCondition}
        onSelect={value => {
          setUnderlyingCondition(value);
        }}
        onClose={() => toggleModal('underlyingCondition')}
        multiple={true} // 다중 선택 가능하도록 설정
      />
    </View>
  );
};

// 마지막 row는 last prop 사용하여 개별 스타일 적용할 수 있도록 함
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

// 사용자 입력형 모달
const ModalComponent = ({
  visible,
  title,
  label,
  value,
  setValue,
  onClose,
  placeholder,
  maxLength,
}) => (
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
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#828287"
          maxLength={maxLength}
          value={value}
          onChangeText={setValue}
          keyboardType={label === '키' || label === '몸무게' ? 'numeric' : 'default'}
        />
      </View>
      <View style={styles.modalSaveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// 생년월일 선택 모달 컴포넌트
const DatePickerModal = ({
  visible,
  title,
  date,
  setDate,
  setBirthdate,
  onClose,
}) => {
  const [tempDate, setTempDate] = useState(date);

  useEffect(() => {
    if (visible) {
      setTempDate(date);
    }
  }, [visible, date]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
    if (Platform.OS === 'android') {
      const formattedDate = `${currentDate.getFullYear()}.${(
        '0' +
        (currentDate.getMonth() + 1)
      ).slice(-2)}.${('0' + currentDate.getDate()).slice(-2)}`;
      setBirthdate(formattedDate);
      setDate(currentDate);
      onClose();
    }
  };

  const handleConfirm = () => {
    const formattedDate = `${tempDate.getFullYear()}.${(
      '0' +
      (tempDate.getMonth() + 1)
    ).slice(-2)}.${('0' + tempDate.getDate()).slice(-2)}`;
    setBirthdate(formattedDate);
    setDate(tempDate);
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
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="spinner"
          onChange={onChange}
          maximumDate={new Date()}
          style={{width: '100%'}}
        />
        {/* iOS의 경우 완료 버튼 제공 */}
        {Platform.OS === 'ios' && (
          <View style={styles.modalSaveButtonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleConfirm}>
              <Text style={styles.saveButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

// 선택형 모달
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

        // '해당사항 없음' 제거
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
                  : tempSelectedValue === option) && styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionPress(option)}>
              <Text
                style={[
                  styles.optionText,
                  (multiple
                    ? tempSelectedValue.includes(option)
                    : tempSelectedValue === option) && styles.selectedOptionText,
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
