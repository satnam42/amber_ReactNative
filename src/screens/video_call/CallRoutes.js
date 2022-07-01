import React, {useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import CallIncoming from './CallIncoming';
import LiveVideoCall from './LiveVideoCall';
import RecivedCall from './RecivedCall';
import CallOutgoing from './CallOutgoing';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();
const CallRoutes = () => {
  const navigation = useNavigation();

  const {call} = useSelector(state => state);
  const {navigateTo} = call;

  const navigateDynamically = name => {
    if (name === null) return;
    navigation.navigate(name);
  };

  useEffect(() => {
    console.log('NAVIGATING DYNAMICALLY TO ', navigateTo);
    navigateDynamically(navigateTo);
  }, [navigateTo]);

  return (
    <Stack.Navigator
      name="callRoutes"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CallIncoming" component={CallIncoming} />
      <Stack.Screen name="LiveVideoCall" component={LiveVideoCall} />
      <Stack.Screen name="CallOutgoing" component={CallOutgoing} />
      {/* <Stack.Screen name="RecivedCall" component={RecivedCall} /> */}
    </Stack.Navigator>
  );
};
export default CallRoutes;
