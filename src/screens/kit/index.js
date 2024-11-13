// src\screens\kit\index.js
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text, View, TouchableOpacity, Alert } from 'react-native';
import theme from '../../theme';
import styles from './styles.js';
const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Kit_screen = () => {
    const [providerId, setProviderId] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setProviderId(parsedData.providerId);
            }
        };
        fetchUserData();
    }, []);

    

    return (
        <View>
            <Text style={{ color: 'black' }}>src/screens/kit/index.js</Text>
            <Text style={{ color: 'black' }}>키트 검사 결과들 보여주는 화면</Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('NoTabs', { screen: 'kit_guide_1' })}
            >
                <Text style={{ color: 'black' }}>키트 검사 시작</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Kit_screen;