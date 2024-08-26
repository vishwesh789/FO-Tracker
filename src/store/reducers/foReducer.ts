import {Constants, IFoState, NewsActionTypes} from '../actions/actionTypes';
const initalState: IFoState = {
  isloading: false,
  currentPosition: {
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: null,
      accuracy: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 0,
  },
  isClockedIn: false,
};
export default (
  state: IFoState = initalState,
  action: NewsActionTypes,
): IFoState => {
  switch (action.type) {
    case Constants.SET_LOADING:
      return {
        ...state,
        ...action.payload,
      };
    case Constants.SET_CURRENT_POSITION:
      return {
        ...state,
        ...action.payload,
      };
    case Constants.SET_CLOCKEDIN_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
