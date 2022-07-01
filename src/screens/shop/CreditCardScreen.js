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
import {api_giftBuy} from '../../api_services';
import {REMOVE_SELECTED_GIFT_FOR_PURCHASE} from '../../redux/reducers/actionTypes';

stripe.setOptions({
  publishableKey: STRIPE_PUBLIC_KEY,
});

const CreditCardScreen = ({navigation, route}) => {
  const {paymentMethod} = route.params;
  const {auth, gift} = useSelector(state => state);
  const dispatch = useDispatch(null);

  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = React.useState('');

  const {confirmPayment, loading} = useConfirmPayment();
  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();

  const handleUnmount = () => {
    dispatch({type: REMOVE_SELECTED_GIFT_FOR_PURCHASE});
  };

  const handleToggleLoading = bool => setPaymentLoading(bool);

  const handleStripePayment = async () => {
    const payload = {
      token: auth.accessToken,
      body: {
        userId: auth?.user?.id,
        giftId: gift?.selectedGiftForPurchase?.id,
        paymentMethod: 'card',
      },
    };

    try {
      handleToggleLoading(true);
      const response = await api_giftBuy(payload);
      console.log(response);
      if (response.isSuccess) {
        // CHECKOUT WITH STRIPE START
        const {paymentIntent: clientSecret} = response.data;

        console.log(clientSecret, 'clientSecret created');

        setPaymentClientSecret(clientSecret);

        // payment sheet
        const res = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Merchant Name',
          // for google pay
          googlePay: true,
          merchantCountryCode: 'US',
          testEnv: true, // use test environment
        });

        //
        console.log(res, 'initPaymentSheet');

        if (res?.error) {
          console.log('ErrorCode ', error.code);
        }
      } else {
        Alert.alert('Failed 1', response?.message || 'failed to make purchase');
      }

      // CHECKOUT WITH STRIPE START END
    } catch (err) {
      Alert.alert('Failed 2', err?.message || 'failed to make intent');
    } finally {
      handleToggleLoading(false);
    }
  };

  const handlePayPress = () => {
    if (paymentMethod === 'StripeCard') {
      handleStripePayment();
    }
    if (paymentMethod === 'CreditCard') {
      navigation.navigate('ShopHome', {paymentStatus: true});
    }
  };

  function renderCreditCardForm() {
    return (
      <>
        <View
          style={{
            flex: 1,
            width: '80%',
            marginTop: 10,
          }}>
          {/* row 1*/}
          <View style={{padding: 5, marginVertical: 10}}>
            <View>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#555',
                }}>
                Card Number
              </Text>
              <TextInput
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderBottomWidth: 3,
                  fontSize: 15,
                  color: '#000',
                }}
              />
            </View>
          </View>
          {/* row 2*/}
          <View
            style={{
              padding: 5,
              marginVertical: 15,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#555',
                }}>
                Expiry Date
              </Text>
              <TextInput
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderBottomWidth: 3,
                  fontSize: 15,
                  color: '#000',
                }}
              />
            </View>
            <View style={{marginLeft: 30, minWidth: 40}}>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#555',
                }}>
                CVV
              </Text>
              <TextInput
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderBottomWidth: 3,
                  fontSize: 15,
                  color: '#000',
                }}
              />
            </View>
          </View>
          {/* row 3*/}
          <View style={{padding: 5, marginVertical: 15}}>
            <View>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#555',
                }}>
                Card Holder Name
              </Text>
              <TextInput
                style={{
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderBottomWidth: 3,
                  fontSize: 15,
                  color: '#000',
                }}
              />
            </View>
          </View>
        </View>
      </>
    );
  }

  const openPaymentSheet = async () => {
    console.log('opening payment sheet');
    try {
      const res = await presentPaymentSheet({
        clientSecret: paymentClientSecret,
      });
      console.log(res, 'presentPaymentSheet -------------------');
      if (res?.error) {
        console.log('err presentPaymentSheet', res?.error);
      }
    } catch (err) {
      console.log('err presentPaymentSheet catvch', err);
    }
  };

  const handleGooglePay = async () => {
    // try {
    //   const res = await isGooglePaySupported({ testEnv: true })
    //   console.log(res, "isGooglePaySupported")
    // } catch (error) {
    //   console.log(error, "isGooglePaySupported error")
    // }

    if (!(await isGooglePaySupported({testEnv: true}))) {
      Alert.alert('Google Pay is not supported.');
      return;
    }

    const {error} = await initGooglePay({
      testEnv: true,
      merchantName: 'Merchant Name',
      countryCode: 'US ',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: false,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: false,
    });

    if (error) {
      console.log(error, 'initgoogle');
      Alert.alert(error.code, error.message);
      return;
    }

    // generate token
    handleStripePayment();
  };

  const payWithGooglePay = async () => {
    console.log('running gp');
    const {error} = await presentGooglePay({
      clientSecret: paymentClientSecret,
      forSetupIntent: false,
    });

    if (error) {
      Alert.alert(error.code, error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.');
    // ----------------------

    // const { error, paymentMethod } = await createGooglePayPaymentMethod({
    //   amount: 12,
    //   currencyCode: 'USD',
    // });

    // if (error) {
    //   Alert.alert(error.code, error.message);
    //   return;
    // } else if (paymentMethod) {
    //   Alert.alert(
    //     'Success',
    //     `The payment method was created successfully. paymentMethodId: ${paymentMethod.id}`
    //   );
    // }
  };

  React.useEffect(() => {
    handleGooglePay();

    return () => handleUnmount();
  }, []);
  return (
    <ScrollView style={{flex: 1}}>
      <HeaderBackTitle
        title={paymentMethod === 'StripeCard' ? 'Stripe Card' : 'Credit Card'}
        navigation={navigation}
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
            {gift?.selectedGiftForPurchase?.title}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: '#000',
              alignSelf: 'flex-start',
              opacity: 0.8,
            }}>
            {gift?.selectedGiftForPurchase?.description}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 25,
              // fontWeight: "bold",
              color: '#ffb105',
              letterSpacing: 0.5,
            }}>
            Total Price: {gift?.selectedGiftForPurchase?.coin} coins
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
        {/* Cards */}
        {/* ---------------------- */}

        {paymentMethod === 'CreditCard' && renderCreditCardForm()}
        {/* ---------------------- */}
        {/* BTN */}

        {paymentLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity
            style={{
              marginTop: 100,
              backgroundColor: '#549dfc',
              width: 150,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 40,
            }}
            onPress={handlePayPress}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 0.5,
              }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={openPaymentSheet}>
        <Text>Open Payment Sheet</Text>
      </TouchableOpacity>

      <GooglePayButton
        style={{
          width: 100,
          height: 50,
        }}
        type="standard"
        onPress={payWithGooglePay}
      />
      {/* <TouchableOpacity onPress={payWithGooglePay}>
        <Text>payWithGooglePay ()</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default CreditCardScreen;

const styles = StyleSheet.create({});
