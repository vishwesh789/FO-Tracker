import {enablePromise, SQLiteDatabase} from 'react-native-sqlite-storage';
import {db} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

enablePromise(true);

export const createFoTables = async (): Promise<void> => {
  try {
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS foJourney (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        clockIn TEXT,
        clockOut TEXT,
        dealers TEXT, 
        locations TEXT,
        createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('foJourney table created successfully.');
  } catch (error) {
    console.error('Error creating foJourney table:', error);
  }
};

export const tablesToDelete = ['foJourney'];

export const deleteTables = async (): Promise<void> => {
  try {
    for (const tableName of tablesToDelete) {
      await db.executeSql(`DROP TABLE IF EXISTS ${tableName};`);
      console.log(`Table ${tableName} deleted successfully.`);
      await AsyncStorage.removeItem('journeyDataSeeded');
    }
  } catch (error) {
    console.error('Error deleting tables:', error);
  }
};

export const consoleTableData = async (tableName: string): Promise<void> => {
  try {
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    const rows = results[0].rows;
    console.log(`Data from ${tableName} table:`);
    for (let i = 0; i < rows.length; i++) {
      console.log(`Row ${i}:`, JSON.stringify(rows.item(i)));
    }
  } catch (error) {
    console.error(`Error fetching data from ${tableName} table:`, error);
  }
};
