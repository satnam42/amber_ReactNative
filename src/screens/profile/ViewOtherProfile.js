import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import FollowBtn from '../../components/FollowBtn';
import {getViewProfile} from '../../redux/actions/profile.action';
import MyLoader from '../../components/MyLoader';
import {
  api_blockUser,
  api_followUser,
  api_unfollowUser,
  api_userReport,
} from '../../api_services';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import VideoGallary from './gallary/VideoGallary';
import {
  CURRENT_VIEW_PROFILE_SUCCESS,
  REMOVE_CURRENT_VIEW_PROFILE,
  REMOVE_USER_FROM_USERLIST,
} from '../../redux/reducers/actionTypes';
import PhotoGallary from './gallary/PhotoGallary';
import {getCoversationList} from '../../redux/actions/chat.actions';
import ReportUser from '../../components/ReportUser';
import {createRef} from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import ImageComp from '../../components/ImageComp';

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

const ViewOtherProfile = ({route, navigation, CustomBack = true}) => {
  const dispatch = useDispatch();

  const [isAmFollowing, setIsAmFollowing] = useState(false);
  const [disableBlockBtn, setDisableBlockBtn] = useState(false);
  const [isVideoGallaryActive, setIsVideoGallaryActive] = useState(false);
  const [overRiderFollowText, setOverRiderFollowText] = useState(null);
  const {userId} = route.params;
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [shortMenu, setShortMenu] = useState(false);
  const actionSheetRef = createRef();
  const sheetReportUserRef = createRef();
  const [isPhotoGallaryActive, setIsPhotoGallaryActive] = useState(false);

  console.log(route);
  const {auth, profile, extra} = useSelector(state => state);
  const {
    loading: profileLoading,
    error: profileError,
    currentViewProfile,
  } = profile;

  const handleNavigate = route => navigation.navigate(route);

  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  useEffect(() => {
    dispatch(getViewProfile({token: auth.accessToken, userId: userId}));

    if (profileError) {
      handleToast('error', 'error', profileError);
    }
  }, [userId]);

  useEffect(() => {
    if (currentViewProfile) {
      setIsAmFollowing(currentViewProfile?.isAmFollowing);
    }
  }, [currentViewProfile]);

  const handleFollow = async () => {
    const response = await api_followUser({
      token: auth.accessToken,
      userId: auth.user.id,
      tragetUserId: userId,
    });
    console.log(response, 'follow');

    if (response.isSuccess && response.statusCode === 200) {
      ToastAndroid.show('follow success!', ToastAndroid.SHORT);
      setIsAmFollowing(true);
    } else {
      handleToast('error', 'error', response.error || 'failed to follow!');
    }
  };
  const handleUnFollow = async () => {
    const response = await api_unfollowUser({
      token: auth.accessToken,
      userId: auth.user.id,
      tragetUserId: userId,
    });
    console.log(response, 'unfollow');
    if (response.isSuccess && response.statusCode === 200) {
      ToastAndroid.show('unfollow success!', ToastAndroid.SHORT);
      setIsAmFollowing(false);
    } else {
      handleToast('error', 'error', response.error || 'failed to unfollow!');
    }
  };

  console.log({currentViewProfile});

  const handleRefreshChatUserList = () => {
    dispatch(
      getCoversationList({
        userId: auth.user.id,
        authToken: auth.accessToken,
      }),
    );
  };

  const handleBlockPerson = async () => {
    console.log('REMOVE TEST');

    const bodyData = {
      toUser: currentViewProfile?.id,
      byUser: auth?.user?.id,
    };
    try {
      const response = await api_blockUser({
        bodyData,
        authToken: auth.accessToken,
      });
      console.log({response});
      if (response.isSuccess && response.statusCode === 200) {
        handleToast('success', 'success', response.error || 'Blocked!');
        dispatch({
          type: REMOVE_USER_FROM_USERLIST,
          payload: {userId: currentViewProfile?.id},
        });
        handleRefreshChatUserList();
        setDisableBlockBtn(true);
      } else {
        handleToast('error', 'error', response.error || 'failed to Blocked!');
      }
    } catch (error) {
      console.log(error);
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

  const redirectToChatScreen = () => {
    // navigation.navigate('Inbox', {
    //   screen: 'ChatScreen',
    //   params: {
    //     // conversationId,
    //     otherUserName: currentViewProfile?.username || currentViewProfile?.firstName || 'no name',
    //     otherUserID: currentViewProfile.id,
    //     otherUserProfileImage: currentViewProfile.avatar,
    //   },
    // });
    navigation.navigate('ChatScreen', {
      otherUserName:
        currentViewProfile?.username ||
        currentViewProfile?.firstName ||
        'no name',
      otherUserID: currentViewProfile?.id,
      otherUserProfileImage: currentViewProfile?.avatar,
    });
  };

  const handlePhotoGallaryToggle = bool => {
    console.log({bool});
    setIsPhotoGallaryActive(bool);
  };

  const handleBack = () => {
    const {routes} = navigation.getState();

    console.log(navigation.getState());
    console.log(routes);
    // if (routes.length == 1) {
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 1,
    //       routes: [
    //         { name: 'Profile' },
    //       ],
    //     })
    //   );
    // } else {
    // navigation.pop();
    navigation.goBack();
    // }

    // if (currentActiveMainTab === "PROFILE" && CustomBack) {
    //   navigation.navigate('Profile');
    // } else {
    // navigation.pop();
    // }
  };

  const handleUnmount = () => {
    dispatch({type: CURRENT_VIEW_PROFILE_SUCCESS, payload: null});
  };

  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('sheet');
    } else {
      actionSheetRef.current.hide();
    }
  };
  const handleReportUserSheet = bool => {
    if (bool) {
      SheetManager.show('sheetReportUser');
    } else {
      sheetReportUserRef.current.hide();
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
    <View style={{flex: 1}}>
      {/* ----  <><><><><><><>  ---- */}
      {reportLoading && (
        <MyLoader
          style={{position: 'absolute'}}
          visible={true}
          text={'Reporting...'}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          handldeSheet(true);
        }}
        style={{
          width: 55,
          height: 55,
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 100,
        }}>
        <Entypo name="dots-three-vertical" size={20} color={'#000'} />
      </TouchableOpacity>

      {/* ----  <><><><><><><>  ---- */}

      <HeaderBackTitle
        navigation={navigation}
        title="Profile"
        onBackPress={handleBack}
      />

      <ScrollView style={{flex: 1}}>
        <>
          <View style={{marginBottom: 70}}>
            <View>
              <View style={[styles.profile.container, {position: 'relative'}]}>
                {profileLoading && <MyLoader visible={profileLoading} />}
                <View style={styles.profile.avatarBox}>
                  {currentViewProfile?.avatar ? (
                    // <Image
                    //   source={
                    //     currentViewProfile.avatar
                    //       ? {
                    //           uri: currentViewProfile.avatar,
                    //         }
                    //       : {uri: null}
                    //   }
                    //   style={{
                    //     width: 130,
                    //     height: 130,
                    //     borderRadius: 100,
                    //   }}
                    // />
                    <ImageComp
                      imageStyles={{
                        width: 130,
                        height: 130,
                        borderRadius: 100,
                      }}
                      URI={currentViewProfile.avatar}
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
                  {currentViewProfile?.firstName ||
                    currentViewProfile?.username ||
                    'No Name'}
                </Text>
                <Text style={styles.profile.bio}>
                  {currentViewProfile?.bio}
                </Text>

                {currentViewProfile?.isBlocked ||
                  (disableBlockBtn && (
                    <View
                      style={{
                        backgroundColor: 'red',
                        padding: 5,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                        }}>
                        This User is Blocked.
                      </Text>
                    </View>
                  ))}

                {/* LEFT CTA */}
                {/* <TouchableOpacity
                onPress={() => setIsReportVisible(!isReportVisible)}
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
                  left: 45,
                }}>
                <Feather name="alert" size={35} color={'#000'} />
              </TouchableOpacity> */}

                {/* { top right } */}

                {/* RIGHT CTA */}

                {isReportVisible && (
                  <ReportUser
                    isReportVisible={isReportVisible}
                    setIsReportVisible={setIsReportVisible}
                  />
                )}
                {/* {!currentViewProfile?.isBlocked && !disableBlockBtn && (
                <TouchableOpacity
                  style={{
                    width: 55,
                    height: 55,
                    padding: 5,
                    borderRadius: 100,
                    backgroundColor: 'tomato',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    zIndex: 10,
                    right: 45,
                  }}
                  onPress={hanldeBlockUser}>
                  <Entypo name="block" size={35} color={'#000'} />
                </TouchableOpacity>
              )} */}
                {/* RIGHT CTA */}
                {!currentViewProfile?.isBlocked && !disableBlockBtn && (
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
                      right: 45,
                    }}
                    onPress={redirectToChatScreen}>
                    <AntDesign name="message1" size={35} color={'#000'} />
                  </TouchableOpacity>
                )}
                {!currentViewProfile?.isBlocked && (
                  <View style={styles.profile.followingDetails}>
                    <TouchableOpacity
                      onPress={() => {
                        // handleNavigate('FollowersScreen')
                      }}>
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
                          {currentViewProfile?.followerCount
                            ? currentViewProfile?.followerCount
                            : 0}
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
                      onPress={() => {
                        // navigation.navigate('FollowersScreen', {activeView: 1})
                      }}>
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
                          {currentViewProfile?.followingCount
                            ? currentViewProfile?.followingCount
                            : 0}
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
                )}
              </View>
              {/* profile end*/}

              {!currentViewProfile?.isBlocked && (
                <View>
                  {isAmFollowing ? (
                    <FollowBtn follow={true} onPress={handleUnFollow} />
                  ) : (
                    <FollowBtn follow={false} onPress={handleFollow} />
                  )}
                </View>
              )}
              {!currentViewProfile?.isBlocked && (
                <View
                  style={{
                    flex: 1,
                    marginTop: 30,
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
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        marginHorizontal: 20,
                      }}
                      // onPress={() => handlePhotoGallaryToggle(true)}>
                      onPress={() => {
                        navigation.navigate('ScrollablePhotos', {
                          images: currentViewProfile?.images,
                        });
                      }}>
                      {currentViewProfile?.avatar ? (
                        // <Image
                        //   source={{
                        //     uri: currentViewProfile?.avatar,
                        //   }}
                        //   style={{
                        //     width: 100,
                        //     height: 100,
                        //     borderRadius: 15,
                        //   }}
                        // />
                        <ImageComp
                          URI={currentViewProfile?.avatar}
                          imageStyles={{
                            width: 100,
                            height: 100,
                            borderRadius: 15,
                          }}
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
                          <Entypo
                            name="folder-images"
                            color="white"
                            size={45}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  {/* Video */}
                  <View
                    style={{
                      marginLeft: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#000',
                      }}>
                      Video
                    </Text>
                    <TouchableOpacity
                      // onPress={() => setIsVideoGallaryActive(true)}>
                      onPress={() => {
                        if (
                          currentViewProfile?.videos?.[
                            currentViewProfile?.videos?.length - 1
                          ]?.thumbnail
                        ) {
                          navigation.navigate('ScrollableVideos', {
                            videos: currentViewProfile?.videos,
                          });
                        } else {
                          Alert.alert('Alert', 'No Videos');
                        }
                      }}>
                      {currentViewProfile?.videos?.[
                        currentViewProfile?.videos?.length - 1
                      ]?.thumbnail ? (
                        <Image
                          source={{
                            uri: currentViewProfile?.videos?.[
                              currentViewProfile?.videos?.length - 1
                            ]?.thumbnail,
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
                  </View>
                </View>
              )}
              <Toast />
              {/* body end */}
            </View>
          </View>

          <ActionSheet id="sheet" ref={actionSheetRef}>
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
          <ActionSheet id="sheetReportUser" ref={sheetReportUserRef}>
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
        </>
      </ScrollView>
      {isPhotoGallaryActive && (
        <PhotoGallary
          setIsPhotoGallaryActive={setIsPhotoGallaryActive}
          images={currentViewProfile?.images}
        />
      )}
      {isVideoGallaryActive && (
        <VideoGallary
          setIsVideoGallaryActive={setIsVideoGallaryActive}
          videos={currentViewProfile?.videos}
        />
      )}
    </View>
  );
};

export default ViewOtherProfile;

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

  extraDetailsContainer: {
    flexDirection: 'row',
    width: '75%',
    padding: 5,
    borderColor: 'rgba(15,15,15,0.1)',
    borderBottomWidth: 1,
  },
});
