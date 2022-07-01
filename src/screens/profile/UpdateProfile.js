import {useNavigation} from '@react-navigation/core';
import React, {createRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ActivityIndicatorBase,
  PermissionsAndroid,
} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';

const UpdateProfile = () => {
  const navigation = useNavigation(null);
  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle
        title="Update Profile Pic"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{marginBottom: 70}}></ScrollView>
    </View>
  );
};

export default UpdateProfile;
