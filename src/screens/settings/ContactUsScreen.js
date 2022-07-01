import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, ScrollView, Text, TextInput} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import NextBtn from '../../components/NextBtn';
const ContactUsScreen = () => {
  const navigation = useNavigation(null);
  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle
        title="Contact Us"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView>
        {/* Name */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              maxWidth: 350,
              width: '80%',
              marginLeft: 15,
              color: 'rgba(0,0,0,0.6)',
              marginBottom: 5,
            }}>
            Name
          </Text>
          <TextInput
            style={{
              maxWidth: 350,
              width: '80%',
              borderColor: 'rgba(0,0,0,0.2)',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              color: '#000',
            }}
            placeholder="please enter your name"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        {/* Email */}
        <View
          style={{
            marginVertical: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              maxWidth: 350,
              width: '80%',
              marginLeft: 15,
              color: 'rgba(0,0,0,0.6)',
              marginBottom: 5,
            }}>
            Email Address
          </Text>
          <TextInput
            style={{
              maxWidth: 350,
              width: '80%',
              borderColor: 'rgba(0,0,0,0.2)',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              color: '#000',
            }}
            // value={email}
            // onChangeText={text => setEmail(text)}
            placeholder="example@email.com"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        {/* Message */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              maxWidth: 350,
              width: '80%',
              marginLeft: 15,
              color: 'rgba(0,0,0,0.6)',
              marginBottom: 5,
            }}>
            Message
          </Text>
          <TextInput
            style={{
              maxWidth: 350,
              width: '80%',
              borderColor: 'rgba(0,0,0,0.2)',
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              height: 160,
              color: '#000',
            }}
            textAlignVertical="top"
            multiline={true}
            // value={email}
            // onChangeText={text => setEmail(text)}
            placeholder="your message..."
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        {/* Submit btn */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 60,
          }}>
          <NextBtn title="Sumbit" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactUsScreen;
