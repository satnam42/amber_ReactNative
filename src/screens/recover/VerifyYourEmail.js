import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {api_verifyOtp} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {colors} from '../../constants';

const OTP_MAX_LENGTH = 4;
const VerifyYourEmail = ({route}) => {
  const {email, restToken} = route?.params;
  const navigation = useNavigation(null);
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  // console.log({otp});
  // console.log({email, restToken});

  const handleOtpChange = value => {
    if (value.length > OTP_MAX_LENGTH) return;
    setOtp(value);
  };

  const moveToRecoverPasswordScreen = () => {
    navigation.navigate('CreateNewPassword', {
      restToken,
    });
  };

  const handleVerifyPress = async () => {
    setLoading(true);
    try {
      const response = await api_verifyOtp({token: restToken, otp});
      console.log(response);
      if (response?.isSuccess) {
        Alert.alert('Alert', `otp verified!`);
        moveToRecoverPasswordScreen();
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
        title="Verify Your Email"
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
              source={require('../../assets/icons/email.png')}
            />
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
            {` Please Enter The 4 Digit Code Sent To ${email}`}
          </Text>
        </View>

        {/* input */}
        <View
          style={{
            marginVertical: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'relative',
            }}>
            <TextInput
              keyboardType="numeric"
              style={{
                width: 170,
                color: '#000',
                fontSize: 20,
                fontFamily: 'bolder',
                margin: 5,
                padding: 10,
                letterSpacing: 28,
              }}
              value={otp}
              onChangeText={handleOtpChange}
            />
            <View
              style={{
                backgroundColor: 'orange',
                width: 30,
                height: 5,
                position: 'absolute',
                bottom: 0,
                left: 12,
              }}></View>
            <View
              style={{
                backgroundColor: 'orange',
                width: 30,
                height: 5,
                position: 'absolute',
                bottom: 0,
                left: 12,
              }}></View>
            <View
              style={{
                backgroundColor: 'orange',
                width: 30,
                height: 5,
                position: 'absolute',
                bottom: 0,
                left: 52,
              }}></View>
            <View
              style={{
                backgroundColor: 'orange',
                width: 30,
                height: 5,
                position: 'absolute',
                bottom: 0,
                left: 92,
              }}></View>
            <View
              style={{
                backgroundColor: 'orange',
                width: 30,
                height: 5,
                position: 'absolute',
                bottom: 0,
                left: 132,
              }}></View>
          </View>
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
              handleVerifyPress();
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
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default VerifyYourEmail;
