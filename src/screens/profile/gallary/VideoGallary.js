import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderBackTitle from '../../../components/HeaderBackTitle';
// import VideoPlayer from "react-native-video-controls";

import VideoPlayer from 'react-native-video-controls';
import {useDispatch, useSelector} from 'react-redux';
import {
  api_removeProfileImage,
  api_userDeleteImageOrVideo,
} from '../../../api_services';
import {REMOVE_VIDEO_FROM_USER_VIDEO_LIST} from '../../../redux/reducers/actionTypes';

const {width, height} = Dimensions.get('window');

const PhotoBox = ({item, index, setFullPreviewVideo}) => {
  useEffect(() => {
    return () => {
      setFullPreviewVideo(null);
    };
  }, []);

  return (
    <TouchableOpacity
      style={{
        width: '33.3%',
        maxWidth: 150,
        height: 140,
        margin: 2,
        borderWidth: 0.4,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 5,
      }}
      onPress={() => setFullPreviewVideo(item.name)}>
      {item?.thumbnail ? (
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
          source={{uri: item?.thumbnail}}
        />
      ) : (
        <View
          style={{
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="ios-play-circle-outline" size={40} color={'#fff'} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default VideoGallary = ({
  setIsVideoGallaryActive,
  videos,
  setRefresh,
}) => {
  const [fullPreviewVideo, setFullPreviewVideo] = useState(null);
  const dispatch = useDispatch(null);

  const [playbackObj, setPlaybackObj] = useState({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  });

  const {auth} = useSelector(state => state);

  const handleVideoEnd = () => {
    setFullPreviewVideo(false);
  };
  console.log(playbackObj);
  console.log({fullPreviewVideo});

  const deleteVideo = async name => {
    const ITEM_NAME = name?.split('/')?.slice(-1)?.pop();
    console.log({ITEM_NAME});

    const payload = {
      itemName: ITEM_NAME,
      token: auth?.accessToken,
      userId: auth?.user?.id,
      itemType: 'video',
    };
    console.log(payload);
    try {
      const response = await api_userDeleteImageOrVideo(payload);
      console.log(response);
      if (response?.isSuccess) {
        setRefresh(s => !s);
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
    }
  };

  useEffect(() => {
    return () => {
      setFullPreviewVideo(null);
    };
  }, []);
  return (
    <View style={[styles.container]}>
      <HeaderBackTitle
        title={'Video'}
        onBackPress={() => setIsVideoGallaryActive(false)}
      />
      {videos ? (
        <FlatList
          style={{
            width: '98%',
            alignSelf: 'center',
          }}
          initialNumToRender={100}
          columnWrapperStyle={{alignItems: 'center'}}
          data={videos}
          ListEmptyComponent={
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text> No Videos...</Text>
            </View>
          }
          keyExtractor={item => item._id}
          numColumns={3}
          renderItem={({item, index}) => (
            <PhotoBox
              setFullPreviewVideo={setFullPreviewVideo}
              item={item}
              index={index}
            />
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>No Videos</Text>
        </View>
      )}

      {/* Full View */}
      {fullPreviewVideo && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            width,
            height: height - 20,
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
            onPress={() => setFullPreviewVideo(false)}>
            <AntDesign name={'closecircleo'} color={'#fff'} size={30} />
          </TouchableOpacity>
          {/* <View style={{height: height - 30}}> */}
          <VideoPlayer
            source={{uri: fullPreviewVideo}}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: '#000',
            }}
            disableBack={true}
          />
          {/* </View> */}

          <View
            style={{
              position: 'absolute',
              top: height - 150 - 70,
              width: '100%',
              alignItems: 'center',
              zIndex: 1000,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: 10,
                borderRadius: 50,
              }}
              onPress={() => deleteVideo(fullPreviewVideo)}>
              <AntDesign name={'delete'} color={'#fff'} size={30} />
            </TouchableOpacity>
          </View>
          {/* bar */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
    width: width,
    backgroundColor: '#fff',
    height: '100%',
    paddingBottom: 5,
  },
});
