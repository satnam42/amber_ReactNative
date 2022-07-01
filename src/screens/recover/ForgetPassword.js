import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {colors} from '../../constants';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {api_forgetPassword} from '../../api_services';

const ForgetPassword = () => {
  const navigation = useNavigation(null);
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // const validate = text => {
  //   console.log(text);
  //   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  //   if (reg.test(text) === false) {
  //     console.log('Email is Not Correct');
  //     setEmail(text);
  //     return false;
  //   } else {
  //     setEmail(text);
  //     console.log('Email is Correct');
  //   }
  // };

  const moveToVerifyOtpScreen = restToken => {
    navigation.navigate('VerifyYourEmail', {
      email,
      restToken,
    });
  };
  const handleSendBtnPress = async () => {
    setLoading(true);
    try {
      const response = await api_forgetPassword({email});
      console.log(response);
      if (response?.isSuccess) {
        Alert.alert('Alert', `otp has been sent to email: ${email}`);
        moveToVerifyOtpScreen(response?.data?.token);
      } else {
        throw new Error(response?.error || 'something went wrong');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderBackTitle
        onBackPress={() => navigation.goBack()}
        title="Forget password"
      />
      <ScrollView
        style={{
          flex: 1,
        }}>
        {/* ICON BOX */}
        <View
          style={{
            height: 300,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderRadius: 300,
              width: 300,
              height: 300,
              backgroundColor: 'rgba(229,217,56,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 100, height: 100}}
              resizeMode="contain"
              source={require('../../assets/icons/lock.png')}
            />
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#fff',
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 100,
                right: 100,
              }}>
              <FontAwesome5 color="tomato" name="question" size={20} />
            </View>
          </View>
        </View>
        {/* ICON BOX */}

        {/* desc */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.TextBlackLight,
              width: 300,
              textAlign: 'center',
              fontSize: 16,
            }}>
            Please Enter your Email Address To Recieve a Verification Code.
          </Text>
        </View>

        {/* input */}
        <View
          style={{
            marginVertical: 50,
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
              borderColor: 'rgba(0,0,0,0.1)',
              borderWidth: 0.2,
              borderRadius: 10,
              padding: 10,
              color: '#000',
            }}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="example@email.com"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>

        {/* submit btn */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ebc634',
              width: 220,
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 15,
              marginBottom: 50,
            }}
            onPress={() => {
              handleSendBtnPress();
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text
                style={{
                  fontSize: 17,
                  textAlign: 'center',
                  color: 'rgba(0,0,0,0.6)',
                  letterSpacing: 1,
                }}>
                Send
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgetPassword;
