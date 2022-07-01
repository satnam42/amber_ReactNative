import React, {useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';

const useCustomBackHandler = () => {
  const disableBackButton = () => {
    // BackHandler.exitApp();
    Alert.alert('Exit', 'exit ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          BackHandler.exitApp();
          return true;
        },
      },
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', disableBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', disableBackButton);
    };
  }, []);

  return 'back handle added';
};
export default useCustomBackHandler;
