import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {ScrollView, View, Text} from 'react-native';
import {colors} from '../../constants';
import GetPaidView from '../shop/GetPaidView';

const GoLiveScreen = () => {
  const navigation = useNavigation();

  const renderHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 80,
          paddingHorizontal: 40,
          marginTop: 20,
        }}>
        <Text style={{color: '#fff', fontSize: 34, fontWeight: 'bold'}}>
          Go Live
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.darkPurpleColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {renderHeader()}
      <ScrollView
        style={{
          width: '80%',
          height: '100%',
        }}>
        <GetPaidView />
      </ScrollView>
    </View>
  );
};

export default GoLiveScreen;
