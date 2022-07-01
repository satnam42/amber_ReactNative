import React, {useEffect, useState} from 'react';
import {GOOGLE_WEB_CLIENT_ID, isTestMode} from '../../constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  ActivityIndicator,
  ActivityIndicatorBase,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../../styles/globalStyles';
import * as yup from 'yup';
import {Formik} from 'formik';
import {api_login, api_socialLogin, DEV_MODE} from '../../api_services';
import Toast from 'react-native-toast-message';
import {login} from '../../redux/actions/auth.action';
import {useDispatch, useSelector} from 'react-redux';
import {
  LOGIN_REFRESH,
  LOGIN_SUCCESS,
  SET_FOLLOWER_COUNT,
  SET_FOLLOWING_COUNT,
  SET_USER_COORDS,
} from '../../redux/reducers/actionTypes';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  LoginKit,
  LoginState,
  UserData,
  UserDataScopes,
} from '@snapchat/snap-kit-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import Geolocation from '@react-native-community/geolocation';
import CheckBox from '@react-native-community/checkbox';

const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, ({min}) => `Username must be atleast ${min} character`)
    .required('username is required!'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be atleast ${min} character`)
    .required('Password is required!'),
});

const LoginScreen = ({navigation}) => {
  const [socialGoogleLoading, setSocialGoogleLoading] = React.useState(false);
  const [socialFbLoading, setSocialFbLoading] = React.useState(false);
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const [socialSnapLoading, setSocialSnapLoading] = React.useState(false);

  const dispatch = useDispatch();
  const {loading, error, user} = useSelector(state => state.auth);
  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  console.log({toggleCheckBox});

  function onAuthStateChanged(user) {
    console.log('oAuth user', user);
  }
  setSocialFbLoading;

  const populateFollowCounts = user => {
    if (!user) return;
    const {followerCount, followingCount} = user;
    Alert.alert('', JSON.stringify({followerCount, followingCount}));
    if (followerCount) {
      dispatch({type: SET_FOLLOWER_COUNT, payload: {count: followerCount}});
    }

    if (followingCount) {
      dispatch({type: SET_FOLLOWING_COUNT, payload: {count: followingCount}});
    }
  };

  useEffect(() => {
    if (error) {
      handleToast('error', 'error', error);
      dispatch({
        type: LOGIN_REFRESH,
      });
    }
    if (user) {
      navigation.navigate('Main', {screen: 'Home'});
      // populateFollowCounts(user);
      handleToast('success', 'success', 'Login success!');
    }
  }, [error, loading]);

  useEffect(() => {
    if (user) {
      navigation.navigate('Main', {screen: 'Home'});
    }
  }, []);

  const handleLogin = async payload => {
    // if (!toggleCheckBox) {
    //   Alert.alert('Alert', 'please agree with term & conditions ');
    //   return;
    // }

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      dispatch(login({...payload, deviceToken: fcmToken}));
    } else {
      Alert.alert(
        'Alert',
        'Authentication Failed!! , because your device failed to generate device token',
      );
    }
  };

  const getLocation = async () => {
    console.log('GETTING USER LOCATION');
    try {
      Geolocation.getCurrentPosition(
        position => {
          console.log({position});
          console.log('longitude', position.coords.longitude);
          console.log('latitude', position.coords.latitude);
          const {longitude, latitude} = position.coords;
          dispatch({
            type: SET_USER_COORDS,
            payload: {
              hasCoords: true,
              lng: longitude,
              lat: latitude,
            },
          });
        },
        err => {
          Alert.alert(
            'Permission Fail',
            `${err?.message} , make sure to enable loaction and reload app`,
          );
        },
      );
    } catch (err) {
      console.log({err});
    }
  };

  const checkLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted) {
        getLocation();
      } else {
        // request permission
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
          .then(res => {
            console.log(res);
            if (res === 'denied') {
              Alert.alert('Failed', 'Failed to get location due to permission');
            }
            if (res === 'granted') {
              getLocation();
            }
          })
          .catch(err => {
            console.log(err, 'decline');
          });
      }
    } catch (err) {
      console.log(err, 'oooo');
    }
  };

  const handleSnapchatLogin = () => {
    console.log({LoginKit});
    console.log('LOGIN WITH SNAPCAHAT');
    LoginKit.login()
      .then(() => {
        // Handle login success
      })
      .catch(error => {
        // Handle login failure
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    checkLocationPermission();
    return subscriber; // unsubscribe on unmount
  }, []);

  const getRefreshAccessToken = () => {
    LoginKit.refreshAccessToken()
      .then(accessToken => console.log(accessToken))
      .catch(error => console.log(error));
  };

  const getIsUserLoggedInStatus = () => {
    LoginKit.isUserLoggedIn().then(
      isUserLoggedIn => console.log({isUserLoggedIn}),
      // setIsLoggedIn(isUserLoggedIn),
    );
  };

  const getHasAccessToUserDisplayName = () => {
    // LoginKit.hasAccessToScope(UserDataScopes.DISPLAY_NAME).then(hasAccess =>
    //   setHasAccessToScope(hasAccess),
    // );
  };

  const fetchUserData = () => {
    const query = '{me{bitmoji{avatar},displayName}}';

    LoginKit.fetchUserData(query, null)
      .then(data => {
        console.log({data});
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    const onLoginStateChange = state => {
      // setLastLoginState(state);
      getIsUserLoggedInStatus();
      getRefreshAccessToken();
      getHasAccessToUserDisplayName();
      fetchUserData();
    };

    const EventEmitter = Platform.select({
      // ios: new NativeEventEmitter(NativeModules.LoginKit),
      android: DeviceEventEmitter,
    });

    EventEmitter?.addListener(LoginState.LOGIN_KIT_LOGIN_STARTED, () =>
      onLoginStateChange(LoginState.LOGIN_KIT_LOGIN_STARTED),
    );
    EventEmitter?.addListener(LoginState.LOGIN_KIT_LOGIN_SUCCEEDED, () =>
      onLoginStateChange(LoginState.LOGIN_KIT_LOGIN_SUCCEEDED),
    );
    EventEmitter?.addListener(LoginState.LOGIN_KIT_LOGIN_FAILED, () =>
      onLoginStateChange(LoginState.LOGIN_KIT_LOGIN_FAILED),
    );
    EventEmitter?.addListener(LoginState.LOGIN_KIT_LOGOUT, () =>
      onLoginStateChange(LoginState.LOGIN_KIT_LOGOUT),
    );

    getIsUserLoggedInStatus();
    getRefreshAccessToken();
    getHasAccessToUserDisplayName();
    fetchUserData();

    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  const hitSocialLogin = async payload => {
    try {
      console.log('API LOGIN');
      const response = await api_socialLogin(payload);
      console.log(response);
      if (response.isSuccess) {
        dispatch({type: LOGIN_SUCCESS, payload: response.data});
        navigation.navigate('Main');
        Alert.alert('success', 'success');
      } else {
        Alert.alert('error', response?.error || 'failed to signin');
      }
    } catch (error) {
      Alert.alert('error', error?.message || 'failed to signin');
    } finally {
      setSocialGoogleLoading(false);
      setSocialFbLoading(false);
    }
  };

  const doSocialLogin = async (data, mediaType) => {
    let fcmToken;
    try {
      fcmToken = await AsyncStorage.getItem('fcmToken');
    } catch (err) {
      console.log(err);
    }
    // console.log({ data }, mediaType)
    if (mediaType === 'facebook') {
      const payload = {
        socialLoginId: data?.id,
        platform: 'facebook',
        firstName: data.first_name,
        lastName: data.name,
        gender: 'male',
        deviceToken: fcmToken,
      };
      hitSocialLogin(payload);
    }
    if (mediaType === 'google') {
      const payload = {
        socialLoginId: data?.user?.id,
        platform: 'google',
        firstName: data?.user?.name,
        lastName: data?.user?.name,
        gender: data?.gender,
        deviceToken: fcmToken,
      };
      hitSocialLogin(payload);
    }
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name, gender',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
          Alert.alert('error', error?.message || 'failed to login');
          setSocialFbLoading(false);
        } else {
          console.log('result:', result);
          doSocialLogin({...result, token}, 'facebook');
        }
      },
    );
    console.log({profileRequest});
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const handleGoogleLoginPress = async () => {
    setSocialGoogleLoading(true);
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.birthday.read',
      ],
      webClientId:
        '58873969543-j5tkuqrc3hekmdmfm5u807ggmnjuus0v.apps.googleusercontent.com',
      client_type: 3,
    });

    try {
      const user = await GoogleSignin.signIn();
      console.log({user});
      if (user) {
        // get extra data start
        try {
          const {accessToken} = await GoogleSignin.getTokens();
          fetch(
            `https://people.googleapis.com/v1/people/${user.user.id}?personFields=genders`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
            .then(res => res.json())
            .then(res => {
              console.log(res);
              doSocialLogin({...user, gender: res.genders[0].value}, 'google');
            })
            .catch(err => {
              setSocialGoogleLoading(false);
              console.log(err);
              Alert.alert('error', 'failed to login');
            });
        } catch (err) {
          setSocialGoogleLoading(false);
          console.log(err);
          Alert.alert('error', 'failed to login');
        }
        // get extra data end
      } else {
        setSocialGoogleLoading(false);
        Alert.alert('error', 'failed to login');
      }
    } catch (err) {
      console.log(err, '7878');
      setSocialGoogleLoading(false);
      Alert.alert('error', 'failed to login');
    }
  };
  const handleFBLoginPress = async () => {
    setSocialFbLoading(true);
    LoginManager.setLoginBehavior('web_only');
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_friends',
        'user_gender',
      ]);
      console.log({result});
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      try {
        const data = await AccessToken.getCurrentAccessToken();
        console.log({data});
        if (!data) {
          throw 'Something went wrong obtaining access token';
        }
        getInfoFromToken(data.accessToken);
      } catch (err) {
        Alert.alert('error', err?.message || 'failed to login');
        setSocialFbLoading(false);
      }
    } catch (error) {
      console.log({error});
      Alert.alert('error', error?.message || 'failed to login');
      setSocialFbLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        username: DEV_MODE.STATUS ? DEV_MODE.UN : '',
        password: DEV_MODE.STATUS ? DEV_MODE.PW : '',
      }}
      validateOnMount={true}
      validationSchema={loginValidationSchema}
      onSubmit={values => handleLogin(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <ScrollView>
          <View style={styles.container}>
            {/* image */}
            <View style={styles.logoBox}>
              <Image
                style={{...styles.logo, padding: 20}}
                source={require('../../assets/icons/logo.png')}
                width={120}
                height={120}
              />
            </View>

            {/* loginForm */}
            <View style={styles.loginForm}>
              {/* email */}
              {/* <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="rgba(0,0,0,0.4)"
                onChangeText={handleChange("email")}
                value={values.email}
                onBlur={handleBlur("email")}
              />
              {errors.email && touched.email && (
                <Text style={globalStyles.inputError}>{errors.email}</Text>
              )} */}
              {/* username */}
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(0,0,0,0.4)"
                // onChangeText={(value) => setUsername(value)}
                onChangeText={handleChange('username')}
                // value={username}
                value={values.username}
                onBlur={handleBlur('username')}
              />
              {errors.username && touched.username && (
                <Text style={globalStyles.inputError}>{errors.username}</Text>
              )}
              {/* password */}
              <TextInput
                style={styles.input}
                // onChangeText={(value) => setPassword(value)}
                // value={password}
                placeholder="Password"
                placeholderTextColor="rgba(0,0,0,0.4)"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {errors.password && touched.password && (
                <Text style={globalStyles.inputError}>{errors.password}</Text>
              )}

              {/* <View
                style={{
                  width: '100%',
                  height: 30,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
                <View style={styles.loginFormExtra.textRow}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('TermAndConditions')}>
                    <Text style={styles.loginFormExtra.primaryColor}>
                      {`Agree with Term & Conditions`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}
              {/* button start */}
              <LinearGradient
                start={{x: 0.0, y: 0.3}}
                end={{x: 0.6, y: 1.0}}
                locations={[0.4, 1]}
                colors={['#f46f69', '#f8c748']}
                style={styles.loginBtn.box}>
                <TouchableOpacity onPress={handleSubmit}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.loginBtn.text}>SIGN IN</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
              {/* button end */}

              {/* temp */}
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('SignUpUsername')}>
                <Text>temp</Text>
              </TouchableOpacity> */}

              <View style={styles.loginFormExtra.box}>
                <View style={styles.loginFormExtra.textRow}>
                  <Text style={{color: '#000'}}>
                    Forgot Your Password?
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgetPassword')}>
                      <Text style={styles.loginFormExtra.secondaryColor}>
                        Get help signing in
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>
                <View style={styles.loginFormExtra.textRow}>
                  <Text style={styles.loginFormExtra.primaryColor}>
                    New to Amber?
                    <Text
                      onPress={() => {
                        // navigation.navigate('SignUp');
                        navigation.navigate('SignUpUsername');
                      }}
                      style={styles.loginFormExtra.secondaryColor}>
                      Sign up
                    </Text>
                    now!
                  </Text>
                </View>
                <View style={styles.loginFormExtra.textRow}></View>
              </View>
            </View>
            {/* socialLoginBox */}

            <View style={styles.socialLogin.box}>
              {/* snapchat */}
              {/* <TouchableOpacity onPress={handleSnapchatLogin}>
                <View
                  style={{
                    ...styles.socialLogin.btn,
                    ...styles.socialLogin.snapchat,
                  }}>
                  <View style={styles.socialLogin.iconBox}>
                    <Image
                      source={require('../../assets/icons/snapchat.png')}
                      style={{height: 30, width: 30}}
                    />
                  </View>
                  <Text style={styles.socialLogin.btnText}>
                    Login with Snapchat
                  </Text>
                </View>
              </TouchableOpacity> */}
              {/* google */}
              <TouchableOpacity
                style={socialGoogleLoading ? {height: 30} : {}}
                onPress={handleGoogleLoginPress}>
                {socialGoogleLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <View style={styles.socialLogin.btn}>
                    <View style={styles.socialLogin.iconBox}>
                      <Image
                        source={require('../../assets/icons/google.png')}
                        style={{height: 30, width: 30}}
                      />
                    </View>
                    <Text
                      style={{...styles.socialLogin.btnText, color: '#000'}}>
                      Login with Google
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* facebook */}
              <LinearGradient
                start={{x: 0.0, y: 1}}
                end={{x: 0.8, y: 1.0}}
                locations={[0.1, 1]}
                colors={['#49b8fc', '#335fff']}
                style={[styles.socialLogin.facebookBG]}>
                {socialFbLoading ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 30,
                    }}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{height: 30}}
                    onPress={handleFBLoginPress}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={styles.socialLogin.iconBox}>
                        <Image
                          source={require('../../assets/icons/facebook.png')}
                          style={{height: 30, width: 30}}
                        />
                      </View>
                      <Text
                        style={{...styles.socialLogin.btnText, color: '#fff'}}>
                        Login with Facebook
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          </View>
          <Toast />
        </ScrollView>
      )}
    </Formik>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoBox: {
    marginTop: 50,
    alignItems: 'center',
  },
  logo: {
    // backgroundColor: 'red',
  },
  loginForm: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    width: '80%',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#000',
    borderWidth: 2,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    color: 'rgba(0,0,0,0.8)',
    marginVertical: 10,
  },
  loginBtn: {
    box: {
      width: '80%',
      borderRadius: 40,
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    text: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  },
  loginFormExtra: {
    box: {
      marginVertical: 20,
      paddingBottom: 10,
      borderColor: 'rgba(0,0,0,0.1)',
      borderBottomWidth: 1.2,
    },
    textRow: {
      alignItems: 'center',
      marginVertical: 3,
    },
    secondaryColor: {
      color: '#f8c748',
      fontSize: 16,
      letterSpacing: 0.9,
      fontWeight: 'bold',
    },
    primaryColor: {
      color: 'rgba(0,0,0,0.6)',
    },
  },
  socialLogin: {
    box: {
      alignItems: 'center',
    },
    btn: {
      width: 280,
      flexDirection: 'row',
      marginVertical: 5,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'rgba(0,0,0,0.5)',
    },
    iconBox: {
      marginRight: 20,
    },
    btnText: {
      fontSize: 18,
    },
    snapchat: {
      backgroundColor: '#f8c748',
      borderColor: 'transparent',
    },
    facebook: {
      flexDirection: 'row',
      borderColor: 'transparent',
    },
    facebookBG: {
      width: 280,
      flexDirection: 'row',
      marginVertical: 5,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
  },
});
