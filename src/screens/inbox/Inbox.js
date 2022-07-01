import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MessagesView from './MessagesView';
import NotificationsView from './NotificationsView';

const midTabs = ['NOTIFICATIONS', 'MESSAGES'];

const Inbox = ({navigation}) => {
  const [activeMinNav, setActiveMinNav] = useState(midTabs[1]);

  console.log({activeMinNav});

  const handleMidNavChange = midTabName => {
    setActiveMinNav(midTabName);
  };
  return (
    <View style={{flex: 1}}>
      <View style={{minHeight: 50}}></View>
      {/* mid Nav Start */}
      <View
        style={{
          alignItems: 'center',
        }}>
        <View style={styles.midNav.box}>
          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[0])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                backgroundColor:
                  activeMinNav === midTabs[0] ? '#f6af00' : '#222',
              }}>
              Notifications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[1])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                backgroundColor:
                  activeMinNav === midTabs[1] ? '#f6af00' : '#222',
              }}>
              Messages
            </Text>
            {false && (
              <Text
                style={{
                  position: 'absolute',
                  top: -4,
                  right: 0,
                  backgroundColor: 'red',
                  width: 13,
                  height: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}></Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* mid Nav END */}

      {/* DYNAMIC VIEW  START*/}
      {activeMinNav === midTabs[0] && <NotificationsView />}
      {activeMinNav === midTabs[1] && <MessagesView navigation={navigation} />}
      {/* DYNAMIC VIEW  END*/}
    </View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  midNav: {
    box: {
      backgroundColor: '#222',
      height: 35,
      minWidth: 230,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 50,
    },
  },
});
