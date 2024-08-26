import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../assets/colors';
import LottieView from 'lottie-react-native';
import splash from '../assets/splash.json';
import {navigationRef} from '../../App';
import {CommonActions, RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {rootStackParams} from '../components/stackNavigator';
import {getClockStatus} from '../utils/storage';
import {setAttendance} from '../store/actions';
import {useDispatch} from 'react-redux';

interface SplashScreenProps {
  navigation: StackNavigationProp<rootStackParams, 'splash'>;
  route: RouteProp<rootStackParams, 'splash'>;
}
const Splash = (props: SplashScreenProps) => {
  const {navigation} = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const checkClockStatus = async () => {
      const isClockedIn = await getClockStatus();
      if (isClockedIn) {
        dispatch(setAttendance(isClockedIn));
      } else {
        dispatch(setAttendance(false));
      }
    };
    checkClockStatus();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('token');
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: token ? 'home' : 'login'}],
          }),
        );
      };

      checkAuth();
    }, 3000);

    return () => {};
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView source={splash} autoPlay loop style={styles.animation} />
      <Text style={styles.title}>FO TRACKER</Text>
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#190029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {color: COLORS.white, fontSize: 30, fontWeight: 'bold'},
  animation: {
    width: 100,
    height: 100,
  },
});
