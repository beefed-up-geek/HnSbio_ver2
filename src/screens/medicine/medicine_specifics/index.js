// src/screens/medicine/medicine_specifics/index.js

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Text } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
import styles from './styles.js'; //스타일 불러오기 // 개발 규칙: stylesheet 분리
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const Medicine_specifics_screen = () => {
    const navigation = useNavigation();
    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#B7C8FF', '#EBEFFE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // 왼쪽에서 오른쪽 방향으로 설정
                style={styles.headerContainer}
            >
                <Text style={styles.koreanName}>{name}</Text>
                <Text style={styles.englishName}>{englishName}</Text>
            </LinearGradient>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
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
            </ScrollView>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>{selectedTab === 'efficacy' ? '효능' : selectedTab === 'instruction' ? '사용법' : selectedTab === 'caution' ? '주의사항' : '보관법'}</Text>
                <Text style={styles.sectionContent}>{renderContent()}</Text>
            </View>

            <View style={styles.sectionFooter}>
                <Text style={styles.footerText}>
                    H&S Biolab 데이터는 식품의약안전처에서 제공하는 국가의약품안전정보를 기준으로 제작됩니다.
                </Text>
            </View>
        </ScrollView>
    );
};

export default Medicine_specifics_screen;
