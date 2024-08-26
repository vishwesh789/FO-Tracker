import React from 'react';

import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Splash from '../screens/splash';

import LoginScreen from '../screens/login';
import MainStackNavigator, {rootStackParamsMain} from './mainStackNavigator';

export type rootStackParams = {
  login: undefined;
  splash: undefined;
  home: StackNavigationProp<rootStackParamsMain>;
};

const Stack = createStackNavigator<rootStackParams>();

const Stacknavigator = () => {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="home"
        component={MainStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Stacknavigator;
