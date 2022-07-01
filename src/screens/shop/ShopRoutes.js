import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text} from 'react-native';
import Shop from './Shop';
import CreditCardScreen from './CreditCardScreen';
import EarnFreeCoinScreen from './EarnFreeCoinScreen';
import CheckoutScreen from './CheckoutScreen';
import GiftShop from './GiftShop';
import SubmitBankDetails from '../extra/SubmitBankDetails';
import PayPalMeScreen from './PayPalMeScreen';

const Stack = createStackNavigator();
const ShopRoutes = () => {
  return (
    <Stack.Navigator
      name="ShopNavigator"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ShopHome" component={Shop} />
      <Stack.Screen name="CreditCardScreen" component={CreditCardScreen} />
      <Stack.Screen name="EarnFreeCoinScreen" component={EarnFreeCoinScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />

      <Stack.Screen name="GiftShop" component={GiftShop} />
    </Stack.Navigator>
  );
};

export default ShopRoutes;
