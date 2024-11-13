// src\components\ModalComponent\styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../theme'; // Adjust the path to your theme file

const width_ratio = Dimensions.get('screen').width / 390;
const height_ratio = Dimensions.get('screen').height / 844;

const styles = StyleSheet.create({
  modalVisibleBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24 * width_ratio,
    paddingTop: 24 * height_ratio,
    paddingBottom: 40 * height_ratio,
  },
  modalTitle: {
    color: '#49494F',
    fontSize: 18,
    ...theme.fonts.SemiBold,
    textAlign: 'center',
    marginBottom: 32 * height_ratio,
  },
  inputContainer: {
    marginBottom: 18 * height_ratio,
  },
  inputLabel: {
    ...theme.fonts.Medium,
    fontSize: 14,
    color: '#505054',
    marginBottom: 8 * height_ratio,
  },
  textInput: {
    ...theme.fonts.Regular,
    backgroundColor: '#F1F1F1',
    borderRadius: 18,
    paddingVertical: 15 * width_ratio,
    paddingHorizontal: 24 * width_ratio,
    fontSize: 14,
    color: '#49494F',
  },
  modalSaveButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20 * height_ratio,
  },
  saveButton: {
    width: '60%',
    backgroundColor: '#EBEFFE',
    borderRadius: 24,
    paddingVertical: 15 * height_ratio,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.fonts.SemiBold,
    fontSize: 15,
    color: '#7596FF',
  },
});

export default styles;
