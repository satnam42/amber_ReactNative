import React from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {useSelector} from 'react-redux';

const data = [
  {
    id: 1,
    image:
      'https://media.istockphoto.com/photos/young-woman-photographing-the-autumn-season-picture-id864516870?b=1&k=20&m=864516870&s=170667a&w=0&h=Hg4HcoGEfJ5QUqNSLFfKiOrD5xncPDPMe4BpBP7HR44=',
    image2:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },

  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 8,
    image:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 9,
    image:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 10,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
  {
    id: 11,
    image:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    image2: '',
    users: 'Elina stark, fireboi9 and 15 others',
    subject: 'liked your comment 7h',
    cmt: 'Amazing!',
  },
];

const NotificationDetails = ({index, item}) => {
  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        // backgroundColor: 'yellow',
      }}>
      {/* image start*/}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          marginRight: 10,
          // backgroundColor: 'yellow'
        }}>
        <Image
          source={{
            uri: item?.image,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        {/* sub Image */}
        {item.image2 ? (
          <View
            style={{
              backgroundColor: '#fff',
              padding: 3,
              borderRadius: 50,
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
            <Image
              source={{
                uri: item?.image2,
              }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
              }}
            />
          </View>
        ) : null}
      </View>
      {/* image end*/}
      {/* Details start*/}
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 5,
        }}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#555'}}>
          {item.users}
        </Text>
        <Text style={{fontSize: 15, color: '#555'}}>{item.subject}</Text>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: 'rgba(0,0,0,0.3)',
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#555',
              marginLeft: 5,
            }}>
            {item.cmt}
          </Text>
        </View>
      </View>
      {/* Details end*/}
    </View>
  );
};

const MessageNoti = ({item}) => {
  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        // backgroundColor: 'yellow',
      }}>
      <View
        style={{
          flexDirection: 'column',
          padding: 10,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Text Message Received
        </Text>
        <Text> from: {item?.notification?.title} </Text>
      </View>
    </View>
  );
};

const VideoCallReciveNoti = ({item}) => {
  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
        // backgroundColor: 'yellow',
      }}>
      <View
        style={{
          flexDirection: 'column',
          padding: 5,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Video Call Received
        </Text>
        <Text> from: {item?.notification?.body} </Text>
      </View>
    </View>
  );
};

const NotificationsView = () => {
  const {notificationStorage} = useSelector(state => state.notification);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 80,
      }}>
      <FlatList
        data={notificationStorage.filter(item => item && item)}
        keyExtractor={(item, idx) => item?.sentTime || idx}
        numColumns={1}
        ListEmptyComponent={
          <View
            style={{
              // backgroundColor: 'red',
              width: '100%',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>No Notifications...</Text>
          </View>
        }
        renderItem={({item, index}) => {
          // <NotificationDetails key={item.id} index={index} item={item} />
          console.log('YYYY', item?.data?.type, item?.data);
          // check notification type
          // TEXT MESSAGE NOTIFICATION
          if (item?.data?.type === 'messaging') {
            return (
              <MessageNoti
                key={item?.sentTime || index}
                index={index}
                item={item}
              />
            );
          }

          // CALL RECIVE NOTIFICATION
          if (item?.data?.type === 'callReceive') {
            return (
              <VideoCallReciveNoti
                key={item?.sentTime || index}
                index={index}
                item={item}
              />
            );
          }
        }}
      />
    </View>
  );
};

export default NotificationsView;
