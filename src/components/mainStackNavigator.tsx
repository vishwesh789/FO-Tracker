import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {CustomHeader} from './customHeader';

import FoJourneys from '../screens/foJourneys';
import Splash from '../screens/splash';
import Dashboard from '../screens/dashboard';
import {View} from 'react-native';

export type rootStackParamsMain = {
  dashboard: undefined;
  foJourneys: undefined;
  splash: undefined;
};

const Stack = createStackNavigator<rootStackParamsMain>();

const MainStackNavigator = ({navigation}: any) => {
  return (
    <Stack.Navigator initialRouteName="dashboard">
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          headerShown: true,
          headerTransparent: false,
          headerLeft: () => <View style={{width: 0}} />,
          headerTitle: props => (
            <CustomHeader
              userIcon={true}
              heading={'Dashboard'}
              navigation={navigation}
            />
          ),
          headerStyle: {height: 60},
        }}
      />
      <Stack.Screen name="foJourneys" component={FoJourneys} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
