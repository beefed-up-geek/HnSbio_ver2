// src\screens\health_checkup\authentication_2\index.js
import React, { useState, useEffect } from 'react';
import {
 View,
 Image,
 Text,
 TextInput,
 ScrollView,
 TouchableOpacity,
 Modal,
 ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import styles from './styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../../theme.js';

const telecomOptions = [
 'SKT',
 'KT',
 'LGU+',
 '알뜰폰 (SKT)',
 '알뜰폰 (KT)',
 '알뜰폰 (LGU+)',
];

const Authentication_2_screen = () => {
 const [name, setName] = useState('');
 const [birthdate, setBirthdate] = useState('');
 const [phoneNumber, setPhoneNumber] = useState('');
 const [selectedTelecom, setSelectedTelecom] = useState('');
 const [nameFocused, setNameFocused] = useState(false);
 const [birthdateFocused, setBirthdateFocused] = useState(false);
 const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
 const [birthdateError, setBirthdateError] = useState(false);
 const [phoneNumberError, setPhoneNumberError] = useState(false);
 const [formValid, setFormValid] = useState(false);
 const [telecomModalVisible, setTelecomModalVisible] = useState(false);
 const [loading, setLoading] = useState(false);

 const route = useRoute();
 const { selectedValue, selectedLabel, selectedImage, refreshHealthData } = route.params;
 const navigation = useNavigation();

 const [_id, setId] = useState(null);

 useEffect(() => {
   const getProviderData = async () => {
     try {
       const userDataString = await AsyncStorage.getItem('user');
       if (userDataString) {
         const userData = JSON.parse(userDataString);
         const { _id, birthdate, name } = userData;

         if (_id) {
           console.log('_id를 성공적으로 가져옴:', _id);
           setId(_id);
         } else {
           console.log('_id가 존재하지 않음');
         }

         if (birthdate) {
           console.log('birthdate를 성공적으로 가져옴:', birthdate);
           const processedBirthdate = birthdate.replace(/[^0-9]/g, '').slice(0, 8);
           setBirthdate(processedBirthdate);
         } else {
           console.log('birthdate가 존재하지 않음');
         }

         if (name) {
           console.log('name을 성공적으로 가져옴:', name);
           setName(name.slice(0, 8));
         } else {
           console.log('name이 존재하지 않음');
         }
       } else {
         console.log('user 데이터가 존재하지 않음');
       }
     } catch (error) {
       console.error('데이터를 가져오는 중 오류 발생:', error);
     }
   };

   getProviderData();
 }, []);

 const isValidBirthdate = (birthdate) => {
   if (birthdate.length !== 8) {
     return false;
   }
   const year = parseInt(birthdate.slice(0, 4), 10);
   const month = parseInt(birthdate.slice(4, 6), 10);
   const day = parseInt(birthdate.slice(6, 8), 10);

   const date = new Date(year, month - 1, day);
   return (
     date.getFullYear() === year &&
     date.getMonth() === month - 1 &&
     date.getDate() === day
   );
 };

 const isValidPhoneNumber = (phoneNumber) => {
   return phoneNumber.length === 11 && phoneNumber.startsWith('010');
 };

 useEffect(() => {
   if (
     name.length > 0 &&
     isValidBirthdate(birthdate) &&
     isValidPhoneNumber(phoneNumber) &&
     !birthdateError &&
     !phoneNumberError &&
     selectedTelecom.length > 0
   ) {
     setFormValid(true);
   } else {
     setFormValid(false);
   }
 }, [
   _id,
   name,
   birthdate,
   phoneNumber,
   birthdateError,
   phoneNumberError,
   selectedTelecom,
 ]);

 const handleAuthentication = async () => {
   console.log('인증 요청 함수가 호출되었습니다.');

   if (!formValid) {
     console.log('폼이 유효하지 않음.');
     return;
   }

   setLoading(true);

   try {
     let telecom = '';
     if (selectedTelecom === 'KT' || selectedTelecom === '알뜰폰 (KT)') {
       telecom = '1';
     } else if (
       selectedTelecom === 'SKT' ||
       selectedTelecom === '알뜰폰 (SKT)'
     ) {
       telecom = '0';
     } else if (
       selectedTelecom === 'LGU+' ||
       selectedTelecom === '알뜰폰 (LGU+)'
     ) {
       telecom = '2';
     }

     const request_data = {
       _id: _id,
       userName: name,
       identity: birthdate,
       phoneNo: phoneNumber,
       telecom: telecom,
       loginTypeLevel: selectedValue.toString(),
     };
     console.log(request_data);
     const response = await axios.post(
       'http://98.82.55.237/health_checkup/step1ById',
       request_data,
     );
     console.log("응답\n",response.data);
     const { result, data } = response.data;
     if (result.code === 'CF-03002') {
       navigation.navigate('authentication_3', {
         _id: _id,
         jti: data.jti,
         twoWayTimestamp: data.twoWayTimestamp,
         name: name,
         birthdate: birthdate,
         phoneNo: phoneNumber,
         telecom: telecom,
         loginTypeLevel: selectedValue.toString(),
         selectedLabel: selectedLabel,
         selectedImage: selectedImage,
         refreshHealthData
       });
     } else {
       setBirthdateError(true);
       setPhoneNumberError(true);
     }
   } catch (error) {
    Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
    //  if (error.response && error.response.status === 404) {
    //    navigation.navigate('authentication_3', {
    //      _id: _id,
    //      jti: 'dummyJti',
    //      twoWayTimestamp: Date.now().toString(),
    //      name: name,
    //      birthdate: birthdate,
    //      phoneNo: phoneNumber,
    //      telecom: telecom,
    //      loginTypeLevel: selectedValue.toString(),
    //      selectedLabel: selectedLabel,
    //      selectedImage: selectedImage,
    //      refreshHealthData,
    //    });
    //  } else {
    //    console.error(error);
    //  }
   } finally {
     setLoading(false);
   }
 };

 const handleTelecomSelect = (provider) => {
   setSelectedTelecom(provider);
   setTelecomModalVisible(false);
 };

 return (
   <>
     <ScrollView contentContainerStyle={styles.container}>
       <Text style={styles.title}>개인정보 입력</Text>
       <Text style={styles.subtitle}>
         본인인증을 진행하기 위해 개인정보를 입력해주세요.
       </Text>

       <View style={styles.inputContainer}>
         <View
           style={[
             styles.inputWrapper,
             nameFocused && styles.inputWrapperFocused,
           ]}>
           <Text style={styles.floatingLabel}>이름</Text>
           <TextInput
             style={styles.input}
             value={name}
             onChangeText={(text) => setName(text.slice(0, 8))}
             placeholder={!nameFocused ? '이름 입력' : ''}
             placeholderTextColor="#777"
             maxLength={8}
             onFocus={() => setNameFocused(true)}
             onBlur={() => setNameFocused(false)}
           />
         </View>

         <View
           style={[
             styles.inputWrapper,
             birthdateFocused && styles.inputWrapperFocused,
             birthdateError && styles.inputWrapperError,
           ]}>
           <Text style={styles.floatingLabel}>생년월일 8자리</Text>
           <TextInput
             style={styles.input}
             value={birthdate}
             onChangeText={(text) => {
               setBirthdate(text.slice(0, 8));
               setBirthdateError(false);
             }}
             placeholder={!birthdateFocused ? '생년월일' : ''}
             keyboardType="numeric"
             placeholderTextColor="#777"
             maxLength={8}
             onFocus={() => {
               setBirthdateFocused(true);
               setBirthdateError(false);
             }}
             onBlur={() => {
               setBirthdateFocused(false);
               if (!isValidBirthdate(birthdate)) {
                 setBirthdateError(true);
               }
             }}
           />
         </View>
         {!birthdateFocused && birthdateError && (
           <Text style={styles.errorText}>유효한 생년월일을 입력해주세요</Text>
         )}

         <View
           style={[
             styles.inputWrapper,
             phoneNumberFocused && styles.inputWrapperFocused,
             phoneNumberError && styles.inputWrapperError,
           ]}>
           <Text style={styles.floatingLabel}>휴대폰번호</Text>
           <View style={styles.phoneInputRow}>
             <TouchableOpacity
               style={styles.telecomButton}
               onPress={() => setTelecomModalVisible(true)}>
               <Text style={styles.telecomButtonText}>
                 {selectedTelecom || '통신사'}
               </Text>
               <Image
                 source={require('../../../images/login/underTriangle.png')}
                 style={styles.underTriangleButtonImage}
               />
             </TouchableOpacity>
             <TextInput
               style={styles.input}
               value={phoneNumber}
               onChangeText={(text) => {
                 setPhoneNumber(text.slice(0, 11));
                 setPhoneNumberError(false);
               }}
               placeholder={!phoneNumberFocused ? '휴대폰번호 입력' : ''}
               keyboardType="phone-pad"
               placeholderTextColor="#777"
               maxLength={11}
               onFocus={() => {
                 setPhoneNumberFocused(true);
                 setPhoneNumberError(false);
               }}
               onBlur={() => {
                 setPhoneNumberFocused(false);
                 if (!isValidPhoneNumber(phoneNumber)) {
                   setPhoneNumberError(true);
                 }
               }}
             />
             {phoneNumber.length > 0 && (
               <TouchableOpacity onPress={() => setPhoneNumber('')}>
                 <Image
                   source={require('../../../images/xButton.png')}
                   style={styles.xButtonImage}
                 />
               </TouchableOpacity>
             )}
           </View>
         </View>
         {!phoneNumberFocused && phoneNumberError && (
           <Text style={styles.errorText}>유효한 휴대폰번호를 입력해주세요</Text>
         )}
       </View>

       <TouchableOpacity
         style={[
           styles.authButton,
           formValid ? styles.authButtonEnabled : styles.authButtonDisabled,
         ]}
         onPress={handleAuthentication}
         disabled={!formValid}>
         <Text
           style={[
             styles.authButtonText,
             formValid
               ? styles.authButtonTextEnabled
               : styles.authButtonTextDisabled,
           ]}>
           인증 요청
         </Text>
       </TouchableOpacity>

       {/* Telecom Selection Modal */}
       <Modal
         visible={telecomModalVisible}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setTelecomModalVisible(false)}>
         <View style={styles.modalOverlay}>
           <View style={styles.modalContainer}>
             <View style={styles.modalTop}>
               <Text style={styles.modalTitle}>통신사 선택</Text>
               <TouchableOpacity
                 style={styles.xButton}
                 onPress={() => setTelecomModalVisible(false)}>
                 <Image
                   source={require('../../../images/xButton.png')}
                   style={styles.xButtonImage}
                 />
               </TouchableOpacity>
             </View>
             {telecomOptions.map((option) => (
               <TouchableOpacity
                 key={option}
                 style={styles.telecomOption}
                 onPress={() => handleTelecomSelect(option)}>
                 <Text style={styles.telecomOptionText}>{option}</Text>
               </TouchableOpacity>
             ))}
           </View>
         </View>
       </Modal>
     </ScrollView>

     {/* 로딩 인디케이터 */}
     {loading && (
       <Modal transparent={true} animationType="none">
         <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color={theme.colors.mainBlue} />
           <Text style={styles.loadingText}>인증 요청 중입니다...</Text>
         </View>
       </Modal>
     )}
   </>
 );
};

export default Authentication_2_screen;