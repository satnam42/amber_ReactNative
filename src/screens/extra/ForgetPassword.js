import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';

const ForgetPassword = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle
        title="Forget Password ?"
        onBackPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default ForgetPassword;
