import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {colors} from '../../constants';

import LinearGradient from 'react-native-linear-gradient';
import PaymentOptionsModal from '../../components/PaymentOptionsModal';
import PurchaseCompleteNotification from '../../components/PurchaseCompleteNotification';
import {api_getGifts} from '../../api_services';
import {useDispatch, useSelector} from 'react-redux';
import {SET_SELECTED_GIFT_FOR_PURCHASE} from '../../redux/reducers/actionTypes';

const PriceButton = props => {
  const {label, onPress} = props;

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 30,
        left: 22,
      }}
      onPress={onPress}>
      <LinearGradient
        start={{x: 0.0, y: 1}}
        end={{x: 0.8, y: 1.0}}
        locations={[0.1, 1]}
        colors={['#45bbcc', '#7ac7b5']}
        style={{
          width: 95,
          height: 30,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const GiftItem = ({item, setIsPaymentModelVisible}) => {
  if (!item.iconUrl || !item.title) return <></>;

  const dispatch = useDispatch();

  const handlePriceBtnPress = () => {
    setIsPaymentModelVisible(true);
    dispatch({
      type: SET_SELECTED_GIFT_FOR_PURCHASE,
      payload: item,
    });
  };

  return (
    <View
      style={{
        width: 140,
        height: 160,
        borderRadius: 15,
        marginBottom: 10,
        backgroundColor: colors.midPurpleColor,
      }}>
      {/* image */}
      <Image
        style={{
          width: 75,
          height: 75,
          position: 'absolute',
          top: 15,
          left: 34,
          resizeMode: 'contain',
        }}
        source={{uri: item?.iconUrl}}
      />

      <PriceButton label={item?.coin} onPress={handlePriceBtnPress} />
    </View>
  );
};

const GiftShop = () => {
  const [gifts, setGifts] = React.useState([]);
  const [isPaymentModelVisible, setIsPaymentModelVisible] =
    React.useState(false);

  const navigation = useNavigation();
  const {auth} = useSelector(state => state);

  const handleGetGifts = async () => {
    try {
      const payload = {token: auth.accessToken};
      const response = await api_getGifts(payload);
      console.log(response);
      if (response.isSuccess) {
        setGifts(response.items);
      } else {
        Alert.alert('Error', response?.message || 'failed to fetch gifts!');
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'failed to fetch gifts!');
    }
  };

  React.useEffect(() => {
    handleGetGifts();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.darkPurpleColor,
        paddingBottom: 80,
      }}>
      <HeaderBackTitle
        title="Gifts"
        onBackPress={() => navigation.goBack()}
        color="#fff"
      />

      <FlatList
        style={{
          width: '90%',
          alignSelf: 'center',
        }}
        columnWrapperStyle={{
          justifyContent: 'space-around',
        }}
        data={gifts}
        ListEmptyComponent={
          <Text style={{textAlign: 'center'}}>Loading..</Text>
        }
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item, index}) => (
          <GiftItem
            item={item}
            index={index}
            setIsPaymentModelVisible={setIsPaymentModelVisible}
          />
        )}
        // onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
      />

      {/* modals */}
      <PaymentOptionsModal
        visible={isPaymentModelVisible}
        setVisible={bool => setIsPaymentModelVisible(bool)}
      />
    </View>
  );
};

export default GiftShop;
