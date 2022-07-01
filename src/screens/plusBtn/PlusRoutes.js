import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../home/HomeScreen';
import RandomNextAndAcceptModeScreen from '../home/RandomNextAndAcceptModeScreen';
import RandomUsersScreen from '../home/RandomUsersScreen';

const Stack = createStackNavigator();
const PlusRoutes = () => {
  return (
    <Stack.Navigator
      name={'PlusNavigator'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{activeTab: 'RANDOM'}}
      />
      <Stack.Screen name="RandomUsersScreen" component={RandomUsersScreen} />
      <Stack.Screen
        name="RandomNextAndAcceptModeScreen"
        component={RandomNextAndAcceptModeScreen}
      />
    </Stack.Navigator>
  );
};

export default PlusRoutes;
