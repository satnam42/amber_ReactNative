import React from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SettingItem = ({navigation, title, route, onPress}) => {
  const handleNaviagte = route => {
    navigation.navigate(route);
  };
  return (
    <TouchableOpacity
      onPress={() => {
        onPress ? onPress() : handleNaviagte(route);
      }}>
      <View
        style={{
          backgroundColor: '#49cf76',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 17,
          marginVertical: 12,
          marginLeft: 50,
          marginRight: 50,
          height: 50,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            letterSpacing: 0.5,
            marginLeft: 20,
          }}>
          {title}
        </Text>
        <Image
          source={require('../../ios/Assets/forwardarrowicon.png')}
          style={{
            width: 10,
            height: 20,
            marginRight: 20,
          }}></Image>
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;
