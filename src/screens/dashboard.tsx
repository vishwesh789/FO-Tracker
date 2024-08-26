import React, {useEffect, useState, useRef, Dispatch, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  PermissionsAndroid,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getClockStatus, saveClockStatus} from '../utils/storage';
import MapScreen from './mapScreen';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import moment from 'moment';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {useDispatch, useSelector} from 'react-redux';
import {setAttendance, setCurrentPosition} from '../store/actions';
import FoJourneys from './foJourneys';
import {
  initFoJourney,
  pushLocation,
  saveClockIn,
  saveClockOut,
} from '../db/dbMethods';
import {IRootState} from '../store/reducers';
import {
  startForegroundService,
  stopForegroundService,
} from '../utils/backgrndTask';

const Dashboard = () => {
  const [showMapView, setMapView] = useState(true);

  const dispatch = useDispatch();
  const handleClockIn = async () => {
    Alert.alert('Fo Tracker', 'Are you sure, you want to opt in?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async () => await watchPosition()},
    ]);
  };

  const handleClockOut = async () => {
    stopTracking();
  };

  const isPresent = useSelector((state: IRootState) => state.fo.isClockedIn);

  useEffect(() => {
    ReactNativeForegroundService.add_task(
      () => {
        Geolocation.getCurrentPosition(taskFunction, console.error, {
          enableHighAccuracy: true,
          maximumAge: 4000,
        });
      },
      {
        delay: 5000,
        onLoop: true,
        taskId: 'taskid',
        onError: (e: any) => console.log(`Error logging:`, e),
      },
    );
  }, []);

  const taskFunction = useCallback(() => {
    Geolocation.getCurrentPosition(handlePosition, console.error, {
      enableHighAccuracy: true,
    });
  }, []);
  console.log(' dashboaerdddd scrrrrrrrnn');

  const watchPosition = async () => {
    try {
      const prominentDisclosureShown = JSON.parse(
        (await AsyncStorage.getItem('prominentDisclosureShown')) || 'false',
      );

      if (prominentDisclosureShown) {
        await requestLocationPermissions();
      } else {
        Alert.alert(
          'Location Permission',
          'Fo Tracker requires your approval to access the mobile phone location at all times, even when the application is in the background.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('User cancelled permission request'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.setItem(
                  'prominentDisclosureShown',
                  JSON.stringify(true),
                );
                await requestLocationPermissions();
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error in watchPosition:', error);
    }
  };

  const handlePosition = async (position: GeolocationResponse) => {
    // console.log('>>>>>>>>>>>>>>> position: ', position);
    const time = moment().format('YYYY-MM-DD HH:mm');
    await pushLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    dispatch(setCurrentPosition(position));
  };

  const startTracking = async () => {
    await initFoJourney();
    const time = new Date().toISOString();
    startForegroundService();
    await saveClockIn(time);
    await saveClockStatus(true);
    dispatch(setAttendance(true));
  };

  const stopTracking = async () => {
    Alert.alert('IFFCO Kisan', 'Are you sure you want to checkout ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          stopForegroundService();
          const time = new Date().toISOString();
          await saveClockOut(time);
          await saveClockStatus(false);
          dispatch(setAttendance(false));
        },
      },
    ]);
  };

  const requestLocationPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ];

      const grantedPermissions = await PermissionsAndroid.requestMultiple(
        permissions,
      );

      const isFineLocationGranted =
        grantedPermissions[
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ] === PermissionsAndroid.RESULTS.GRANTED;
      const isBackgroundLocationGranted =
        grantedPermissions[
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        ] === PermissionsAndroid.RESULTS.GRANTED;

      if (isFineLocationGranted && isBackgroundLocationGranted) {
        startTracking();
      } else {
        console.log('Location permission denied.');
        await checkPermissions();
      }
    } catch (error) {
      console.warn('Error requesting location permissions:', error);
    }
  };

  const checkPermissions = async () => {
    const isFineLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const isBackgroundLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (isFineLocationGranted && isBackgroundLocationGranted) {
      startTracking();
    } else {
      Alert.alert(
        'IFFCO Kisan',
        'In the Setting -> Permissions -> Location, choose the option "Allow All The Time".',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('User cancelled permission request'),
            style: 'cancel',
          },
          {
            text: 'Go to Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Pressable
          style={styles.button}
          onPress={() => {
            setMapView(true);
          }}>
          <Text style={styles.buttonText}>Map View</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            setMapView(false);
          }}>
          <Text style={styles.buttonText}>My Journeys</Text>
        </Pressable>
      </View>
      {showMapView ? <MapScreen /> : <FoJourneys />}
      {!isPresent ? (
        <Pressable
          style={styles.button}
          onPress={() => {
            handleClockIn();
          }}>
          <Text style={styles.buttonText}>CLOCK IN</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.button}
          onPress={() => {
            handleClockOut();
          }}>
          <Text style={styles.buttonText}>CLOCK OUT </Text>
        </Pressable>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 15,
    backgroundColor: '#fdd380',
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: 'rgb(40, 0, 66)',
    fontSize: 18,
    fontWeight: '600',
  },
  animeContaner: {alignItems: 'center', justifyContent: 'center', flex: 1},
  animation: {
    width: 100,
    height: 100,
  },
});
