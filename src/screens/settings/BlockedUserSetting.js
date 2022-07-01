import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ActivityIndicatorBase,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {api_unblockUser} from '../../api_services';
import DefaultImage from '../../components/DefaultImage';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {getBlockList} from '../../redux/actions/block.action';
import {BLOCK_REDUCER_REFRESH} from '../../redux/reducers/actionTypes';
import Toast from 'react-native-toast-message';
const data = [
  {
    id: 1,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://media.istockphoto.com/photos/pleasant-young-indian-woman-freelancer-consult-client-via-video-call-picture-id1300972573?b=1&k=20&m=1300972573&s=170667a&w=0&h=xuAsEkMkoBbc5Nh-nButyq3DU297V_tnak-60VarrR0=',
  },
  {
    id: 2,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 7,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 8,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1629467057571-42d22d8f0cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 9,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 10,
    name: 'Elina stark',
    bio: 'you think so?..',
    image:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
];

const BlockedUser = ({item, handleUnblock}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          margin: 2,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          maxWidth: 400,
          marginLeft: 20,
        }}>
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
          <DefaultImage iconSize={60} style={{marginRight: 15}} />
        )}

        <View style={{}}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              color: '#222',
            }}>
            {item?.username}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{marginRight: 45}}
        onPress={() => handleUnblock(item.id)}>
        <Text
          style={{
            color: '#fff',
            backgroundColor: '#cf4949',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 30,
          }}>
          unblock
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BlockedUserSetting = ({navigation}) => {
  const {auth, block} = useSelector(state => state);
  const {accessToken, user} = auth;
  const {error, loading, blockList} = block;
  const dispatch = useDispatch();

  const handleGetBlockUserList = () => {
    dispatch(getBlockList({userId: user?.id, authToken: accessToken}));
  };
  useEffect(() => {
    handleGetBlockUserList();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch({type: BLOCK_REDUCER_REFRESH});
    }
  }, [error]);

  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handleUnblock = async unblockUserId => {
    const bodyData = {
      toUser: unblockUserId,
      byUser: user?.id,
      to: 'string',
    };
    const response = await api_unblockUser({
      bodyData,
      authToken: accessToken,
    });
    console.log(response);

    if (response.isSuccess && response.statusCode === 200) {
      handleToast('success', 'success', response.message || 'UnBlocked!');
      handleGetBlockUserList();
    } else {
      handleToast('error', 'error', response.error || 'failed to UnBlocked!');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <HeaderBackTitle title={'Blocked Users'} navigation={navigation} />

      <FlatList
        data={blockList}
        keyExtractor={item => item.id}
        numColumns={1}
        ListEmptyComponent={
          <Text style={{textAlign: 'center'}}>
            {loading ? (
              <View
                style={{
                  width: '100%',
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="orange" />
              </View>
            ) : (
              'empty list'
            )}
          </Text>
        }
        renderItem={({item, index}) => (
          <BlockedUser
            index={index}
            item={item}
            navigation={navigation}
            handleUnblock={handleUnblock}
          />
        )}
      />
    </View>
  );
};

export default BlockedUserSetting;

const styles = StyleSheet.create({});
