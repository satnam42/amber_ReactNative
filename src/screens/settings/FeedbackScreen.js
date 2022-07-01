import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, ScrollView, Text, TextInput, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {api_sendFeedback} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import NextBtn from '../../components/NextBtn';
const FeedbackScreen = () => {
  const navigation = useNavigation(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const {auth} = useSelector(s => s);

  const sendFeedBack = async () => {
    if (!message) return;
    setLoading(true);
    try {
      const res = await api_sendFeedback({
        message: message,
        userId: auth?.user?.id,
        token: auth?.accessToken,
      });
      console.log(res);
      if (res?.isSuccess) {
        Alert.alert('Alert', 'Success');
      } else {
        throw new Error(res?.error || 'something went worng!');
      }
    } catch (error) {
      Alert.alert('Alert', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle
        title="Feedback"
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
            // value={email}
            // onChangeText={text => setEmail(text)}
            placeholder="please enter your name"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        {/* Email */}
        {/* <View
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
        </View> */}

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
            value={message}
            onChangeText={text => setMessage(text.trim())}
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
          <NextBtn
            loading={loading}
            title="Sumbit"
            onPress={() => sendFeedBack()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FeedbackScreen;
