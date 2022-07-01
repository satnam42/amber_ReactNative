import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShopView from '../shop/ShopView';

const PurchaseCoinPopup = ({ togglePurchaseCoinPopup }) => {
  const handleClose = () => {
    togglePurchaseCoinPopup(false);
  };
  return (
    <View
      style={{
        backgroundColor: colors.darkPurpleColor,
        width: '100%',
        height: '100%',
        padding: 30,
      }}>
      <View
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          Purchase Coin
        </Text>
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name={'ios-close'} size={24} color={'#FFF'} />
        </TouchableOpacity>
      </View>
      <ShopView containerWidth={'100%'} />
    </View>
  );
};

export default PurchaseCoinPopup;


// navigation.navigate('ShopNavigator', { screen: 'Profile' });
