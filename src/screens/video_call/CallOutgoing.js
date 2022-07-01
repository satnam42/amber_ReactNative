import React, {useEffect, useRef} from 'react';
import {Image, View, Dimensions, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {END_VIDEO_CALL, SETISVIDEOCALL} from '../../redux/reducers/actionTypes';
import SocketIOClient from 'socket.io-client';
import {SOCKET_URL} from '../../api_services';

const {width, height} = Dimensions.get('screen');

const CallOutgoing = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const {auth, call} = useSelector(state => state);

  const handleOutgoingCallEnd = () => {
    socketRef.current.emit('call-end', {});
    dispatch({type: END_VIDEO_CALL});
  };

  const handleUnmount = () => {
    socketRef.current.disconnect();
    socketRef.current = null;
  };

  useEffect(() => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth.accessToken,
      },
    });

    if (call?.isReciving) {
      //  RECIVING
    } else {
      //  SENDER
      socketRef.current.emit('set-cannel', auth?.user?.id);
      console.log(
        socketRef.current,
        {userId: auth?.user?.id},
        'set channel called',
      );
    }

    return () => {
      handleUnmount();
    };
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
          calling Jhone Doe...
        </Text>
      </View>
      {/* Text End */}

      {/* Call Btn Start */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          position: 'absolute',
          bottom: 200,
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
          onPress={() => handleOutgoingCallEnd()}>
          <FontAwesome name="close" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Call Btn End */}
    </View>
  );
};
export default CallOutgoing;
