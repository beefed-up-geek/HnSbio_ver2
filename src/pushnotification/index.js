//src/pushnotification/index.js

import React, {useEffect} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Text,
  StyleSheet,
} from 'react-native';
import notifee, {
  AndroidImportance,
} from '@notifee/react-native';

const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      // Android POST_NOTIFICATIONS 권한 요청
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('알림 권한이 허용되었습니다.');
      } else {
        console.log('알림 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('권한 요청 중 오류 발생:', error);
    }
  } else if (Platform.OS === 'ios') {
    // iOS에서는 notifee를 통해 권한 요청
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= 1) {
      console.log('알림 권한이 허용되었습니다.');
    } else {
      console.log('알림 권한이 거부되었습니다.');
    }
  }
};

export async function onDisplayNotification() {
  // 알림 채널 생성(Android 전용)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH, // 알림 우선순위
    badge: true, // 앱 아이콘에 배지 표시
    sound: 'default', // 기본 알림 소리
  });

  // 알림 표시
  await notifee.displayNotification({
    title: '(테스트) 키트 검사 알림',
    body: '검사한 지 5분이 지났어요. 다시 한번 검사해보는 건 어떨까요?',
    android: {
      channelId,
      smallIcon: 'hns', // 작은 아이콘 (푸시 알림 아이콘 설정)
      color: '#4CAF50', // 아이콘 색상
    },
    ios: {
      sound: 'default', // iOS 알림 사운드
      badgeCount: 1, // 배지 카운트
    },
  });
}

const PushNotification = () => {
  useEffect(() => {
    const initNotification = async () => {
      await checkApplicationPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notification channel created:', channelId);
    };
  
    initNotification();
  }, []);

  return (
    <View style={styles.hiddenContainer}>
      <Text style={styles.hiddenText}>푸시 알림 테스트</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    display: 'none',
  },
  hiddenText: {
    display: 'none',
  },
});

export default PushNotification;
