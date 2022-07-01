import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../HomeScreen';
import ViewOtherProfile from '../../profile/ViewOtherProfile';
import RandomNextAndAcceptModeScreen from '../RandomNextAndAcceptModeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AGREE_TO_TERM_AND_CONDITION_KEY} from '../../../constants';
import {REMOVE_POPUP_OVERLAY} from '../../../redux/reducers/actionTypes';
import {useDispatch} from 'react-redux';
import RandomUsersScreen from '../RandomUsersScreen';
import CheckoutScreen from '../../shop/CheckoutScreen';
const Stack = createStackNavigator();
const HomeRoutes = () => {
  const dispatch = useDispatch(null);

  const checkTermsAndConditionsAgreement = async () => {
    try {
      const res = await AsyncStorage.getItem(AGREE_TO_TERM_AND_CONDITION_KEY);
      console.log(res, 'AGREE_TO_TERM_AND_CONDITION_KEY');
      if (res) {
        console.log('remove pop');
        dispatch({type: REMOVE_POPUP_OVERLAY});
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkTermsAndConditionsAgreement();
  }, []);

  return (
    <Stack.Navigator
      name={'HomeNavigator'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="RandomUsersScreen" component={RandomUsersScreen} />
      <Stack.Screen
        name="RandomNextAndAcceptModeScreen"
        component={RandomNextAndAcceptModeScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeRoutes;
