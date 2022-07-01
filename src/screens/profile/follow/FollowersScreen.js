import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import HeaderBackTitle from '../../../components/HeaderBackTitle';
import FollowersView from './FollowersView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FollowingView from './FollowingView';
import {useSelector} from 'react-redux';
import {TabBarContext} from '../../../../App';

const SearchFriend = ({
  searchFriendKeyword,
  setSearchFriendKeyword,
  placeholder,
}) => {
  return (
    <View
      style={{
        backgroundColor: '#666',
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 30,
        marginLeft: 30,
        marginRight: 30,
        height: 45,
      }}>
      <Image
        source={require('../../../../ios/Assets/SearchIcon.png')}
        style={{
          width: 25,
          height: 25,
        }}></Image>

      <TextInput
        style={{
          color: '#fff',
          fontSize: 17,
          letterSpacing: 0.5,
          paddingHorizontal: 20,
          width: '90%',
          paddingHorizontal: 10,
          marginHorizontal: 10,
        }}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        value={searchFriendKeyword}
        onChangeText={value => setSearchFriendKeyword(value)}
      />
    </View>
  );
};

const FollowersScreen = ({route, navigation}) => {
  const [activeMidTabs, setActiveMidTabs] = useState(0);
  const [isKeyBoardUp, setIsKeyBoardUp] = useState(false);
  const [searchFriendKeyword, setSearchFriendKeyword] = useState('');
  const {tabSettings, setTabSettings} = React.useContext(TabBarContext);
  const {user} = useSelector(state => state.auth);

  console.log({searchFriendKeyword});

  useEffect(() => {
    if (route?.params?.activeView) {
      setActiveMidTabs(route?.params?.activeView);
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyBoardUp(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyBoardUp(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={{flex: 1, paddingBottom: isKeyBoardUp ? 0 : 70}}>
      <HeaderBackTitle navigation={navigation} title={'Followers'} />
      {/* Mid tabs start */}
      <View
        style={{
          width: '80%',
          maxWidth: 400,
          height: 60,
          alignSelf: 'center',
          flexDirection: 'row',
          borderColor: 'rgba(0,0,0,0.4)',
          borderBottomWidth: 1,
        }}>
        {/*  0 */}
        <TouchableOpacity
          onPress={() => setActiveMidTabs(0)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#555',
            justifyContent: 'center',
            borderBottomWidth: activeMidTabs === 0 ? 2 : 0,
          }}>
          <Text style={{fontSize: 16, color: '#555'}}>
            {user?.followerCount}
          </Text>
          <Text
            style={{
              fontSize: 17,
              marginLeft: 5,
              fontWeight: 'bold',
              color: '#000',
            }}>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveMidTabs(1)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',

            borderColor: '#555',
            justifyContent: 'center',
            borderBottomWidth: activeMidTabs === 1 ? 3 : 0,
          }}>
          <Text style={{fontSize: 16, color: '#555'}}>
            {user?.followingCount}
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginLeft: 5,
              color: '#000',
            }}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
      {/* Mid tabs end */}
      <SearchFriend
        placeholder={activeMidTabs ? 'Search Following' : 'Search Follower'}
        searchFriendKeyword={searchFriendKeyword}
        setSearchFriendKeyword={setSearchFriendKeyword}
      />

      {/* DYNAMIC VIEW START */}
      {activeMidTabs ? (
        <FollowingView searchFriendKeyword={searchFriendKeyword} />
      ) : (
        <FollowersView searchFriendKeyword={searchFriendKeyword} />
      )}
      {/* DYNAMIC VIEW END*/}
    </View>
  );
};

export default FollowersScreen;
