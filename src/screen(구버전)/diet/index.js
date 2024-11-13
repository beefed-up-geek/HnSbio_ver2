// src\screen(구버전)\diet\index.js
import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

const {width} = Dimensions.get('window');

// 뉴스 데이터
const articles = [
  {
    id: '1',
    title: '건강 관련 최신 뉴스 - 조선일보',
    thumbnail: 'https://via.placeholder.com/150', // 임의의 썸네일 URL
    url: 'https://m.health.chosun.com/svc/news_view.html?contid=2024080501971',
  },
  {
    id: '2',
    title: '경제 관련 최신 뉴스 - 한국경제',
    thumbnail: 'https://via.placeholder.com/150', // 임의의 썸네일 URL
    url: 'https://www.hankyung.com/article/202408051605i',
  },
  {
    id: '3',
    title: '사회 관련 최신 뉴스 - 네이트뉴스',
    thumbnail: 'https://via.placeholder.com/150', // 임의의 썸네일 URL
    url: 'https://m.news.nate.com/view/20240805n10319?mid=m05&list=recent&cpcd=',
  },
];

const DietScreen = () => {
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
      <View style={styles.articleContainer}>
        <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContainer: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DietScreen;
