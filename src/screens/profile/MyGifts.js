import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {api_getMyGifts} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import moment from 'moment';
const GiftLi = ({item, index}) => {
  return (
    <View
      style={{
        padding: 20,
        width: '50%',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: 75,
            height: 75,
            resizeMode: 'contain',
            marginBottom: 10,
          }}
          source={{uri: item?.iconUrl}}
        />

        <View>
          <Text
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: 5,
              paddingHorizontal: 8,
              borderRadius: 30,
            }}>
            {item?.coin} (COINS)
          </Text>
        </View>
      </View>
    </View>
  );
};

const MyGifts = () => {
  const [giftsData, setGiftsData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const {auth} = useSelector(state => state);
  const navigation = useNavigation(null);

  const handleGetGifts = async () => {
    const payload = {
      token: auth.accessToken,
      userId: auth.user.id,
    };
    setLoading(true);
    try {
      const response = await api_getMyGifts(payload);
      console.log(response, 'myGifts');
      if (response?.isSuccess) {
        console.log(response.data);
        setGiftsData(response.data);
      } else {
        Alert.alert('Error', response?.error || 'failed to get gifts');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message || 'failed to get gifts');
    } finally {
      setLoading(false);
    }
  };

  console.log({giftsData});

  React.useEffect(() => {
    handleGetGifts();
  }, []);

  return (
    <View style={{flex: 1, marginBottom: 70}}>
      <HeaderBackTitle
        title="My Gifts"
        onBackPress={() => navigation.goBack()}
      />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            style={{
              width: '100%',
              alignSelf: 'center',
              flex: 1,
            }}
            numColumns={2}
            data={giftsData}
            ListEmptyComponent={
              <Text style={{textAlign: 'center'}}>
                {loading ? 'Loading..' : 'no data'}
              </Text>
            }
            keyExtractor={(item, _) => _}
            renderItem={({item, index}) => <GiftLi item={item} index={index} />}
            // onEndReached={handleFetchMoreUser}
            // onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </View>
  );
};

export default MyGifts;
