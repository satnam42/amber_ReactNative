import React, {useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {Toggle} from '@ui-kitten/components';

const NotificationSetting = ({navigation}) => {
  const [isAllNotificationActive, setIsAllNotificationActive] =
    React.useState(false);
  const [toggles, setToggles] = React.useState({
    allNotifications: true,
    newFollowers: false,
    directMessages: true,
    videoCalls: false,
    reminders: true,
  });

  const handleAllNotifiactionToggle = state => {
    if (state) {
      setToggles({
        allNotifications: true,
        newFollowers: true,
        directMessages: true,
        videoCalls: true,
        reminders: true,
      });
      setIsAllNotificationActive(true);
    } else {
      setToggles({
        allNotifications: false,
        newFollowers: false,
        directMessages: false,
        videoCalls: false,
        reminders: false,
      });
      setIsAllNotificationActive(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle title={'Notifications'} navigation={navigation} />
      <ScrollView style={styles.notificationContainer}>
        {/* All Notifications */}
        <View
          style={[
            styles.notificationList,
            {
              marginBottom: 20,
            },
          ]}>
          <Text style={styles.notificationText}>All Notifications</Text>
          <Toggle
            status="success"
            onChange={() =>
              handleAllNotifiactionToggle(!isAllNotificationActive)
            }
            checked={isAllNotificationActive}
          />
        </View>
        {/* DIVIDER */}
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            width: '100%',
            height: 2,
          }}></View>

        {/* New Followers */}
        <View style={styles.notificationList}>
          <Text style={styles.notificationText}>New Followers</Text>
          <Toggle
            status="success"
            onChange={() =>
              setToggles({...toggles, newFollowers: !toggles.newFollowers})
            }
            checked={toggles?.newFollowers}
          />
        </View>
        {/* Direct messages */}
        <View style={styles.notificationList}>
          <Text style={styles.notificationText}>Direct messages</Text>
          <Toggle
            status="success"
            onChange={() =>
              setToggles({
                ...toggles,
                directMessages: !toggles.directMessages,
              })
            }
            checked={toggles.directMessages}
          />
        </View>
        {/* Video calls*/}
        <View style={styles.notificationList}>
          <Text style={styles.notificationText}>Video calls</Text>
          <Toggle
            status="success"
            onChange={() =>
              setToggles({...toggles, videoCalls: !toggles.videoCalls})
            }
            checked={toggles?.videoCalls}
          />
        </View>
        {/* Reminders*/}
        {/* <View style={styles.notificationList}>
          <Text style={styles.notificationText}>Reminders</Text>
          <Toggle
            status="success"
            onChange={() =>
              setToggles({ ...toggles, reminders: !toggles.reminders })
            }
            checked={toggles.reminders}
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

export default NotificationSetting;

const styles = StyleSheet.create({
  notificationContainer: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  notificationList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  notificationText: {
    backgroundColor: '#49cf76',
    fontSize: 17,
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    minWidth: 200,
    textAlign: 'center',
  },
});
