import React, {useEffect} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Shop from '../screens/shop/Shop';
import AddPost from '../screens/add_post/AddPost';
import Inbox from '../screens/inbox/Inbox';
import Profile from '../screens/profile/Profile';
import ProfileRoutes from '../screens/profile/ProfileRoutes';
import HomeScreen from '../screens/home/HomeScreen';
import InboxRoutes from '../screens/inbox/InboxRoutes';
import ShopRoutes from '../screens/shop/ShopRoutes';
import {BlurView} from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/core';
import HomeRoutes from '../screens/home/MidTabViews/HomeRoutes';
import {useDispatch, useSelector} from 'react-redux';
import {
  ADD_POPUP_OVERLAY,
  REMOVE_POPUP_OVERLAY,
  SET_CURRENT_ACTIVE_MAIN_TAB,
  SET_PREV_ACTIVE_MAIN_TAB,
} from '../redux/reducers/actionTypes';
import GetPaidView from '../screens/shop/GetPaidView';
import GoLiveScreen from '../screens/settings/GoLiveScreen';
import {AGREE_TO_TERM_AND_CONDITION_KEY, colors} from '../constants';
import {TabBarContext} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusRoutes from '../screens/plusBtn/PlusRoutes';

const tabBarIcon = {
  width: 25,
  height: 25,
};

