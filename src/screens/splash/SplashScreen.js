import React from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import {fromLocalStorage} from '../../utils/helper';
import {useDispatch, useSelector} from 'react-redux';
import {LOAD_PROFILE} from '../../redux/reducers/actionTypes';
import requestUserPermission from '../../utils/notificationServices';
import RNBootSplash from 'react-native-bootsplash';
const SplashScreen = props => {
  console.log('SPLASH PROPS', props);
  const {navigation, isAuth, route} = props;
  const {setIsSplashActive} = route?.params;
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  const checkIfAlreadyLoggedIn = async () => {
    const auth = await fromLocalStorage('auth');
    console.log(auth);
    if (auth && auth?.token) {
      dispatch({type: LOAD_PROFILE, payload: auth});
      navigation.navigate('Main');
    } else {
      // navigation.navigate('Login');
      navigation.navigate('SignUpUsername');
    }
    setIsSplashActive && setIsSplashActive(false);
  };

  LOAD_PROFILE;
  React.useEffect(() => {
    if (user) {
      navigation.navigate('Main');
    }
    checkIfAlreadyLoggedIn();
    RNBootSplash.hide({fade: true});
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.logoBox}>
        <Image
          source={require('../../assets/icons/logo.png')}
          style={{height: 200, width: 200}}
        />
      </View> */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
});
