import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import {Provider} from 'react-redux';
import reducers from './src/store/reducers';
import {applyMiddleware, legacy_createStore} from 'redux';
import {thunk} from 'redux-thunk';
import Stacknavigator, {rootStackParams} from './src/components/stackNavigator';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import {SQLiteDatabase, openDatabase} from 'react-native-sqlite-storage';
import {
  consoleTableData,
  createFoTables,
  deleteTables,
} from './src/db/dbServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {insertSeedData} from './src/db/seeds';

export let db: SQLiteDatabase;

export const getDBConnection = async () => {
  return await openDatabase({name: 'fo.db', location: 'default'});
};

getDBConnection().then(d => (db = d));

let store = legacy_createStore(reducers, applyMiddleware(thunk));
export const navigationRef = createNavigationContainerRef<rootStackParams>();
ReactNativeForegroundService.register();

const App = () => {
  useEffect(() => {
    deleteTables();
    makeDatabaseready();
    consoleTableData('foJourney');
    seedJourneyData();
    return () => {};
  }, []);

  const seedJourneyData = async () => {
    try {
      const isSeeded = await AsyncStorage.getItem('journeyDataSeeded');
      if (isSeeded === null) {
        insertSeedData();

        await AsyncStorage.setItem('journeyDataSeeded', 'true');

        console.log('Seed data inserted and marked as seeded.');
      } else {
        console.log('Seed data has already been inserted.');
      }
    } catch (error) {
      console.error('Error seeding journey data:', error);
    }
  };

  const makeDatabaseready = async () => {
    console.log('heloooooooooooooo');
    await createFoTables();
  };
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <NavigationContainer ref={navigationRef}>
          <Stacknavigator />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};
const log = () => console.log('Hellow World');
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red'},
});

export default App;
