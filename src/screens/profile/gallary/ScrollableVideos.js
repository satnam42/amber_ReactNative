import {useNavigation} from '@react-navigation/core';
import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import {useState} from 'react';
import {
  api_userDeleteImageOrVideo,
  getUserDetails,
} from '../../../api_services';
import {
  REMOVE_VIDEO_FROM_USER_VIDEO_LIST,
  UPDATE_MY_PROFILE,
} from '../../../redux/reducers/actionTypes';
import VideoPlayer from 'react-native-video-controls';

const ScrollableVideos = ({route}) => {
  const navigation = useNavigation(false);
  const carouselRef = useRef(null);
  const [carouselShowIndex, setCarouselShowIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const {auth} = useSelector(s => s);
  const dispatch = useDispatch(null);

  const {videos, showVideoDeleteButton} = route?.params;

  const handleUpdateProfile = async () => {
    try {
      const response = await getUserDetails(auth?.accessToken, auth?.user?.id);
      if (response.isSuccess) {
        dispatch({type: UPDATE_MY_PROFILE, payload: response?.data});
      } else {
        Alert.alert('Alert', response?.error || 'failed to get profile');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message || 'failed to get profile');
    } finally {
      // setLoading(false);
    }
  };

  const deleteVideo = async () => {
    console.log(activeIndex, 'ooo');
    console.log(videos[activeIndex], 'video name');
    const name = videos[activeIndex].name;
    const ITEM_NAME = name?.split('/')?.slice(-1)?.pop();
    console.log({ITEM_NAME});

    const payload = {
      itemName: ITEM_NAME,
      token: auth?.accessToken,
      userId: auth?.user?.id,
      itemType: 'video',
    };
    console.log(payload);
    setLoading(true);
    try {
      const response = await api_userDeleteImageOrVideo(payload);
      console.log(response);
      if (response?.isSuccess) {
        Alert.alert('Success', 'Video Delete Success');
        dispatch({
          type: REMOVE_VIDEO_FROM_USER_VIDEO_LIST,
          payload: {videoName: name},
        });
      } else {
        Alert.alert('Alert', response?.error || 'Failed to Delete Video!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message || 'Failed to Delete Video!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() => navigation.goBack()}>
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000',
              // marginBottom: 70
            }}>
            <Carousel
              onSnapToItem={index => setActiveIndex(index)}
              ref={i => {
                console.log(i, 'oooo');
                carouselRef.current = i?._activeItem;
              }}
              data={videos}
              firstItem={carouselShowIndex}
              renderItem={data => {
                console.log(data);
                return (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                      }}>
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 15,
                          width: 50,
                          height: 50,
                          left: 10,
                          borderRadius: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          zIndex: 1000,
                        }}
                        onPress={() => {
                          navigation.goBack();
                        }}>
                        <AntDesign
                          name={'closecircleo'}
                          color={'#fff'}
                          size={30}
                        />
                      </TouchableOpacity>

                      <VideoPlayer
                        source={{uri: data?.item?.name}}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          backgroundColor: '#000',
                        }}
                        disableFullscreen={true}
                        disableVolume={true}
                        toggleResizeModeOnFullscreen={false}
                        disableBack={true}
                      />
                    </View>
                  </View>
                );
              }}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
            />
          </View>
          {showVideoDeleteButton && (
            <View
              style={{
                position: 'absolute',
                bottom: 90,
                width: '100%',
                alignItems: 'center',
                zIndex: 1000,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {loading ? (
                <ActivityIndicator
                  style={{
                    padding: 10,
                    marginRight: 20,
                  }}
                  size="small"
                  color="#fff"
                />
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: 10,
                    borderRadius: 50,
                    marginRight: 20,
                  }}
                  onPress={() => {
                    deleteVideo();
                  }}>
                  <AntDesign name={'delete'} color={'tomato'} size={30} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TapGestureHandler>
    </View>
  );
};

export default ScrollableVideos;
