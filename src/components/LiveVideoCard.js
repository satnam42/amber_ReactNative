import React, {useRef, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Touchable,
  Alert,
  ActivityIndicator,
  ActivityIndicatorBase,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getAgeByDob} from '../utils/helper';
import {useDispatch, useSelector} from 'react-redux';
import SocketIOClient from 'socket.io-client';

import {BASE_URL, generate_rtcToken, SOCKET_URL} from '../api_services';
import ImageComp from '../components/ImageComp';

const LiveVideoCard = ({item, index}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch(null);
  const {auth} = useSelector(state => state);

  const socketRef = useRef();

  const navigateToUserProfile = id => {
    navigation.navigate('ViewOtherProfile', {
      user: item,
      userId: item.id,
    });
  };

  const {coin} = useSelector(state => state);

  const hitCallUserSocket = () => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });

    console.log({socketRef});
    // listen for socket errors

    const dataObj = {
      channelName: auth?.user?.id,
      receiverId: item.id,
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
            callingToUserId: item.id,
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
    <TouchableOpacity
      style={{width: '50%', maxWidth: 210}}
      onPress={() => navigateToUserProfile(0)}>
      <View
        style={{
          margin: 5,
          minHeight: 200,
          borderRadius: 15,
          overflow: 'hidden',
        }}>
        {/* background */}

        <ImageComp
          loaderSize={20}
          URI={item?.avatar ? item?.avatar : null}
          imageStyles={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        {/* overlay */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}></View>
        <View
          style={{
            margin: 10,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: '#fff',
              fontWeight: 'bold',
              color: '#f6af00',
            }}>
            {`${item?.firstName || item.username} , ${getAgeByDob(item?.dob)}`}
          </Text>
          <Text style={{fontSize: 14, color: '#fff'}} numberOfLines={2}>
            {item?.discription}
          </Text>
        </View>
        {/* icon */}
        <View
          style={{
            padding: 2,
            position: 'absolute',
            bottom: 15,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#49cf76',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}
            onPress={() => handleVideoCallPress()}>
            {isLoading ? (
              <View>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : (
              <Image
                source={require('../../ios/Assets/video-call-icon.png')}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LiveVideoCard;
