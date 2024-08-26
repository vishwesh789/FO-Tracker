import {insertJourneyData} from './dbMethods';

const seedData = [
  {
    updatedAt: '2024-08-26 14:10:25',
    createdAt: '2024-08-26 14:05:12',
    locations: [
      {latitude: 26.511222, longitude: 83.0561122},
      {latitude: 26.3711111, longitude: 83.0566666},
      {latitude: 26.3333333, longitude: 83.9666666},
      {latitude: 26.4622211, longitude: 83.1622212},
    ],
    clockOut: '2024-08-26T14:10:23.897Z',
    id: 2,
    date: '2024-08-25',
    clockIn: '2024-08-26T14:09:58.128Z',
    dealers: [
      {
        id: 5,
        latitude: 26.4622211,
        longitude: 83.1622212,
        checkedIn: false,
        checkInTime: '2024-08-26T14:00:12.345Z',
        checkOutTime: '2024-08-26T14:06:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
      {
        id: 6,
        latitude: 26.5155555,
        longitude: 83.2655555,
        checkedIn: false,
        checkInTime: '',
        checkOutTime: '',
        isVisited: false,
        isReadyForCheckout: false,
      },
      {
        id: 7,
        latitude: 26.3333333,
        longitude: 83.9666666,
        checkedIn: false,
        checkInTime: '2024-08-26T14:02:12.345Z',
        checkOutTime: '2024-08-26T14:06:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
      {
        id: 8,
        latitude: 26.3711111,
        longitude: 83.0566666,
        checkedIn: false,
        checkInTime: '2024-08-26T14:06:12.345Z',
        checkOutTime: '2024-08-26T14:06:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
    ],
  },
  {
    updatedAt: '2024-08-26 15:20:30',
    createdAt: '2024-08-26 15:16:01',
    locations: [
      {latitude: 26.4522345, longitude: 83.0572345},
      {latitude: 26.4688888, longitude: 83.1755555},
      {latitude: 26.5211111, longitude: 83.2788888},
      {latitude: 26.3566666, longitude: 83.9788888},
    ],
    clockOut: '2024-08-26T15:20:28.752Z',
    id: 3,
    date: '2024-08-24',
    clockIn: '2024-08-26T15:12:02.346Z',
    dealers: [
      {
        id: 9,
        latitude: 26.4688888,
        longitude: 83.1755555,
        checkedIn: false,
        checkInTime: '2024-08-26T14:06:12.345Z',
        checkOutTime: '2024-08-26T14:06:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
      {
        id: 10,
        latitude: 26.5211111,
        longitude: 83.2788888,
        checkedIn: false,
        checkInTime: '2024-08-26T14:02:12.345Z',
        checkOutTime: '2024-08-26T14:05:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
      {
        id: 11,
        latitude: 26.3566666,
        longitude: 83.9788888,
        checkedIn: false,
        checkInTime: '2024-08-26T14:08:12.345Z',
        checkOutTime: '2024-08-26T14:09:28.345Z',
        isVisited: true,
        isReadyForCheckout: false,
      },
      {
        id: 12,
        latitude: 26.3947577575,
        longitude: 83.0577777,
        checkedIn: false,
        checkInTime: '',
        checkOutTime: '',
        isVisited: false,
        isReadyForCheckout: true,
      },
    ],
  },
];

export const insertSeedData = async () => {
  for (let i = 0; i < seedData.length; i++) {
    const d = seedData[i];

    await insertJourneyData(
      d.date,
      d.clockIn,
      d.clockOut,
      d.dealers,
      d.locations,
    );
  }
};
