import React from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  REMOVE_OFFER_OVERLAY,
  SET_SELECTED_COIN_FOR_PURCHASE,
} from '../redux/reducers/actionTypes';
import NextBtn from './NextBtn';
import LinearGradient from 'react-native-linear-gradient';

import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/core';
const OfferOverlay = () => {
  const dispatch = useDispatch();
  const _carousel = React.useRef();
  const {isOfferPopupActive, offerData} = useSelector(state => state.popup);

  const navigation = useNavigation(null);
  const handlePopupClose = () => dispatch({type: REMOVE_OFFER_OVERLAY});

  const handleBuyPress = item => {
    dispatch({
      type: SET_SELECTED_COIN_FOR_PURCHASE,
      payload: item,
    });
    dispatch({type: REMOVE_OFFER_OVERLAY});

    navigation.navigate('CheckoutScreen');
  };

  return isOfferPopupActive && offerData ? (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Carousel
        loop={false}
        ref={_carousel.current}
        data={offerData}
        containerCustomStyle={{
          borderRadius: 100,
        }}
        slideStyle={{
          overflow: 'hidden',
        }}
        contentContainerCustomStyle={{
          overflow: 'hidden',
        }}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: '80%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LinearGradient
                start={{x: 0.1, y: 1}}
                end={{x: 0.8, y: 1.0}}
                locations={[0.1, 0.9]}
                colors={['#FCCA27', '#FFFFFF']}
                useAngle={true}
                angle={180}
                style={{
                  borderRadius: 15,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: 30,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {`Daily Offer (${index + 1})`}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 15,
                    }}
                    onPress={handlePopupClose}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>x</Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '78%',
                    height: 300,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 30,
                    paddingTop: 10,
                  }}>
                  <Image
                    style={{width: 140, height: 140}}
                    source={{uri: item?.iconUrl}}
                    resizeMode="contain"
                  />
                  {/* <Text style={{marginVertical: 10}}>{JSON.stringify(item)}</Text> */}
                  <View style={{}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Coins : {item?.coins}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginVertical: 5,
                      }}>
                      Price : ${item?.price}
                    </Text>
                  </View>
                  <NextBtn
                    title="Buy Now"
                    onPress={() => handleBuyPress(item)}
                    btnContainerStyle={{
                      width: '100%',
                      minWidth: 150,
                      height: 40,
                      paddingHorizontal: 10,
                    }}
                    textStyle={{
                      fontSize: 15,
                    }}
                  />
                </View>
              </LinearGradient>
            </View>
          );
        }}
        sliderWidth={300}
        itemWidth={Dimensions.get('window').width}
      />

      {/* <View
        style={{
          backgroundColor: '#fff',
          width: '80%',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 30,
          paddingTop: 5,
        }}>
        <View style={{alignItems: 'flex-end', width: '100%'}}>
          <TouchableOpacity onPress={handlePopupClose}>
            <Text>close</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={{width: 60, height: 60}}
          source={require('../assets/icons/logo.png')}
          resizeMode="contain"
        />
        <Text style={{marginVertical: 10}}>{JSON.stringify(offerData)}</Text>
        <NextBtn
          title="Buy Now"
          onPress={handlePopupClose}
          btnContainerStyle={{
            width: '100%',
            height: 40,
            paddingHorizontal: 10,
          }}
          textStyle={{
            fontSize: 15,
          }}
        />
      </View> */}
    </View>
  ) : (
    <></>
  );
};

export default OfferOverlay;
