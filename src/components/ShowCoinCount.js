import React from 'react';
import {View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';

const ShowCoinCount = ({coinCount}) => {
  const {auth} = useSelector(state => state);

  return (
    <View
      style={{
        padding: 10,
      }}>
      {/* tray */}
      <View
        style={{
          backgroundColor: 'orange',
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          top: 16,
          left: 14,
          height: 35,
          paddingRight: 40,
        }}>
        <Text
          style={{
            color: '#fff',
            padding: 8,
            fontSize: 13,
            fontWeight: 'bold',
          }}>
          {coinCount}
        </Text>
      </View>
      {/* coin */}
      <Image
        source={
          auth?.user?.gender === 'male'
            ? require('../assets/icons/shop/coin.png')
            : require('../assets/icons/shop/gem.png')
        }
        style={{
          width: auth?.user?.gender === 'male' ? 42 : 48,
          height: auth?.user?.gender === 'male' ? 42 : 48,
          marginHorizontal: 10,
          resizeMode: 'contain',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: auth?.user?.gender === 'male' ? 20 : 10,
          right: -10,
        }}
      />
    </View>
  );
};

export default ShowCoinCount;
