import React, {createRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ActivityIndicatorBase,
  PermissionsAndroid,
} from 'react-native';
import {Avatar} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {
  LOGOUT,
  RESET_REDUX_STORE,
  UPDATE_MY_PROFILE,
} from '../../redux/reducers/actionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteFromLocalStorage,
  fromLocalStorage,
  generateNameAvatar,
} from '../../utils/helper';
import PhotoGallary from './gallary/PhotoGallary';
import VideoGallary from './gallary/VideoGallary';
import StorieView from '../../components/StorieView';
import FileUploadForm from '../../components/FileUploadForm';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import {AGREE_TO_TERM_AND_CONDITION_KEY, colors} from '../../constants';
import {api_logout, getUserDetails} from '../../api_services';
import {floor} from 'react-native-reanimated';
import {getFcmToken} from '../../utils/notificationServices';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageComp from '../../components/ImageComp';

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const {user, accessToken} = useSelector(state => state.auth);
  const {follow, auth} = useSelector(state => state);
  const [profilePic, setProfilePic] = useState(user?.avatar);
  const [isStoreView, setIsStoreView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const actionSheetRef = createRef();
  console.log({user});
  const [isPhotoGallaryActive, setIsPhotoGallaryActive] = useState(false);
  const [isVideoGallaryActive, setIsVideoGallaryActive] = useState(false);
  const [isVideoUploadFormActive, setIsVideoUploadFormActive] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleNavigate = route => {
    navigation.navigate(route, {setRefresh});
  };
  const handlePhotoGallaryToggle = bool => setIsPhotoGallaryActive(bool);

  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };
  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('sheetUploadVideo');
    } else {
      actionSheetRef?.current?.hide();
    }
  };

  // const removeAgreement = async () => {
  //   try {
  //     const res = await AsyncStorage.removeItem(
  //       AGREE_TO_TERM_AND_CONDITION_KEY,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLogout = () => {
    Alert.alert('Logout Alert', 'please confirm your action!', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'LOGOUT',
        onPress: async () => {
          // removeAgreement();
          const res = await api_logout({token: accessToken});
          console.log(res);
          handleToast('success', 'success', 'logout successfully!');
          dispatch({type: LOGOUT});
          await getFcmToken(true);
          navigation.navigate('Login');
          dispatch({type: RESET_REDUX_STORE});
        },
      },
    ]);
  };

  const handleAddPhotoToGallary = () => {
    setIsStoreView(true);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handlePickVideo = async () => {
    const result = await launchImageLibrary({
      title: 'Video Picker',
      mediaType: 'video',
      includeBase64: true,
    })
      .then(res => setSelectedVideo(res.assets[0]))
      .catch(err => console.log(err));
  };

  const requestCameraPermission = async () => {
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
      } else {
        console.log('Camera permission denied');
      }
      handlePickVideoThruCamera();
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePickVideoThruCamera = async () => {
    const res = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => console.log(err));

    if (res) {
      try {
        const result = await launchCamera(
          {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            mediaType: 'video',
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
              setSelectedVideo(response?.assets[0]);
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      requestCameraPermission();
    }
  };

  useEffect(() => {
    setProfilePic(user?.avatar || '');
  }, [user]);

  React.useEffect(() => {
    handleUpdateProfile();
  }, [refresh, auth?.doUpdateProfile]);

  return (
    <View style={{flex: 1}}>
      {loading && (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.1)',
            position: 'absolute',
            zIndex: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      )}
      <ScrollView style={{marginBottom: 70}}>
        {/* Profile start */}
        <View style={[styles.profile.container, {marginBottom: 70}]}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginTop: 5,
              position: 'absolute',
              right: 10,
              top: 10,
            }}
            onPress={() => handleNavigate('SettingRoutes')}>
            <Image
              source={require('../../../ios/Assets/settings.png')}
              style={{
                width: 30,
                height: 30,
              }}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginTop: 5,
              position: 'absolute',
              right: 10,
              top: 60,
            }}
            onPress={handleLogout}>
            <Icon name="logout" size={28} color="#555" />
          </TouchableOpacity>

          <View style={styles.profile.avatarBox}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                marginTop: 5,
                backgroundColor: '#555',
                position: 'absolute',
                zIndex: 2,
                width: 50,
                height: 50,
                borderRadius: 100,
                textAlign: 'center',
                bottom: 10,
                left: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleNavigate('EditProfile')}>
              {/* <Icon3
              name="edit"
              style={{lineHeight: 50}}
              size={30}
              color="#fff"
            /> */}
              <Image
                source={require('../../../ios/Assets/pencil.png')}
                style={{
                  width: 25,
                  height: 25,
                }}></Image>
            </TouchableOpacity>

            {user?.gender === 'female' && (
              <TouchableOpacity
                style={{
                  width: 55,
                  height: 55,
                  padding: 5,
                  borderRadius: 100,
                  backgroundColor: 'orange',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 140,
                  zIndex: 10,
                  left: -60,
                }}
                onPress={() => navigation.navigate('MyGifts')}>
                <Feather name="gift" size={35} color={'#000'} />
              </TouchableOpacity>
            )}

            {profilePic ? (
              // <Image
              //   style={{
              //     width: 130,
              //     borderRadius: 100,
              //     height: 130,
              //   }}
              //   source={{
              //     uri: profilePic,
              //   }}
              // />
              <ImageComp
                imageStyles={{
                  width: 130,
                  borderRadius: 100,
                  height: 130,
                }}
                URI={profilePic}
              />
            ) : (
              <View
                style={{
                  width: 130,
                  height: 130,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <MaterialCommunityIcons name="face-profile" size={120} />
              </View>
            )}
          </View>
          <Text style={styles.profile.username}>
            {user?.firstName || user?.username || 'NO NAME'}
          </Text>
          <Text style={styles.profile.bio}>{user?.bio}</Text>
          <View style={styles.profile.followingDetails}>
            <TouchableOpacity onPress={() => handleNavigate('FollowersScreen')}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    marginRight: 5,
                  }}>
                  {user?.followerCount || 0}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}>
                  Follower
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.profile.followingDetailHr}></View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowersScreen', {activeView: 1})
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    marginRight: 5,
                  }}>
                  {user?.followingCount || 0}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}>
                  Following
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* profile end*/}

        {/* body start */}
        <View
          style={{
            flex: 1,
            marginTop: 30,
            marginBottom: 70,
          }}>
          <View>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                marginLeft: 20,
              }}>
              Photos
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 20,
              }}>
              {/* <TouchableOpacity onPress={() => {handlePhotoGallaryToggle(true)}}> */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ScrollablePhotos', {
                    images: user?.images,
                    showPhotoDeleteButton: true,
                  })
                }>
                {profilePic ? (
                  // <Image
                  //   source={{
                  //     uri: profilePic,
                  //   }}
                  //   style={{
                  //     width: 100,
                  //     height: 100,
                  //     borderRadius: 15,
                  //   }}
                  // />
                  <ImageComp
                    imageStyles={{
                      width: 100,
                      height: 100,
                      borderRadius: 15,
                    }}
                    URI={profilePic}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#555',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Entypo name="folder-images" color="white" size={45} />
                  </View>
                )}
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  width: 100,
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  marginLeft: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EditProfile', {
                      headerTitle: 'Change Profile',
                      hideForm: true,
                      setRefresh: setRefresh,
                    });
                  }}>
                  <Icon3
                    name="add"
                    size={65}
                    style={{
                      paddingHorizontal: 10,
                      marginTop: 5,
                    }}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Video */}
          <View>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                marginLeft: 20,
              }}>
              Video
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                marginHorizontal: 20,
              }}>
              {/* <TouchableOpacity onPress={() => setIsVideoGallaryActive(true)}> */}
              <TouchableOpacity
                onPress={() => {
                  if (user?.videos?.[user?.videos?.length - 1]?.thumbnail) {
                    navigation.navigate('ScrollableVideos', {
                      videos: user?.videos,
                      showVideoDeleteButton: true,
                    });
                  } else {
                    Alert.alert('Alert', 'No Videos');
                  }
                }}>
                {user?.videos?.[user?.videos?.length - 1]?.thumbnail ? (
                  <Image
                    source={{
                      uri: user?.videos?.[user?.videos?.length - 1]?.thumbnail,
                    }}
                    style={{
                      width: 100,
                      height: 150,
                      borderRadius: 15,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 150,
                      borderRadius: 15,
                      backgroundColor: '#555',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Entypo name="folder-video" color="#fff" size={45} />
                  </View>
                )}
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  width: 100,
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  marginLeft: 20,
                  height: 150,
                }}>
                <TouchableOpacity
                  // onPress={() => setIsVideoUploadFormActive(true)}>
                  // onPress={handlePickVideo}>
                  onPress={() => handldeSheet(true)}>
                  <Icon3
                    name="add"
                    size={65}
                    style={{
                      paddingHorizontal: 10,
                      marginTop: 5,
                    }}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <Toast />

        <ActionSheet id="sheetUploadVideo" ref={actionSheetRef}>
          <View
            style={{
              height: 90,
            }}>
            <TouchableOpacity
              onPress={() => {
                handlePickVideoThruCamera();
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
                Open Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handlePickVideo();
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
                Choose From Gallary
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
      </ScrollView>
      {/* body end */}
      {isPhotoGallaryActive && (
        <PhotoGallary
          setRefresh={setRefresh}
          setIsPhotoGallaryActive={setIsPhotoGallaryActive}
          images={user?.images}
          showPhotoDeleteButton
        />
      )}
      {isVideoGallaryActive && (
        <View
          style={{
            width: '100%',
            height: '91%',
            position: 'absolute',
          }}>
          <VideoGallary
            setRefresh={setRefresh}
            setIsVideoGallaryActive={setIsVideoGallaryActive}
            videos={user.videos}
          />
        </View>
      )}
      {isStoreView && <StorieView />}
      {isVideoUploadFormActive ||
        (selectedVideo && (
          <FileUploadForm
            handlePickVideo={handlePickVideo}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            setRefresh={setRefresh}
            setIsVideoUploadFormActive={setIsVideoUploadFormActive}
          />
        ))}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profile: {
    container: {
      alignItems: 'center',
    },
    avatarBox: {
      marginVertical: 20,
      borderColor: 'orange',
      borderWidth: 5,
      borderRadius: 100,
      padding: 5,
    },
    username: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'rgba(0,0,0,0.7)',
    },
    bio: {
      fontSize: 17,
      fontWeight: 'normal',
      color: 'rgba(0,0,0,0.7)',
    },
    followingDetails: {
      marginTop: 5,
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
    },
    followingDetailHr: {backgroundColor: '#fff', width: 2, height: '80%'},
  },
});
