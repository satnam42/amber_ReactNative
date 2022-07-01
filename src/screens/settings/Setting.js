import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import SettingItem from '../../components/SettingItem';
import Share from 'react-native-share';
import {AMBER_PLAYSTORE_LINK} from '../../constants';

const Setting = ({navigation}) => {
  const {auth} = useSelector(s => s);

  const handleSharePress = async () => {
    const options = {
      message: `Download Amber App by clicking on the link  and enjoy live streaming.`,
      title: 'Amber App invite',
      url: AMBER_PLAYSTORE_LINK,
    };
    try {
      const shareResponse = await Share.open(options);
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  return (
    <View style={{flex: 1, paddingBottom: 70}}>
      <HeaderBackTitle title={'Settings'} navigation={navigation} />
      <ScrollView
        style={{
          marginTop: 40,
        }}>
        <SettingItem
          title={'Notifications'}
          route={'NotificationSetting'}
          navigation={navigation}
        />
        <SettingItem
          title={'Blocked users'}
          route={'BlockedUserSetting'}
          navigation={navigation}
        />
        <SettingItem
          title={'Help and feedback'}
          route={'HelpAndFeedbackSetting'}
          navigation={navigation}
        />
        <SettingItem
          title={'Statics'}
          route={'StaticsSetting'}
          navigation={navigation}
        />
        {auth?.user?.gender === 'female' && (
          <SettingItem
            title={'Redeem Status'}
            route={'RedeemStats'}
            navigation={navigation}
          />
        )}
        <SettingItem
          title={'Reset Password'}
          route={'ResetPassword'}
          navigation={navigation}
        />
        {/* <SettingItem
          title={'Extra'}
          route={'ExtraSettings'}
          navigation={navigation}
        /> */}
        <SettingItem
          title={'About'}
          route={'AboutSetting'}
          navigation={navigation}
        />
        <SettingItem title={'Share with Friends'} onPress={handleSharePress} />
      </ScrollView>
    </View>
  );
};

export default Setting;
