// src\screen(구버전)\Kit_checkup\index.js
import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
const scaleWidth = width / 390;
const scaleHeight = height / 844;

const Kit_checkupScreen1 = ({navigation, onPress}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // 페이드인 페이드아웃 애니메이션 설정
    opacity.value = withRepeat(
      withTiming(0, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1, // 무한 반복
      true, // 요요 효과 (반대로 애니메이션 반복)
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ImageBackground
                style={styles.headerLeftIcon}
                source={require('./assets/images/2965bb04-fa93-4fc2-af21-da51b8a4fe33.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              소변 검사 가이드
            </Text>
            <View style={styles.headerRightIconWrapper}>
              <ImageBackground
                style={styles.headerRightIcon}
                source={require('./assets/images/ff5c89e1-1e02-48ca-a40a-324811996b44.png')}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.mainContentTitle} numberOfLines={1}>
              검사하기 전에 참고하세요!
            </Text>
            <View style={styles.tipsWrapper}>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/4c4569cb-5e5c-47bc-8d48-48e0b3e3d6f7.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  아침의 첫 소변이 가장 정확도가 높아요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/c6a4ae25-be3c-457f-a4fe-568dd7bceca6.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  검사 전에는 비타민을 섭취하면 안 돼요.&nbsp;
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/79cccc81-c921-4288-8914-4da2b2f4475c.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  임신 중이나 생리 중에는 검사 결과가 부정확해요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/44ed877c-47cd-4ce1-94b7-494684c8cac7.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  검사 전에 과도한 물 섭취는 피하세요.
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipIconWrapper}>
                  <ImageBackground
                    style={styles.tipIcon}
                    source={require('./assets/images/fd75ea69-03eb-47f1-82a0-721c3defcb73.png')}
                  />
                </View>
                <Text style={styles.tipText} numberOfLines={1}>
                  60분 이내에 촬영하세요.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => navigation.navigate('Kit_checkup2')}>
              <Animated.View
                style={[styles.confirmButtonTextWrapper, animatedStyle]}>
                <Text style={styles.confirmButtonText} numberOfLines={1}>
                  확인했어요
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.footerSpacer} />
          <View style={styles.footer}>
            <View style={styles.footerIconsWrapper}>
              <View style={styles.footerIconWrapper}>
                <View style={styles.footerIconBackground}>
                  <View style={styles.footerIconImageWrapper}>
                    <ImageBackground
                      style={styles.footerIconImage}
                      source={require('./assets/images/b86dfc01-3441-4689-8f2d-c7386a7d1669.png')}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.footerIconButton}>
                <View style={styles.footerIconWrapper}>
                  <ImageBackground
                    style={styles.footerIconImage}
                    source={require('./assets/images/5020e8c8-66ca-4247-9aa9-e67addbc6044.png')}
                  />
                </View>
                <Text style={styles.footerIconText} numberOfLines={1}>
                  키트 결과
                </Text>
              </View>
              <View style={styles.footerIconWrapper}>
                <View style={styles.footerIconImageWrapper}>
                  <ImageBackground
                    style={styles.footerIconImage}
                    source={require('./assets/images/bce61a0e-da28-493b-b63b-a6fc6e15c776.png')}
                  />
                </View>
              </View>
              <View style={styles.footerIconWrapper}>
                <ImageBackground
                  style={styles.footerIconImage}
                  source={require('./assets/images/d274c04b-d15c-4fdf-85ba-6a02b0e0cc10.png')}
                />
              </View>
              <View style={styles.footerIconWrapper}>
                <ImageBackground
                  style={styles.footerIconImage}
                  source={require('./assets/images/0facc259-9130-4b57-bb25-eedd26f6442b.png')}
                />
              </View>
            </View>
          </View>
          <ImageBackground
            style={styles.footerImage}
            source={require('./assets/images/a1b5eba3-e8ae-4071-9dec-cbebd3c9cdc4.png')}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Kit_checkupScreen1;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: 390 * scaleWidth,
    height: 844 * scaleHeight,
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  statusBar: {
    height: 44 * scaleHeight,
    alignSelf: 'stretch',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  statusBarLeftIcon: {
    width: 28.426 * scaleWidth,
    height: 11.089 * scaleHeight,
    position: 'absolute',
    top: 16 * scaleHeight,
    left: 33.454 * scaleWidth,
    zIndex: 5,
  },
  statusBarLeftIconImage: {
    width: 28.426 * scaleWidth,
    height: 11.089 * scaleHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 6,
  },
  statusBarRightIcons: {
    width: 66.661 * scaleWidth,
    height: 11.336 * scaleHeight,
    position: 'absolute',
    top: 16.163 * scaleHeight,
    left: 308.667 * scaleWidth,
    zIndex: 1,
  },
  statusBarRightIcon1: {
    width: '22.91%',
    height: '96.73%',
    position: 'absolute',
    top: 0,
    left: '33.04%',
    zIndex: 3,
  },
  statusBarRightIcon2: {
    width: 24.328 * scaleWidth,
    height: 11.333 * scaleHeight,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  statusBarRightIcon3: {
    width: '25.5%',
    height: '94.1%',
    position: 'absolute',
    top: '2.96%',
    left: 0,
    zIndex: 4,
  },
  header: {
    display: 'flex',
    height: 68 * scaleHeight,
    paddingTop: 24 * scaleHeight,
    paddingRight: 24 * scaleWidth,
    paddingBottom: 24 * scaleHeight,
    paddingLeft: 24 * scaleWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 7,
  },
  headerLeftIcon: {
    width: 20 * scaleWidth,
    height: 20 * scaleWidth,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 8,
  },
  headerTitle: {
    height: 20 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 16 * scaleWidth,
    fontWeight: '600',
    lineHeight: 20 * scaleHeight,
    color: '#000000',
    position: 'relative',
    textAlign: 'left',
    zIndex: 9,
  },
  headerRightIconWrapper: {
    display: 'flex',
    width: 20 * scaleWidth,
    flexDirection: 'row',
    gap: 8 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 10,
  },
  headerRightIcon: {
    width: 20 * scaleWidth,
    height: 20 * scaleWidth,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 11,
  },
  mainContent: {
    display: 'flex',
    width: 390 * scaleWidth,
    height: 593 * scaleHeight,
    paddingTop: 40 * scaleHeight,
    paddingRight: 24 * scaleWidth,
    paddingBottom: 30 * scaleHeight,
    paddingLeft: 24 * scaleWidth,
    gap: 10 * scaleHeight,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24 * scaleWidth,
    borderTopRightRadius: 24 * scaleWidth,
    borderBottomRightRadius: 24 * scaleWidth,
    borderBottomLeftRadius: 24 * scaleWidth,
    position: 'absolute',
    top: 112 * scaleHeight,
    left: 0,
    zIndex: 32,
  },
  mainContentTitle: {
    height: 21 * scaleHeight,
    alignSelf: 'stretch',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 18 * scaleWidth,
    fontWeight: '600',
    lineHeight: 21 * scaleHeight,
    color: '#49494f',
    position: 'relative',
    textAlign: 'left',
    zIndex: 33,
  },
  tipsWrapper: {
    display: 'flex',
    paddingTop: 24 * scaleHeight,
    paddingRight: 0,
    paddingBottom: 40 * scaleHeight,
    paddingLeft: 0,
    gap: 8 * scaleHeight,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 34,
  },
  tip: {
    display: 'flex',
    paddingTop: 12 * scaleHeight,
    paddingRight: 10 * scaleWidth,
    paddingBottom: 12 * scaleHeight,
    paddingLeft: 10 * scaleWidth,
    flexDirection: 'row',
    gap: 10 * scaleWidth,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 13 * scaleWidth,
    borderTopRightRadius: 13 * scaleWidth,
    borderBottomRightRadius: 13 * scaleWidth,
    borderBottomLeftRadius: 13 * scaleWidth,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 35,
  },
  tipIconWrapper: {
    width: 24 * scaleWidth,
    height: 24 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 36,
  },
  tipIcon: {
    width: 19.5 * scaleWidth,
    height: 19.5 * scaleWidth,
    position: 'relative',
    zIndex: 37,
    marginTop: 2.25 * scaleHeight,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 2.25 * scaleWidth,
  },
  tipText: {
    display: 'flex',
    width: 270 * scaleWidth,
    height: 18 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 12 * scaleWidth,
    fontWeight: '400',
    lineHeight: 18 * scaleHeight,
    color: '#49494f',
    position: 'relative',
    textAlign: 'center',
    zIndex: 38,
  },
  confirmButton: {
    display: 'flex',
    width: 166 * scaleWidth,
    paddingTop: 12 * scaleHeight,
    paddingRight: 40 * scaleWidth,
    paddingBottom: 12 * scaleHeight,
    paddingLeft: 40 * scaleWidth,
    flexDirection: 'row',
    gap: 10 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ebeffe',
    borderTopLeftRadius: 48 * scaleWidth,
    borderTopRightRadius: 48 * scaleWidth,
    borderBottomRightRadius: 48 * scaleWidth,
    borderBottomLeftRadius: 48 * scaleWidth,
    position: 'relative',
    zIndex: 55,
  },
  confirmButtonTextWrapper: {
    width: 86 * scaleWidth,
    height: 18 * scaleHeight,
    justifyContent: 'center', // 중앙 정렬 추가
    alignItems: 'center', // 중앙 정렬 추가
    flexShrink: 0,
    position: 'relative',
    zIndex: 56,
  },
  confirmButtonText: {
    fontFamily: 'DM Sans',
    fontSize: 14 * scaleWidth,
    fontWeight: '700',
    lineHeight: 18 * scaleHeight,
    color: '#7595ff',
    letterSpacing: 0.56 * scaleWidth,
    textAlign: 'center',
    textTransform: 'uppercase',
    zIndex: 57,
  },

  footerSpacer: {
    height: 110 * scaleHeight,
    alignSelf: 'stretch',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    position: 'relative',
    zIndex: 12,
  },
  footer: {
    display: 'flex',
    width: 327 * scaleWidth,
    paddingTop: 10 * scaleHeight,
    paddingRight: 0,
    paddingBottom: 10 * scaleHeight,
    paddingLeft: 0,
    gap: 4 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24 * scaleWidth,
    borderTopRightRadius: 24 * scaleWidth,
    borderBottomRightRadius: 24 * scaleWidth,
    borderBottomLeftRadius: 24 * scaleWidth,
    position: 'relative',
    zIndex: 15,
  },
  footerIconsWrapper: {
    display: 'flex',
    width: 307 * scaleWidth,
    flexDirection: 'row',
    gap: 24 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    zIndex: 16,
  },
  footerIconWrapper: {
    width: 24 * scaleWidth,
    height: 24 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    zIndex: 17,
  },
  footerIconBackground: {
    width: 24 * scaleWidth,
    height: 24 * scaleHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 18,
  },
  footerIconImageWrapper: {
    width: 20.98 * scaleWidth,
    height: 20.528 * scaleHeight,
    position: 'relative',
    zIndex: 19,
    marginTop: 2 * scaleHeight,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 1.51 * scaleWidth,
  },
  footerIconImage: {
    width: '107.15%',
    height: '107.31%',
    position: 'absolute',
    top: '-3.65%',
    left: '-3.57%',
    zIndex: 20,
  },
  footerIconButton: {
    display: 'flex',
    width: 108 * scaleWidth,
    paddingTop: 10 * scaleHeight,
    paddingRight: 12 * scaleWidth,
    paddingBottom: 10 * scaleHeight,
    paddingLeft: 12 * scaleWidth,
    flexDirection: 'row',
    gap: 8 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: '#303437',
    borderTopLeftRadius: 48 * scaleWidth,
    borderTopRightRadius: 48 * scaleWidth,
    borderBottomRightRadius: 48 * scaleWidth,
    borderBottomLeftRadius: 48 * scaleWidth,
    position: 'relative',
    zIndex: 21,
  },
  footerIconText: {
    height: 20 * scaleHeight,
    flexShrink: 0,
    flexBasis: 'auto',
    fontFamily: 'Pretendard Variable',
    fontSize: 14 * scaleWidth,
    fontWeight: '700',
    lineHeight: 20 * scaleHeight,
    color: '#f2f3f4',
    position: 'relative',
    textAlign: 'left',
    zIndex: 24,
  },
  footerImage: {
    width: 148 * scaleWidth,
    height: 5 * scaleHeight,
    flexShrink: 0,
    position: 'relative',
    zIndex: 14,
  },
});
