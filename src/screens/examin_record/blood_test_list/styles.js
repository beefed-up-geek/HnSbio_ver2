import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../../theme'; // 개발 규칙: 폰트 적용
const width_ratio = Dimensions.get('screen').width / 390; // 개발 규칙: 상대 크기 적용
const height_ratio = Dimensions.get('screen').height / 844; // 개발 규칙: 상대 크기 적용

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20 * width_ratio,
        paddingTop: 20 * height_ratio,
      },
      headerTitle: {
        ...theme.fonts.Bold,
        fontSize: 15 * width_ratio,
        color: '#333',
        marginBottom: 20 * height_ratio,
        textAlign: 'left',
      },
      card: {
        backgroundColor: '#fff',
        marginBottom: 10 * height_ratio,
        padding: 16 * width_ratio,
        borderRadius: 25 * width_ratio,
        borderWidth: 1,
        borderColor: '#DADADA',
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      cardType: {
        ...theme.fonts.Bold,
        fontSize: 16 * width_ratio,
        color: '#333',
      },
      cardHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      moreText: {
        ...theme.fonts.Medium,
        fontSize: 12 * width_ratio,
        color: '#828282',
        marginRight: 4 * width_ratio,
      },
      cardContent: {
        marginTop: 8 * height_ratio,
      },
      tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6 * width_ratio,
      },
      abnormalTag: {
        backgroundColor: '#FEE7E7',
        borderRadius: 10 * width_ratio,
        paddingHorizontal: 10 * width_ratio,
        paddingVertical: 5 * height_ratio,
        borderWidth: 1,
        borderColor: '#FF6B6B',
      },
      abnormalTagText: {
        ...theme.fonts.Medium,
        fontSize: 10 * width_ratio,
        color: '#FF6B6B',
      },
      normalText: {
        fontSize: 12 * width_ratio,
        color: '#333',
      },
      listContainer: {
        paddingBottom: 20 * height_ratio,
      },
});

export default styles;