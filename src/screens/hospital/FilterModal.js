// src\screens\hospital\FilterModal.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Slider from '@react-native-community/slider';
import theme from '../../theme';

const width_ratio = Dimensions.get('screen').width / 390 * 0.95;
const height_ratio = Dimensions.get('screen').height / 844* 0.95;

const FilterModal = ({visible, onClose, filters, setFilters, onApply}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isApplying, setIsApplying] = useState(false);

  const distanceValues = [5, 10, 20, 50, 100, '전국'];

  useEffect(() => {
    // filters의 초기값이 배열이 아닌 경우 처리
    setLocalFilters(prev => ({
      ...filters,
      info: Array.isArray(filters.info) ? filters.info : filters.info ? [filters.info] : [],
      rating: Array.isArray(filters.rating) ? filters.rating : filters.rating ? [filters.rating] : [],
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
      distance: 20,
      rating: [],
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
      [key]: prev[key] === value ? '모든 병원' : value,
    }));
  };

  // 거리 필터 변경 핸들러
  const handleDistanceChange = value => {
    const selectedDistance = distanceValues[value];
    setLocalFilters(prev => ({
      ...prev,
      distance: selectedDistance,
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

          {/* 혈액 적정성 평가 등급 (다중 선택) */}
          <Text style={styles.sectionTitle}>
            혈액 적정성 평가 등급
          </Text>
          <View style={styles.RatingbuttonGroup}>
            {['1', '2', '3', '4', '5'].map(rating => (
              <FilterButton
                key={rating}
                label={`${rating}등급`}
                selected={localFilters.rating?.includes(rating)}
                onPress={() => handleMultiFilterChange('rating', rating)}
                disabled={isApplying}
              />
            ))}
          </View>
          <Text style={styles.infoText}>
            {'❖ '}병원 등급은 건강보험심사평가원의 2021년(7차) 혈액 적정성 평가 데이터를 기반으로 합니다.
          </Text>

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
            style={{width: '100%', height: 40 * height_ratio}}
            minimumValue={0}
            maximumValue={distanceValues.length - 1}
            step={1}
            value={distanceValues.indexOf(localFilters.distance)}
            onValueChange={handleDistanceChange}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#CB45FF"
            disabled={isApplying}
          />
          <View style={styles.distanceLabels}>
            {distanceValues.map((distance, index) => (
              <Text key={index} style={styles.labelText}>
                {distance === '전국' ? '전국' : `${distance}km`}
              </Text>
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

// 스타일 조정
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
    padding: 20 * width_ratio,
    backgroundColor: 'white',
    borderTopLeftRadius: 10 * width_ratio,
    borderTopRightRadius: 10 * width_ratio,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2 * height_ratio},
    shadowOpacity: 0.25,
    shadowRadius: 4 * width_ratio,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18 * width_ratio,
    fontWeight: 'bold',
    marginBottom: 15 * height_ratio,
    textAlign: 'center',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16 * width_ratio,
    fontWeight: 'bold',
    marginTop: 10 * height_ratio,
    marginBottom: 10 * height_ratio,
    color: '#000',
  },
  infoText:{
    fontSize: 12 * width_ratio,
    fontFamily: 'Pretendard-SemiBold',
    color: '#333333', // 원하는 색상
    textAlign: 'left', // 텍스트 정렬
    paddingHorizontal: 5 * width_ratio, // 좌우 여백
    opacity : 0.55,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10 * height_ratio,
    paddingHorizontal: 5 * width_ratio,
  },
  RatingbuttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10 * height_ratio,
  },
  filterButton: {
    paddingVertical: 8 * height_ratio,
    paddingHorizontal: 15 * width_ratio,
    backgroundColor: '#F0F0F0',
    borderRadius: 20 * width_ratio,
    margin: 4 * width_ratio,
  },
  filterButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14 * width_ratio,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5 * width_ratio,
    marginTop: 10 * height_ratio,
    marginBottom: 15 * height_ratio,
  },
  labelText: {
    marginTop: -7 * height_ratio,
    color: '#000',
    fontSize: 15 * width_ratio,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20 * height_ratio,
  },
  resetButton: {
    padding: 10 * width_ratio,
    backgroundColor: '#F0F0F0',
    borderRadius: 5 * width_ratio,
    flex: 1,
    marginRight: 10 * width_ratio,
  },
  resetButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16 * width_ratio,
  },
  applyButton: {
    padding: 10 * width_ratio,
    backgroundColor: '#007AFF',
    borderRadius: 5 * width_ratio,
    flex: 1,
    marginLeft: 10 * width_ratio,
  },
  applyButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16 * width_ratio,
  },
  selectedButton: {
    backgroundColor: '#E4EDFF',
    borderColor: '#2F54EB',
  },
  selectedButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14 * width_ratio,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#868990',
    fontFamily: 'Pretendard-Bold',
    opacity: 0.5,
    fontSize: 14 * width_ratio,
  },
});

export default FilterModal;