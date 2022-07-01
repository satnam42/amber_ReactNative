import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import WebView from 'react-native-webview';
import HeaderBackTitle from '../../components/HeaderBackTitle';

const AboutSetting = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, paddingBottom: 80}}>
      <HeaderBackTitle
        title="About Us"
        onBackPress={() => navigation.goBack()}
      />
      <WebView source={{uri: 'https://amberclubpro.com/privacy-policy.html'}} />
    </View>
  );
};

export default AboutSetting;
