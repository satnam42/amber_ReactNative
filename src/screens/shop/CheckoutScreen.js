import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {
  CardField,
  createGooglePayPaymentMethod,
  initPaymentSheet,
  presentPaymentSheet,
  useConfirmPayment,
  useGooglePay,
  GooglePayButton,
} from '@stripe/stripe-react-native';
import stripe from 'tipsi-stripe';
import {STRIPE_PUBLIC_KEY} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {api_coinBuy, api_CointBuy, api_giftBuy} from '../../api_services';
import {REMOVE_SELECTED_COIN_FOR_PURCHASE} from '../../redux/reducers/actionTypes';
import {useNavigation} from '@react-navigation/core';
import {getUserCoin} from '../../redux/actions/coin.actions';

stripe.setOptions({
  publishableKey: STRIPE_PUBLIC_KEY,
});

const CheckoutScreen = () => {
  const {auth, coin} = useSelector(state => state);
  const dispatch = useDispatch(null);
  const navigation = useNavigation(null);

  console.log();

  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = React.useState('');
  const [googlePayError, setGooglePayError] = React.useState(false);

  const {confirmPayment, loading} = useConfirmPayment();
  const {
    isGooglePaySupported,
    initGooglePay,
    presentGooglePay,
    createGooglePayPaymentMethod,
  } = useGooglePay();

  const handleUpdateCoinCount = () => {
    dispatch(getUserCoin({token: auth?.accessToken, userId: auth?.user?.id}));
  };

  const handleUnmount = () => {
    dispatch({type: REMOVE_SELECTED_COIN_FOR_PURCHASE});
  };

  const handleToggleLoading = bool => setPaymentLoading(bool);

  // GetToken
  const getPaymentToken = async () => {
    console.log(coin.selectedCoinForPurchase._id, 'oooooooooooooo');
    const payload = {
      token: auth.accessToken,
      body: {
        coinId: coin.selectedCoinForPurchase._id,
        userId: auth.user.id,
        paymentMethod: 'card',
      },
    };
    const response = await api_coinBuy(payload);
    return response;
  };

  // PAY WITH STRIPE_CARD
  const openPaymentSheet = async () => {
    console.log('opening payment sheet');
    try {
      const {error} = await presentPaymentSheet({
        clientSecret: paymentClientSecret,
      });
      if (error) {
        Alert.alert('failed', error?.message || 'payment failed');
        console.log('err presentPaymentSheet', error);
      } else {
        Alert.alert('Success', 'payment Success');
        handleUpdateCoinCount();
      }
    } catch (err) {
      console.log('err presentPaymentSheet catvch', err);
    }
  };

  // PAY WITH GOOGLE_PAY
  const payWithGooglePay = async () => {
    if (!paymentClientSecret) return;

    console.log('running gp', {paymentClientSecret});
    // -----------------------------

    // const { error } = await presentGooglePay({
    //   clientSecret: paymentClientSecret,
    //   forSetupIntent: false,
    // });

    // if (error) {
    //   console.log(error)
    //   Alert.alert(error.code, error.message);
    //   // Update UI to prompt user to retry payment (and possibly another payment method)
    //   return;
    // }
    // Alert.alert('Success', 'The payment was confirmed successfully.');

    // ------------------------
    try {
      const {error, paymentMethod} = await createGooglePayPaymentMethod({
        amount: 12,
        currencyCode: 'usd',
      });

      if (error) {
        Alert.alert(error.code, error.message);
        return;
      } else if (paymentMethod) {
        Alert.alert(
          'Success',
          `The payment method was created successfully. paymentMethodId: ${paymentMethod.id}`,
        );
      }
    } catch (error) {
      console.log('failed createGooglePayPaymentMethod', error);
    }
  };

  // setup GooglePay
  const GooglePayInit = async () => {
    if (!(await isGooglePaySupported({testEnv: true}))) {
      setGooglePayError('Google Pay is not supported.');
      Alert.alert('Google Pay is not supported.');
      return;
    }

    const {error} = await initGooglePay({
      testEnv: true,
      merchantName: 'Amber',
      countryCode: 'US',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
    });

    if (error) {
      console.log(error, 'initgoogle');
      Alert.alert(error.code, error.message);
      return;
    }
  };

  // setup StripeCard
  const stripeInit = async () => {
    const response = await getPaymentToken();
    console.log(response);
    if (response.isSuccess) {
      const {paymentIntent: clientSecret} = response.data;
      console.log(clientSecret, 'clientSecret created');
      setPaymentClientSecret(clientSecret);
      // payment sheet
      const res = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Amber',
        // customerId: response?.data?.customer,
        // customerEphemeralKeySecret: response?.data?.ephemeralKey,
        // for google pay
        googlePay: true,
        merchantCountryCode: 'US',
        testEnv: true, // use test environment
      });
      if (res?.error) {
        console.log('ErrorCode ', error.code);
      }
    } else {
      Alert.alert('Failed 1', response?.message || 'failed to make purchase');
    }
  };

  React.useEffect(() => {
    GooglePayInit();
    stripeInit();
    return () => handleUnmount();
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <HeaderBackTitle
        title={'Checkout'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, alignItems: 'center', paddingBottom: 35}}>
        {/* Detalils */}
        <View
          style={{
            width: '80%',
            marginVertical: 15,
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Text
            style={{
              fontSize: 15,
              alignSelf: 'flex-start',
              opacity: 0.8,
              marginBottom: 5,
              color: '#000',
            }}>
            Order Summary
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#000',
              alignSelf: 'flex-start',
              opacity: 0.8,
            }}>
            Category: {coin?.selectedCoinForPurchase?.category}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#000',
              alignSelf: 'flex-start',
              opacity: 0.8,
            }}>
            Coins: {coin?.selectedCoinForPurchase?.coins}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 25,
              // fontWeight: "bold",
              color: '#ffb105',
              letterSpacing: 0.5,
            }}>
            Total Price: {coin?.selectedCoinForPurchase?.price}
          </Text>
        </View>
        {/* Hr */}
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: '100%',
            height: 2,
            marginVertical: 5,
          }}></View>

        {/* ---------------------- */}
        {/* BTN */}

        {/* {
          paymentLoading ? (
            <ActivityIndicator size="large" />
          ) :
            <TouchableOpacity
              style={{
                marginTop: 100,
                backgroundColor: "#549dfc",
                width: 150,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 40,
              }}
              onPress={handlePayPress}
            >


              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                }}
              >
                Pay Now
              </Text>
            </TouchableOpacity>
        } */}
      </View>
      {paymentClientSecret ? (
        <Button
          variant="primary"
          // disabled={!loading}
          title="Open Payment Sheet"
          onPress={openPaymentSheet}
        />
      ) : // <TouchableOpacity onPress={openPaymentSheet}>
      //   <Text>Open Payment Sheet</Text>
      // </TouchableOpacity>
      null}
      {/* {paymentClientSecret ? (
        googlePayError ? (
          <Text>{googlePayError}</Text>
        ) : (
          <GooglePayButton
            style={{
              width: 100,
              height: 50,
            }}
            type="standard"
            onPress={payWithGooglePay}
          />
        )
      ) : (
        <ActivityIndicator size="small" />
      )} */}
      {/* <TouchableOpacity onPress={payWithGooglePay}>
        <Text>payWithGooglePay ()</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({});
