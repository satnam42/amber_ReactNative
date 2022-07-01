import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import NextBtn from '../../components/NextBtn';
import {api_userAddBankDetails} from '../../api_services';
import {UPDATE_MY_PROFILE} from '../../redux/reducers/actionTypes';
import {PAYPAY_ME_LINK} from '../../constants';
import WebView from 'react-native-webview';
const SubmitBankDetails = () => {
  const navigation = useNavigation();
  const [accountNo, setAccountNo] = React.useState('');
  const [accountNo2, setAccountNo2] = React.useState('');
  const [bankCode, setBankCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (accountNo && accountNo2 && bankCode) {
      if (accountNo !== accountNo2) {
        Alert.alert('Alert', 'account no is not matched!');
        return;
      } else if (accountNo.length < 6) {
        Alert.alert('Alert', 'account no should be greater than 6');
      } else {
        const payload = {
          accountNo,
          bankCode,
          token: auth?.accessToken,
          userId: auth?.user?.id,
        };
        setLoading(true);
        try {
          const response = await api_userAddBankDetails(payload);
          console.log(response);
          if (response?.isSuccess) {
            dispatch({type: UPDATE_MY_PROFILE, payload: response?.data});
            Alert.alert('Alert', 'Success');
          } else {
            Alert.alert(
              'Alert',
              response?.error || 'failed to add bank details',
            );
          }
        } catch (error) {
          Alert.alert('Alert', error?.message || 'failed to add bank details');
        } finally {
          setLoading(false);
        }

        console.log(payload);
      }
    } else {
      Alert.alert('Alert', 'please fill all fields!');
    }
  };

  // return <WebView source={{uri: PAYPAY_ME_LINK}} />;
  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle
        title="Add Bank Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView>
        <View style={{width: '80%', alignSelf: 'center', marginTop: 30}}>
          <Text>Account No:</Text>
          <TextInput
            keyboardType="numeric"
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text => setAccountNo(text)}
            value={accountNo}
          />
        </View>
        <View style={{width: '80%', alignSelf: 'center', marginTop: 30}}>
          <Text>Confirm Account No:</Text>
          <TextInput
            keyboardType="numeric"
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text => setAccountNo2(text)}
            value={accountNo2}
          />
        </View>
        <View style={{width: '80%', alignSelf: 'center', marginTop: 30}}>
          <Text>Swift Code:</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text => setBankCode(text)}
            value={bankCode}
          />
        </View>
        <View style={{width: '80%', alignSelf: 'center', marginTop: 30}}>
          <Text>Name: (optional)</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text => setName(text)}
            value={name}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {loading ? (
            <ActivityIndicator size="large" color="purple" />
          ) : (
            <NextBtn title="Submit" onPress={handleSubmit} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SubmitBankDetails;
