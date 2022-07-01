import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Inbox from './Inbox';
import ChatScreen from './chat/ChatScreen';

const Stack = createStackNavigator();
const InboxRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="inbox" component={Inbox} />
      {/* <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
    </Stack.Navigator>
  );
};

export default InboxRoutes;
