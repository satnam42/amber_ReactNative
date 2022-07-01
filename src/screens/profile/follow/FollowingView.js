import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getFollowing} from '../../../redux/actions/follow.action';
import {useNavigation} from '@react-navigation/core';
import {
  DO_PROFILE_UPDATE,
  REFRESH_FOLLOW_REDUCER,
  SET_FOLLOWING_COUNT,
} from '../../../redux/reducers/actionTypes';
import DefaultImage from '../../../components/DefaultImage';
import {api_unfollowUser} from '../../../api_services';
import {FieldArray} from 'formik';
import {TabBarContext} from '../../../../App';

const FollowersListItem = ({item, index, setRefresh}) => {
  const navigation = useNavigation();
  const {auth, follow} = useSelector(state => state);
  const {tabSettings, setTabSettings} = React.useContext(TabBarContext);
  const dispatch = useDispatch(null);

  const handleViewProfile = item => {
    // navigation.navigate('ProfileRoutes', {
    //   screen: 'ViewOtherProfile',
    //   params: {user: item, userId: item.id},
    // });
    navigation.navigate('ViewOtherProfile', {
      user: item,
      userId: item.id,
    });
  };

  const updateUserDetails = async () => {
    dispatch({type: DO_PROFILE_UPDATE});
  };

  const handleUnfollow = async tragetUserId => {
    const payload = {
      token: auth.accessToken,
      userId: auth.user.id,
      tragetUserId,
    };
    try {
      const response = await api_unfollowUser(payload);
      console.log(response);
      if (response.isSuccess) {
        setRefresh(s => !s);

        //updateUser
        updateUserDetails();

        ToastAndroid.showWithGravity(
          response?.message || 'unfollow successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          response?.message || 'something went wrong!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (err) {
      console.log(err);
      ToastAndroid.showWithGravity(
        err?.message || 'something went wrong!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  // useEffect(() => {
  //   // const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  //   const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
  //     // setKeyboardStatus('Keyboard Shown');
  //     setTabSettings({
  //       ...tabSettings,
  //       showTabBar: true,
  //     });
  //   });
  //   const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
  //     // setKeyboardStatus('Keyboard Hidden');
  //     setTabSettings({
  //       ...tabSettings,
  //       showTabBar: false,
  //     });
  //   });

  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: '80%',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => handleViewProfile(item)}>
        {item?.avatar ? (
          <Image
            source={{
              uri: item?.avatar,
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
          />
        ) : (
          <DefaultImage
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              marginRight: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            iconSize={55}
          />
        )}
        <Text
          style={{
            fontSize: 15,
            maxWidth: 100,
            fontWeight: 'bold',

            color: '#333',
          }}>
          {item?.firstName || item.username}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          borderRadius: 8,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: item?.follow ? '#f4871e' : '#FFF',
          borderColor: '#f4871e',
          borderWidth: 1,
          minWidth: 90,
          marginLeft: 8,
        }}
        onPress={() => handleUnfollow(item?.id)}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: item?.follow ? '#FFF' : '#f4871e',
            textAlign: 'center',
          }}>
          Unfollow
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const FollowingView = ({searchFriendKeyword}) => {
  const dispatch = useDispatch(null);
  const {auth, follow} = useSelector(state => state);
  const {error: followingReqErr, followingList, loading} = follow;
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    dispatch(getFollowing({token: auth.accessToken, userId: auth.user.id}));
  }, [refresh]);

  if (followingReqErr) {
    Alert.alert('Error', followingReqErr);
    dispatch({type: REFRESH_FOLLOW_REDUCER});
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        // data={followingList.filter(u =>
        //   u?.firstName?.includes(searchFriendKeyword),
        // )}
        data={followingList.filter(u =>
          u?.username?.includes(searchFriendKeyword),
        )}
        keyExtractor={item => item.id}
        numColumns={1}
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                width: 300,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="orange" size="small" />
            </View>
          ) : (
            <View
              style={{
                width: 300,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Text>No Following...</Text>÷ */}
            </View>
          )
        }
        renderItem={({item, index}) => (
          <FollowersListItem
            setRefresh={setRefresh}
            index={index}
            item={item}
          />
        )}
      />
    </View>
  );
};

export default FollowingView;
