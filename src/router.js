import React, {useEffect, useState} from 'react';
import LoginScreen from './screens/login/LoginScreen';
import SignUp from './screens/signup/SignUp';
import SplashScreen from './screens/splash/SplashScreen';

import SignUpTwo from './screens/signup/SignUpTwo';
import {NavigationContainer} from '@react-navigation/native';
import Verification from './screens/signup/Verification';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './screens/main/Main';
import {useSelector} from 'react-redux';
import {Alert, BackHandler} from 'react-native';
import ViewOtherProfile from './screens/profile/ViewOtherProfile';
import ChatScreen from './screens/inbox/chat/ChatScreen';
import LiveVideoCall from './screens/video_call/LiveVideoCall';
import CallIncoming from './screens/video_call/CallIncoming';
import SubmitBankDetails from './screens/extra/SubmitBankDetails';
import requestUserPermission from './utils/notificationServices';
import ForgetPassword from './screens/recover/ForgetPassword';
import CreateNewPassword from './screens/recover/CreateNewPassword';
import VerifyYourEmail from './screens/recover/VerifyYourEmail';
import TermAndConditions from './screens/settings/TermAndConditions';
import {
  UsernameScreen,
  PasswordScreen,
  DobScreen,
  EmailScreen,
  AvatarScreen,
  GenderScreen,
} from './screens/multi_signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AGREE_TO_TERM_AND_CONDITION_KEY} from './constants';
import {REMOVE_POPUP_OVERLAY} from './redux/reducers/actionTypes';

import {useDispatch} from 'react-redux';
import ScrollablePhotos from './screens/profile/gallary/ScrollablePhotos';
import ScrollableVideos from './screens/profile/gallary/ScrollableVideos';
import Test from './screens/Test';
import PayPalMeScreen from './screens/shop/PayPalMeScreen';
const Stack = createStackNavigator();
const Routes = () => {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  console.log(user, 'form root');

  // const checkTermsAndConditionsAgreement = async () => {
  // try {
  //   const res = await AsyncStorage.getItem(AGREE_TO_TERM_AND_CONDITION_KEY);
  //   console.log(res, 'AGREE_TO_TERM_AND_CONDITION_KEY');
  //   if (res) {
  //     console.log('remove pop');
  //     dispatch({type: REMOVE_POPUP_OVERLAY});
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // };

  useEffect(() => {
    // checkTermsAndConditionsAgreement();
    requestUserPermission();
  }, []);
  return (
    <NavigationContainer
      initialRouteName="Splash"
      screenOptions={{
        unmountOnBlur: true,
      }}>
      <Stack.Navigator
        name="Root"
        screenOptions={{
          headerShown: false,
        }}>
        {isSplashActive && (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            initialParams={{setIsSplashActive: setIsSplashActive}}
          />
        )}
        {/* NEW SIGN UP START */}
        <Stack.Group>
          <Stack.Screen name="SignUpUsername" component={UsernameScreen} />
          <Stack.Screen name="SignUpEmail" component={EmailScreen} />
          <Stack.Screen name="SignUpPassword" component={PasswordScreen} />
          <Stack.Screen name="SignUpDob" component={DobScreen} />
          <Stack.Screen name="SignUpGender" component={GenderScreen} />
          <Stack.Screen name="SignUpAvatar" component={AvatarScreen} />
        </Stack.Group>
        {/* NEW SIGN UP END */}

        <Stack.Screen name="Test" component={Test} />
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpTwo" component={SignUpTwo} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen
            name="TermAndConditions"
            component={TermAndConditions}
          />
          <Stack.Screen
            name="CreateNewPassword"
            component={CreateNewPassword}
          />
          <Stack.Screen name="VerifyYourEmail" component={VerifyYourEmail} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Verification" component={Verification} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="ViewOtherProfile" component={ViewOtherProfile} />
          <Stack.Screen name="ScrollablePhotos" component={ScrollablePhotos} />
          <Stack.Screen name="ScrollableVideos" component={ScrollableVideos} />
          <Stack.Screen name="PayPalMeScreen" component={PayPalMeScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="LiveVideoCall" component={LiveVideoCall} />
          <Stack.Screen name="CallIncoming" component={CallIncoming} />
          <Stack.Screen
            name="SubmitBankDetails"
            component={SubmitBankDetails}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Routes;
