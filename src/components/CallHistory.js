import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DefaultImage from './DefaultImage';
import SocketIOClient from 'socket.io-client';
import {generate_rtcToken, SOCKET_URL} from '../api_services';
import {useNavigation} from '@react-navigation/native';
const isDateOfToday = date => {
  const dateToCompare = date.substr(0, 10);
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  if (today === dateToCompare) {
    return true;
  } else {
    false;
  }
};

const NoImageFallBack = () => {
  return (
    <DefaultImage
      style={{
        width: 70,
        height: 70,
        borderRadius: 50,
      }}
      iconSize={60}
    />
  );
};

const CallHistory = ({index, item}) => {
  console.log({item});
  const [loading, setIsLoading] = React.useState(false);
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation(null);
  const socketRef = React.useRef(null);

  const otherUserId =
    auth?.user?.id === item?.fromUserId ? item?.toUserId : item?.fromUserId;
  const hitCallUserSocket = () => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });
    const dataObj = {
      channelName: auth?.user?.id,
      receiverId: otherUserId,
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
            callingToUserId: otherUserId,
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

  const handleCallHistoryPress = () => {
    getTokenForVideoCall();
    // dispatch({
    //   type: SET_POPUP_OVERLAY,
    //   payload: {
    //     isPopupActive: true,
    //     popupData: {
    //       pop: 12312,
    //       data: 'dada',
    //     },
    //   },
    // });
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 6,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        alignSelf: 'center',
      }}
      key={item?._id}>
      {item?.callType === 'outgoing' &&
        (item?.toUserAvatar ? (
          <Image
            source={{uri: item?.toUserAvatar}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
          />
        ) : (
          <NoImageFallBack />
        ))}

      {item?.callType === 'missed' &&
        (item?.fromUserAvatar ? (
          <Image
            source={{uri: item?.fromUserAvatar}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
          />
        ) : (
          <NoImageFallBack />
        ))}

      {item?.callType === 'incoming' &&
        (item?.fromUserAvatar ? (
          <Image
            source={{uri: item?.fromUserAvatar}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
          />
        ) : (
          <NoImageFallBack />
        ))}

      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#222'}}>
          {item?.callType === 'outgoing' && item?.toUser}
          {item?.callType === 'incoming' && item?.fromUser}
          {item?.callType === 'missed' && item?.fromUser}
          {/* {auth?.user?.id === item?.fromUserId ? item?.fromUser : item?.toUser} */}
        </Text>
        <Text style={{fontSize: 16, color: '#222'}}>
          {/* {moment(item.createdAt).format('dddd')} */}

          {isDateOfToday(item?.createdAt)
            ? 'Today'
            : item?.createdAt?.substr(0, 10)}
        </Text>
        <Text style={{fontSize: 16, color: '#222'}}>
          Duration:{' '}
          {item?.duration <= 0
            ? 'less than a min.'
            : `${item?.duration} minutes`}
        </Text>
        <Text style={{fontSize: 16, color: '#222'}}>
          Time: {item?.time || item?.createdAt?.split('T')[1]?.split('.')[0]}
        </Text>
        <Text style={{fontSize: 16, color: '#222'}}>
          CallType:
          <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>
            {item?.callType}
            {/* {item?.fromUser === auth?.user?.id ? 'Outgoing' : 'Incomming'} */}
          </Text>
        </Text>
      </View>
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#49cf76',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
        }}>
        <TouchableOpacity onPress={handleCallHistoryPress}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{fontSize: 17, fontWeight: 'bold', color: '#fff'}}>
              Call
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallHistory;
