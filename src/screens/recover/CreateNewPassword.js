import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
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
import HeaderBackTitle from '../../components/HeaderBackTitle';
import NextBtn from '../../components/NextBtn';
import {colors} from '../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {api_recoverPassword} from '../../api_services';
const CreateNewPassword = ({route}) => {
  const {restToken} = route?.params;
  const navigation = useNavigation(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRecoverPassword = async () => {
    setLoading(true);
    try {
      const response = await api_recoverPassword({
        newPassword: password,
        token: restToken,
      });
      console.log(response);
      if (response?.isSuccess) {
        Alert.alert('Alert', `new password has been set!`);
        navigation.navigate('Login');
      } else {
        throw new Error(response?.error || 'something went wrong');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePress = () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        if (password.length > 7) {
          handleRecoverPassword();
        } else {
          Alert.alert(('Alert', 'password must greater than 8'));
          // password must greater than 8
        }
      } else {
        Alert.alert(('Alert', 'password must be matched'));
        // password must be matched
      }
    } else {
      Alert.alert(('Alert', 'please enter password'));
      //both empty
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderBackTitle
        onBackPress={() => navigation.goBack()}
        title="Create New Password"
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
              <FontAwesome color="green" name="check" size={20} />
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
            Your New Password Must Be Different from Previously Used Password.
          </Text>
        </View>

        {/* input */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 30,
          }}>
          <Text
            style={{
              maxWidth: 350,
              width: '80%',
              marginLeft: 15,
              color: 'rgba(0,0,0,0.6)',
              marginBottom: 5,
            }}>
            New Password
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
            value={password}
            onChangeText={t => setPassword(t)}
            secureTextEntry={true}
            placeholder="**********"
            placeholderTextColor="rgba(0,0,0,0.3)"
          />
        </View>
        <View
          style={{
            marginBottom: 50,
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
            Confirm Password
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
            value={confirmPassword}
            onChangeText={t => setConfirmPassword(t)}
            secureTextEntry={true}
            autoComplete="password"
            placeholder="**********"
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
              handleSavePress();
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
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateNewPassword;
