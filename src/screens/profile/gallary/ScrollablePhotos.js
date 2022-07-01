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
import {UPDATE_MY_PROFILE} from '../../../redux/reducers/actionTypes';
import ImageComp from '../../../components/ImageComp';
import HeaderBackTitle from '../../../components/HeaderBackTitle';
import Icon from 'react-native-vector-icons/Ionicons';
const ScrollablePhotos = ({route}) => {
  const navigation = useNavigation(false);
  const carouselRef = useRef(null);
  const [carouselShowIndex, setCarouselShowIndex] = useState(null);
  const {auth} = useSelector(s => s);
  const dispatch = useDispatch(null);

  const {images, showPhotoDeleteButton} = route?.params;

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
    }
  };

  const deleteImage = async name => {
    const ITEM_NAME = name?.split('/')?.slice(-1)?.pop();
    console.log({ITEM_NAME});

    const payload = {
      itemName: ITEM_NAME,
      token: auth?.accessToken,
      userId: auth?.user?.id,
      itemType: 'image',
    };

    try {
      const response = await api_userDeleteImageOrVideo(payload);
      console.log(response);
      if (response.isSuccess) {
        handleUpdateProfile();
        Alert.alert('Success', 'Image Delete Success');
      } else {
        Alert.alert('Alert', response?.error || 'Failed to Delete Image!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message || 'Failed to Delete Image!');
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
        }}>
        <TouchableOpacity
          style={{
            margin: 20,
            width: 40,
            height: 40,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="ios-arrow-back" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() => navigation.goBack()}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
          }}>
          <Carousel
            ref={carouselRef.current}
            data={images}
            firstItem={carouselShowIndex}
            renderItem={data => {
              console.log(data);
              return (
                <View
                  style={{
                    flex: 1,
                    // marginTop: '40%',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '99%',
                      // borderColor: '#fff',
                      // borderWidth: 15,
                      // borderTopWidth: 30,
                      borderRadius: 5,
                      shadowColor: '#000',
                      shadowOffset: {width: -2, height: 4},
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 10,
                      zIndex: 10,
                      // backgroundColor: 'lightgray',
                      backgroundColor: '#000',
                    }}>
                    {/* <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                      }}
                      resizeMode="contain"
                      source={{
                        uri: data.item.name,
                      }}
                    /> */}
                    <ImageComp
                      URI={data.item.name}
                      imageStyles={{
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                      }}
                    />
                  </View>

                  {showPhotoDeleteButton && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        position: 'absolute',
                        zIndex: 10,
                        bottom: 0,
                        marginBottom: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          borderRadius: 100,
                        }}
                        onPress={() => {
                          deleteImage(data?.item?.name);
                        }}>
                        <AntDesign name={'delete'} color={'tomato'} size={24} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
          />
        </View>
      </TapGestureHandler>
    </View>
  );
};

export default ScrollablePhotos;
