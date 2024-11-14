// src\screens\health_checkup\authentication_2\styles.js
import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 20 * height_ratio,
        paddingHorizontal: 24 * width_ratio,
        backgroundColor: 'white',
      },
      backButton: {
        marginLeft: -8,
        marginTop: 12,
        marginBottom: 40,
      },
      backButtonImage: {
        width: 24 * width_ratio,
        height: 24 * width_ratio,
      },
      title: {
        textAlign: 'left',
        fontSize: 24 * height_ratio,
        ...theme.fonts.SemiBold,
        marginBottom: 10 * height_ratio,
        color: '#000',
      },
      subtitle: {
        textAlign: 'left',
        fontSize: 14 * height_ratio,
        marginBottom: 20 * height_ratio,
        color: '#666',
      },
      inputContainer: {
        marginBottom: 20 * height_ratio,
      },
      inputWrapper: {
        marginBottom: 12 * height_ratio,
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 13 * width_ratio,
        paddingVertical: 8 * height_ratio,
        paddingHorizontal: 18 * width_ratio,
      },
      inputWrapperFocused: {
        borderColor: 'black',
      },
      inputWrapperError: {
        borderColor: '#F53E50',
      },
      floatingLabel: {
        fontSize: 12 * height_ratio,
        color: '#828287',
        marginBottom: 2,
      },
      input: {
        flex: 1,
        color: '#000',
        fontSize: 16 * height_ratio,
        paddingTop: 0,
        paddingBottom: 2 * height_ratio,
      },
      phoneInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      telecomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8 * width_ratio,
        paddingVertical: 4 * height_ratio,
        paddingHorizontal: 8 * width_ratio,
        backgroundColor: '#F1F1F1',
        borderRadius: 8 * width_ratio,
      },
      telecomButtonText: {
        fontSize: 12,
        ...theme.fonts.Medium,
        color: theme.colors.textGray,
      },
      underTriangleButtonImage: {
        width: 7 * width_ratio,
        height: 7 * width_ratio,
        marginLeft: 8 * width_ratio,
      },
      xButtonImage: {
        width: 20 * width_ratio,
        height: 20 * width_ratio,
        marginLeft: 8 * width_ratio,
      },
      authButton: {
        paddingVertical: 18 * height_ratio,
        borderRadius: 13 * width_ratio,
        alignItems: 'center',
      },
      authButtonDisabled: {
        backgroundColor: '#F1F1F1',
      },
      authButtonEnabled: {
        backgroundColor: '#EBEFFE',
      },
      authButtonText: {
        fontWeight: 'bold',
        fontSize: 16 * height_ratio,
      },
      authButtonTextDisabled: {
        color: '#828287',
      },
      authButtonTextEnabled: {
        color: '#7596FF',
      },
      errorText: {
        color: '#F53E50',
        fontSize: 12 * height_ratio,
        marginTop: -8 * height_ratio,
        marginBottom: 12 * height_ratio,
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      modalContainer: {
        backgroundColor: 'white',
        paddingTop: 20 * height_ratio,
        paddingBottom: 30 * height_ratio,
        paddingHorizontal: 24 * width_ratio,
        borderTopLeftRadius: 20 * width_ratio,
        borderTopRightRadius: 20 * width_ratio,
      },
      modalTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24 * height_ratio,
      },
      modalTitle: {
        fontSize: 18 * height_ratio,
        fontWeight: 'bold',
      },
      xButtonImage: {
        width: 24 * width_ratio,
        height: 24 * width_ratio,
      },
      telecomOption: {
        paddingVertical: 12 * height_ratio,
      },
      telecomOptionText: {
        fontSize: 14 * height_ratio,
        color: '#000',
      }, 
      loadingContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
        alignItems: 'center',
        justifyContent: 'center',
      },
      loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
        ...theme.fonts.Medium,
      },
});
  
export default styles;