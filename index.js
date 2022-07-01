/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().onMessage(async remoteMessage => {
  console.log(
    'Notification caused app to open from background state',
    remoteMessage.notification,
  );
});

AppRegistry.registerComponent(appName, () => App);

// todo   Helloworld
// *      HellowWorld
// ?      HellowWorld
// !      HellowWorld
// ^      HellowWorld
// &      HellowWorld
// ~      HellowWorld
// *//      HellowWorld
