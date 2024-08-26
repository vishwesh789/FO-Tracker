import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  BackHandler,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {IRootState} from '../store/reducers';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const {width, height} = Dimensions.get('window');

export function CustomHeader(props: any) {
  const {heading, navigation} = props;
  const isPresent = useSelector((state: IRootState) => state.fo.isClockedIn);
  const handleLogout = async () => {
    if (isPresent) {
      Alert.alert('Fo Tracker', 'Please Opt out first.');
    } else {
      console.log('aaaaaaaaaaaaaa');
      await AsyncStorage.removeItem('token');
      navigation.navigate('login');
      console.log('bbbbbbbbbbbbbbbbb');
    }
  };
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => {}} style={{width: 100, paddingLeft: 10}}>
        {isPresent && (
          <FontAwesome5Icon
            name="running"
            size={35}
            color={'#4eff00'}
            solid
            onPress={() => {}}
          />
        )}
      </Pressable>

      {heading && (
        <View>
          <Text style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
            {heading}
          </Text>
        </View>
      )}
      <Pressable
        style={{
          flexDirection: 'row',
          width: 100,
          justifyContent: 'flex-end',
          paddingRight: 10,
        }}
        onPress={() => handleLogout()}>
        <FontAwesome5Icon
          name="sign-out-alt"
          size={35}
          color={'#fdd380'}
          solid
          onPress={() => handleLogout()}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -15,
  },

  menuImage: {
    height: 35,
    width: 35,
  },

  headerInnerContainerIos: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    paddingTop: 10,
  },
  titleContainer: {
    flex: 1,
  },

  heading: {
    fontSize: 15,
    color: 'black',
    fontWeight: '800',
  },
});
