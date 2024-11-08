// src/screens/home/my_profile/index.js

import {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import theme from '../../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const My_profile_screen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('김콩팥');
  const [birthdate, setBirthdate] = useState('1978.09.23');
  const [height, setHeight] = useState('169');
  const [weight, setWeight] = useState('62');
  const [kidneyStatus, setKidneyStatus] = useState('해당사항 없음');
  const [underlyingCondition, setUnderlyingCondition] = useState('당뇨');

  const [modalVisible, setModalVisible] = useState({
    nickname: false,
    birthdate: false,
    height: false,
    weight: false,
    kidneyStatus: false,
    underlyingCondition: false,
  });

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
        <DetailRow label="성별" value="남자" />
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
          value={underlyingCondition}
          onPress={() => toggleModal('underlyingCondition')}
          last
        />
      </View>

      <TouchableOpacity style={styles.accountManagementContainer}>
        <Image
          source={require('../../../images/home/gearIcon.png')}
          style={styles.settingsIcon}
        />
        <Text style={styles.accountManagementText}>내 계정 관리</Text>
      </TouchableOpacity>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton}>
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
      <ModalComponent
        visible={modalVisible.birthdate}
        title="생년월일 변경"
        label="생년월일"
        value={birthdate}
        setValue={setBirthdate}
        onClose={() => toggleModal('birthdate')}
        placeholder="YYYY/MM/DD"
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
          toggleModal('kidneyStatus');
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
          toggleModal('underlyingCondition');
        }}
        onClose={() => toggleModal('underlyingCondition')}
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
      <Image
        source={require('../../../images/home/my_profile/go.png')}
        style={styles.goIcon}
      />
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
        />
      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);


// 선택형 모달
const SelectionModalComponent = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
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
      <View style={styles.optionContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedValue === option && styles.selectedOptionButton,
            ]}
            onPress={() => onSelect(option)}>
            <Text
              style={[
                styles.optionText,
                selectedValue === option && styles.selectedOptionText,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default My_profile_screen;
