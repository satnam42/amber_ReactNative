import {
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  api_usersRandom,
  generate_rtcToken,
  SOCKET_URL,
} from '../../api_services';
import SocketIOClient from 'socket.io-client';

import Carousel from 'react-native-snap-carousel';
import Spin from 'react-native-spinkit';
import ImageComp from '../../components/ImageComp';
import {getRandomLoacalImage} from './images';
const CLEAR_IMAGE =
  'https://images.unsplash.com/photo-1611042553484-d61f84d22784?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80';

let MY_TIMEOUT = null;
const RandomNextAndAcceptModeScreen = ({route}) => {
  const navigation = useNavigation(null);

  const {auth, coin} = useSelector(s => s);
  const socketRef = React.useRef();

  const {randomData} = route?.params;
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [activeUser, setActiveUser] = React.useState(null);
  const [imageLoaders, setImageLoaders] = React.useState([]);
  const [showImageSilder, setShowImageSilder] = React.useState(false);
  const [randomBlurImages, setRandomBlurImages] = React.useState(
    getRandomLoacalImage(4),
  );

  const _carousel = React.useRef();
  console.log(randomData, 'randomData');
  console.log({imageLoaders, activeUser});

  const handleNextPress = async () => {
    setShowImageSilder(true);
    setRandomBlurImages(getRandomLoacalImage(4));
    console.log('in next');
    setLoading(true);
    try {
      const payload = {
        token: auth?.accessToken,
        pageSize: 5,
      };
      const res = await api_usersRandom(payload);
      console.log(res);

      if (res?.isSuccess) {
        setActiveUser(res?.items[0]);
        setImageLoaders(res?.items[0]?.randomImages);
        removeTimeoutFun();
        setTimeoutFun();
      } else {
        throw new Error(res?.error || 'something went wrong!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setShowImageSilder(false);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (randomData) {
      setActiveUser(randomData);
      setImageLoaders(randomData?.randomImages);
    }
    setTimeoutFun();
    return () => {
      removeTimeoutFun();
    };
  }, []);

  const hitCallUserSocket = () => {
    socketRef.current = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        token: auth?.accessToken,
      },
    });
    console.log({socketRef});
    const dataObj = {
      channelName: auth?.user?.id,
      receiverId: activeUser?.id,
      callerId: auth?.user?.id,
      username: auth?.user?.username,
    };
    socketRef.current.emit('callUser', dataObj);
    console.log('::::::::::::::::CALL USER EMITTED  with', dataObj);
  };

  const getTokenForVideoCall = async () => {
    setLoading2(true);
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
            callingToUserId: activeUser?.id,
            call_rate,
          });
        }
      } else {
        Alert.alert('Error', 'failed to generate agora token');
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'failed to generate agora token');
    } finally {
      setLoading2(false);
    }
  };

  const handleAcceptPress = () => {
    console.log('HHHH');
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

  const setTimeoutFun = () => {
    MY_TIMEOUT = setTimeout(handleNextPress, 15000);
  };
  const removeTimeoutFun = () => {
    clearTimeout(MY_TIMEOUT);
  };

  return (
    <View
      style={{
        backgroundColor: '#333',
        flex: 1,
        width: '100%',
      }}>
      {showImageSilder && (
        <Carousel
          autoplay={true}
          loop={true}
          firstItem={0}
          autoplayInterval={30}
          layoutCardOffset={0}
          inactiveSlideScale={1}
          ref={_carousel.current}
          data={randomBlurImages}
          containerCustomStyle={{}}
          slideStyle={{
            overflow: 'hidden',
          }}
          contentContainerCustomStyle={{
            overflow: 'hidden',
          }}
          renderItem={({item, index}) => {
            return (
              <ImageComp
                URI={item?.uri}
                imageStyles={{
                  position: 'absolute',
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                  zIndex: -1,
                }}
                blurRadius={1}
              />
              // <ImageBackground
              //   source={{uri: item?.uri}}
              //   style={{
              //     position: 'absolute',
              //     width: Dimensions.get('window').width,
              //     height: Dimensions.get('window').height,

              //     zIndex: -1,
              //   }}
              //   blurRadius={1}
              // />
            );
          }}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
        />
      )}
      {loading || activeUser?.avatar ? (
        showImageSilder ? (
          <View
            style={{
              backgroundColor: '#000',
              ...StyleSheet.absoluteFillObject,
              zIndex: -1,
            }}></View>
        ) : (
          <ImageComp
            URI={activeUser?.avatar}
            imageStyles={{
              ...StyleSheet.absoluteFillObject,
              zIndex: -1,
            }}
          />
        )
      ) : (
        <ImageBackground
          source={{uri: CLEAR_IMAGE}}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
          }}
          blurRadius={25}
        />
      )}
      {/* header */}
      <View
        style={{
          width: '100%',
          height: 80,
          justifyContent: 'center',
          padding: 15,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            width: 33,
            height: 33,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
          }}>
          <Ionicons name={'arrow-back'} size={30} color={'#000'} />
        </TouchableOpacity>
        {/* header end */}
      </View>
      {/* ACTION BTN */}

      <View
        style={{
          width: '100%',
          height: 200,
          position: 'absolute',
          bottom: 70,
          alignItems: 'center',
        }}>
        {loading ? (
          <>
            {/* searchIocn */}
            <View
              style={{
                height: 100,
                width: 100,
                backgroundColor: '#FFC75F',
                position: 'absolute',
                top: -50,
                borderRadius: 100,
                zIndex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Spin type="9CubeGrid" isVisible={true} color="#fff" size={30} />
            </View>
            {/* searchIocn end */}
            <View
              style={{
                width: '80%',
                height: 200,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: '#FFC75F',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  color: 'rgba(0,0,0,0.6)',
                }}>
                Searching...
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  width: '90%',
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 10,
                  marginTop: 25,
                }}>
                <View
                  style={{
                    backgroundColor: '#D43725',
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Ionicons name="alert" size={15} color="#fff" />
                </View>
                <Text style={{padding: 5, color: 'rgba(0,0,0,0.6)'}}>
                  offensive language is not tollorated
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              width: '80%',
              height: 200,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                marginBottom: 20,
                fontWeight: 'bold',
                fontSize: 20,
                textShadowColor: 'rgba(0, 0, 0, 1)',
                textShadowOffset: {1: -1, 0: 1},
                textShadowRadius: 4,
              }}>
              {activeUser?.username || 'no name'}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#2C73D2',
                borderRadius: 50,
                padding: 5,
                width: '75%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
              }}
              onPress={handleAcceptPress}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                {loading2 ? 'loading... ' : 'Accept'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                padding: 5,
                width: '75%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
              }}
              onPress={() => {
                setTimeout(() => {
                  handleNextPress();
                }, 5000);
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* ACTION BTN END */}
    </View>
  );
};

export default RandomNextAndAcceptModeScreen;

const styles = StyleSheet.create({});
