import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import LiveVideoCard from '../../../components/LiveVideoCard';
import {getUserCoin} from '../../../redux/actions/coin.actions';

import {countryCode} from '../../signup/helper';

import {getUpdateProfileListMain} from '../../../redux/actions/profile.action';
import {getUsersList} from '../../../redux/actions/users.action';
import {
  GET_USERS_LIST_FAIL,
  PROFILE_LIST_REFRESH,
  REMOVE_USERS_LIST,
  SET_USER_COORDS,
  SET_USER_LIST_FILTER,
  USERS_REDUCER_REFRESH,
} from '../../../redux/reducers/actionTypes';
import Geolocation from '@react-native-community/geolocation';
import {
  api_getFollowingList,
  api_sendVideoCallInvitationToRandom,
} from '../../../api_services';
import Fontisto from 'react-native-vector-icons/Fontisto';

const countries = countryCode?.map((item, idx) => ({
  _id: idx,
  name: item?.name,
  isoCode: item?.code ? item?.code?.toLowerCase() : '',
}));

const AmberClubSelection = ({
  setActiveTab,
  activeTab,
  isSelectCountryOpen,
  setIsSelectCountryOpen,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isoCode, setIsoCode] = React.useState('all');
  const dispatch = useDispatch();
  const {auth, users} = useSelector(state => state);

  const handleChangeSelect = value => setSelectedIndex(value);

  const handleSetCorrectIsoCode = () => {
    const countryOfUser = auth?.user?.country;
    console.log({countryOfUser, countryCode}, 'here');

    let myIsoCode = '';

    for (const c of countryCode) {
      if (c?.name === countryOfUser) {
        myIsoCode = c?.code;
      }
    }
    // setIsoCode(myIsoCode);
  };

  const handleCountryChangeForUsersList = countryName => {
    dispatch({
      type: SET_USER_LIST_FILTER,
      payload: {filter_country: countryName, filter_pageNo: 1},
    });
    dispatch({type: REMOVE_USERS_LIST});

    // console.log(auth);
    // dispatch(
    //   getUsersList({
    //     pageSize: users.filter_pageSize,
    //     pageNo: 1,
    //     country: countryName,
    //     popular: users.filter_popular,
    //     token: auth.accessToken,
    //   }),
    // );
  };

  const handleCountrySelect = ({name, isoCode}) => {
    setIsoCode(isoCode);
    handleCountryChangeForUsersList(name);
    setIsSelectCountryOpen(false);
  };

  React.useEffect(() => {
    handleSetCorrectIsoCode();
    dispatch(getUserCoin({token: auth?.accessToken, userId: auth?.user?.id}));
    if (!users?.userList) {
      dispatch(
        getUsersList({
          pageSize: users.filter_pageSize,
          pageNo: 1,
          country: auth?.user?.country,
          // country: '',
          popular: true,
          token: auth.accessToken,
        }),
      );
    }
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          // width: '80%',
          marginLeft: 25,
          marginRight: 25,
          alignSelf: 'center',
          marginVertical: 5,
          // backgroundColor: 'red',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'center',
            borderRadius: 50,
            borderWidth: 2,
            borderColor: 'orange',
          }}>
          <TouchableOpacity
            onPress={() => setIsSelectCountryOpen(!isSelectCountryOpen)}>
            {isoCode === 'all' ? (
              <View
                style={{
                  borderRadius: 50,
                  width: 35,
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Fontisto name="world" size={30} color={'#000'} />
              </View>
            ) : (
              <CountryFlag
                isoCode={isoCode}
                size={35}
                style={{
                  borderRadius: 50,
                  width: 35,
                  height: 35,
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.1)',
            // backgroundColor: 'yellow',
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            width: '80%',
            marginLeft: 20,

            maxWidth: 300,
            borderRadius: 30,
            padding: 3,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{flex: 1, marginHorizontal: 5}}
            onPress={() => setActiveTab('POPULAR')}>
            <Text
              style={{
                padding: 3,
                paddingHorizontal: 8,
                color: '#000',
                backgroundColor:
                  activeTab === 'POPULAR' ? '#fff' : 'transparent',
                borderRadius: 30,
                textAlign: 'center',
              }}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginHorizontal: 5}}
            onPress={() => setActiveTab('NEARBY')}>
            <Text
              style={{
                padding: 3,
                paddingHorizontal: 8,
                color: '#000',
                backgroundColor:
                  activeTab === 'NEARBY' ? '#fff' : 'transparent',
                borderRadius: 30,
                textAlign: 'center',
              }}>
              Nearby
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, marginHorizontal: 5}}
            onPress={() => setActiveTab('FORYOU')}>
            <Text
              style={{
                width: '100%',
                padding: 3,
                paddingHorizontal: 8,
                color: '#000',
                backgroundColor:
                  activeTab === 'FORYOU' ? '#fff' : 'transparent',
                borderRadius: 30,
                textAlign: 'center',
              }}>
              For You
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isSelectCountryOpen && (
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 10,
            zIndex: 10,
            width: 200,
            height: 300,
            backgroundColor: '#333',
            borderRadius: 10,
            padding: 4,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
          <ScrollView>
            {countries?.map((c, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={{marginVertical: 5}}
                  onPress={() => handleCountrySelect(c)}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingLeft: 15,
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {c?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
};
const AmberClub = () => {
  const {auth, users} = useSelector(state => state);
  const {user, accessToken} = auth;

  const [isSelectCountryOpen, setIsSelectCountryOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('POPULAR');
  const [forYouUsersLoading, setForYouUsersLoading] = React.useState(false);
  const [forYouUsersList, setForYouUsersList] = React.useState([]);

  const {
    loading,
    error,
    userList,
    filter_pageSize,
    filter_pageNo,
    filter_country,
    filter_lat,
    filter_lng,
  } = users;

  const dispatch = useDispatch(null);

  const getLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          console.log('longitude', position.coords.longitude);
          console.log('latitude', position.coords.latitude);
          const {longitude, latitude} = position.coords;
          dispatch({
            type: SET_USER_COORDS,
            payload: {
              hasCoords: true,
              lng: longitude,
              lat: latitude,
            },
          });
        },
        err => {
          Alert.alert(
            'Permission Fail',
            `${err?.message} , make sure to enable loaction and reload app`,
          );
        },
        {enableHighAccuracy: false, timeout: 20000},
      );
    } catch (err) {
      console.log(err);
    }
  };

  const checkLocationPermission = async () => {
    console.log('checkLocationPermission()');
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      getLocation();
    } else {
      // request permission
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(res => {
          console.log(res);
          if (res === 'denied') {
            Alert.alert('Failed', 'Failed to get location due to permission');
          }
          if (res === 'granted') {
            getLocation();
          }
        })
        .catch(err => {
          console.log(err, 'decline');
        });
    }
  };

  const handleFetchMoreUser = () => {
    console.log('handle FETCH MORE CALL');

    if (loading) return;
    if (activeTab === 'POPULAR') {
      dispatch(
        getUsersList({
          pageSize: filter_pageSize,
          pageNo: filter_pageNo,
          country: filter_country || user?.country,
          token: accessToken,
          popular: true,
        }),
      );
    }
    if (activeTab === 'NEARBY') {
      console.log('NEARBY -MODE');

      if (auth.coords.hasCoords) {
        dispatch(
          getUsersList({
            pageSize: filter_pageSize,
            pageNo: filter_pageNo,
            country: filter_country,
            token: accessToken,
            popular: false,
            lat: auth.coords.lat,
            long: auth.coords.lng,
          }),
        );
      } else {
        dispatch({
          type: GET_USERS_LIST_FAIL,
          payload:
            'Location permmison is denied, GRANT location to use nearBy filter',
        });
      }
    }
    if (activeTab === 'FORYOU') {
      console.log('FORYOU -MODE');
    }
  };

  if (error) {
    Alert.alert('error', error, [
      {
        text: 'OK',
        onPress: () => {
          console.log('checkLocationPermission() will do it later');
          checkLocationPermission();
        },
      },
    ]);
    dispatch({type: USERS_REDUCER_REFRESH});
  }
  const getForYouTabsUser = async () => {
    setForYouUsersLoading(true);
    try {
      const response = await api_getFollowingList(accessToken, user?.id);
      if (response?.isSuccess) {
        setForYouUsersList(response?.data);
        console.log(response, '----> getForYouTabsUser');
      } else {
        throw new Error(response?.error || 'something went worng');
      }
    } catch (error) {
      Alert.alert('Alert', error.message);
    } finally {
      setForYouUsersLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'POPULAR') {
      console.log('POPULAR -MODE');
      setForYouUsersList([]);
      dispatch({type: REMOVE_USERS_LIST});
      //1. first time
      dispatch(
        getUsersList({
          pageSize: filter_pageSize,
          pageNo: 1,
          // country: filter_country || user?.country,
          country: filter_country,
          token: accessToken,
          popular: true,
        }),
      );
    }
    if (activeTab === 'NEARBY') {
      console.log('NEARBY -MODE');
      //check if lat long present
      setForYouUsersList([]);
      dispatch({type: REMOVE_USERS_LIST});
      if (auth.coords.hasCoords) {
        //1. refresh popular
        dispatch(
          getUsersList({
            pageSize: filter_pageSize,
            pageNo: 1,
            // country: filter_country || user?.country,
            country: filter_country,
            token: accessToken,
            popular: false,
            lat: auth.coords.lat,
            long: auth.coords.lng,
          }),
        );
      } else {
        dispatch({
          type: GET_USERS_LIST_FAIL,
          payload:
            'Location permmison is denied, GRANT location to use nearBy filter',
        });
      }
    }
    if (activeTab === 'FORYOU') {
      dispatch({type: REMOVE_USERS_LIST});
      setForYouUsersList(s => []);
      getForYouTabsUser();
    }
  }, [activeTab, filter_country]);

  return (
    <View style={{flex: 1, marginTop: 10, paddingBottom: 70}}>
      <AmberClubSelection
        isSelectCountryOpen={isSelectCountryOpen}
        setIsSelectCountryOpen={setIsSelectCountryOpen}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {/* POPULAR */}

      {isSelectCountryOpen && (
        <TouchableWithoutFeedback
          onPress={() => {
            setIsSelectCountryOpen(false);
          }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent',
              zIndex: 1,
            }}></View>
        </TouchableWithoutFeedback>
      )}

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
        data={
          forYouUsersList.length
            ? forYouUsersList
            : userList.filter(item => !item?.isBlocked)
        }
        ListEmptyComponent={
          loading || forYouUsersLoading ? (
            <View
              style={{
                width: '100%',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="orange" size="large" />
            </View>
          ) : (
            <Text style={{textAlign: 'center', marginTop: 30}}>'no data'</Text>
          )
        }
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item, index}) => (
          <LiveVideoCard index={index} item={item} />
        )}
        onEndReached={handleFetchMoreUser}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default AmberClub;
