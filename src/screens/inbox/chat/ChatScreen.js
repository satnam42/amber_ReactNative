import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Spin from 'react-native-spinkit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  api_blockUser,
  api_userReport,
  generate_rtcToken,
  SOCKET_URL,
} from '../../../api_services';
import MyLoader from '../../../components/MyLoader';
import {useDispatch, useSelector} from 'react-redux';
import SocketIOClient from 'socket.io-client';
import {
  ADD_CHAT_STORAGE,
  CHAT_REDUCER_REFRESH,
  DESTORY_CHAT_STORAGE,
} from '../../../redux/reducers/actionTypes';
import {getOldChat} from '../../../redux/actions/chat.actions';
import DefaultImage from '../../../components/DefaultImage';
import GiftModal from '../../../components/GiftModal';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {createRef} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ReportUser from '../../../components/ReportUser';

const chatData = [
  {
    id: 1,
    sender: 'Elina',
    reciver: 'pankaj',
    time: '11:47',
    message: 'i love your live stream',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 2,
    sender: 'pankaj',
    reciver: 'Elina',
    time: '11:47',
    message: 'Thank you so much!. ❤❤❤',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 3,
    sender: 'Elina',
    reciver: 'pankaj',
    time: '11:47',
    message: 'where are you from ?...',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 4,
    sender: 'pankaj',
    reciver: 'Elina',
    time: '11:47',
    message: 'im from india',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 5,
    sender: 'Elina',
    reciver: 'pankaj',
    time: '11:47',
    message: 'i am comming to india next month',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 6,
    sender: 'pankaj',
    reciver: 'Elina',
    time: '11:47',
    message: 'nice',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: true,
  },
  {
    id: 16,
    sender: 'Elina',
    reciver: 'pankaj',
    time: '11:47',
    message: 'can we meet there.',
    sendStatus: true,
    recivedStatus: true,
    seenStatus: false,
  },
  {
    id: 7,
    sender: 'pankaj',
    reciver: 'Elina',
    time: '11:47',
    message: 'sure',
    sendStatus: true,
    recivedStatus: false,
    seenStatus: false,
  },
];
const ChatHeader = ({
  navigation,
  name,
  avatar,
  otherUserID,
  handldeSheet,
  handleReportUserSheet,
}) => {
  console.log(otherUserID, 'otherUserID - ChatHeader');
  const [isLoading, setIsLoading] = useState(false);
  const {auth, coin} = useSelector(state => state);
  const socketRef = useRef(null);
  const hitCallUserSocket = () => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });
    const dataObj = {
      channelName: auth?.user?.id,
      receiverId: otherUserID,
      callerId: auth?.user?.id,
      username: auth?.user?.username,
    };
    socketRef.current.emit('callUser', dataObj);
    console.log('::::::::::::::::CALL USER EMITTED  with', dataObj);
  };

  const getTokenForVideoCall = async () => {
    setIsLoading(true);
    try {
      const response = await generate_rtcToken({
        channelId: auth?.user?.id,
        authToken: auth?.accessToken,
        isPublisher: true,
      });

      if (response.isSuccess && response.statusCode === 200) {
        console.log(response, 'generate_rtcToken');
        const api_uid = response.data.userId;
        const api_agora_token = response.data.token;
        const channel_id = auth?.user?.id;
        const call_rate = response?.data?.rate;

        if (api_uid && api_agora_token && channel_id) {
          hitCallUserSocket();
          navigation.navigate('LiveVideoCall', {
            api_uid,
            api_agora_token,
            channel_id,
            call_type: 'CALLER',
            call_mode: 'NORMAL',
            callingToUserId: otherUserID,
            call_rate,
          });
        }
      } else {
        Alert.alert('Error', 'failed to generate agora token');
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'failed to generate agora token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoCallPress = () => {
    // for female
    if (auth?.user?.gender === 'female') {
      getTokenForVideoCall();
      return;
    }

    // for male
    if (coin?.currectCoin > 59) {
      getTokenForVideoCall();
    } else {
      Alert.alert('Alert', 'you dont have enough coin to call,', [
        {
          text: 'Buy Now',
          onPress: () => navigation.navigate('Shop'),
          style: 'cancel',
        },
        {
          text: 'Later',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: 70,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Icon
          name="ios-arrow-back"
          size={40}
          style={{
            paddingHorizontal: 10,
            marginTop: 5,
          }}
          color="#555"
        />
      </TouchableOpacity>

      {avatar ? (
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
          source={{
            uri: avatar,
          }}
        />
      ) : (
        <DefaultImage
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
          iconSize={50}
          color={'#555'}
        />
      )}
      <View style={{flex: 1, padding: 10}}>
        <Text
          style={{fontSize: 20, fontWeight: 'bold', color: 'rgba(0,0,0,0.6)'}}>
          {name || 'no name'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: 80,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity onPress={() => handleVideoCallPress()}>
          <FontAwesome
            name="video-camera"
            style={{marginTop: 1}}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handldeSheet(true);
          }}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            style={{marginTop: 1}}
            color={'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

let audioRecorderPlayer;
const ChatForm = ({
  sendChatMsg,
  fireTypingEvent,
  handleSendGift,
  otherUserID,
  handldeSheet2,
}) => {
  const [message, setMessage] = useState('');
  const [isGiftModalVisible, setIsGiftModalVisible] = useState(false);

  const [recordSecs, setRecordSecs] = React.useState(null);
  const [recordTime, setRecordTime] = React.useState(null);
  const [currentPositionSec, setCurrentPositionSec] = React.useState(null);
  const [currentDurationSec, setCurrentDurationSec] = React.useState(null);
  const [playTime, setPlayTime] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isRecordBoxShow, setIsRecordBoxShow] = React.useState(false);
  const [isPlayingRecordedSound, setIsPlayingRecordedSound] =
    React.useState(false);
  const [recordedVoiceURI, setRecordedVoiceURI] = React.useState(null);
  const [hasRecordedAudioToPlay, setHasRecordedAudioToPlay] =
    React.useState(false);

  const handleSendMessage = () => {
    sendChatMsg(message);
    setMessage('');
  };

  const {auth} = useSelector(state => state);

  const onTyping = () => {
    fireTypingEvent(true);
  };

  const toggleGiftModal = bool => {
    setIsGiftModalVisible(bool);
  };

  useEffect(() => {
    if (message) fireTypingEvent(true);
  }, [message]);

  const askForPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        console.log('write external stroage', grants);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };
  const audioRecorderInit = () => {
    audioRecorderPlayer = new AudioRecorderPlayer();
    console.log(audioRecorderPlayer);
  };

  const onStartRecord = async () => {
    console.log('onStartRecord');
    setRecordedVoiceURI(null);
    setHasRecordedAudioToPlay(false);
    audioRecorderInit();
    setIsRecordBoxShow(true);
    setIsListening(true);
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      return;
    });
    console.log(result);
  };

  const onStopRecord = async () => {
    console.log('onStopRecord');
    setIsListening(false);
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
    setHasRecordedAudioToPlay(true);
    setRecordedVoiceURI(result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    setIsPlayingRecordedSound(true);
    const msg = audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      return;
    });
  };

  const onPausePlay = async () => {
    console.log('onPausePlay');
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    setIsPlayingRecordedSound(false);
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const handldleMicPress = () => {
    askForPermission();
    onStartRecord();
  };

  const handleCloseRecordBox = () => {
    setIsPlayingRecordedSound(false);
    setIsRecordBoxShow(false);
    setHasRecordedAudioToPlay(false);
    onStopRecord();
  };
  return (
    <>
      {isGiftModalVisible && (
        <GiftModal
          otherUserID={otherUserID}
          toggleGiftModal={toggleGiftModal}
          handleSendGift={handleSendGift}
        />
      )}
      {/* RECORD BOX */}
      {isRecordBoxShow && (
        <View
          style={{
            alignSelf: 'center',
            // height: 300 + 150 ,
            height: 170,
            width: '95%',
            borderColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            margin: 5,
            borderRadius: 10,

            borderWidth: 2,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Recording Audio</Text>
            <TouchableOpacity onPress={handleCloseRecordBox}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          {/* <View>
            <Text> - - - - - - - - - - - - </Text>
            <Text>- - - {isListening ? 'LISTING TO YOUR VOICE' : ''} - - </Text>
            {isListening && (
              <Spin type="Wave" isVisible={isListening} color="red" size={30} />
            )}
            <Text> - - - - - - - - - - - - </Text>
            <Text>recordTime: {recordTime}</Text>
            <Text>recordSecs: {recordSecs}</Text>
            <Text>currentPositionSec: {currentPositionSec}</Text>
            <Text>currentDurationSec: {currentDurationSec}</Text>
            <Text>playTime: {playTime}</Text>
            <Text>duration: {duration}</Text>
            <Text> - - - - - - - - - - - - </Text>
          </View> */}
          {/* 
          {isListening && (
            <View>
              <TouchableOpacity onPress={onStopRecord}>
                <Text>Stop Recording</Text>
              </TouchableOpacity>
            </View>
          )} */}
          {/* {hasRecordedAudioToPlay && (
            <View>
              <TouchableOpacity onPress={onStartPlay}>
                <Text>Play Recorded Voice</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPausePlay}>
                <Text>pause Playing Voice</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStopPlay}>
                <Text>Stop Playing</Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* {recordedVoiceURI && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Will Send this', recordedVoiceURI);
              }}>
              <Text>SEND</Text>
            </TouchableOpacity>
          )} */}

          <View
            style={{
              width: '100%',
              // backgroundColor: 'blue',
              height: 150,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isListening && (
              <Spin type="Wave" isVisible={true} color="red" size={30} />
            )}
            <Text style={{fontSize: 30, color: '#000'}}>{recordTime}</Text>

            {isListening && (
              <TouchableOpacity
                onPress={() => {
                  onStopRecord();
                }}>
                <FontAwesome name="hand-stop-o" size={35} color="gray" />
              </TouchableOpacity>
            )}

            {isPlayingRecordedSound && (
              <View>
                <Text>
                  {playTime}/{duration}
                </Text>
              </View>
            )}
            {hasRecordedAudioToPlay && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={onStopPlay}
                  style={{
                    margin: 6,
                  }}>
                  <FontAwesome
                    name="stop-circle"
                    size={24 + 5}
                    color={'#000'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onStartPlay}
                  style={{
                    margin: 6,
                  }}>
                  <AntDesign name="play" size={24} color={'#000'} />
                </TouchableOpacity>
                {/* {isPlayingRecordedSound && (
                  <TouchableOpacity>
                    <AntDesign name="pausecircle" size={24} color={'#000'} />
                  </TouchableOpacity>
                )} */}
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('Will Send this', recordedVoiceURI);
                  }}
                  style={{
                    margin: 6,
                  }}>
                  <AntDesign name="checkcircle" size={24} color={'#000'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      {/* RECORD BOX END */}
      <View
        style={{
          width: '100%',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: 10,
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
          }}
          onPress={() => {
            handldeSheet2(true);
          }}>
          <Ionicons name="ios-camera" size={20} color="gray" />
        </TouchableOpacity>

        {/* input start */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            marginHorizontal: 15,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: 'gray',
          }}>
          {auth?.user?.gender === 'male' && (
            <TouchableOpacity
              style={{
                marginLeft: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
              }}
              onPress={() => toggleGiftModal(!isGiftModalVisible)}>
              <Ionicons name="gift" size={20} color="gray" />
            </TouchableOpacity>
          )}
          <TextInput
            style={{
              marginHorizontal: 10,
              paddingRight: 12,
              color: '#000',
            }}
            onFocus={() => {
              console.log('focus received');
              onTyping();
            }}
            placeholderTextColor="#555"
            onBlur={() => console.log('focus lost')}
            value={message}
            onChangeText={value => setMessage(value.trimStart())}
            placeholder="Type Something..."
            onSubmitEditing={handleSendMessage}
          />
        </View>
        {/* input end */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 15,
          }}>
          {message.length ? (
            <TouchableOpacity
              onPress={handleSendMessage}
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
              }}>
              <Ionicons name="ios-send" size={22} color="gray" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handldleMicPress}
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
              }}>
              <FontAwesome name="microphone" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const MessageStatus = ({status}) => {
  return (
    <View style={{width: 20}}>
      {status === 'SEND' && (
        <Ionicons name="checkmark" size={18} color="#fff" />
      )}
      {status === 'RECIVED' && (
        <Ionicons name="checkmark-done" size={18} color="#fff" />
      )}
      {status === 'SEEN' && (
        <Ionicons name="checkmark-done" size={18} color="#03f6c5" />
      )}
    </View>
  );
};

const ChatMessage = ({item, index}) => {
  const [status, setStatus] = useState('SEND');
  const [isSideLeft, setIsSideLeft] = useState(false);

  const {user} = useSelector(state => state.auth);

  // useEffect(() => {
  //   // seen status
  //   const { sendStatus, recivedStatus, seenStatus } = item;
  //   if (sendStatus && !recivedStatus && !seenStatus) {
  //     setStatus("SEND");
  //   }
  //   if (sendStatus && recivedStatus && !seenStatus) {
  //     setStatus("RECIVED");
  //   }
  //   if (sendStatus && recivedStatus && seenStatus) {
  //     setStatus("SEEN");
  //   }

  //   // message side
  //   if (auth?.name === item?.sender) {
  //     setIsSideLeft(true);
  //   }
  // }, [item]);

  useEffect(() => {
    if (user?.id !== item?.msgFrom && user?.id !== item?.sender) {
      setIsSideLeft(true);
    }
  }, [item]);

  if (!item?.msg?.trim()) {
    return (
      <View
        style={{
          width: '100%',
        }}>
        <View
          style={{
            alignSelf: isSideLeft ? 'flex-start' : 'flex-end',
            // backgroundColor: item?.msgFrom === user.id ? '#222' : '#23a12f',
            padding: 5,
            width: 80,
            maxWidth: 80,
            borderRadius: 10,
            marginVertical: 10,
            marginTop: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Text>
        {item.gift.title}
      </Text> */}
          {item?.gift?.iconUrl ? (
            <Image
              style={{
                width: 75,
                height: 75,
              }}
              source={{uri: item?.gift?.iconUrl}}
            />
          ) : item?.gift?.icon ? (
            <Image
              style={{
                width: 75,
                height: 75,
              }}
              source={{uri: item?.gift?.icon}}
            />
          ) : (
            <Image
              style={{
                width: 75,
                height: 75,
              }}
              source={require('../../../assets/icons/gifts/gift1.png')}
            />
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: isSideLeft ? '#222' : '#23a12f',

          alignSelf: isSideLeft ? 'flex-start' : 'flex-end',
          padding: 5,
          width: '60%',
          maxWidth: 300,
          borderRadius: 10,
          marginVertical: 10,
          marginTop: 15,
        }}>
        {/* messageTIP */}
        {isSideLeft ? (
          <Octicons
            style={{
              position: 'absolute',
              zIndex: -1,
              top: -22,
            }}
            name="triangle-right"
            size={50}
            color="#222"
          />
        ) : (
          <Octicons
            style={{
              position: 'absolute',
              zIndex: -1,
              top: -22,
              right: 0,
            }}
            name="triangle-left"
            size={50}
            color="#23a12f"
          />
        )}

        <Text style={{color: '#fff', padding: 5, fontSize: 15}}>
          {/* {item.message} */}
          {item?.msg || item?.content}
        </Text>
        {/* status */}
        <View
          style={{
            height: 15,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{color: '#fff', fontSize: 12, marginRight: 10}}>
            {item?.createdAt
              ? new Date(item?.createdAt).toLocaleTimeString()
              : null}
          </Text>
          {/* <MessageStatus
            // status={"SEND"}
            // status={"RECIVED"}
            // status={"SEEN"}
            status={status}
          /> */}
        </View>
      </View>
    );
  }
};

const ChatBox = ({
  chat,
  handleGetOldChat,
  conversationId,
  triggerScrollToEnd,
  isOtherUserTyping,
}) => {
  const chatListRef = useRef(null);

  const {error, loading} = useSelector(state => state.chat);

  const dispatch = useDispatch();
  const scrollChatToEnd = () => {
    chatListRef?.current?.scrollToEnd();
  };
  const loadMoreOldChat = () => {
    handleGetOldChat(conversationId);
  };
  useEffect(() => {
    scrollChatToEnd();
  }, [triggerScrollToEnd]);

  useEffect(() => {
    scrollChatToEnd();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error || 'something went wrong!');
      dispatch({type: CHAT_REDUCER_REFRESH});
    }
  }, [error]);

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
      }}>
      {/* <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        numColumns={1}
        ListEmptyComponent={<Text>Loading...</Text>}
        renderItem={({ item, index }) => (
          <ChatMessage index={index} item={item} />
        )}
      /> */}
      {loading ? (
        <View style={{width: '100%', height: '100%'}}>
          <MyLoader
            visible={true}
            text={'getting older chat'}
            bgColor={'transparent'}
          />
        </View>
      ) : null}

      {/* {chat.length && !loading && !error ? ( */}
      <FlatList
        ref={chatListRef}
        // onContentSizeChange={() => chatListRef.current.scrollToEnd()}
        // onLayout={() => chatListRef.current.scrollToEnd()}
        data={chat}
        keyExtractor={(item, idx) => item?._id || idx}
        numColumns={1}
        ListEmptyComponent={() => (
          <Text style={{textAlign: 'center', color: '#555'}}>
            send message to start conversation
          </Text>
        )}
        renderItem={({item, index}) => (
          <ChatMessage index={index} item={item} />
        )}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y === 0) {
            loadMoreOldChat();
          }
        }}
      />
      {/* ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>
            send msg to start conversation
          </Text>
        </View>
      )} */}

      {isOtherUserTyping ? (
        <View
          style={{
            padding: 5,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              backgroundColor: '#444',
              width: 70,
              borderRadius: 20,
              padding: 5,
              fontSize: 12,
              color: '#FFF',
            }}>
            typing...
          </Text>
        </View>
      ) : null}
    </View>
  );
};