const tabColors = {
  inActiveIconColor: '#fff',
  activeIconColor: '#f47328',
  blurOverlayColor: 'rgba(45, 33, 47,0.5)',
};

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const {prevActiveMainTab, currentActiveMainTab} = useSelector(
    state => state.extra,
  );
  const dispatch = useDispatch();
  const {auth} = useSelector(state => state);
  const {tabSettings} = React.useContext(TabBarContext);
  const blurTabMode = tabSettings?.blurTabMode;
  const showTabBar = tabSettings?.showTabBar;
  console.log(React.useContext(TabBarContext), 'hsdfijhdjsfhasf');

  const checkTermsAndConditionsAgreement = async () => {
    try {
      const res = await AsyncStorage.getItem(AGREE_TO_TERM_AND_CONDITION_KEY);
      console.log(res, 'AGREE_TO_TERM_AND_CONDITION_KEY');
      // if (res) {
      //   // console.log('remove pop');
      //   // dispatch({type: REMOVE_POPUP_OVERLAY});
      // }
      if (!res) {
        //show popup
        dispatch({type: ADD_POPUP_OVERLAY});
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkTermsAndConditionsAgreement();
  }, []);

  return (
    <>
      <Tab.Navigator
        name="Tabs"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            fontWeight: 'bold',
            letterSpacing: 1,
            paddingBottom: 5,
          },
          tabBarHideOnKeyboard: 'true',
          tabBarActiveTintColor: blurTabMode
            ? tabColors.activeIconColor
            : colors.TextBlackLight,
          tabBarInactiveTintColor: blurTabMode
            ? tabColors.inActiveIconColor
            : colors.TextWhiteDark,

          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            paddingBottom: 10,
            height: 70,
            borderTopColor: 'transparent',
            overflow: 'hidden',
            backgroundColor: blurTabMode ? '#fff' : colors.amberColor,
            display: 'flex',
          },
          tabBarBackground: () =>
            blurTabMode && (
              <BlurView
                tint="xlight"
                intensity={20}
                overlayColor={tabColors.blurOverlayColor}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ),
        }}>
        <Tab.Screen
          name="Home"
          listeners={({navigation}) => ({
            tabPress: () => {
              dispatch({
                type: SET_PREV_ACTIVE_MAIN_TAB,
                payload: currentActiveMainTab,
              });
              dispatch({type: SET_CURRENT_ACTIVE_MAIN_TAB, payload: 'HOME'});
            },
          })}
          component={HomeRoutes}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'Home',

            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={require('../assets/icons/mainTab/home.png')}
                style={{
                  width: tabBarIcon.width - 1,
                  height: tabBarIcon.height - 1,
                }}
                tintColor={
                  focused
                    ? blurTabMode
                      ? tabColors.activeIconColor
                      : color.TextBlackLight
                    : tabColors.inActiveIconColor
                }
              />
            ),
          }}
        />
        {auth?.user?.gender === 'male' ? (
          <Tab.Screen
            name="Shop"
            listeners={({navigation}) => ({
              tabPress: () => {
                dispatch({
                  type: SET_PREV_ACTIVE_MAIN_TAB,
                  payload: currentActiveMainTab,
                });
                dispatch({type: SET_CURRENT_ACTIVE_MAIN_TAB, payload: 'SHOP'});
              },
            })}
            component={ShopRoutes}
            options={{
              tabBarLabel: 'Shop',

              unmountOnBlur: true,
              tabBarIcon: ({color, size, focused}) => (
                <Image
                  source={require('../assets/icons/mainTab/coin.png')}
                  style={{
                    width: tabBarIcon.width + 2,
                    height: tabBarIcon.height + 2,
                  }}
                  tintColor={
                    focused
                      ? blurTabMode
                        ? tabColors.activeIconColor
                        : color.TextBlackLight
                      : tabColors.inActiveIconColor
                  }
                />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Earn"
            listeners={({navigation}) => ({
              tabPress: () => {
                dispatch({
                  type: SET_PREV_ACTIVE_MAIN_TAB,
                  payload: currentActiveMainTab,
                });
                dispatch({type: SET_CURRENT_ACTIVE_MAIN_TAB, payload: 'SHOP'});
              },
            })}
            component={GoLiveScreen}
            options={{
              tabBarLabel: 'Earn',
              unmountOnBlur: true,
              tabBarIcon: ({color, size, focused}) => (
                <Image
                  source={require('../assets/icons/mainTab/coin.png')}
                  style={{
                    width: tabBarIcon.width + 2,
                    height: tabBarIcon.height + 2,
                  }}
                  tintColor={
                    focused
                      ? blurTabMode
                        ? tabColors.activeIconColor
                        : color.TextBlackLight
                      : tabColors.inActiveIconColor
                  }
                />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="AddPost"
          component={PlusRoutes}
          options={{
            tabBarLabel: ' ',
            unmountOnBlur: true,
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={require('../assets/icons/mainTab/add.png')}
                style={{
                  width: tabBarIcon.width + 15,
                  height: tabBarIcon.height + 15,
                  marginTop: 8,
                }}
                tintColor={
                  focused
                    ? blurTabMode
                      ? tabColors.activeIconColor
                      : colors.TextBlackLight
                    : tabColors.inActiveIconColor
                }
              />
            ),
          }}>
          {/* {() => <HomeScreen activeTab={'RANDOM'} />} */}
        </Tab.Screen>
        <Tab.Screen
          name="Inbox"
          component={InboxRoutes}
          listeners={({navigation}) => ({
            tabPress: () => {
              dispatch({
                type: SET_PREV_ACTIVE_MAIN_TAB,
                payload: currentActiveMainTab,
              });
              dispatch({type: SET_CURRENT_ACTIVE_MAIN_TAB, payload: 'INBOX'});
            },
          })}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'Inbox',
            tabBarIcon: ({color, size, focused}) => (
              <View style={{position: 'relative'}}>
                <Image
                  source={require('../assets/icons/mainTab/inbox.png')}
                  style={{width: tabBarIcon.width, height: tabBarIcon.height}}
                  tintColor={
                    focused
                      ? blurTabMode
                        ? tabColors.activeIconColor
                        : color.TextBlackLight
                      : tabColors.inActiveIconColor
                  }
                />
                {false && (
                  <Text
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'red',
                      width: 10,
                      height: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                    }}></Text>
                )}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ProfileRoutes"
          component={ProfileRoutes}
          listeners={({navigation}) => ({
            tabPress: () => {
              dispatch({
                type: SET_PREV_ACTIVE_MAIN_TAB,
                payload: currentActiveMainTab,
              });
              dispatch({type: SET_CURRENT_ACTIVE_MAIN_TAB, payload: 'PROFILE'});
            },
          })}
          options={{
            unmountOnBlur: true,
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={require('../assets/icons/mainTab/profile.png')}
                style={{
                  width: tabBarIcon.width,
                  height: tabBarIcon.height,
                }}
                tintColor={
                  focused
                    ? blurTabMode
                      ? tabColors.activeIconColor
                      : color.TextBlackLight
                    : tabColors.inActiveIconColor
                }
              />
            ),
          }}
        />
      </Tab.Navigator>
      <Toast />
    </>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#f6af00',
    // padding: 10,
    // marginTop: 'auto',
    height: 55,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
    // paddingTop: 10,
    // paddingBottom: -5,
    // marginBottom: 5,
    marginBottom: -25,
  },
});
