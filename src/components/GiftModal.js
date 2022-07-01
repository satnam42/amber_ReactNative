import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {api_getGifts, api_giftSend} from '../api_services';
import {getUserCoin} from '../redux/actions/coin.actions';

const data = [
  {
    title: 'bestGidt',
    coin: 100,
    icon: require('../assets/icons/gifts/gift1.png'),
    description: 'ashdfasdh ',
    _id: '6221962d4e98cc75f1af0997',
    createdAt: '2022-03-04T04:31:41.893Z',
    updatedAt: '2022-03-04T04:31:41.893Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift2.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift3.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift4.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift5.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift6.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift7.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift8.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift9.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift10.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift11.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift12.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift13.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift14.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift15.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
  {
    title: 'bestGidt77',
    coin: 100,
    icon: require('../assets/icons/gifts/gift16.png'),
    description: 'ashdfasdh ',
    _id: '622196474e98cc75f1af099e',
    createdAt: '2022-03-04T04:32:07.474Z',
    updatedAt: '2022-03-04T04:32:07.474Z',
    __v: 0,
  },
];

const GiftBox = ({item, index, handleSendGift, otherUserID}) => {
  const constant = {
    iconSize: 75,
    iconMinusSize: 15,
  };
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch(null);

  const [loading, setLoading] = React.useState(false);

  const handleGiftPress = async gift => {
    setLoading(true);
    console.log({gift});

    const payload = {
      token: auth.accessToken,
      body: {
        senderId: auth.user.id,
        receiverId: otherUserID,
        giftId: gift.id,
      },
    };

    try {
      const response = await api_giftSend(payload);
      console.log(response);
      if (response.isSuccess) {
        dispatch(
          getUserCoin({token: auth?.accessToken, userId: auth?.user?.id}),
        );
        handleSendGift(item);
        Alert.alert('Success', 'gift has been sent!');
      } else {
        Alert.alert('Failed', response?.error || 'failed to send gift!');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Failed', err.message || 'failed to send gift!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      style={{
        width: constant.iconSize,
        height: constant.iconSize,
        margin: 2,
        // justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {
        handleGiftPress(item);
      }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {item?.iconUrl ? (
            <Image
              style={{
                width: constant.iconSize - constant.iconMinusSize,
                height: constant.iconSize - constant.iconMinusSize,
              }}
              resizeMode="contain"
              source={{uri: item?.iconUrl}}
            />
          ) : (
            <Image
              style={{
                width: constant.iconSize - constant.iconMinusSize,
                height: constant.iconSize - constant.iconMinusSize,
              }}
              resizeMode="contain"
              // source={{ uri: item?.iconUrl }}
              source={require('../assets/icons/gifts/gift13.png')}
            />
          )}
          <Text
            style={{
              fontSize: 10,
              backgroundColor: '#000',
              paddingHorizontal: 20,
              color: '#FFF',
              borderRadius: 10,
            }}>
            {item?.coin}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const GiftModal = ({toggleGiftModal, index, handleSendGift, otherUserID}) => {
  const [gifts, setGifts] = useState([]);
  const closeGiftModal = () => {
    toggleGiftModal(false);
  };

  const {auth} = useSelector(state => state);

  const getGifts = async () => {
    console.log('GETTING GFT');
    const response = await api_getGifts({token: auth?.accessToken});

    console.log(response);
    if (response.isSuccess) {
      setGifts(response.items);
    } else {
      Alert.alert('ERROR ', 'failed to get gifts');
    }
  };

  useEffect(() => {
    getGifts();
  }, []);

  return (
    <View
      key={index}
      style={{
        width: '100%',
        height: 300,
        margin: 0,
        padding: 10,
        borderRadius: 5,
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          border: 1,
          elevation: 1,
          borderRadius: 1,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: '5%',
            marginVertical: 10,

            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
          }}>
          <Text style={{fontSize: 17, color: '#000'}}>Send Gift's</Text>
          <TouchableOpacity onPress={closeGiftModal}>
            <Ionicons name={'ios-close'} size={24} color={'#000'} />
          </TouchableOpacity>
        </View>

        <FlatList
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          columnWrapperStyle={{
            justifyContent: 'space-evenly',
            alignItems: 'flex-end',
            gap: 15,
          }}
          data={gifts}
          ListEmptyComponent={
            <Text style={{textAlign: 'center'}}>Loading..</Text>
          }
          keyExtractor={item => item._id}
          numColumns={3}
          renderItem={({item, index}) => (
            <GiftBox
              otherUserID={otherUserID}
              item={item}
              index={index}
              handleSendGift={handleSendGift}
            />
          )}
          //   onEndReached={fetchMore}
          //   onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  );
};

export default GiftModal;
