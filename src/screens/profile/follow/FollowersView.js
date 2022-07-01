import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api_removeFollower} from '../../../api_services';
import DefaultImage from '../../../components/DefaultImage';
import {getFollowers} from '../../../redux/actions/follow.action';
import {DO_PROFILE_UPDATE} from '../../../redux/reducers/actionTypes';

const data = [
  {
    id: 1,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=',
  },
  {
    id: 2,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,

    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: true,
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 7,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 8,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: false,
    image:
      'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 9,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: true,
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 10,
    name: 'Elina stark',
    bio: 'you think so?..',
    follow: true,
    image:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
];

const FollowersListItem = ({item, index, setRefresh}) => {
  const navigation = useNavigation();

  const [loading, setLoading] = React.useState(false);
  const {auth} = useSelector(state => state);
  const dispatch = useDispatch(null);
  const handleViewProfile = item => {
    // navigation.navigate('ProfileRoutes', {
    //   screen: 'ViewOtherProfile',
    //   params: { user: item, userId: item.id, },
    // });

    navigation.navigate('ViewOtherProfile', {
      user: item,
      userId: item.id,
    });
  };

  const handleRemovePress = async () => {
    const payload = {
      token: auth?.accessToken,
      userId: auth?.user?.id,
      tragetUserId: item?.id,
    };
    setLoading(true);
    try {
      const res = await api_removeFollower(payload);
      console.log(res);
      if (res?.isSuccess) {
        Alert.alert('Alert', res?.message || 'user removed!');
        setRefresh(s => !s);
        dispatch({type: DO_PROFILE_UPDATE});
      } else {
        throw new Error(res?.error || 'something went wrong !');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'red',
          width: '70%',
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
        }}
        onPress={handleRemovePress}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: item?.follow ? '#FFF' : '#f4871e',
              textAlign: 'center',
            }}>
            Remove
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const FollowersView = ({searchFriendKeyword}) => {
  const dispatch = useDispatch(null);
  const {auth, follow} = useSelector(state => state);
  const {followersList, loading} = follow;
  const [refresh, setRefresh] = React.useState(false);
  console.log({followersList});

  useEffect(() => {
    dispatch(
      getFollowers({
        token: auth.accessToken,
        userId: auth.user.id,
      }),
    );
  }, [refresh]);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: '10%',
      }}>
      <FlatList
        data={followersList.filter(u =>
          u?.username?.includes(searchFriendKeyword),
        )}
        keyExtractor={item => item.id}
        numColumns={1}
        ListEmptyComponent={
          loading && (
            <View
              style={{
                width: 300,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="orange" size="small" />
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

export default FollowersView;
