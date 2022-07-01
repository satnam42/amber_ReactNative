import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async (getNewTokenForcefuly = false) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'the old fcm token');
  if (!fcmToken || getNewTokenForcefuly) {
    console.log('GENERATING NEW FCM TOKEN');
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('new fcm token', fcmToken);
        AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('error raised in fcm token', error);
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state y',
      remoteMessage.notification,
    );
    return remoteMessage.notification;
  });

  messaging().onMessage(async remoteMessage => {
    console.log(
      'Notification caused app to open from background state x',
      remoteMessage.notification,
    );
    return remoteMessage.notification;
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      // App was opened by a notification
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quite state',
          remoteMessage.notification,
        );
      }
      return remoteMessage.notification;
    });
};
