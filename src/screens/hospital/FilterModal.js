import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Slider from '@react-native-community/slider';

const FilterModal = ({visible, onClose, filters, setFilters, onApply}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // filters의 초기값이 배열이 아닌 경우 처리
    setLocalFilters(prev => ({
      ...filters,
      info: Array.isArray(filters.info) ? filters.info : filters.info ? [filters.info] : [],
      grade: Array.isArray(filters.grade) ? filters.grade : filters.grade ? [filters.grade] : [],
    }));
  }, [filters]);

  // 필터 적용 핸들러
  const applyFilter = async () => {
    try {
      setIsApplying(true);
      setFilters(localFilters);
      if (onApply) {
        await onApply(localFilters);
      }
      onClose();
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // 필터 초기화 핸들러
  const resetFilters = async () => {
    const reset = {
      distance: 100,
      grade: [],
      type: '모든 병원',
      info: [],
    };
    setLocalFilters(reset);
    try {
      setIsApplying(true);
      setFilters(reset);
      if (onApply) {
        await onApply(reset);
      }
    } catch (error) {
      console.error('Error resetting filters:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // 다중 선택 필터 변경 핸들러
  const handleMultiFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const currentValues = prev[key] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [key]: newValues,
      };
    });
  };

  // 단일 선택 필터 변경 핸들러
  const handleSingleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '모든 병원': value,
    }));
  };

  // 거리 필터 변경 핸들러
  const handleDistanceChange = value => {
    setLocalFilters(prev => ({
      ...prev,
      distance: value,
    }));
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <BlurView style={styles.absolute} blurType="light" blurAmount={10} />
      <View style={styles.bottomView}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>상세 필터</Text>

          {/* 병원 종류 (단일 선택) */}
          <Text style={styles.sectionTitle}>병원 종류</Text>
          <View style={styles.buttonGroup}>
            {['모든 병원', '투석 병원', '일반 병원'].map(type => (
              <FilterButton
                key={type}
                label={type}
                selected={localFilters.type === type}
                onPress={() => handleSingleFilterChange('type', type)}
                disabled={isApplying}
              />
            ))}
          </View>

          {/* 병원 정보 (다중 선택) */}
          <Text style={styles.sectionTitle}>병원 정보</Text>
          <View style={styles.buttonGroup}>
            {['의원', '병원', '종합병원', '요양병원', '상급종합병원'].map(info => (
              <FilterButton
                key={info}
                label={info}
                selected={localFilters.info?.includes(info)}
                onPress={() => handleMultiFilterChange('info', info)}
                disabled={isApplying}
              />
            ))}
          </View>

          {/* 거리 설정 */}
          <Text style={styles.sectionTitle}>거리 설정</Text>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={0}
            maximumValue={100}
            step={20}
            value={localFilters.distance}
            onValueChange={handleDistanceChange}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#CB45FF"
            thumbImage={require('./assets/filled-circle.png')}
            disabled={isApplying}
          />
          <View style={styles.distanceLabels}>
            <Text style={styles.labelText}>5km</Text>
            <Text style={styles.labelText}>10km</Text>
            <Text style={styles.labelText}>20km</Text>
            <Text style={styles.labelText}>50km</Text>
            <Text style={styles.labelText}>100km</Text>
            <Text style={styles.labelText}>전국</Text>
          </View>

          {/* 혈액 적정성 평가 등급 (다중 선택) */}
          <Text style={styles.sectionTitle}>
            혈액 적정성 평가 등급(투석 병원)
          </Text>
          <View style={styles.GradebuttonGroup}>
            {['1등급', '2등급', '3등급', '4등급', '5등급'].map(grade => (
              <FilterButton
                key={grade}
                label={grade}
                selected={localFilters.grade?.includes(grade)}
                onPress={() => handleMultiFilterChange('grade', grade)}
                disabled={isApplying}
              />
            ))}
          </View>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={resetFilters}
              style={[styles.resetButton, isApplying && styles.disabledButton]}
              disabled={isApplying}>
              <Text style={styles.resetButtonText}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFilter}
              style={[styles.applyButton, isApplying && styles.disabledButton]}
              disabled={isApplying}>
              {isApplying ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.applyButtonText}>필터 적용</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// FilterButton 컴포넌트는 동일하게 유지
const FilterButton = ({label, selected, onPress, disabled}) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      selected && styles.selectedButton,
      disabled && styles.disabledButton,
    ]}
    onPress={onPress}
    disabled={disabled}>
    <Text
      style={[
        styles.filterButtonText,
        selected && styles.selectedButtonText,
        disabled && styles.disabledButtonText,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// styles는 동일하게 유지

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  GradebuttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    margin: 4,
  },
  filterButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  labelText: {
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  resetButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  applyButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  applyButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#E4EDFF',
    borderColor: '#2F54EB'
  },
  selectedButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
    opacity: 0.5,
  },
});

export default FilterModal;
