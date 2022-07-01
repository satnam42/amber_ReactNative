import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Setting from './Setting';
import NotificationSetting from './NotificationSetting';
import BlockedUserSetting from './BlockedUserSetting';
import HelpAndFeedbackSetting from './HelpAndFeedbackSetting';
import StaticsSetting from './StaticsSetting';
import AboutSetting from './AboutSetting';
import ResetPassword from './ResetPassword';
import FAQScreen from '../extra/FAQScreen';
import PrivacyPolicyScreen from '../extra/PrivacyPolicyScreen';
import RedeemStats from '../shop/RedeemStats';
import ExtraSettings from './ExtraSetting';
import ContactUsScreen from './ContactUsScreen';
import FeedbackScreen from './FeedbackScreen';
import TermAndConditions from './TermAndConditions';
const Stack = createStackNavigator();
const SettingRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
      />
      <Stack.Screen name="BlockedUserSetting" component={BlockedUserSetting} />
      <Stack.Screen
        name="HelpAndFeedbackSetting"
        component={HelpAndFeedbackSetting}
      />
      <Stack.Screen name="StaticsSetting" component={StaticsSetting} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="AboutSetting" component={AboutSetting} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermAndConditions} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="ExtraSettings" component={ExtraSettings} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name="RedeemStats" component={RedeemStats} />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
    </Stack.Navigator>
  );
};

export default SettingRoutes;
