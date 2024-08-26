import {ActionType} from 'typesafe-actions';
import * as NewsActions from './foActions.ts';
import {GeolocationResponse} from '@react-native-community/geolocation';

export type NewsActionTypes = ActionType<typeof NewsActions>;

export interface IFoState {
  isloading: boolean;
  currentPosition: GeolocationResponse;
  isClockedIn: boolean;
}

export enum Constants {
  SET_LOADING = 'SET_LOADING',
  SET_CURRENT_POSITION = 'SET_CURRENT_POSITION',
  SET_CLOCKEDIN_STATUS = 'SET_CLOCKEDIN_STATUS',
}
