import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {COLORS} from '../assets/colors';
import {navigationRef} from '../../App';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type PropType = {
  article: any;
  index: number;
  onPin: () => void;
  onDelete: () => void;
};

const {width, height} = Dimensions.get('window');

const NewsCard = ({article, index, onPin, onDelete}: PropType) => {
  return (
    <Pressable style={styles.headlineContainer}>
      <Image
        source={{uri: article.urlToImage}}
        height={200}
        style={styles.image}></Image>
      <View style={{display: 'flex', flexDirection: 'row', padding: 10}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => {
            // navigationRef.navigate('newsWebView', {url: article.url});
          }}>

          <Text style={styles.name}>{article.source.name}</Text>
          <Text style={styles.title}>{article.title}</Text>
        </Pressable>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: 50,
          }}>
          <FontAwesome5
            name="thumbtack"
            size={20}
            color={'#fdd380'}
            solid
            onPress={onPin}
          />
          <FontAwesome5
            name="trash"
            size={20}
            color="#fdd380"
            onPress={onDelete}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  headlineContainer: {
    backgroundColor: 'rgba(25, 0, 100, 0.2)',
    marginBottom: 16,
    borderRadius: 16,
  },
  image: {borderRadius: 16},
  name: {color: COLORS.white, fontSize: 14, fontWeight: '400', marginBottom: 5},
  title: {color: COLORS.white, fontSize: 18, fontWeight: '700'},
});
