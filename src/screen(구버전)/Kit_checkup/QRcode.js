// src\screen(구버전)\Kit_checkup\QRcode.js
import React, {Fragment, useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, Linking, TouchableOpacity, Dimensions} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const QRCodeScreen = ({onPress, navigation}) => {
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const [result, setResult] = useState(null);

  const scanner = useRef(null);

  const onSuccess = e => {
    console.log('scanned data', e.data);
    setResult(e);
    setScan(false);
    setScanResult(true);
  };

  const activeQR = () => {
    setScan(true);
  };

  const scanAgain = () => {
    setScan(true);
    setScanResult(false);
  };

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ color: 'black' }}>이 화면은 /src/screen/Kit_checkup/QRcode.js 🎉</Text>
        <Text style={{ color: 'black' }}>QR코드 인식하고 링크로 이동 누르면  /src/screen/Kit_checkup/Kit_checkup3.js🎉</Text>
        <Text style={styles.textTitle}>
          Welcome To React-Native QR Code Tutorial!
        </Text>
        {!scan && !scanResult && (
          <View style={styles.cardView}>
            <TouchableOpacity onPress={activeQR} style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Click to Scan!</Text>
            </TouchableOpacity>
          </View>
        )}

        {scanResult && (
          <Fragment>
            <Text style={styles.textTitle1}>Result!</Text>
            <View style={scanResult ? styles.scanCardView : styles.cardView}>
              <Text>Type: {result.type}</Text>
              <Text>Result: {result.data}</Text>
              <Text numberOfLines={1}>RawData: {result.rawData}</Text>
              {result.data.startsWith('http') && (
                <TouchableOpacity
                  onPress={() =>
                    /*openLink(result.data)*/ 
                    navigation.navigate('Kit_checkup3')
                  }
                  style={styles.buttonTouchable}>
                  <Text style={styles.buttonTextStyle}>Open Link</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={scanAgain}
                style={styles.buttonTouchable}>
                <Text style={styles.buttonTextStyle}>Click to Scan again!</Text>
              </TouchableOpacity>
            </View>
          </Fragment>
        )}

        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            ref={scanner}
            onRead={onSuccess}
            topContent={
              <Text style={styles.centerText}>
                Go to{' '}
                <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text>{' '}
                on your computer and scan the QR code to test.
              </Text>
            }
            bottomContent={
              <View>
                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={() => scanner.current.reactivate()}>
                  <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={() => setScan(false)}>
                  <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#99003d',
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    color: 'black',
  },
  textTitle1: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    color: 'black',
  },
  cardView: {
    width: deviceWidth - 32,
    height: deviceHeight / 2,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: 'white',
  },
  scanCardView: {
    width: deviceWidth - 32,
    height: deviceHeight / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: 'white',
  },
  buttonScan: {
    width: 42,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: 'black',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: '#ff0066',
    marginTop: 32,
    width: deviceWidth - 62,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;
