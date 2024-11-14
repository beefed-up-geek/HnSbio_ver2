// src\pushnotification\index.js
import React, { useEffect } from 'react';
import { View, Button, PermissionsAndroid, Platform, Text } from 'react-native';
import notifee from '@notifee/react-native';

const checkAPPlicationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
        } catch (error) {
            console.error(error);
        }
    } else if (Platform.OS === 'ios') {
        // iOS에서는 notifee의 권한 요청 사용
        const settings = await notifee.requestPermission();

        if (settings.authorizationStatus >= 1) {
            console.log('알림 권한이 허용되었습니다.');
        } else {
            console.log('알림 권한이 거부되었습니다.');
        }
    }
}

export async function onDisplayNotification() {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    await notifee.displayNotification({
        title: '(테스트)키트 검사',
        body: '검사한지 5분이 지났어요. 다시 한번 검사해보는 건 어떨까요?',
        android: {
            channelId,
        },
        ios: {
            // iOS의 알림 관련 설정 (optional)
            sound: 'default',
            badgeCount: 1,
        },
    });
}

const PushNotification = () => {
    useEffect(() => {
        // 권한을 요청하고 나서 바로 푸시 알림을 표시
        const initNotification = async () => {
            await checkAPPlicationPermission();
            await onDisplayNotification(); // 앱 시작 후 바로 푸시 알림 표시
        };

        initNotification();
    }, []);

    return (
        <View style={{ display: 'none' }}>
            {/* 이 View와 안의 요소들은 화면에 보이지 않으며, 공간을 차지하지 않음 */}
            <Text>푸시 알림 테스트</Text>
            <Button title="알림 보내기" onPress={() => onDisplayNotification()} />
        </View>
    );
}

export default PushNotification;
