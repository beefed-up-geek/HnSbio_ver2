import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const scaleWidth = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const scaleHeight = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: 390 * scaleWidth,
    height: 844 * scaleHeight,
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: theme.colors.White,
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
    backgroundColor: theme.colors.White,
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
    paddingHorizontal: 24 * scaleWidth,
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
    fontSize: 16 * scaleWidth,
    lineHeight: 20 * scaleHeight,
    color: theme.colors.Black,
    textAlign: 'left',
    zIndex: 9,
    ...theme.fonts.Medium,
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
    paddingHorizontal: 24 * scaleWidth,
    paddingBottom: 30 * scaleHeight,
    gap: 10 * scaleHeight,
    alignItems: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
    backgroundColor: theme.colors.White,
    borderRadius: 24 * scaleWidth,
    position: 'absolute',
    marginTop: 40,
    left: 0,
    zIndex: 32,
  },
  mainContentTitle: {
    height: 21 * scaleHeight,
    fontSize: 18 * scaleWidth,
    lineHeight: 21 * scaleHeight,
    color: theme.colors.textGray,
    textAlign: 'left',
    zIndex: 33,
    ...theme.fonts.SemiBold,
  },
  tipsWrapper: {
    display: 'flex',
    paddingTop: 24 * scaleHeight,
    paddingBottom: 40 * scaleHeight,
    gap: 8 * scaleHeight,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    position: 'relative',
    zIndex: 34,
  },
  tip: {
    display: 'flex',
    paddingVertical: 12 * scaleHeight,
    paddingHorizontal: 10 * scaleWidth,
    flexDirection: 'row',
    gap: 10 * scaleWidth,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.lightGray,
    borderRadius: 13 * scaleWidth,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 35,
  },
  tipIcon: {
    width: 19.5 * scaleWidth,
    height: 19.5 * scaleWidth,
    position: 'relative',
    zIndex: 37,
    marginTop: 2.25 * scaleHeight,
    marginLeft: 2.25 * scaleWidth,
  },
  tipText: {
    width: 230 * scaleWidth,
    fontSize: 14 * scaleWidth,
    lineHeight: 20 * scaleHeight,
    color: theme.colors.textGray,
    textAlign: 'center',
    zIndex: 38,
    flexWrap: 'wrap',
    ...theme.fonts.Regular,
  },
  confirmButton: {
    width: 166 * scaleWidth,
    paddingVertical: 12 * scaleHeight,
    paddingHorizontal: 40 * scaleWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 48 * scaleWidth,
    zIndex: 55,
  },
  confirmButtonText: {
    fontSize: 14 * scaleWidth,
    lineHeight: 18 * scaleHeight,
    color: theme.colors.mainBlue,
    textAlign: 'center',
    textTransform: 'uppercase',
    zIndex: 57,
    ...theme.fonts.Bold,
  },
  footerSpacer: {
    height: 110 * scaleHeight,
    backgroundColor: theme.colors.White,
    zIndex: 12,
  },
  footer: {
    width: 327 * scaleWidth,
    paddingVertical: 10 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.White,
    borderRadius: 24 * scaleWidth,
    zIndex: 15,
  },
  footerIconText: {
    fontSize: 14 * scaleWidth,
    lineHeight: 20 * scaleHeight,
    color: theme.colors.White,
    textAlign: 'center',
    ...theme.fonts.Bold,
    zIndex: 24,
  },
  iconContainer: {
    width: 50 * scaleWidth,
    height: 50 * scaleHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25 * scaleWidth,
    margin: 5 * scaleWidth,
  },
  iconImage: {
    width: 40 * scaleWidth,
    height: 40 * scaleHeight,
    borderRadius: 20 * scaleWidth,
  },
  iconText: {
    fontSize: 14 * scaleWidth,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;
