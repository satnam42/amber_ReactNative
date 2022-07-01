import React, {
  useEffect,
  useState,
  createContext,
  useLayoutEffect,
} from 'react';
import {Alert, Text, View, PermissionsAndroid} from 'react-native';
import MainTabs from '../../components/MainTabs';
import CallRoutes from '../video_call/CallRoutes';
import {isCalling} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import requestUserPermission from '../../utils/notificationServices';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import Geolocation from '@react-native-community/geolocation';

import SocketIOClient from 'socket.io-client';
import {
  ADD_OFFER_OVERLAY,
  ADD_TO_NOTIFICATION_STORAGE,
  GET_USER_COINS_COUNT_REQUEST,
  SETISVIDEOCALL,
  SET_LATEST_NOTIFICATION,
  SET_USER_COORDS,
  TEXT_MSG_RECIVED_NOTIFICATION,
  TOGGLE_IS_RECIVING,
} from '../../redux/reducers/actionTypes';
import {useNavigation} from '@react-navigation/core';
import PopupOverlay from '../../components/PopupOverlay';
import OfferOverlay from '../../components/OfferOverlay';
import {getUserCoin} from '../../redux/actions/coin.actions';
import {api_getDailyOffers, SOCKET_URL} from '../../api_services';
import {useRef} from 'react';
import useCustomBackHandler from '../../hooks/useCustomBackHandler';

const NotificationContext = createContext([]);
function Main() {
  const {auth, call} = useSelector(state => state);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [notificationStorage, setNotificationStorage] = useState([]);
  const socketRef = useRef(null);
  useCustomBackHandler();

  const handlePushNotification = notification => {
    dispatch({
      type: ADD_TO_NOTIFICATION_STORAGE,
      payload: notification,
    });

    dispatch({
      type: SET_LATEST_NOTIFICATION,
      payload: notification,
    });

    //  INVITATION NOTIFICATION
    if (notification?.data?.type === 'callReceive' && !call.isAlreadyInCall) {
      return;
      // dispatch({
      //   type: TOGGLE_IS_RECIVING,
      //   payload: notification?.data,
      // });

      // dispatch({
      //   type: SETISVIDEOCALL,
      //   payload: {bool: true, navigateTo: 'CallIncoming'},
      // });

      navigation.navigate('CallIncoming', {
        notificationData: notification?.data,
      });
    } else {
      console.log('isAlreadyInCall true');
    }
  };

  const handleTextMsgRecivedPop = noti => {
    console.log({noti});
    if (noti?.data?.type === 'messaging') {
      dispatch({
        type: TEXT_MSG_RECIVED_NOTIFICATION,
        payload: noti,
      });

      Toast.show({
        type: 'info',
        text1: noti?.notification?.title
          ? `${noti?.notification?.title}: messaging `
          : 'message recived...',
        text2: noti?.notification?.body || '',
      });
    }
  };

  const notificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'NOTIFICATION CLICKED FROM WHERE APP IS RUNN ON BACKGROUND !!!  ',
        );

        console.log(remoteMessage);
        const {conversationId, imageUrl, name, senderId} = remoteMessage?.data;

        navigation.navigate('ChatScreen', {
          conversationId: conversationId,
          otherUserName: name,
          otherUserProfileImage: imageUrl,
          otherUserID: senderId,
        });
        handlePushNotification(remoteMessage);
      }
    });

    messaging().onMessage(async remoteMessage => {
      console.log('NOTIFICATION CAUSE WHEN APP IS ON/ACTIVE', remoteMessage);
      // #
      handleTextMsgRecivedPop(remoteMessage);
      handlePushNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('NOTIFICATION CLICKED FROM WHERE APP CLOSE !!!  ');
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quite state',
            remoteMessage,
          );

          const {conversationId, imageUrl, name, senderId} =
            remoteMessage?.data;

          navigation.navigate('ChatScreen', {
            conversationId: conversationId,
            otherUserName: name,
            otherUserProfileImage: imageUrl,
            otherUserID: senderId,
          });
        }
        handlePushNotification(remoteMessage);
      })
      .catch(err => console.log(`error from CLOSE NOTI CLICK ${err.message}`));
  };

  const getLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          console.log('longitude', position.coords.longitude);
          console.log('latitude', position.coords.latitude);
          const {longitude, latitude} = position.coords;
          dispatch({
            type: SET_USER_COORDS,
            payload: {
              hasCoords: true,
              lng: longitude,
              lat: latitude,
            },
          });
        },
        err => {
          Alert.alert(
            'Permission Fail',
            `${err?.message} , make sure to enable loaction and reload app`,
          );
        },
        {enableHighAccuracy: false, timeout: 20000},
      );
    } catch (err) {
      console.log(err);
    }
  };

  const checkLocationPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      getLocation();
    } else {
      // request permission
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(res => {
          console.log(res);
          if (res === 'denied') {
            Alert.alert('Failed', 'Failed to get location due to permission');
          }
          if (res === 'granted') {
            getLocation();
          }
        })
        .catch(err => {
          console.log(err, 'decline');
        });
    }
  };

  const fetchLatestCoinValue = () => {
    dispatch(getUserCoin({token: auth?.accessToken, userId: auth?.user?.id}));
  };

  const connectSocket = () => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });

    console.log({socketRef});
    // listen for socket errors
    console.log('::::::  listen for callUser');
    socketRef.current.on('oops', oops => console.log({oops}, '@@@@'));
    socketRef.current.on('receiveCall', data => {
      console.log(data, '@@@@-receiveCall');
      navigation.navigate('CallIncoming', {
        notificationData: {...data, withSocket: true},
      });
    });
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
    if (auth?.user?.gender === 'male') {
      checkForDailyOffers();
    }
  }, []);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    checkLocationPermission();
    fetchLatestCoinValue();
  }, []);

  connectSocket();

  console.log({notificationStorage});
  return (
    <>
      <NotificationContext.Provider
        value={{notificationStorage, setNotificationStorage}}>
        <View style={{flex: 1}}>
          {call?.isVideoCalling ? <CallRoutes /> : <MainTabs />}
          <OfferOverlay />
          <PopupOverlay />
        </View>
      </NotificationContext.Provider>
    </>
  );
}

export default Main;
