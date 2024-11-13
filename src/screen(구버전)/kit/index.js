// src\screen(구버전)\kit\index.js
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const KitScreen = ({onPress, navigation}) => {

  const handleKitPurchase = () => {
    Linking.openURL('https://hnsbiolab.com/device');
  };
  

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.topRow} />
            <View style={styles.secondRow} />
            <View style={styles.cardContainer}>
              <ImageBackground
                style={styles.profileImage}
                source={require('./assets/images/35dfdd72ec7b06088f1aa32a7f0e4db35347eabf.png')}
                resizeMode="cover"
              />
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>
                      키트 검사하러 가기
                    </Text>
                  </View>
                  <View style={styles.cardDate}>
                    <Text style={styles.cardDateText}>최근 검사한 날짜</Text>
                    <Text style={styles.cardDateText}>2024년 7월 23일</Text>
                  </View>
                </View>
              </View>
              <View style={styles.roundButtonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Kit_checkup1')}>
                  <View style={styles.roundButton}>
                    <View style={styles.roundButtonInner}>
                      <ImageBackground
                        style={styles.roundButtonImage}
                        source={require('./assets/images/ad153a78-1510-497d-8dad-61ee25759ee6.png')}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.storeButton} onPress={handleKitPurchase}>
                    <Image
                      style={styles.linkIcon}
                      source={require('./assets/images/1bd18327-449a-421c-a713-db8473a9045a.png')}
                    />
                  <Text style={styles.linkText}>스토어 바로가기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>결과 분석</Text>
              <View style={styles.analysisCardContainer}>
                <View style={styles.analysisCard}>
                  <View style={styles.analysisCardHeader}>
                    <Text style={styles.analysisCardHeaderText}>
                      7월 23일 검사 결과
                    </Text>
                  </View>
                  <View style={styles.analysisCardContent}>
                    <View style={styles.analysisCardRow}>
                      <View style={styles.analysisCardRowInner}>
                        <Text style={styles.analysisCardRowText}>
                          키트 검사 분석이 제공되는 곳입니다.{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>검사 결과</Text>
              <View style={styles.resultCardsContainer}>
                <View style={styles.resultCard}>
                  <View style={styles.resultCardHeader}>
                    <Text style={styles.resultCardHeaderText}>
                      혈청 크레아티닌
                    </Text>
                    <View style={styles.resultCardValueContainer}>
                      <ImageBackground
                        style={styles.resultCardValueIcon}
                        source={require('./assets/images/4928a50d-4220-47fc-a94a-ed450b37f63f.png')}
                        resizeMode="cover"
                      />
                      <Text style={styles.resultCardValueText}>0.6</Text>
                    </View>
                  </View>
                  <View style={styles.resultCardContent}>
                    <View style={styles.resultCardRow}>
                      <View style={styles.resultCardRowInner}>
                        <View style={styles.resultCardRowIconContainer}>
                          <ImageBackground
                            style={styles.resultCardRowIcon}
                            source={require('./assets/images/c9c6f018-39fe-4831-9a2d-f26bd563231c.png')}
                          />
                        </View>
                        <Text style={styles.resultCardRowText}>
                          낮을수록 신장 기능이 좋아요.
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.chartContainer}>
                    <View style={styles.chartValueContainer}>
                      <Text style={styles.chartValueText}>
                        <Text style={styles.chartValueMainText}>1.6&nbsp;</Text>
                        <Text style={styles.chartValueUnitText}>mg/dL</Text>
                      </Text>
                    </View>
                    <View style={styles.chartImageContainer}>
                      <ImageBackground
                        style={styles.chartVerticalLine}
                        source={require('./assets/images/37db7bda-b032-467f-b87e-f05acfb13afc.png')}
                        resizeMode="cover"
                      />
                      <View style={styles.chartLabelsContainer}>
                        <Text style={styles.chartLabel}>2.0</Text>
                        <Text style={styles.chartLabel}>1.6</Text>
                        <Text style={styles.chartLabel}>1.2</Text>
                        <Text style={styles.chartLabel}>0.8</Text>
                        <Text style={styles.chartLabel}>0.4</Text>
                      </View>
                      <ImageBackground
                        style={styles.chartBackground}
                        source={require('./assets/images/f57f014d-02eb-4b0a-96ca-e7a184db36dc.png')}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.chartDatesContainer}>
                      <Text style={styles.chartDate}>02.25</Text>
                      <Text style={styles.chartDateActive}>04.13</Text>
                      <Text style={styles.chartDate}>05.02</Text>
                      <Text style={styles.chartDate}>06.17</Text>
                      <Text style={styles.chartDate}>07.23</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.resultCard}>
                  <View style={styles.resultCardHeader}>
                    <Text style={styles.resultCardHeaderText}>
                      사구체여과율 (GFR)
                    </Text>
                    <View style={styles.resultCardValueContainer}>
                      <ImageBackground
                        style={styles.resultCardValueIcon}
                        source={require('./assets/images/7f5d2d5f-9e8a-4e21-9d58-c1d4597a8707.png')}
                        resizeMode="cover"
                      />
                      <Text style={styles.resultCardValueText}>5.0</Text>
                    </View>
                  </View>
                  <View style={styles.resultCardContent}>
                    <View style={styles.resultCardRow}>
                      <View style={styles.resultCardRowInner}>
                        <View style={styles.resultCardRowIconContainer}>
                          <ImageBackground
                            style={styles.resultCardRowIcon}
                            source={require('./assets/images/c7b9c806-8ac6-4051-b3f7-007855d12eca.png')}
                          />
                        </View>
                        <Text style={styles.resultCardRowText}>
                          높을수록 신장 기능이 좋아요.
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.chartContainer}>
                    <View style={styles.chartValueContainer}>
                      <Text style={styles.chartValueText}>
                        <Text style={styles.chartValueMainText}>1.6&nbsp;</Text>
                        <Text style={styles.chartValueUnitText}>mg/dL</Text>
                      </Text>
                    </View>
                    <View style={styles.chartImageContainer}>
                      <ImageBackground
                        style={styles.chartVerticalLine}
                        source={require('./assets/images/8678c6e2-30b8-445b-ae1b-5a4786ac3ccc.png')}
                        resizeMode="cover"
                      />
                      <View style={styles.chartLabelsContainer}>
                        <Text style={styles.chartLabel}>2.0</Text>
                        <Text style={styles.chartLabel}>1.6</Text>
                        <Text style={styles.chartLabel}>1.2</Text>
                        <Text style={styles.chartLabel}>0.8</Text>
                        <Text style={styles.chartLabel}>0.4</Text>
                      </View>
                      <ImageBackground
                        style={styles.chartBackground}
                        source={require('./assets/images/7d7678a1-2f4d-4f7d-8140-552a8493f59f.png')}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.chartDatesContainer}>
                      <Text style={styles.chartDate}>02.25</Text>
                      <Text style={styles.chartDateActive}>04.13</Text>
                      <Text style={styles.chartDate}>05.02</Text>
                      <Text style={styles.chartDate}>06.17</Text>
                      <Text style={styles.chartDate}>07.23</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  storeButton:{
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: '50%',
  },
  linkTouchable: {
    position: 'absolute',
    top: 163,
    left: 0.5,
    zIndex: 20, // Ensure this is higher than overlapping elements
  },
  linkContainer: {
    display: 'flex',
    width: 325,
    height: 24,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    // Removed position: 'absolute' and zIndex from here
  },
  cardIcon: {
    width: 16,
    height: 16,
    marginLeft: 123.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  // Ensure overlapping elements have lower zIndex or pointerEvents set to 'none'
  overlappingElement: {
    zIndex: 10, // Lower than linkTouchable
    // Or add pointerEvents: 'none',
  },
  container: {
    width: 390,
    height: 1355,
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  innerContainer: {
    display: 'flex',
    width: 333,
    height: 203,
    alignItems: 'center',
    flexWrap: 'nowrap',
    position: 'relative',
    marginTop: -20, // 기존 96에서 80으로 수정
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 29,
  },
  topRow: {
    display: 'flex',
    width: 333,
    height: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  secondRow: {
    display: 'flex',
    width: 333,
    height: 17,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  cardContainer: {
    width: 326,
    height: 229,
    flexShrink: 0,
    position: 'relative',
    zIndex: 3,
  },
  profileImage: {
    width: 125,
    height: 125,
    position: 'absolute',
    top: 10,
    left: 155,
    zIndex: 11,
  },
  card: {
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
    zIndex: 4,
  },
  cardContent: {
    display: 'flex',
    gap: 4,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 5,
  },
  cardHeader: {
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
    zIndex: 6,
  },
  cardHeaderText: {
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
    lineHeight: 27,
    color: '#353535',
    position: 'relative',
    textAlign: 'left',
    zIndex: 7,
  },
  cardDate: {
    width: '90%',
    height: 28,
    flexShrink: 0,
    position: 'relative',
    zIndex: 8,
  },
  cardDateText: {
    height: 'auto',
    weight: '100%',
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#545359',
    position: 'relative',
    textAlign: 'left',
    zIndex: 9,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  roundButtonContainer: {
    width: 71.646,
    height: 70,
    position: 'absolute',
    top: 117.315,
    left: 264.354,
    zIndex: 12,
  },
  roundButton: {
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
    zIndex: 13,
    marginTop: -38.315,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: -32.354,
  },
  roundButtonInner: {
    width: 25.846,
    height: 25.846,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 14,
  },
  roundButtonImage: {
    width: 8.274,
    height: 17.231,
    position: 'relative',
    zIndex: 15,
    marginTop: 4.308,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 10.034,
  },
  linkContainer: {
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
    zIndex: 16,
  },
  linkIconContainer: {
    width: 24,
    height: 24,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 17,
  },
  linkIcon: {
    width: 19.5,
    height: 18,
    position: 'relative',
    zIndex: 18,
    marginTop: 3,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 2.25,
  },
  linkText: {
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
    marginLeft: '2%',
    marginTop: '0.6%',
    zIndex: 19,
  },
  cardIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 167,
    left: 123.5,
    overflow: 'hidden',
    zIndex: 20,
  },
  analysisContainer: {
    width: 326,
    height: 140,
    flexShrink: 0,
    position: 'relative',
    zIndex: 21,
  },
  analysisTitle: {
    height: 21,
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
    color: '#5d5d62',
    position: 'relative',
    textAlign: 'left',
    zIndex: 22,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 1,
  },
  analysisCardContainer: {
    display: 'flex',
    width: 326,
    gap: 12,
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 23,
    marginTop: 18,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  analysisCard: {
    display: 'flex',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 24,
  },
  analysisCardHeader: {
    display: 'flex',
    width: 124,
    height: 24,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 25,
  },
  analysisCardHeaderText: {
    height: 28,
    width: width * 0.7,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    color: '#5d5d62',
    position: 'relative',
    textAlign: 'left',
    zIndex: 26,
  },
  analysisCardContent: {
    display: 'flex',
    width: 171,
    height: 17,
    gap: 8,
    alignItems: 'flex-start',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 27,
  },
  analysisCardRow: {
    display: 'flex',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 24,
    paddingLeft: 0,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 28,
  },
  analysisCardRowInner: {
    display: 'flex',
    width: 171,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 29,
  },
  analysisCardRowText: {
    height: 18,
    width: width * 0.7,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
    color: '#72777a',
    position: 'relative',
    textAlign: 'left',
    zIndex: 30,
  },
  resultsContainer: {
    display: 'flex',
    width: 326,
    paddingTop: 30, // 기존 66에서 50으로 수정
    paddingRight: 0,
    paddingBottom: 60,
    paddingLeft: 0,
    gap: 18,
    alignItems: 'flex-start',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 31,
  },
  resultsTitle: {
    height: 21,
    alignSelf: 'stretch',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
    color: '#5d5d62',
    position: 'relative',
    textAlign: 'left',
    zIndex: 32,
  },
  resultCardsContainer: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 33,
  },
  resultCard: {
    display: 'flex',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 34,
  },
  resultCardHeader: {
    display: 'flex',
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 35,
  },
  resultCardHeaderText: {
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
    zIndex: 36,
  },
  resultCardValueContainer: {
    display: 'flex',
    width: 53,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 37,
  },
  resultCardValueIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 38,
  },
  resultCardValueText: {
    height: 16,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'left',
    zIndex: 39,
  },
  resultCardContent: {
    display: 'flex',
    width: 171,
    height: 17,
    gap: 8,
    alignItems: 'flex-start',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 40,
  },
  resultCardRow: {
    display: 'flex',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 24,
    paddingLeft: 0,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 41,
  },
  resultCardRowInner: {
    display: 'flex',
    width: 171,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 42,
  },
  resultCardRowIconContainer: {
    width: 18,
    height: 18,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 43,
  },
  resultCardRowIcon: {
    width: 15,
    height: 15,
    position: 'relative',
    zIndex: 44,
    marginTop: 1.5,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 1.5,
  },
  resultCardRowText: {
    height: 16,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'left',
    zIndex: 45,
  },
  chartContainer: {
    width: 282,
    height: 182,
    flexShrink: 0,
    position: 'relative',
    zIndex: 46,
  },
  chartValueContainer: {
    display: 'flex',
    width: 61,
    height: 34,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    position: 'relative',
    zIndex: 61,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 68.5,
  },
  chartValueText: {
    width: 48,
    height: 16,
    flexShrink: 0,
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    position: 'absolute',
    top: 9,
    left: 6.548,
    textAlign: 'center',
    zIndex: 62,
  },
  chartValueMainText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#303437',
    position: 'relative',
    textAlign: 'center',
  },
  chartValueUnitText: {
    fontFamily: 'Pretendard Variable',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 16,
    color: '#303437',
    position: 'relative',
    textAlign: 'center',
  },
  chartImageContainer: {
    width: 277.883,
    height: 134,
    position: 'relative',
    zIndex: 60,
    marginTop: -6,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  chartVerticalLine: {
    width: 11.321,
    height: 132,
    position: 'absolute',
    top: 0,
    left: 92.628,
    zIndex: 60,
  },
  chartLabelsContainer: {
    display: 'flex',
    width: 31.905,
    height: 120,
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 0,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 47,
  },
  chartLabel: {
    display: 'flex',
    width: 18,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'center',
    zIndex: 48,
  },
  chartBackground: {
    width: 231.569,
    height: 124,
    position: 'absolute',
    top: 10,
    left: 46.314,
    zIndex: 53,
  },
  chartDatesContainer: {
    display: 'flex',
    width: 250.095,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 54,
    marginTop: -4,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 31.905,
  },
  chartDate: {
    display: 'flex',
    width: 33,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#72777a',
    position: 'relative',
    textAlign: 'center',
    zIndex: 55,
  },
  chartDateActive: {
    display: 'flex',
    width: 30,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    color: '#0070f0',
    position: 'relative',
    textAlign: 'center',
    zIndex: 56,
  },
  footerImage: {
    width: 148,
    height: 5,
    position: 'relative',
    zIndex: 93,
    marginTop: 1043,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 121,
  },
});

export default KitScreen;
