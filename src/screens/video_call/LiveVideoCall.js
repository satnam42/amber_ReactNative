import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import {
  api_coinDeduct,
  api_sendVideoCallInvitation,
  api_sendVideoCallInvitationToRandom,
  BASE_URL,
  generate_rtcToken,
  SOCKET_URL,
} from '../../api_services';
import requestCameraAndAudioPermission from '../../permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AGORA_APP_ID, colors} from '../../constants';

import SocketIOClient from 'socket.io-client';
import {connectAdvanced, useDispatch, useSelector} from 'react-redux';
import {
  END_VIDEO_CALL,
  SETISVIDEOCALL,
  SET_CALLING_DATA,
  SET_CALL_MODE,
  SET_IS_ALREADY_IN_CALL,
  TOGGLE_IS_RECIVING,
} from '../../redux/reducers/actionTypes';
import PurchaseCoinPopup from './PurchaseCoinPopup';
import {getUserCoin} from '../../redux/actions/coin.actions';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';
import {ALIGNMENT_KEY_PATTERN} from 'react-native-ui-lib/generatedTypes/src/commons/modifiers';
import {createIconSetFromFontello} from 'react-native-vector-icons';
let updatedE;

function formatTime(seconds) {
  return [
    parseInt(seconds / 60 / 60),
    parseInt((seconds / 60) % 60),
    parseInt(seconds % 60),
  ]
    .join(':')
    .replace(/\b(\d)\b/g, '0$1');
}

const ChatForm = ({togglePurchaseCoinPopup}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 10,

        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        zIndex: 3,
        justifyContent: 'space-around',
      }}>
      {/* input start */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingVertical: 5,
          alignItems: 'center',
          marginHorizontal: 15,
          borderRadius: 40,
          borderWidth: 2,
          borderColor: '#fff',
        }}>
        <AntDesign name="message1" size={24} color="#fff" />
        <TextInput
          style={{
            marginHorizontal: 15,
            paddingRight: 12,
          }}
          value=""
          placeholder="Type Something..."
          placeholderTextColor="#fff"
        />
      </View>
      {/* input end */}
      <View
        style={{
          flexDirection: 'row',
          width: 100,
          justifyContent: 'space-between',
          marginRight: 15,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: 5,
            borderRadius: 50,
          }}
          onPress={() => togglePurchaseCoinPopup(state => !state)}>
          <Image
            source={require('../../assets/icons/shop/coin.png')}
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: 5,
            borderRadius: 50,
          }}>
          <Ionicons name="gift" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: 5,
            borderRadius: 50,
          }}>
          <Ionicons name="glasses-sharp" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let CALL_MODE;
let CALL_TYPE;
let CALLING_TO_USER_ID;
let VIDEO_CALL_TIMER = 0;
let COIN_DEDUCT_INTERVAL;
let CALL_LISTEN_DATA = null;
let WAIT_FOR_USER_TO_JOIN_TIMEOUT;
let HISTORY_ID;

let CALL_RATE;
let REMAINING_COINS;
let CALL_TIME_IN_MIN;
let CALL_RATE_INTERVAL;

let SET_IS_ALREADY_TRIGGER_END_CALL = false;

