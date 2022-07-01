import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {
  SETISVIDEOCALL,
  SET_CALLING_DATA,
  SET_CALL_MODE,
  SET_IS_ALREADY_IN_CALL,
} from '../../../redux/reducers/actionTypes';
import RecivedCall from '../../video_call/RecivedCall';
import {countryCode} from '../../../screens/signup/helper';
import {
  api_sendVideoCallInvitationToRandom,
  api_usersRandom,
  generate_rtcToken,
} from '../../../api_services';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {transform} from '@babel/core';
import Pulse from '../../../components/Pulse';
import {useRef} from 'react';
import Carousel from 'react-native-snap-carousel';

import {hide} from 'react-native-bootsplash';
import RandomUserList from '../../../components/RandomUserList';
import RandomNextAndAcceptMode from '../../../components/RandomNextAndAcceptMode';
const AnyWhereDrop = ({
  handleCountrySelect,
  iscountryDropOpen,
  setIsCountryDropOpen,
  selectedCountry,
}) => {
  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderColor: '#49cf76',
          borderRadius: 50,
          margin: 5,
          width: 150,
          alignItems: 'center',
        }}
        onPress={() => setIsCountryDropOpen(!iscountryDropOpen)}>
        <Text
          style={{
            color: '#49cf76',
            fontSize: 17,
            textAlign: 'center',
            flex: 1,
            lineHeight: 45,
            fontWeight: 'bold',
          }}>
          {selectedCountry}
        </Text>
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 15,
            right: 10,
          }}>
          {/* <Image
            source={require('../../../../ios/Assets/dropdown.png')}
            style={{
              width: 20,
              height: 20,
            }}></Image> */}
          {iscountryDropOpen ? (
            <AntDesignIcon
              name={'caretup'}
              size={18}
              color={'#49cf76'}></AntDesignIcon>
          ) : (
            <AntDesignIcon
              name={'caretdown'}
              size={18}
              color={'#49cf76'}></AntDesignIcon>
          )}
        </View>
      </TouchableOpacity>
      {iscountryDropOpen && (
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: 10,
            top: 70,
            width: 200,
            height: 200,
            overflow: 'hidden',
          }}>
          <ScrollView>
            {countryCode.map((item, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleCountrySelect(item.name)}>
                  <Text
                    style={{
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: 17,
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      zIndex: 1,
                    }}>
                    {item.name}
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

const GenderDrop = ({
  isGenderDropOpen,
  setIsGenderDropOpen,
  selectedGender,
  handleGenderSelect,
}) => {
  const [items, setItems] = React.useState([
    {label: 'Women', value: 'women'},
    {label: 'Men', value: 'men'},
  ]);

  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderColor: '#49cf76',
          borderRadius: 50,
          margin: 5,
          width: 150,
          alignItems: 'center',
          height: 50,
        }}
        onPress={() => setIsGenderDropOpen(!isGenderDropOpen)}>
        <Text
          style={{
            color: '#49cf76',
            fontSize: 17,
            textAlign: 'center',
            flex: 1,
            lineHeight: 45,
            fontWeight: 'bold',
          }}>
          {selectedGender}
        </Text>
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 15,
            right: 10,
          }}>
          {isGenderDropOpen ? (
            <AntDesignIcon
              name={'caretup'}
              size={18}
              color={'#49cf76'}></AntDesignIcon>
          ) : (
            <AntDesignIcon
              name={'caretdown'}
              size={18}
              color={'#49cf76'}></AntDesignIcon>
          )}
        </View>
      </TouchableOpacity>
      {isGenderDropOpen && (
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: 10,
            top: 70,
            right: -15,
            width: 200,
            height: 200,
            overflow: 'hidden',
          }}>
          <ScrollView>
            {items.map((item, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleGenderSelect(item.label)}>
                  <Text
                    style={{
                      backgroundColor: '#fff',
                      color: '#000',
                      fontSize: 17,
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      zIndex: 1,
                    }}>
                    {item.label}
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

const IMAGE_ARRAY = [
  'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
  'https://miro.medium.com/max/1400/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
];

export const RANDOM_VIEWS = {
  RANDOM_DEFAULT: 'RANDOM_DEFAULT',
  RANDOM_USERLIST: 'RANDOM_USERLIST',
  RANDOM_NEXT_AND_ACCEPT_MODE: 'RANDOM_NEXT_AND_ACCEPT_MODE',
};
const Random = () => {
  const [activeRandomView, setActiveRandomView] = useState(
    RANDOM_VIEWS.RANDOM_DEFAULT,
  );
  const _carousel = useRef();

  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  const {auth} = useSelector(state => state);

  const handleSearchStart = async () => {
    hitGetRandomUsers();
    // setLoading(!loading);

    // setTimeout(() => {
    //   navigation.navigate('RandomNextAndAcceptModeScreen');
    //   // setActiveRandomView(RANDOM_VIEWS.RANDOM_NEXT_AND_ACCEPT_MODE);
    // }, 2000);

    return;
    // 1. generate token
    const payload = {
      channelId: auth.user.id,
      isPublisher: true,
      authToken: auth.accessToken,
    };
    try {
      const response = await generate_rtcToken(payload);

      console.log(response);
      // 2. navigate to Random Call
      if (response?.isSuccess) {
        const api_uid = response.data.userId;
        const api_agora_token = response.data.token;
        const channel_id = auth?.user?.id;

        if (api_uid && api_agora_token && channel_id) {
          navigation.navigate('LiveVideoCall', {
            api_uid,
            api_agora_token,
            channel_id,
            call_type: 'CALLER',
            call_mode: 'RANDOM',
          });
        }
      } else {
        Alert.alert('Error', 'failed to generate agora token');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hitGetRandomUsers = async () => {
    setLoading(true);
    try {
      const payload = {
        token: auth?.accessToken,
        pageSize: 5,
      };
      const res = await api_usersRandom(payload);
      console.log(res);

      if (res?.isSuccess) {
        navigation?.navigate('RandomNextAndAcceptModeScreen', {
          randomData: res?.items[0],
        });
      } else {
        throw new Error(res?.error || 'something went wrong!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        paddingBottom: 100,
        height: '100%',
      }}
      style={{
        marginBottom: 70,
      }}>
      {activeRandomView === RANDOM_VIEWS.RANDOM_DEFAULT && (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 30,
              padding: 10,
              height: 80,
            }}></View>
          {/* ACTION BTN */}
          <View
            style={{
              zIndex: -1000,
              marginTop: 50,
            }}>
            <TouchableOpacity onPress={handleSearchStart}>
              <View
                style={[
                  {
                    backgroundColor: true ? 'transparent' : '#49cf76',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 150,
                    width: 200,

                    maxWidth: 230,
                    maxHeight: 230,
                    margin: 0,
                    zIndex: -1,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'rgba(0,0,0,0.5)',
                    zIndex: 10,
                  }}>
                  {loading ? 'searching....' : 'Tap To Start'}
                </Text>

                <>
                  <Pulse repeat={true} delay={0} />
                  <Pulse repeat={true} delay={1000} />
                  <Pulse repeat={true} delay={2000} />
                  <Pulse repeat={true} delay={3000} />
                </>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RandomUsersScreen');
              // setActiveRandomView(RANDOM_VIEWS.RANDOM_USERLIST)
            }}
            style={{
              width: '100%',
              height: 150,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingLeft: 10,
              position: 'absolute',
              bottom: 15,
              right: 15,
            }}>
            <Image
              style={{
                width: 70,
                height: 70,
                position: 'absolute',
                top: -25,
                right: 5,
              }}
              source={require('../../../assets/icons/AmberClubRandomIcon.png')}
              resizeMode="contain"
            />
            <View
              style={{
                width: 75,
                height: 75,
                marginRight: 20,
                marginBottom: 20,
                overflow: 'hidden',
                borderRadius: 100,
                borderWidth: 4,
                borderColor: 'rgba(0,0,0,0.1)',
                zIndex: 10,
              }}>
              <Carousel
                autoplay={true}
                loop={true}
                autoplayInterval={100}
                ref={_carousel.current}
                data={IMAGE_ARRAY}
                containerCustomStyle={{
                  borderRadius: 100,
                }}
                slideStyle={{
                  overflow: 'hidden',
                }}
                contentContainerCustomStyle={{
                  overflow: 'hidden',
                }}
                renderItem={({item, index}) => {
                  return (
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        alignSelf: 'center',
                      }}
                      resizeMode="cover"
                      source={{uri: item}}
                    />
                  );
                }}
                sliderWidth={75}
                itemWidth={75}
              />
            </View>
          </TouchableOpacity>
        </>
      )}

      {activeRandomView === RANDOM_VIEWS.RANDOM_USERLIST && (
        <RandomUserList setActiveRandomView={setActiveRandomView} />
      )}
    </ScrollView>
  );
};
export default Random;
