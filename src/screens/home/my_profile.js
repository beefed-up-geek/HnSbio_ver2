// src/screens/home/my_profile.js

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

import theme from '../../theme'; // 개발 규칙: 폰트 적용
import styles from './my_profile_styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리

const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const My_profile_screen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState('김콩팥');

  const handleChooseProfilePicture = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setProfileImage(uri);
      }
    });
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
            source={require('../../images/home/my_profile/sampleProfile.png')}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity
          style={styles.cameraIconContainer}
          onPress={handleChooseProfilePicture}>
          <Image
            source={require('../../images/home/my_profile/camera.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>닉네임</Text>
          <TouchableOpacity
            style={styles.textButtonWrapper}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.detailValue}>김콩팥</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>성별</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>남성</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>생년월일</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>1978.09.23</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>키</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>169 cm</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>몸무게</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>62 kg</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>콩팥병 상태</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>해당사항 없음</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailLastRow}>
          <Text style={styles.detailLabel}>기저질환 정보</Text>
          <TouchableOpacity style={styles.textButtonWrapper}>
            <Text style={styles.detailValue}>당뇨</Text>
            <Image
              source={require('../../images/home/my_profile/go.png')}
              style={styles.goIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.accountManagementContainer}>
        <Image
          source={require('../../images/home/gearIcon.png')}
          style={styles.settingsIcon}
        />
        <Text style={styles.accountManagementText}>내 계정 관리</Text>
      </TouchableOpacity>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>
      </View>

      {modalVisible ? (
        <View style={styles.modalOverlay}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableOpacity
              style={styles.modalVisibleBackground}
              activeOpacity={1}
              onPress={() => setModalVisible(false)} // Close modal on overlay tap
            ></TouchableOpacity>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>닉네임 변경</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>닉네임</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="6자리 이내로 입력"
                  placeholderTextColor="#828287"
                  maxLength={8}
                  value={nickname}
                  onChangeText={setNickname}
                />
                <Text style={styles.charCount}>{nickname.length}/8</Text>
              </View>
              <View style={styles.saveButtonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.saveButtonText}>완료</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default My_profile_screen;
