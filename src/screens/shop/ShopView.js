import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {date} from 'yup';
import {api_getCoins, api_getDailyOffers} from '../../api_services';
import PaymentOptionsModal from '../../components/PaymentOptionsModal';
import PurchaseCompleteNotification from '../../components/PurchaseCompleteNotification';
import {colors} from '../../constants';
import ImageComp from '../../components/ImageComp';
import {useNavigation} from '@react-navigation/core';
import {
  ADD_OFFER_OVERLAY,
  SET_SELECTED_COIN_FOR_PURCHASE,
} from '../../redux/reducers/actionTypes';
// #45bbcc #7ac7b5
const PriceButton = props => {
  const {title, setVisible, onPress} = props;

  const navigation = useNavigation();
  const redirectToFreeEarningScreen = () => {
    navigation.navigate('EarnFreeCoinScreen');
  };

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 30,
        left: 22,
      }}
      onPress={
        onPress
        // title === 'Free !'
        //   ? redirectToFreeEarningScreen
        //   : () => setVisible(true)
        // : () => navigation?.navigate("CreditCardScreen")
      }>
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
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const CoinBox = ({item, index, setVisible}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePriceBtnPress = () => {
    dispatch({
      type: SET_SELECTED_COIN_FOR_PURCHASE,
      payload: item,
    });
    navigation.navigate('CheckoutScreen');
  };
  return (
    <View
      style={{
        width: 140,
        height: 170,
        borderRadius: 15,
        margin: 15,

        backgroundColor: item?.isPopular ? '#29AB87' : colors.midPurpleColor,
      }}>
      {/* image */}
      <View
        style={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff'}}>{item?.coins}</Text>
      </View>

      {/* price */}
      {/* <Image
        style={{
          width: 75,
          height: 75,
          position: 'absolute',
          top: 30,
          left: 34,
        }}
        source={{uri: item?.iconUrl}}
      /> */}
      <ImageComp
        URI={item?.iconUrl}
        imageStyles={{
          width: 75,
          height: 75,
          position: 'absolute',
          top: 30,
          left: 34,
        }}
        imageContainerStyles={{
          backgroundColor: 'transparent',
          top: 0,
          left: 0,
        }}
        loaderStyles={{
          top: 50,
          left: 50,
        }}
      />
      <View
        style={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 1,
        }}>
        {item?.isPopular && (
          <Text
            style={{
              backgroundColor: '#fff',
              padding: 5,
              borderRadius: 10,
              position: 'absolute',
              top: -5,
              left: 100,
              transform: [{rotate: '25deg'}],
            }}>
            Popular
          </Text>
        )}
      </View>

      <PriceButton
        title={`$ ${item?.price}`}
        onPress={handlePriceBtnPress}
        navigation={navigation}
        setVisible={setVisible}
      />
    </View>
  );
};

const ShopView = props => {
  const {navigation, route, paymentStatus, containerWidth = '80%'} = props;
  const dispatch = useDispatch(null);
  const [visible, setVisible] = React.useState(false);
  const [purchaseNotificationVisible, setPurchaseNotificationVisible] =
    React.useState(paymentStatus);
  const [coinsData, setCoinsData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const {auth} = useSelector(state => state);

  const handleGetCoins = async () => {
    setLoading(true);
    try {
      const response = await api_getCoins({token: auth.accessToken});
      console.log(response, 'getCoins');
      if (response?.isSuccess) {
        setCoinsData(response.items);
      } else {
        Alert.alert('failed', response?.message || 'failed to get coins');
      }
    } catch (error) {
      Alert.alert('failed', error?.message || 'failed to get coins');
    } finally {
      setLoading(false);
    }
  };

  const checkForDailyOffers = async () => {
    try {
      const res = await api_getDailyOffers({token: auth?.accessToken});
      console.log(res, 'dailyOffers');
      if (res?.isSuccess) {
        //show  popup
        if (res?.data) {
          dispatch({type: ADD_OFFER_OVERLAY, payload: res?.data});
        }
      } else {
        throw new Error(res?.error || 'something went worng !');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    }
  };

  React.useEffect(() => {
    handleGetCoins();
    checkForDailyOffers();
  }, []);

  return (
    <>
      <View style={{flex: 1, alignItems: 'center'}}>
        <FlatList
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          columnWrapperStyle={{
            justifyContent: 'space-around',
          }}
          data={coinsData}
          ListEmptyComponent={
            <View
              style={{
                width: '100%',
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size={'small'} color="white" />
              ) : (
                <Text style={{textAlign: 'center'}}>No Coins...</Text>
              )}
            </View>
          }
          keyExtractor={item => item._id}
          numColumns={2}
          renderItem={({item, index}) => (
            <CoinBox key={item._id} item={item} setVisible={setVisible} />
          )}
        />
      </View>

      <View
        style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <PaymentOptionsModal
          visible={visible}
          setVisible={setVisible}
          navigation={navigation}
        />
      </View>
      <PurchaseCompleteNotification
        setPurchaseNotificationVisible={setPurchaseNotificationVisible}
        purchaseNotificationVisible={purchaseNotificationVisible}
      />
    </>
  );
};

export default ShopView;
