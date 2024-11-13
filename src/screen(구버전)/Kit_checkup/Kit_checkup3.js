// src\screen(구버전)\Kit_checkup\Kit_checkup3.js
import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    // 뒤로 가기 동작을 막는 리스너 설정
    const beforeRemoveListener = navigation.addListener('beforeRemove', e => {
      // 뒤로 가기 동작을 막기
      e.preventDefault();

      // 경고창을 띄워서 뒤로 가기 방지
      Alert.alert('경고', '이 화면에서는 뒤로 갈 수 없습니다.', [
        {text: '확인', style: 'cancel'}, // 확인 버튼만 있는 경고창
      ]);
    });

    return () => {
      // 컴포넌트가 언마운트될 때 리스너를 제거
      navigation.removeListener('beforeRemove', beforeRemoveListener);
    };
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <ImageBackground
                style={styles.imageBackground}
                source={require('./assets/images/35dfdd72ec7b06088f1aa32a7f0e4db35347eabf.png')}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <View style={styles.textSubContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText} numberOfLines={1}>
                      키트 검사하러 가기
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateLabelText} numberOfLines={1}>
                      최근 검사한 날짜
                    </Text>
                    <Text style={styles.dateText} numberOfLines={1}>
                      2024년 7월 23일
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <ImageBackground
                    style={styles.iconImage}
                    source={require('./assets/images/f1ac211d-4dde-4c31-aa1a-8e16cd96d7ff.png')}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <View style={styles.storeContainer}>
                <View style={styles.storeIconContainer}>
                  <ImageBackground
                    style={styles.storeIconImage}
                    source={require('./assets/images/102dcb5c-c0cf-4cc8-b7ff-86c27b376b2e.png')}
                  />
                </View>
                <Text style={styles.storeText} numberOfLines={1}>
                  스토어 바로가기
                </Text>
              </View>
              <ImageBackground
                style={styles.smallImage}
                source={require('./assets/images/6fec72ca-5171-4d56-a741-6bb21f5531d9.png')}
                resizeMode="cover"
              />
            </View>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                결과 분석
              </Text>
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultHeaderText}>
                    <View style={styles.resultHeaderIconContainer}>
                      <ImageBackground
                        style={styles.resultHeaderIcon}
                        source={require('./assets/images/9d79393a-a7ff-4f2b-bc79-6a6ad86b0493.png')}
                      />
                    </View>
                    <Text
                      style={styles.resultHeaderTextContent}
                      numberOfLines={1}>
                      7월 23일 검사 결과
                    </Text>
                  </View>
                  <View style={styles.resultWarningContainer}>
                    <Text style={styles.resultWarningText} numberOfLines={1}>
                      주의
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultDescription}>
                  신장 기능이 지난 검사 때보다 저하되었어요. 현재 만성신장질환의
                  초기 단계일 수 있으므로 빠른 시일 내에 병원에 방문하여
                  신장전문의에게 상담을 받아보세요. 적절한 관리로 진행을 늦출 수
                  있으므로 조기 대응이 중요해요.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 390,
    height: 844,
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  contentContainer: {
    display: 'flex',
    width: 333,
    height: 203,
    alignItems: 'center',
    flexWrap: 'nowrap',
    position: 'relative',
    marginTop: 16,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 29,
  },
  imageContainer: {
    width: 326,
    height: 229,
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  },
  imageBackground: {
    width: 125,
    height: 125,
    position: 'absolute',
    top: 10,
    left: 155,
    zIndex: 9,
  },
  textContainer: {
    display: 'flex',
    width: 326,
    height: 128,
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 20,
    paddingLeft: 24,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    backgroundColor: '#efe8ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'absolute',
    top: 19,
    left: 0,
    zIndex: 2,
  },
  textSubContainer: {
    display: 'flex',
    gap: 4,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 3,
  },
  titleContainer: {
    display: 'flex',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 12,
    paddingLeft: 0,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 4,
  },
  titleText: {
    display: 'flex',
    width: 172,
    height: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: '#353535',
    position: 'relative',
    textAlign: 'left',
    zIndex: 5,
  },
  dateContainer: {
    width: 88,
    height: 28,
    flexShrink: 0,
    fontSize: 0,
    position: 'relative',
    zIndex: 6,
  },
  dateLabelText: {
    height: 18,
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#545359',
    position: 'relative',
    textAlign: 'left',
    zIndex: 7,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  dateText: {
    height: 18,
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    color: '#545359',
    position: 'relative',
    textAlign: 'left',
    zIndex: 8,
    marginTop: 4,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  iconContainer: {
    width: 71.646,
    height: 70,
    position: 'absolute',
    top: 117.315,
    left: 264.354,
    zIndex: 10,
  },
  iconBackground: {
    display: 'flex',
    width: 83,
    height: 56,
    paddingTop: 10.769,
    paddingRight: 10.769,
    paddingBottom: 10.769,
    paddingLeft: 10.769,
    flexDirection: 'row',
    gap: 10.769,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#ccaeea',
    borderTopLeftRadius: 39.846,
    borderTopRightRadius: 39.846,
    borderBottomRightRadius: 39.846,
    borderBottomLeftRadius: 39.846,
    position: 'relative',
    zIndex: 11,
    marginTop: -38.315,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: -32.354,
  },
  iconImage: {
    width: 8.274,
    height: 17.231,
    position: 'relative',
    zIndex: 13,
    marginTop: 4.308,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 10.034,
  },
  storeContainer: {
    display: 'flex',
    width: 325,
    height: 24,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'nowrap',
    position: 'absolute',
    top: 163,
    left: 0.5,
    overflow: 'hidden',
    zIndex: 14,
  },
  storeIconContainer: {
    width: 24,
    height: 24,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 15,
  },
  storeIconImage: {
    width: 19.5,
    height: 18,
    position: 'relative',
    zIndex: 16,
    marginTop: 3,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 2.25,
  },
  storeText: {
    height: 16,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'left',
    zIndex: 17,
  },
  smallImage: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 167,
    left: 123.5,
    overflow: 'hidden',
    zIndex: 18,
  },
  resultContainer: {
    width: 326,
    height: 233,
    flexShrink: 0,
    fontSize: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 19,
  },
  resultTitle: {
    height: 21,
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
    color: '#5d5d62',
    position: 'relative',
    textAlign: 'left',
    zIndex: 29,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 1,
  },
  resultContent: {
    display: 'flex',
    width: 326,
    height: 194,
    paddingTop: 32,
    paddingRight: 24,
    paddingBottom: 32,
    paddingLeft: 24,
    gap: 24,
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 20,
    marginTop: 18,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  resultHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 21,
  },
  resultHeaderText: {
    display: 'flex',
    width: 183.374,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 22,
  },
  resultHeaderIconContainer: {
    width: 24,
    height: 24,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 23,
  },
  resultHeaderIcon: {
    width: 18.75,
    height: 19.5,
    position: 'relative',
    zIndex: 24,
    marginTop: 3,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 3.75,
  },
  resultHeaderTextContent: {
    height: 24,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#5d5d62',
    position: 'relative',
    textAlign: 'left',
    zIndex: 25,
  },
  resultWarningContainer: {
    display: 'flex',
    width: 52.896,
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 12,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ffecec',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 26,
  },
  resultWarningText: {
    height: 24,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
    color: '#ea4447',
    position: 'relative',
    textAlign: 'left',
    zIndex: 27,
  },
  resultDescription: {
    display: 'flex',
    width: 268,
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 0,
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'left',
    zIndex: 28,
  },
  footerImage: {
    width: 148,
    height: 5,
    position: 'relative',
    zIndex: 33,
    marginTop: 532,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 121,
  },
});
