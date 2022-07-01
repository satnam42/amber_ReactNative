import {Form} from 'formik';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ActivityIndicatorBase,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {launchImageLibrary} from 'react-native-image-picker';
import VideoPlayer from 'react-native-video-controls';
import {useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MyLoader from '../components/MyLoader';
import {useNavigation} from '@react-navigation/core';
import {BASE_URL} from '../api_services';
export default FileUploadForm = ({
  setIsVideoUploadFormActive,
  setRefresh,
  selectedVideo,
  handlePickVideo,
  setSelectedVideo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProress, setUploadProress] = useState(0);
  const {auth} = useSelector(state => state);

  const navigation = useNavigation(null);
  console.log({uploadProress});
  const {user, accessToken} = auth;

  // const handlePickVideo = async () => {
  //   const result = await launchImageLibrary({
  //     title: 'Video Picker',
  //     mediaType: 'video',
  //     includeBase64: true,
  //   })
  //     .then(res => setSelectedVideo(res.assets[0]))
  //     .catch(err => console.log(err));
  // };

  console.log({selectedVideo, isLoading});
  const handleUploadVideo = async () => {
    // onClickUpload();
    // return;
    const formData = new FormData();
    formData.append('video', {
      name: 'name.mp4',
      uri: selectedVideo.uri,
      type: 'video/mp4',
    });
    console.log(formData);
    setIsLoading(true);
    fetch(`${BASE_URL}/users/uploadStory/${user.id}`, {
      method: 'PUT',
      headers: {
        'x-access-token': accessToken,
      },
      body: formData,
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        console.log(data);
        if (data.isSuccess) {
          setRefresh(s => !s);
          Alert.alert('Succcess', 'Video uploaded successfully', [
            {
              text: 'OK',
              onPress: () => {
                setIsVideoUploadFormActive(false);
                handleCloseForm();
              },
            },
          ]);
        }
      })
      .catch(err => {
        Alert.alert('Failed', err.message || 'failed to upload video');
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleCloseForm = () => {
    setSelectedVideo(null);
    setIsVideoUploadFormActive(false);
  };

  return (
    <View
      style={{
        position: 'absolute',
        width: width,
        height: height,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
      }}>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          top: 10,
          backgroundColor: '#000',
          flexDirection: 'row',
          paddingHorizontal: 20,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => handleCloseForm()}>
          <FontAwesome name={'close'} size={24} color="#FFF" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#FFF',
            marginLeft: 10,
          }}>
          New Video
        </Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={{width: 60}}
            onPress={() => {
              handleUploadVideo();
            }}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  color: '#FFF',
                  marginLeft: 10,
                }}>
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: '90%',
          marginTop: 10,
        }}>
        {selectedVideo ? (
          <VideoPlayer
            source={selectedVideo}
            disableFullscreen={true}
            disableSeekbar={true}
            disableVolume={true}
            disableBack={true}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={handlePickVideo}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="upload-cloud" color="black" size={100} />

              <Text>Choose a video..</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          marginVertical: 10,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          position: 'absolute',
          bottom: 50,
        }}>
        {selectedVideo && (
          <TouchableOpacity
            onPress={handlePickVideo}
            style={{
              borderRadius: 50,
              height: 40,
              width: 40,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text style={{fontSize: 15}}>Choose Another Video</Text> */}
            <Feather name="upload" size={25} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* {selectedVideo ? (
        <TouchableOpacity
          style={{
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleUploadVideo}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text
              style={{
                width: 100,
                backgroundColor: 'black',
                color: 'white',
                textAlign: 'center',
                padding: 10,
                borderRadius: 20,
              }}>
              Upload Story
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: '100%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'left'}}>
            Note:
          </Text>
          <Text style={{width: '60%', fontSize: 20, fontWeight: 'bold'}}>
            Uploaded Video will be public, and can be Viewed By other Amber
            User's.
          </Text>
        </View>
      )} */}
    </View>
  );
};
