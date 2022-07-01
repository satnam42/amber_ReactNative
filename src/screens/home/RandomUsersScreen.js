import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {dummyRandomUser} from '../../utils/dummy';

// import {RANDOM_VIEWS} from '../../screens/home/MidTabViews/Random';
import LiveVideoCard from '../../components/LiveVideoCard';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {api_usersRandom} from '../../api_services';
const PAGE_SIZE = 10;
const RandomUsersScreen = ({setActiveRandomView}) => {
  const navigation = useNavigation(null);
  const {auth} = useSelector(s => s);
  const [randomUsers, setRandomUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const hitGetRandomUser = async () => {
    setRandomUsers([]);
    setLoading(true);
    try {
      const payload = {
        token: auth?.accessToken,
        pageSize: PAGE_SIZE,
      };
      const res = await api_usersRandom(payload);
      console.log(res);

      if (res?.isSuccess) {
        setRandomUsers(res?.items);
      } else {
        throw new Error(res?.error || 'something went wrong!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoading(false);
    }
  };

  console.log({randomUsers});
  React.useEffect(() => {
    hitGetRandomUser();
  }, []);
  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        marginBottom: 70,
      }}>
      <HeaderBackTitle
        title="Random Users"
        onBackPress={() => navigation.goBack()}
      />
      {/* USERLIST START */}
      <FlatList
        initialNumToRender={100}
        style={{
          width: '90%',
          alignSelf: 'center',
        }}
        columnWrapperStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={randomUsers}
        ListEmptyComponent={
          loading && (
            <View
              style={{
                width: '100%',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="orange" size="large" />
            </View>
          )
        }
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item, index}) => {
          return <LiveVideoCard index={index} item={item} />;
        }}
        onEndReached={() => {
          hitGetRandomUser();
        }}
        onEndReachedThreshold={0.1}
      />
      {/* USERLIST END */}
    </View>
  );
};

export default RandomUsersScreen;

const styles = StyleSheet.create({});
