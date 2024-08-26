import {DealerLocation, FoJourney, LatLong, Location} from '../types/foTypes';
import {db} from '../../App';

import moment from 'moment';
import {DEALERS} from '../utils/constants';

export const initFoJourney = async (): Promise<void> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    const result = await db.executeSql(
      `SELECT * FROM foJourney WHERE date = ?`,
      [todayKey],
    );

    if (result[0].rows.length === 0) {
      const dealersJson = JSON.stringify(DEALERS);
      await db.executeSql(
        `INSERT INTO foJourney (date, dealers, locations) VALUES (?, ?, ?)`,
        [todayKey, dealersJson, '[]'],
      );
    }
  } catch (error) {
    console.error('Error initializing FO Journey data', error);
  }
};

export const pushLocation = async (location: LatLong): Promise<void> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    const result = await db.executeSql(
      `SELECT locations FROM foJourney WHERE date = ?`,
      [todayKey],
    );

    if (result[0].rows.length > 0) {
      const currentLocations = JSON.parse(result[0].rows.item(0).locations);
      currentLocations.push(location);
      const updatedLocations = JSON.stringify(currentLocations);

      await db.executeSql(
        `UPDATE foJourney SET locations = ?, updatedAt = CURRENT_TIMESTAMP WHERE date = ?`,
        [updatedLocations, todayKey],
      );
    }
  } catch (error) {
    console.error('Error saving location', error);
  }
};

export const saveClockIn = async (time: string): Promise<void> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    await db.executeSql(
      `UPDATE foJourney SET clockIn = ?, updatedAt = CURRENT_TIMESTAMP WHERE date = ?`,
      [time, todayKey],
    );
  } catch (error) {
    console.error('Error saving clock-in time', error);
  }
};

export const updateDealers = async (
  dealers: DealerLocation[],
): Promise<void> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    await db.executeSql(
      `UPDATE foJourney SET dealers = ?, updatedAt = CURRENT_TIMESTAMP WHERE date = ?`,
      [JSON.stringify(dealers), todayKey],
    );
  } catch (error) {
    console.error('Error saving updateDealers time', error);
  }
};

export const getClockIn = async (): Promise<string | null> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    const result = await db.executeSql(
      `SELECT clockIn FROM foJourney WHERE date = ?`,
      [todayKey],
    );

    return result[0].rows.length > 0 ? result[0].rows.item(0).clockIn : null;
  } catch (error) {
    console.error('Error getting clock-in time', error);
    return null;
  }
};

export const saveClockOut = async (time: string): Promise<void> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    await db.executeSql(
      `UPDATE foJourney SET clockOut = ?, updatedAt = CURRENT_TIMESTAMP WHERE date = ?`,
      [time, todayKey],
    );
  } catch (error) {
    console.error('Error saving clock-out time', error);
  }
};

export const getClockOut = async (): Promise<string | null> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    const result = await db.executeSql(
      `SELECT clockOut FROM foJourney WHERE date = ?`,
      [todayKey],
    );

    return result[0].rows.length > 0 ? result[0].rows.item(0).clockOut : null;
  } catch (error) {
    console.error('Error getting getClockOut time', error);
    return null;
  }
};

export const getTodaysDealers = async (): Promise<any[]> => {
  try {
    const todayKey = moment().format('YYYY-MM-DD');

    const result = await db.executeSql(
      `SELECT dealers FROM foJourney WHERE date = ?`,
      [todayKey],
    );

    if (result[0].rows.length > 0) {
      return JSON.parse(result[0].rows.item(0).dealers);
    } else {
      return DEALERS;
    }
  } catch (error) {
    console.error("Error retrieving today's dealers", error);
    return [];
  }
};

export const insertJourneyData = async (
  date: string,
  clockIn: string,
  clockOut: string,
  dealers: DealerLocation[],
  locations: LatLong[],
): Promise<void> => {
  try {
    await db.executeSql(
      `
      INSERT INTO foJourney (
        date,
        clockIn,
        clockOut,
        dealers,
        locations
      )
      VALUES (?, ?, ?, ?, ?);
    `,
      [
        date,
        clockIn,
        clockOut,
        JSON.stringify(dealers),
        JSON.stringify(locations),
      ],
    );

    console.log('Journey and location data inserted successfully.');
  } catch (error) {
    console.error('Error inserting journey data:', error);
  }
};

export const getAllJourneys = async (): Promise<FoJourney[] | []> => {
  try {
    const result = await db.executeSql(`
      SELECT *
      FROM foJourney;
    `);

    const rows = result[0].rows;
    const journeys: FoJourney[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      journeys.push({
        date: row.date,
        dealers: JSON.parse(row.dealers),
        locations: JSON.parse(row.locations),
        clockIn: row.clockIn || '',
        clockOut: row.clockOut || '',
      });
    }

    journeys.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; 
    });

    return journeys;
  } catch (error) {
    console.error('Error retrieving all journeys:', error);
    return [];
  }
};


export const getJourneyDataByDate = async (
  date: string,
): Promise<FoJourney | null> => {
  try {
    const result = await db.executeSql(
      `
      SELECT *
      FROM foJourney
      WHERE date = ?;
    `,
      [date],
    );

    const rows = result[0].rows;
    if (rows.length === 0) {
      return null;
    }

    const row = rows.item(0);

    return {
      date: row.date,
      dealers: JSON.parse(row.dealers),
      locations: JSON.parse(row.locations),
      clockIn: row.clockIn || '',
      clockOut: row.clockOut || '',
    };
  } catch (error) {
    console.error('Error retrieving journey data:', error);
    return null;
  }
};
