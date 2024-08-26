import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {API} from '../utils/constants';
import {rootStackParams} from '../components/stackNavigator';
import {IRootState} from '../store/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {setLoader} from '../store/actions';

interface LoginScreenProps {
  navigation: StackNavigationProp<rootStackParams, 'login'>;
  route: RouteProp<rootStackParams, 'login'>;
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();

  const isloading = useSelector((state: IRootState) => state.fo.isloading);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    try {
      dispatch(setLoader(true));

      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, version: '6.0.4'}),
      });
      console.log('responseee', response);
      if (response.ok) {
        dispatch(setLoader(false));

        const data = await response.json();
        try {
          await AsyncStorage.setItem('token', data.user.api_token);
          navigation.navigate('home' as never);
        } catch (error) {
          dispatch(setLoader(false));

          Alert.alert(
            'Storage Error',
            'Failed to store the authentication token',
          );
        }
      } else {
        dispatch(setLoader(false));

        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.error('Login Error:', error);
      Alert.alert(
        'Login Failed',
        'Something went wrong, please try again later',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1.5, alignItems:'center',justifyContent:'center'}}>
      <Image
        source={require('../assets/tracker.png')}
        style={{width: 120, height: 150, }}
      />
      </View>
     
      <View style={{flex: 3}}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={'#fdd380'}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={'#fdd380'}
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      {isloading && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#190029',
  },
  input: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#fdd380',
    borderRadius: 10,
    paddingLeft: 20,
    color: '#fdd380',
  },
  button: {
    padding: 15,
    backgroundColor: '#fdd380',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'rgb(40, 0, 66)',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export default LoginScreen;
