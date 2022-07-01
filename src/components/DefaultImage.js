import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const DefaultImage = ({style, iconSize, color = '#555'}) => {
  return (
    <View style={style}>
      <MaterialCommunityIcons
        name="face-profile"
        size={iconSize}
        color={color}
      />
    </View>
  );
};

export default DefaultImage;
