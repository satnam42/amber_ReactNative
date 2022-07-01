import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from './Profile';
import EditProfile from './EditProfile';
import SettingRoutes from '../settings/SettingRoutes';
import FollowersScreen from './follow/FollowersScreen';
import MyGifts from './MyGifts';
import {useNavigation} from '@react-navigation/core';
import ScrollablePhotos from './gallary/ScrollablePhotos';
import UpdateProfile from './UpdateProfile';
const Stack = createStackNavigator();
const ProfileRoutes = ({route}) => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      name="ProfileRoutes"
      screenOptions={{
        headerShown: false,
        // unmountOnBlur: true,
      }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="SettingRoutes" component={SettingRoutes} />
      <Stack.Screen name="FollowersScreen" component={FollowersScreen} />
      <Stack.Screen name="MyGifts" component={MyGifts} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      {/* <Stack.Screen name="ScrollablePhotos" component={ScrollablePhotos} /> */}
      {/* <Stack.Screen name="ViewOtherProfile" component={ViewOtherProfile} /> */}
    </Stack.Navigator>
  );
};

export default ProfileRoutes;
