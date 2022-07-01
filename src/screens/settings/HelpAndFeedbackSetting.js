import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api_deleteUserAccount} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import SettingItem from '../../components/SettingItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RESET_REDUX_STORE} from '../../redux/reducers/actionTypes';
const HelpAndFeedbackSetting = () => {
  const [loading, setLoading] = React.useState(false);
  const {auth} = useSelector(state => state);
  const navigation = useNavigation(null);
  const dispatch = useDispatch(null);

  const askForAccountDelete = () => {
    Alert.alert('Alert', 'are you sure you want to delete this account', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => handleDeleteAccount(),
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const payload = {token: auth.accessToken, userId: auth.user.id};
    try {
      console.log({payload});
      const response = await api_deleteUserAccount(payload);
      console.log(response);
      if (response.isSuccess) {
        try {
          await AsyncStorage.removeItem('auth');
          Alert.alert('Success', 'Account delete success');
        } catch (e) {
          Alert.alert(
            'Alert',
            `${e?.message} : failed to clear user data , you have to manually clear app data from device setting`,
          );
        }
        dispatch({type: RESET_REDUX_STORE});
        navigation.navigate('Login');
      } else {
        Alert.alert('error', response?.error || 'failed to delete account');
      }
    } catch (error) {
      console.log({error});
      Alert.alert('error', error?.message || 'failed to delete account.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{flex: 1, mar: 70}}>
      <HeaderBackTitle title={'Help & Feedback'} navigation={navigation} />
      <View>
        <SettingItem
          navigation={navigation}
          title="Privacy policy"
          route="PrivacyPolicyScreen"
        />
        <SettingItem
          navigation={navigation}
          title="Terms of service"
          route="TermsOfServiceScreen"
        />
        <SettingItem
          navigation={navigation}
          title="Contact Us"
          route="ContactUsScreen"
        />
        <SettingItem
          navigation={navigation}
          title="Feedback"
          route="FeedbackScreen"
        />
      </View>
      {/* Delete Account */}
      <TouchableOpacity
        style={{
          bottom: 70,
          marginTop: 80,
          backgroundColor: '#49cf76',
          borderRadius: 17,
          marginLeft: 50,
          marginRight: 50,
        }}
        onPress={askForAccountDelete}>
        {loading ? (
          <ActivityIndicator size="small" color={'#fff'} />
        ) : (
          <Text
            style={{
              paddingVertical: 12,
              paddingHorizontal: 25,
              height: 50,
              fontSize: 18,
              color: '#fff',
              borderRadius: 12,
              width: 220,
            }}>
            Delete account
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HelpAndFeedbackSetting;
const styles = StyleSheet.create({});
