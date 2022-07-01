import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  ImageBackground,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const GraphicBox = ({bgImageUri, centerImage, h1, h2}) => {
  const navigation = useNavigation(null);
  return (
    <View style={{backgroundColor: 'transparent', height: 450}}>
      <ImageBackground
        source={{uri: bgImageUri}}
        resizeMode="cover"
        style={{
          height: 400,
          alignItems: 'center',
          position: 'relative',
        }}>
        {h1 === 'Amber' || (
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 30,
                height: 30,
                backgroundColor: 'transparent',
                marginLeft: 10,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="ios-arrow-back" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            width: 250,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 75,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: 'rgba(0,0,0,0.6)',
            }}>
            {h2}
          </Text>
          <Text
            style={{
              fontSize: 35,
              color: 'rgba(0,0,0,0.6)',
            }}>
            {h1}
          </Text>
        </View>
      </ImageBackground>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: -10,
        }}>
        <Image
          resizeMode="cover"
          source={centerImage}
          style={{
            width: 250,
            height: 250,
          }}
        />
      </View>
    </View>
  );
};

export default GraphicBox;
