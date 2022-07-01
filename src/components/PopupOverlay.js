import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View, Text, TouchableOpacity, Image, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AGREE_TO_TERM_AND_CONDITION_KEY} from '../constants';
import {REMOVE_POPUP_OVERLAY} from '../redux/reducers/actionTypes';
import NextBtn from './NextBtn';

const POPUP_SIZE = 260;
const PopupOverlay = () => {
  const dispatch = useDispatch();
  const {isPopupActive, popupData} = useSelector(state => state.popup);

  const handlePopupClose = () => dispatch({type: REMOVE_POPUP_OVERLAY});

  const handleAgree = async () => {
    try {
      const data = await AsyncStorage.setItem(
        AGREE_TO_TERM_AND_CONDITION_KEY,
        'true',
      );
      handlePopupClose();
    } catch (error) {
      console.log(error);
    }
  };
  return isPopupActive ? (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          width: '80%',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 30,
        }}>
        <Image
          style={{width: 60, height: 60}}
          source={require('../assets/icons/logo.png')}
          resizeMode="contain"
        />
        <Text style={{marginVertical: 10}}>
          By tapping Create Account or sign in, you agree to our Terms. Learn
          how we process your data in our privacy policy.
        </Text>
        <NextBtn
          title="Agree and continue"
          onPress={handleAgree}
          btnContainerStyle={{
            width: '100%',
            height: 40,
            paddingHorizontal: 10,
          }}
          textStyle={{
            fontSize: 15,
          }}
        />
        <TouchableOpacity onPress={() => BackHandler.exitApp()}>
          <Text
            style={{
              color: 'gray',
              marginTop: 10,
            }}>
            Disagree and Quit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <></>
  );
};

export default PopupOverlay;
