// src\screen(구버전)\src\index.js
import {NativeModules, Platform} from 'react-native';

const {RNNaverLogin} = NativeModules;

const printWarning = message => {
  console.warn(`['RNNaverLogin'] ${message}`);
};

const initialize = ({
  appName,
  consumerKey,
  consumerSecret,
  disableNaverAppAuthIOS = false,
  serviceUrlSchemeIOS = '',
}) => {
  if (Platform.OS === 'ios') {
    if (!serviceUrlSchemeIOS) {
      printWarning('serviceUrlSchemeIOS is missing in iOS initialize.');
      return;
    }
    RNNaverLogin.initialize(
      serviceUrlSchemeIOS,
      consumerKey,
      consumerSecret,
      appName,
      disableNaverAppAuthIOS,
    );
  } else if (Platform.OS === 'android') {
    RNNaverLogin.initialize(consumerKey, consumerSecret, appName);
  }
};

const login = () => {
  return RNNaverLogin.login();
};

const logout = async () => {
  await RNNaverLogin.logout();
};

const deleteToken = async () => {
  await RNNaverLogin.deleteToken();
};

const getProfile = token => {
  return fetch('https://openapi.naver.com/v1/nid/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(err => {
      console.log('getProfile err');
      console.log(err);
    });
};

const NaverLogin = {
  initialize,
  login,
  logout,
  deleteToken,
  getProfile,
};
export default NaverLogin;