const LiveVideoCall = ({route}) => {
  console.log({CALL_MODE, CALL_TYPE, CALLING_TO_USER_ID});

  let VIDEO_CALL_TIMER_INTERVAL;
  const {auth, call, coin} = useSelector(state => state);
  let i = coin?.currectCoin;
  // let i = 15;

  const iAmReceving = route.params;
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [rtcToken, setRtcToken] = useState(null);
  const [peerIds, setPeerIds] = useState([]);
  const [agora_Uid, setAgora_Uid] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [isPublisher, setIsPublisher] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPurchaseCoinPopupOpen, setIsPurchaseCoinPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const navigation = useNavigation();
  const [remainingCoinState, setRemainingCoinStates] = useState(0);

  const [sendMyVideo, setSendMyVideo] = useState(true);
  const [sendMyAudio, setSendMyAudio] = useState(true);

  const pan = useState(new Animated.ValueXY({x: 0, y: 0}))[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => (isFullScreen ? false : true),
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx);
        pan.y.setValue(gesture.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  )[0];

  const togglePurchaseCoinPopup = bool => {
    setIsPurchaseCoinPopupOpen(bool);
  };

  const fetchUserCoins = () => {
    dispatch(getUserCoin({token: auth?.accessToken, userId: auth?.user?.id}));
  };

  const hitHistoryUpdate = async (duration, time) => {
    console.log('HITTING HISTORY UPDATE');
    const url = `${BASE_URL}/history/update/${HISTORY_ID}`;
    const payload = {duration, time};
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

  const handleCloseVideoCall = async () => {
    try {
      // distroy engine
      await updatedE?.leaveChannel();
      await updatedE?.destroy();
    } catch (err) {
      console.log('ERROR IN CALL END', err);
    }
    // disconnect socket
    socketRef.current.disconnect();
    // clear calling route flags
    dispatch({
      type: TOGGLE_IS_RECIVING,
      payload: null,
    });
    dispatch({
      type: SET_IS_ALREADY_IN_CALL,
      payload: false,
    });
    dispatch({
      type: SET_CALL_MODE,
      payload: null,
    });
    dispatch({
      type: SET_CALLING_DATA,
      payload: null,
    });
    dispatch({
      type: END_VIDEO_CALL,
    });
    fetchUserCoins();
    navigation.navigate('Home');
  };

  const endCall = async () => {
    hitCloseCallSocket();

    clearTimeout(WAIT_FOR_USER_TO_JOIN_TIMEOUT);
    socketRef.current.emit('call-decline');

    const duration = VIDEO_CALL_TIMER - 1;
    const durationInMin = CALL_TIME_IN_MIN;
    clearInterval(CALL_RATE_INTERVAL);
    console.log({VIDEO_CALL_TIMER, duration});
    // if (call?.isReciving?.type !== 'callReceive') {
    clearInterval(VIDEO_CALL_TIMER_INTERVAL);

    if (SET_IS_ALREADY_TRIGGER_END_CALL) {
      return;
    } else {
      SET_IS_ALREADY_TRIGGER_END_CALL = true;
    }

    //HIT END CALL SOCKET
    if (CALL_TYPE === 'CALLER' && CALLING_TO_USER_ID) {
      //we are caller
      const endCallData = {};
      socketRef.current.emit('call-end', endCallData);
      await hitHistoryUpdate(
        JSON.stringify(durationInMin),
        moment().format('h:mm:ss a'),
      );
    } else {
      console.log('WILL NOT END CALL');
    }
    // ------------

    handleCloseVideoCall();
  };
  const getToken = async () => {
    const response = await generate_rtcToken({
      channelId: auth?.user?.id,
      authToken: auth?.accessToken,
      isPublisher: isPublisher,
    });

    console.log(response, 'generated token for video call');

    if (response.isSuccess && response.statusCode === 200) {
      const api_uid = response.data.userId;
      const api_agora_token = response.data.token;
      const channel_id = auth?.user?.id;

      setChannelId(channel_id);
      setRtcToken(api_agora_token);
      setAgora_Uid(api_uid);
      init(api_agora_token, channel_id, api_uid);
    } else {
      Alert.alert('Error', 'failed to generate agora token');
    }
  };

  const sendInvitationToRandom = async () => {
    console.log('SENDING INVITAION TO RANDOM');
    const payload = {token: auth.accessToken, data: {channelId: auth.user.id}};
    const response = await api_sendVideoCallInvitationToRandom(payload);
    console.log(response);

    if (response.isSuccess) {
      Alert.alert('success', 'INVITATION SENT TO RANDOm');
    }
  };

  const hitStartCall = () => {
    console.log('HITTING START CALL');
    // NORMAL CALL && WE ARE CALLER
    if (CALLING_TO_USER_ID) {
      console.log('*(((*(*((*(*(*(((*(*(*');
      const startCallData = {
        receiverId: CALLING_TO_USER_ID,
        callerId: auth?.user?.id,
      };
      console.log({startCallData}, 'startCallData');
      socketRef.current.emit('call-start', startCallData);
      socketRef.current.on('call-start', data => {
        console.log(data, 'id receving ?>');
        CALL_LISTEN_DATA = data;
        // Alert.alert(JSON.stringify(data));
      });
    }
    // RANDOM CALL && WE ARE CALLER
    if (CALL_MODE === 'RANDOM' && CALL_TYPE === 'CALLER') {
    }
  };

  const handleMuteMySelf = async () => {
    console.log('inside mute', {sendMyAudio});
    if (sendMyAudio) {
      //stop sending audio
      try {
        const muteResponse = await updatedE?.muteLocalAudioStream(false);
        console.log({muteResponse});
        setSendMyAudio(false);
      } catch (error) {
        console.log('inside mute', {error});
      }
    } else {
      //start sending audio
      try {
        const muteResponse = await updatedE?.muteLocalAudioStream(true);
        console.log({muteResponse});
        setSendMyAudio(true);
      } catch (error) {
        console.log('inside mute', {error});
      }
    }
  };

  const handleStopSharingMyVideo = async () => {
    console.log('inside mute muteLocalVideoStream');
    if (sendMyVideo) {
      // stop sharing
      try {
        const muteResponse = await updatedE?.muteLocalVideoStream(false);
        console.log({muteResponse});
        setSendMyVideo(false);
      } catch (error) {
        console.log('inside mute', {error});
      }
    } else {
      //start sharing
      try {
        const muteResponse = await updatedE?.muteLocalVideoStream(true);
        console.log({muteResponse});
        setSendMyVideo(true);
      } catch (error) {
        console.log('inside mute', {error});
      }
    }
  };

  const handleCut = () => {
    const checkRemainingCoin = () => {
      console.log('checkRemainingCoin', {
        REMAINING_COINS,
        CALL_TIME_IN_MIN,
        CALL_RATE,
      });

      if (REMAINING_COINS <= CALL_RATE) {
        clearInterval(CALL_RATE_INTERVAL);
        endCall();
        Alert.alert('coin khatam ho gaye!!');
      } else {
        //decrement coins and update CALL TIME IN MIN
        REMAINING_COINS = REMAINING_COINS - CALL_RATE;
        setRemainingCoinStates(REMAINING_COINS);
        CALL_TIME_IN_MIN = CALL_TIME_IN_MIN + 1;
      }
    };

    CALL_RATE_INTERVAL = setInterval(checkRemainingCoin, 60000); // one min
    // CALL_RATE_INTERVAL = setInterval(checkRemainingCoin, 600); /// one min fast forward
  };

  const init = async (AGORA_TOKEN, AGORA_CHANNEL_ID, AGORA_UID) => {
    const test = await RtcEngine.create(AGORA_APP_ID);
    updatedE = test;
    console.log('_ENGINE', test);

    await test.enableVideo();
    await test?.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await test?.setClientRole(ClientRole.Broadcaster);

    test.addListener('Warning', warn => {
      console.log('warning', warn);
    });

    test.addListener('Error', err => {
      console.log('Error', err);
    });

    test.addListener('UserJoined', (uid, elapsed) => {
      clearTimeout(WAIT_FOR_USER_TO_JOIN_TIMEOUT);
      console.log('UserJoined', uid, elapsed);

      setPeerIds([...peerIds, uid]);

      // START COIN DEDUCTION IF WE ARE CALLER
      if (CALL_TYPE === 'CALLER') {
        handleCut();
      }
    });

    test.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      Alert.alert('CALL END', ' Other User went Offline', [
        {
          text: 'OK',
          onPress: () => {
            endCall();
          },
        },
      ]);
    });

    test.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      setJoinSucceed(true);

      // if we are doing random call -> sent Invitaion to random
      if (CALL_MODE === 'RANDOM' && CALL_TYPE === 'CALLER') {
        sendInvitationToRandom();
      }

      // if we are calling user
      if (CALL_TYPE === 'CALLER' && CALLING_TO_USER_ID) {
        sendInvitation();
      }
    });

    console.log('JOINING WITH', {
      AGORA_CHANNEL_ID,
      AGORA_TOKEN,
      AGORA_UID,
    });

    test
      ?.joinChannel(AGORA_TOKEN, AGORA_CHANNEL_ID, null, AGORA_UID)
      .then(() => console.log('JOINED'))
      .catch(err => {
        console.log(err, 'JOINED FAILED');
        Alert.alert('warning', 'failed to join channel');
        endCall();
      });

    hitStartCall();
  };

  const sendInvitation = async () => {
    console.log('SENDING CALL INVITATION', {CALLING_TO_USER_ID});
    const payload = {
      token: auth.accessToken,
      data: {
        username: auth.user.username,
        imageUrl: auth?.user?.avatar,
        receiverId: CALLING_TO_USER_ID,
        channelName: channelId || auth?.user?.id,
      },
    };

    console.log('sending notifiaction with', payload);
    const response = await api_sendVideoCallInvitation(payload);
    console.log(response);
    if (response.isSuccess && response.statusCode === 200) {
      HISTORY_ID = response?.data?._id;
      console.log({HISTORY_ID});
      Alert.alert('SUCCESS', 'INVITAION SEND');
    } else {
      // endCall();
      // Alert.alert('ERROR', response.error || 'Something went wrong!');
    }
  };

  const handleEndCall = () => {
    console.log('END IN ');

    if (CALL_TYPE === 'CALLER') {
      // socketRef.current.emit('set-channel', auth.user.id);
    }

    // listen for CALL DECLINE SOCKET
    socketRef.current.on('call-decline', () => {
      endCall();
    });
  };

  const handleUserJoining = () => {
    WAIT_FOR_USER_TO_JOIN_TIMEOUT = setTimeout(() => {
      endCall();
      Alert.alert('User not Joined!');
    }, 15000);
  };

  const hitCloseCallSocket = () => {
    let data;
    if (CALL_TYPE === 'CALLER') {
      //set reviver id in data
      data = {to: CALLING_TO_USER_ID};
    } else {
      //set caller id in data
      data = {to: channelId};
    }

    socketRef.current.emit('close', data);
  };

  const listenForCallSocketEvent = () => {
    //make socket connection
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });

    console.log('listenForCallSocketEvents', socketRef);
    // listen for socket errors
    socketRef.current.on('oops', oops => console.log({oops}, '@@@@'));
    // listen for socket acceptCall
    socketRef.current.on('acceptCall', oops => {
      console.log({oops}, 'socket acceptCall');
    });
    // listen for socket rejected Call
    socketRef.current.on('rejected', oops => {
      console.log({oops}, 'socket rejected Call');
      endCall();
      Alert.alert('Video Call', 'Call Is Rejected');
    });
    // listen for socket close Call
    socketRef.current.on('close', oops => {
      console.log({oops}, 'socket close Call'), endCall();
      Alert.alert('Video Call', 'Call Is Closed by other User!');
    });
  };

  useEffect(() => {
    listenForCallSocketEvent();
    handleUserJoining();
    CALL_TIME_IN_MIN = 0;
    CALL_RATE = route?.params?.call_rate;
    REMAINING_COINS = coin?.currectCoin;
    setRemainingCoinStates(REMAINING_COINS);

    SET_IS_ALREADY_TRIGGER_END_CALL = false;
    HISTORY_ID = null;
    CALL_LISTEN_DATA = null;
    VIDEO_CALL_TIMER = 0;
    console.log(route.params, 'lll');
    CALL_MODE = route?.params?.call_mode || 'NORMAL';
    CALL_TYPE = route?.params?.call_type || 'CALLER';
    CALLING_TO_USER_ID = route?.params?.callingToUserId;

    const controller = new AbortController();
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }

    if (CALL_MODE === 'RANDOM' && CALL_TYPE === 'RECIVER') {
      console.log('CORRECT PLACE');
      if (call?.callingData) {
        //caller
        const {channelId, token, userId} = call?.callingData;

        if (channelId && token && userId) {
          setChannelId(channelId);
          init(token, channelId, userId);
        } else {
          Alert.alert('need token, channelId and userid forn joing channel');
        }
      } else {
        //reciver
      }
    } else {
      //normal call---
      if (CALL_MODE === 'NORMAL' && CALL_TYPE === 'RECIVER') {
        //reciver
        console.log('REVIVER MODE', route.params);
        const {api_uid, api_agora_token, channel_id} = route.params;

        if ((api_uid, api_agora_token, channel_id)) {
          setChannelId(channel_id);
          setRtcToken(api_agora_token);
          setAgora_Uid(api_uid);
          init(api_agora_token, channel_id, parseFloat(api_uid));
        }
      } else {
        //caller
        const {api_uid, api_agora_token, channel_id} = route.params;
        if ((api_uid, api_agora_token, channel_id)) {
          setChannelId(channel_id);
          setRtcToken(api_agora_token);
          setAgora_Uid(api_uid);
          init(api_agora_token, channel_id, api_uid);
        }
      }
    }

    //END CALL ?
    handleEndCall();

    // unmount
    return () => {
      endCall();
      controller.abort();
    };
  }, []);

  console.log({peerIds});

  console.log({isFullScreen});

  return (
    <>
      {isPurchaseCoinPopupOpen && (
        <PurchaseCoinPopup togglePurchaseCoinPopup={togglePurchaseCoinPopup} />
      )}
      <View style={styles.max}>
        {/* us  */}

        {/*  REMAINING COUNT */}
        {auth?.user?.gender === 'male' && peerIds?.length > 0 && (
          <View
            style={{
              height: 50,
              width: '100%',
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 18}}>
              REMAINING_COINS = {remainingCoinState}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            console.log('ooooo');
            setIsFullScreen(!isFullScreen);
          }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              transform: [
                {
                  translateX: pan.x,
                },
                {
                  translateY: pan.y,
                },
              ],
            }}>
            {/* close zoom in */}

            {joinSucceed && channelId ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('ooooo');
                  setIsFullScreen(!isFullScreen);
                }}
                style={
                  isFullScreen
                    ? {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        left: 0,
                        zIndex: 100,
                      }
                    : peerIds?.length <= 0
                    ? {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                      }
                    : {
                        position: 'absolute',
                        top: 35,
                        left: 30,
                        borderColor: '#fff',
                        borderWidth: 2,
                        zIndex: 100,
                      }
                }>
                {isFullScreen && (
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      zIndex: 201,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                    }}>
                    <TouchableOpacity onPress={() => setIsFullScreen(false)}>
                      <AntDesign name={'shrink'} color="#fff" size={24} />
                    </TouchableOpacity>
                  </View>
                )}
                <RtcLocalView.SurfaceView
                  style={
                    isFullScreen
                      ? {
                          width: windowWidth,
                          height: windowHeight,
                          zIndex: 200,
                        }
                      : peerIds?.length <= 0
                      ? {
                          width: windowWidth,
                          height: windowHeight,
                        }
                      : {
                          width: 160,
                          height: 200,
                        }
                  }
                  channelId={channelId}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay={true}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </Animated.View>
        </TouchableOpacity>
        {/* other user  */}
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: '100%',
            zIndex: -1,
            height: '100%',
          }}>
          {peerIds ? (
            peerIds.map((value, idx) => {
              return (
                <RtcRemoteView.SurfaceView
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    width: '100%',
                    height: '100%',
                  }}
                  uid={value}
                  key={idx}
                  channelId={channelId}
                  renderMode={VideoRenderMode.Hidden}
                  // zOrderMediaOverlay={true}
                />
              );
            })
          ) : (
            <Text></Text>
          )}
        </View>
        {!peerIds?.length ? (
          <Text
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{translateX: -100}],
              color: '#fff',
              fontSize: 24,
              backgroundColor: 'transparent',
            }}>
            Wait for user to join...
          </Text>
        ) : null}

        {/* right icons start*/}
        {!isFullScreen && (
          <View
            style={{
              minHeight: 200,
              position: 'absolute',
              width: '100%',
              bottom: 80,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 2,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                margin: 10,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 5,
                }}
                onPress={() => endCall()}>
                <MaterialIcons name="call-end" size={24} color={'#fff'} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <FontAwesome name="briefcase" size={24} color={'#fff'} />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 5,
                }}
                onPress={() => handleStopSharingMyVideo()}>
                <FontAwesome5
                  name={!sendMyVideo ? 'video' : 'video-slash'}
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 5,
                }}
                onPress={() => handleMuteMySelf()}>
                <FontAwesome
                  name={!sendMyAudio ? 'microphone' : 'microphone-slash'}
                  size={24}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* right icons end*/}
        {/* {!isFullScreen && (
          <ChatForm togglePurchaseCoinPopup={togglePurchaseCoinPopup} />
        )} */}
      </View>
    </>
  );
};

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});

export default LiveVideoCall;
