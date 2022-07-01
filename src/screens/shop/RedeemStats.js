import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {api_getUsersRedeemStats} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';

const RedeemStats = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {auth} = useSelector(s => s);
  const getusersRedeemStats = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: auth?.user?.id,
        token: auth?.accessToken,
      };
      const response = await api_getUsersRedeemStats(payload);
      console.log(response);
      if (response?.isSuccess) {
        setData(response.data);
      } else {
        throw new Error(response?.error || 'failed to get redeem status!');
      }
    } catch (e) {
      Alert.alert('Alert', e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getusersRedeemStats();
  }, []);

  return (
    <View>
      <HeaderBackTitle
        title="Redeem Status"
        onBackPress={() => navigation.goBack()}
      />

      {loading && (
        <View
          style={{
            height: 200,
            width: '100%',
            background: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator color="orange" size="large" />
        </View>
      )}
      {!loading && (
        <ScrollView>
          {data ? (
            data?.map(item => {
              return (
                <View
                  key={item?._id}
                  style={{marginLeft: 20, marginBottom: 20}}>
                  <Text>receiptNo: {item?.receiptNo || item?._id} </Text>
                  <Text>diamond: {item?.diamond} </Text>
                  <Text>status: {item?.status} </Text>
                </View>
              );
            })
          ) : (
            <View style={{marginLeft: 20, marginBottom: 20}}>
              <Text>No Redeem's</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};
export default RedeemStats;
