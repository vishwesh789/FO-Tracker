import {action} from 'typesafe-actions';
import { Constants } from './actionTypes';
import { GeolocationResponse } from '@react-native-community/geolocation';




export const setLoader = (isloading: boolean) => {
  return action(Constants.SET_LOADING, {
    isloading,
  });
};


export const setCurrentPosition = (position: GeolocationResponse) => {
  return action(Constants.SET_CURRENT_POSITION, {
    currentPosition: position,
  });
};

export const setAttendance = (status: boolean) => {
  return action(Constants.SET_CLOCKEDIN_STATUS, {
    isClockedIn: status,
  });
};


