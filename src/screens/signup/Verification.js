import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import NextBtn from '../../components/NextBtn';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBackTitle from '../../components/HeaderBackTitle';
const Verification = ({navigation}) => {
  const handleEnterOtp = () => {
    navigation.navigate('Main');
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <HeaderBackTitle title={'Verification'} navigation={navigation} />

      <View style={styles.main.box}>
        <View>
          <Text style={styles.main.h1}>
            We've sent you a verification code to your phone
          </Text>
          <Text style={styles.main.h2}>+91 1234567890</Text>
        </View>
        <MyTextInput
          width={325}
          placeholder="Enter your code"
          label="Enter code"
          keyboardType="numeric"
        />
        <View
          style={{
            width: '100%',
            fontSize: 18,
            fontWeight: 'bold',
            maxWidth: 325,
            marginVertical: 10,
            letterSpacing: 0.8,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: '#333',
            }}>
            Didn't Receive a code ?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                padding: 10,
                paddingLeft: 0,
                fontSize: 16,
                flex: 1,
                color: '#333',
              }}>
              Resend code 50 seconds
            </Text>

            <NextBtn title="Resend" />
          </View>
        </View>
      </View>
      <View style={styles.submitBox}>
        <NextBtn onPress={handleEnterOtp} title="Enter" />
      </View>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  main: {
    box: {
      alignItems: 'center',
      marginVertical: 10,
    },
    h1: {
      fontSize: 18,
      fontWeight: 'bold',
      maxWidth: 350,
      marginVertical: 10,
      letterSpacing: 0.8,
      color: '#333',
    },
    h2: {
      fontSize: 18,
      fontWeight: 'bold',
      maxWidth: 300,
      color: '#444',
    },
  },
  submitBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
});
