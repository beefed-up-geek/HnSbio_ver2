import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const ManageAccountScreen = () => {
  const navigation = useNavigation();
  
  // account 배열 전체를 저장할 상태
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);

          const userAccounts = parsedUser.account || [];

          // provider 문자열 -> 한글 변환
          const convertedAccounts = userAccounts.map(item => {
            let displayProvider = '';
            switch (item.provider) {
              case 'kakao':
                displayProvider = '카카오';
                break;
              case 'google':
                displayProvider = '구글';
                break;
              case 'naver':
                displayProvider = '네이버';
                break;
              case 'apple':
                displayProvider = '애플';
                break;
              default:
                displayProvider = item.provider;
            }

            return {
              ...item,
              displayProvider,
            };
          });

          setAccounts(convertedAccounts);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // 안드로이드 뒤로가기 버튼 핸들링
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('my_profile');
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  const handleLogoutConfirmation = () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      { text: '아니오', style: 'cancel' },
      { text: '예', onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login1');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  const handleDeleteAccountConfirmation = () => {
    Alert.alert(
      '회원탈퇴',
      '회원 탈퇴 시 모든 정보가 삭제됩니다. 정말로 탈퇴하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: handleDeleteAccount },
      ],
    );
  };

  const handleDeleteAccount = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const { providerId } = JSON.parse(userData);

        const response = await fetch('http://98.82.55.237/user_info/deleteUser', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ providerId }),
        });

        if (response.ok) {
          await AsyncStorage.removeItem('user');
          Alert.alert('회원탈퇴가 완료되었습니다.');
          navigation.navigate('Login1');
        } else {
          // 오류 처리
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('회원탈퇴 실패:', errorData);
            Alert.alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
          } else {
            const errorText = await response.text();
            console.error('회원탈퇴 실패:', errorText);
            Alert.alert('회원탈퇴 중 서버 오류가 발생했습니다. 다시 시도해주세요.');
          }
        }
      }
    } catch (error) {
      console.error('회원탈퇴 중 오류가 발생했습니다:', error);
      Alert.alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  /**
   * account 배열을 줄바꿈(\n)으로 이어 붙여
   * "카카오 (가입일: 241225)\n애플 (가입일: 241226)..." 과 같은 형태의 문자열로 변환
   */
  const accountListString = accounts
    .map(acc => `${acc.displayProvider} (가입일: ${acc.createdAt})`)
    .join('\n');

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>

        {/* 
          "계정 정보" 라벨과
          오른쪽 끝에 account 목록(줄바꿈) 표시 
        */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>계정 정보</Text>
          <Text style={styles.detailValue}>{accountListString}</Text>
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity
          style={styles.detailRow}
          onPress={handleLogoutConfirmation}
        >
          <Text style={styles.detailLabel}>로그아웃</Text>
          <Image
            source={require('../../../images/home/my_profile/go.png')}
            style={styles.goIcon}
          />
        </TouchableOpacity>

        {/* 회원탈퇴 */}
        <TouchableOpacity
          style={styles.detailLastRow}
          onPress={handleDeleteAccountConfirmation}
        >
          <Text style={styles.detailLabel}>회원 탈퇴</Text>
          <Image
            source={require('../../../images/home/my_profile/go.png')}
            style={styles.goIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageAccountScreen;
