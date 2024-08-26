export const SCHEME = 'https';
export const DOMAIN = 'vision-stg.pi314.in';

export const BASE_URL = `${SCHEME}://${DOMAIN}/`;

export const API = {
  LOGIN: BASE_URL + 'api/v3/login',
};

export const MINIMUM_RADIUS_TO_REGISTER_CHEKIN_METER = 100;
export const MINIMUM_RADIUS_TO_REGISTER_CHEKOUT_IN_METER = 50;

export const DEALERS = [
  {
    id: 1,
    latitude: 26.4564444,
    longitude: 83.14933739,
    checkedIn: false,
    checkInTime: '',
    checkOutTime: '',
    isVisited: false,
    isReadyForCheckout: false,
  },
  {
    id: 2,
    latitude: 26.50245566,
    longitude: 83.254933739,
    checkedIn: false,
    checkInTime: '',
    checkOutTime: '',
    isVisited: false,
    isReadyForCheckout: false,
  },
  {
    id: 3,
    latitude: 26.310245566,
    longitude: 83.954933739,
    checkedIn: false,
    checkInTime: '',
    checkOutTime: '',
    isVisited: false,
    isReadyForCheckout: false,
  },
  {
    id: 4,
    latitude: 26.37068888,
    longitude: 83.054664644,
    checkedIn: false,
    checkInTime: '',
    checkOutTime: '',
    isVisited: false,
    isReadyForCheckout: false,
  },
];
