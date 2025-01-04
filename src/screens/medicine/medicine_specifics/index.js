import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import styles from './styles.js';

/**
 * 의약품 상세 정보를 보여주는 화면
 * @param {object} route - 상위에서 전달받은 파라미터(name, englishName 등)
 */
const MedicineSpecificsScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    name,
    englishName,
    efficacy,
    instruction,
    caution,
    sotrageInstruction,
  } = route.params;

  // 현재 선택된 탭 상태
  const [selectedTab, setSelectedTab] = useState('efficacy');

  // 탭에 따라 표시될 내용을 결정하는 함수
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

  // 탭마다 헤더에 표시할 텍스트
  const getTabTitle = () => {
    switch (selectedTab) {
      case 'efficacy':
        return '효능';
      case 'instruction':
        return '사용법';
      case 'caution':
        return '주의사항';
      case 'storage':
        return '보관법';
      default:
        return '';
    }
  };

  return (
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

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'efficacy' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('efficacy')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'efficacy' && styles.activeTabText,
            ]}
          >
            효능
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'instruction' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('instruction')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'instruction' && styles.activeTabText,
            ]}
          >
            사용법
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'caution' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('caution')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'caution' && styles.activeTabText,
            ]}
          >
            주의사항
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'storage' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('storage')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'storage' && styles.activeTabText,
            ]}
          >
            보관법
          </Text>
        </TouchableOpacity>
      </View>

      {/* 상세 정보 영역 */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>{getTabTitle()}</Text>
        <Text style={styles.sectionContent}>{renderContent()}</Text>
      </View>

      {/* 푸터 영역 */}
      <View style={styles.sectionFooter}>
        <Text style={styles.footerText}>
          H&S Biolab 데이터는 식품의약안전처가 제공한 2020년도 e약은요 자료와
          2021년도 의약품 제품 허가정보를 기반으로 제공됩니다.
        </Text>
      </View>
    </ScrollView>
  );
};

export default MedicineSpecificsScreen;
