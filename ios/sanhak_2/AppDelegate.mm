#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>
#import <React/RCTLinkingManager.h>
#import <RNCKakaoUser/RNCKakaoUserUtil.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 기존의 React Native 초기화 코드
  self.moduleName = @"sanhak_2";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// 네이버 로그인 콜백 처리를 위한 메서드 추가
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // 네이버 로그인 URL Scheme으로 시작하는지 확인
  if ([url.scheme isEqualToString:@"com.apple"]) {
    return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
  }
  // 카카오 로그인 URL Scheme 처리
  if([RNCKakaoUserUtil isKakaoTalkLoginUrl:url]) {
    return [RNCKakaoUserUtil handleOpenUrl:url];
  }

  // 기타 다른 URL 처리
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
