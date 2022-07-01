import React, {useEffect, useState, useRef} from 'react';
import {Image, View, Dimensions, Text, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {
  END_VIDEO_CALL,
  SETISVIDEOCALL,
  SET_CALL_ACTION,
  SET_IS_ALREADY_IN_CALL,
} from '../../redux/reducers/actionTypes';
import SocketIOClient from 'socket.io-client';
import {BASE_URL, SOCKET_URL} from '../../api_services';
import {useNavigation} from '@react-navigation/core';
import moment from 'moment';
const {width, height} = Dimensions.get('screen');

const CallIncoming = ({route}) => {
  console.log(route, 'FROM CALL INCOMING');

  const {notificationData} = route.params;

  // callType: "simple"
  // channelName: "6257ef249620e4431ebe5890"
  // imageUrl: "http://93.188.167.68/projects/amber_nodejs/assets/images/1650452497411rn_image_picker_lib_temp_63d1f3fc-b824-4eb6-bbb4-49d4f9f726be.jpg"
  // name: "fish"
  // token: "00686f679b6daf845bba7ba5a2096f1ff34IAC6j4h4SgUmTd33TVyq/febQl15FaHVTCyjNQEEbKEEM3Glsf3vQpoXEAAcu2vNpIZiYgEAAQA0Q2Fi"
  // type: "callReceive"
  // userId: "58183"

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {auth, call} = useSelector(state => state);
  const socketRef = useRef(null);

  const hitHistoryUpdate = async () => {
    console.log('HITTING HISTORY UPDATE');
    const url = `${BASE_URL}/history/update/${notificationData?.data?.historyId}`;
    const payload = {duration: '00:00:00', time: moment().format('h:mm:ss a')};
    console.log({url, payload});
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': auth?.accessToken,
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res, 'hitHistoryUpdate');
        if (res.isSuccess) {
        } else {
          console.log(res);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const hitAcceptCallSocket = () => {
    console.log('HITTING acceptCall  SOCKET');

    let data;
    if (notificationData?.withSocket) {
      data = {Id: notificationData?.data?.channelName};
    } else {
      data = {Id: notificationData?.channelName};
    }
    socketRef.current?.emit('acceptCall', data);
  };
  const hitCallRejectSocket = () => {
    console.log('HITTING rejected  SOCKET');

    let data;
    if (notificationData?.withSocket) {
      data = {to: notificationData?.data?.channelName};
    } else {
      data = {to: notificationData?.channelName};
    }

    socketRef.current?.emit('rejected', data);
  };

  const handleAcceptIncomingCall = () => {
    console.log();
    // picking Call with socket or notifiactiondata
    hitAcceptCallSocket();
    if (notificationData?.withSocket) {
      navigation.navigate('LiveVideoCall', {
        api_uid: notificationData?.data?.userId,
        api_agora_token: notificationData?.data?.token,
        channel_id: notificationData?.data?.channelName,
        call_type: 'RECIVER',
        call_mode: 'NORMAL',
        callingToUserId: null,
      });
    } else {
      navigation.navigate('LiveVideoCall', {
        api_uid: notificationData?.userId,
        api_agora_token: notificationData.token,
        channel_id: notificationData.channelName,
        call_type: 'RECIVER',
        call_mode: 'NORMAL',
        callingToUserId: null,
      });
    }
    // dispatch({
    //   type: SET_IS_ALREADY_IN_CALL,
    //   payload: true,
    // });
    // navigation.navigate('LiveVideoCall', {
    //   iAmReceving: true,
    // });
  };
  const {latestNotification} = useSelector(state => state.notification);

  const handleDeclineIncomingCall = async () => {
    //new
    hitCallRejectSocket();

    //old
    socketRef.current.emit('call-decline');
    console.log('TRIGGER CALL DECLINE CALL SOCKET');
    await hitHistoryUpdate();
    console.log('TRIGGER END CALL');
    navigation.navigate('Home');
    dispatch({type: END_VIDEO_CALL});
    socketRef.current.disconnect();
  };

  const handleEndCall = () => {
    //  make socket connection
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });
    console.log({socketRef});
    // listen for socket errors
    socketRef.current.on('oops', oops => console.log({oops}));
    //listen for call close
    console.log('listen for call close', socketRef);
    socketRef.current.on('close', data => {
      console.log(data, 'socket close Call');
      Alert.alert('Video Call', 'Call Is Closed by other User!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    });
  };

  useEffect(() => {
    handleEndCall();
    () => socketRef?.current?.disconnect();
  }, []);

  return (
    <View
      style={{
        width: width,
        height: height,
      }}>
      {/* bg start */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fG1vZGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        }}
        style={{
          width: width,
          height: height,
          resizeMode: 'cover',
          opacity: 0.8,
          zIndex: -69,
        }}
      />
      {/* bg end*/}

      {/* Text Start */}

      <View
        style={{
          position: 'absolute',
          top: 200,
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#fff',
          }}>
          {latestNotification?.data?.name || 'unknow'} is calling...
        </Text>
      </View>
      {/* Text End */}

      {/* Call Btn Start */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: 300,
          position: 'absolute',
          bottom: 200,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            backgroundColor: '#f23637',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1,
          }}
          onPress={() => handleDeclineIncomingCall()}>
          <FontAwesome name="close" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            backgroundColor: '#49cf76',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1,
          }}
          onPress={() => handleAcceptIncomingCall()}>
          <Ionicons name="call" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Call Btn End */}
    </View>
  );
};
export default CallIncoming;
