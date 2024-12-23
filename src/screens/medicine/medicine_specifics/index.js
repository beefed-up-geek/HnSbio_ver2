import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from './styles.js';

const Medicine_specifics_screen = ({ route }) => {
    const navigation = useNavigation();

    const {
        name, englishName, efficacy, instruction, caution,
        sotrageInstruction,
    } = route.params;

    const [selectedTab, setSelectedTab] = useState('efficacy');

    const renderContent = () => {
        switch (selectedTab) {
            case 'efficacy':
                return efficacy;
            case 'instruction':
                return instruction;
            case 'caution':
                return caution;
            case 'storage':
                return sotrageInstruction;
            default:
                return '';
        }
    };

    return (
        <>

            <ScrollView style={styles.container}>
                {/* 그라데이션 헤더 */}
                <LinearGradient
                    colors={['#B7C8FF', '#EBEFFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientHeader}
                >
                    <Text style={styles.koreanName}>{name}</Text>
                    <Text style={styles.englishName}>{englishName}</Text>
                </LinearGradient>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'efficacy' && styles.activeTabButton]}
                        onPress={() => setSelectedTab('efficacy')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'efficacy' && styles.activeTabText]}>효능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'instruction' && styles.activeTabButton]}
                        onPress={() => setSelectedTab('instruction')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'instruction' && styles.activeTabText]}>사용법</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'caution' && styles.activeTabButton]}
                        onPress={() => setSelectedTab('caution')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'caution' && styles.activeTabText]}>주의사항</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, selectedTab === 'storage' && styles.activeTabButton]}
                        onPress={() => setSelectedTab('storage')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'storage' && styles.activeTabText]}>보관법</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>
                        {selectedTab === 'efficacy' ? '효능' : selectedTab === 'instruction' ? '사용법' : selectedTab === 'caution' ? '주의사항' : '보관법'}
                    </Text>
                    <Text style={styles.sectionContent}>{renderContent()}</Text>
                </View>

                <View style={styles.sectionFooter}>
                    <Text style={styles.footerText}>
                        H&S Biolab 데이터는 식품의약안전처가 제공한 2020년도 e약은요 자료와 2021년도 의약품 제품 허가정보를 기반으로 제공됩니다.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
};

export default Medicine_specifics_screen;
