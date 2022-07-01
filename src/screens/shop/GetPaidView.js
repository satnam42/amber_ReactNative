import {useNavigation} from '@react-navigation/core';
import {Icon, Slider} from 'native-base';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {api_redeemRequest} from '../../api_services';
import {colors} from '../../constants';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {UPDATE_MY_PROFILE} from '../../redux/reducers/actionTypes';
import {createRef} from 'react';
const ShowGemCount = ({gemCount}) => {
  return (
    <View
      style={{
        marginVertical: 40,
        width: 150,
        padding: 10,
      }}>
      {/* tray */}
      <Image
        source={require('../../assets/icons/shop/tray.png')}
        style={{
          width: 150,
          height: 80,
          marginHorizontal: 10,
          resizeMode: 'contain',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: -5,
          left: -18,
          zIndex: -4,
        }}
      />

      {/* gem */}
      <Image
        source={require('../../assets/icons/shop/gem.png')}
        style={{
          width: 100,
          height: 100,
          marginHorizontal: 10,
          resizeMode: 'contain',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: -25,
          left: 80,
          zIndex: 2,
        }}
      />
      <Text
        style={{
          color: '#fff',
          padding: 10,
          fontSize: 25,
          fontWeight: 'bold',
        }}>
        {gemCount}
      </Text>
    </View>
  );
};
const MAX_GO_LIVE_RANGE = 720;
const GetPaidView = () => {
  const [slider, setSlider] = React.useState(0.2);
  const [loading, setLoading] = React.useState(false);
  const [goLiveRange, setGoLiveRange] = React.useState(70);
  const {coin, auth} = useSelector(state => state);
  const dispatch = useDispatch();
  const actionSheetRef = createRef();
  const navigation = useNavigation();

  const requestRedeem = async () => {
    setLoading(true);
    try {
      const res = await api_redeemRequest({
        token: auth?.accessToken,
        userId: auth?.user?.id,
      });
      console.log(res, 'res');
      if (res.isSuccess) {
        Alert.alert('Alert', 'success');
      } else {
        throw new Error(res?.error || 'failed to Redeem!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message || 'failed to redeem');
    } finally {
      setLoading(false);
    }
  };

  const handleReedemPress = () => {
    handldeSheet(true);
  };

  const onCustomRedeemClick = () => {
    if (auth?.user?.isBankDetailFilled) {
      requestRedeem();
    } else {
      navigation.navigate('SubmitBankDetails');
    }
  };

  const onPayPalRedeemClick = () => {
    navigation.navigate('PayPalMeScreen');
  };

  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('redeemSheet');
    } else {
      actionSheetRef?.current?.hide();
    }
  };

  return (
    <>
      <View style={{flex: 1, alignItems: 'center'}}>
        <ActionSheet id="redeemSheet" ref={actionSheetRef}>
          <View
            style={{
              height: 100,
            }}>
            <TouchableOpacity
              onPress={() => {
                onCustomRedeemClick();
                handldeSheet(false);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                }}>
                Custom
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPayPalRedeemClick();
                handldeSheet(false);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                }}>
                PayPal
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handldeSheet(false)}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                padding: 10,
                fontWeight: 'bold',
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </ActionSheet>

        <ShowGemCount gemCount={coin?.currectCoin} />
        <View
          style={{
            flex: 1,
            width: '100%',
            marginVertical: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.bgWhite,
              }}>
              Only
            </Text>
            <Image
              source={require('../../assets/icons/shop/gem.png')}
              style={{
                width: 30,
                height: 30,
                marginHorizontal: 10,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.bgWhite,
              }}>
              600 left to get
            </Text>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 35,
              fontWeight: 'bold',
              color: colors.bgWhite,
            }}>
            0.12$!
          </Text>
        </View>

        {/* scroll bar */}
        <View>
          {/* <Slider
            defaultValue={70}
            size="lg"
            colorScheme="green"
            style={{
              marginBottom: 10,
              width: 300,
            }}
            onChange={value =>
              setGoLiveRange(Math.round((value * MAX_GO_LIVE_RANGE) / 100))
            }>
            <Slider.Track bg="rgba(0,0,0,0.2)">
              <Slider.FilledTrack bg="#f6a201" />
            </Slider.Track>
            <Slider.Thumb borderWidth="0" bg="transparent">
              <View
                style={{
                  backgroundColor: '#f6a201',
                  width: 12,
                  height: 35,
                  borderRadius: 3,
                }}></View>
            </Slider.Thumb>
          </Slider> */}
          {/* scroll bar end */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.bgWhite,
              }}>
              {goLiveRange}/{MAX_GO_LIVE_RANGE}
            </Text>
            <Image
              source={require('../../assets/icons/shop/gem.png')}
              style={{
                width: 30,
                height: 30,
                marginHorizontal: 10,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      </View>
      {/* gradiant btn */}
      <TouchableOpacity onPress={handleReedemPress}>
        <View style={{padding: 20, alignItems: 'center'}}>
          <LinearGradient
            start={{x: 0.0, y: 0.3}}
            end={{x: 0.6, y: 1.0}}
            locations={[0.4, 1]}
            colors={['#f46f69', '#f8c748']}
            style={{
              width: '60%',
              marginBottom: 10,
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 5,
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                  letterSpacing: 0.8,
                }}>
                Redeem
              </Text>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>
      {/* <View style={{padding: 20, alignItems: 'center'}}>
        <LinearGradient
          start={{x: 0.0, y: 0.3}}
          end={{x: 0.6, y: 1.0}}
          locations={[0.4, 1]}
          colors={['#f46f69', '#f8c748']}
          style={{
            width: '60%',
            marginBottom: 10,
            borderRadius: 30,
          }}>
          <TouchableOpacity
            style={() => Alert.alert('Alert!', 'Comming Soon!')}>
            <Text
              style={{
                paddingVertical: 15,
                paddingHorizontal: 25,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                letterSpacing: 0.8,
              }}>
              Go Live
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View> */}
    </>
  );
};

export default GetPaidView;