if (!window.location) {
  window.navigator.userAgent = 'ReactNative';
}

const REPORT_DATA = [
  {
    icon: 'user',
    title: "I don't like this user",
    color: 'green',
  },
  {
    color: 'pink',
    icon: 'skin',
    title: 'Nuditiy and inappropriate content',
  },
  {
    color: 'gray',
    icon: 'clockcircle',
    title: 'Spam or fraud',
  },
  {
    color: 'green',
    icon: 'notification',
    title: 'Verbal harassment',
  },
  {
    color: 'orange',
    icon: 'exclamationcircleo',
    title: 'Violent content',
  },
  {
    color: 'purple',
    icon: 'warning',
    title: 'Underage',
  },
  {
    color: 'red',
    icon: 'fork',
    title: 'False gender',
  },
];
const ChatScreen = ({navigation, route}) => {
  const {conversationId, otherUserName, otherUserID, otherUserProfileImage} =
    route?.params;
  const {auth, chat} = useSelector(state => state);
  const userId = auth?.user?.id;
  const {chatStorage, oldChatPageNo} = chat;

  const [triggerScrollToEnd, setTriggerScrollToEnd] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const socketRef = useRef();
  const actionSheetRef = createRef();
  const actionSheetRef2 = createRef();

  const sheetReportUserRef2 = createRef();
  const conversationIdFromSocket = useRef(null);
  const dispatch = useDispatch();

  const sendChatMsg = msg => {
    console.log(
      msg,
      {
        msg: msg,
        sender: userId,
        msgTo: otherUserID,
        date: Date.now(),
      },
      'sending msg...',
    );
    if (msg && userId) {
      socketRef.current.emit('chat-msg', {
        msg: msg,
        sender: userId,
        msgTo: otherUserID,
        date: Date.now(),
      });
    } else console.log('missing parameter', {msg, userId});
  };

  const hanldeOtherUserTyping = () => {
    setIsOtherUserTyping(true);
    setTimeout(() => setIsOtherUserTyping(false), 2000);
  };

  const listenForMessage = () => {
    socketRef.current.on('chat-msg', data => {
      console.log('chat:', data);
      dispatch({type: ADD_CHAT_STORAGE, payload: data});
      setTriggerScrollToEnd(state => !state);
    });
  };
  const listenForTyping = () => {
    console.log('listing for tyoing');
    socketRef.current.on('typing', event => {
      console.log('typing:', event);
      hanldeOtherUserTyping();
    });
  };

  const fireTypingEvent = bool => {
    console.log('fireTypingEvent', bool);
    if (bool) {
      socketRef?.current?.emit('typing');
    }
  };

  const handleUnmount = () => {
    socketRef.current.on('disconnect', () => {
      console.log('SOCKET DESTROYED');
    });
    socketRef.current.disconnect();
    dispatch({type: DESTORY_CHAT_STORAGE});
  };

  const handleGetOldChat = conversationId => {
    dispatch(
      getOldChat({
        authToken: auth?.accessToken,
        conversationID: conversationId,
        pageNo: oldChatPageNo,
        pageSize: 10,
      }),
    );
  };

  const handleSendGift = gift => {
    const data = {
      msg: ' ',
      sender: userId,
      msgTo: otherUserID,
      date: Date.now(),
      gift,
    };
    console.log('send gift data', data);

    if (gift && userId) {
      socketRef.current.emit('chat-msg', data);
    } else console.log('missing parameter', {gift, userId});
  };

  useEffect(() => {
    if (conversationId) {
      handleGetOldChat(conversationId);
    }

    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth.accessToken,
      },
    });

    console.log(socketRef);
    // socketRef.current.emit('set-user-data', userId);
    socketRef.current.emit('set-room', {
      conversationFrom: userId,
      conversationTo: otherUserID,
    });

    socketRef.current.on('oops', err =>
      console.log(err, 'oooooooooooooooooooooo'),
    );
    console.log({socketRef, userId, otherUserID});

    socketRef.current.on('set-room', room => {
      if (!conversationId) {
        conversationIdFromSocket.current = room;
        handleGetOldChat(room);
      }
    });

    listenForMessage();
    listenForTyping();
    return () => {
      handleUnmount();
    };
  }, []);

  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('sheetChatScreen');
    } else {
      actionSheetRef.current.hide();
    }
  };
  const handldeSheet2 = bool => {
    if (bool) {
      SheetManager.show('sheetUploadFile');
    } else {
      actionSheetRef2.current.hide();
    }
  };

  const requestCameraPermission = async type => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        handleShootFormCamera(type);
        return;
      } else {
        console.log('Camera permission denied');
      }
      handleShootFormCamera(type);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChooseFormGallary = () => {
    launchImageLibrary({
      title: 'choose file to send',
      mediaType: 'mixed',
      includeBase64: true,
    })
      .then(res => console.log(res.assets[0], 'CHOOSEN'))
      .catch(err => console.log(err));
  };
  const handleShootFormCamera = async type => {
    const res = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => console.log(err));
    console.log(res, 'cm');
    if (res) {
      try {
        const res = await launchCamera(
          {
            mediaType: type,
          },
          response => {
            console.log('Response = ', response);
            if (response.didCancel) {
              console.log('User cancelled video shoot ');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
              Alert.alert(response.customButton);
            } else {
              const source = {uri: response.uri};
              console.log('response', JSON.stringify(response));
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      requestCameraPermission(type);
    }
  };

  const handleBlockPerson = async () => {
    console.log('REMOVE TEST');

    const bodyData = {
      toUser: otherUserID,
      byUser: auth?.user?.id,
    };
    try {
      const response = await api_blockUser({
        bodyData,
        authToken: auth.accessToken,
      });
      console.log({response});
      if (response.isSuccess && response.statusCode === 200) {
        Alert.alert('Alert', response?.message || 'Blocked!');
      } else {
        throw new Error(response?.error || 'something went wrong!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    }
  };

  const hanldeBlockUser = () => {
    Alert.alert('Block?', 'are you sure to block this person', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Block',
        onPress: () => handleBlockPerson(),
      },
    ]);
  };

  const handleReportUserSheet = bool => {
    if (bool) {
      SheetManager.show('sheetReportUser2');
    } else {
      sheetReportUserRef2.current.hide();
    }
  };

  const handleReportPress = async text => {
    setReportLoading(true);
    try {
      const payload = {
        token: auth?.accessToken,
        otherUserId: userId,
        userID: auth?.user?.id,
        msg: text,
      };

      const res = await api_userReport(payload);
      console.log(res);
      if (res?.isSuccess) {
        Alert.alert('Alert', 'Your report is submitted!');
      } else {
        throw new Error(res?.error || 'failed to report!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <View style={{flex: 1, marginBottom: 5}}>
      {reportLoading && (
        <MyLoader
          style={{position: 'absolute'}}
          visible={true}
          text={'Reporting...'}
        />
      )}
      {isReportVisible && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ReportUser
            isReportVisible={isReportVisible}
            setIsReportVisible={setIsReportVisible}
          />
        </View>
      )}
      <ChatHeader
        navigation={navigation}
        name={otherUserName}
        avatar={otherUserProfileImage}
        otherUserID={otherUserID}
        handldeSheet={handldeSheet}
        handleReportUserSheet={handleReportUserSheet}
      />
      <ChatBox
        chat={chatStorage}
        handleGetOldChat={handleGetOldChat}
        conversationId={
          conversationId ? conversationId : conversationIdFromSocket.current
        }
        triggerScrollToEnd={triggerScrollToEnd}
        isOtherUserTyping={isOtherUserTyping}
      />
      <ChatForm
        sendChatMsg={sendChatMsg}
        fireTypingEvent={fireTypingEvent}
        otherUserID={otherUserID}
        handleSendGift={handleSendGift}
        handldeSheet2={handldeSheet2}
      />

      <ActionSheet id="sheetChatScreen" ref={actionSheetRef}>
        <View
          style={{
            height: 100,
          }}>
          <TouchableOpacity
            onPress={() => {
              hanldeBlockUser();
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
              Block
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // setIsReportVisible(true);
              handleReportUserSheet(true);
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
              Report
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
      <ActionSheet id="sheetUploadFile" ref={actionSheetRef2}>
        <View
          style={{
            height: 130,
          }}>
          <TouchableOpacity
            onPress={() => {
              handleShootFormCamera('photo');
              handldeSheet2(false);
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              Open Photo Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleShootFormCamera('video');
              handldeSheet2(false);
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              Open Video Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChooseFormGallary();
              handldeSheet2(false);
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              Choose Form Gallary
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handldeSheet2(false)}>
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

      <ActionSheet id="sheetReportUser2" ref={sheetReportUserRef2}>
        <View
          style={{
            height: 340,
          }}>
          {REPORT_DATA.map(item => {
            return (
              <TouchableOpacity
                key={item?.title}
                onPress={() => {
                  handleReportPress(item?.title);
                  handleReportUserSheet(false);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 15,
                    }}>
                    <AntDesign
                      name={item?.icon}
                      size={20}
                      color={item?.color}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: 16,
                      padding: 12,
                    }}>
                    {item?.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={() => handleReportUserSheet(false)}>
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
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
