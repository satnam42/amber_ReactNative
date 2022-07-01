import React, {createRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import GraphicBox from './GraphicBox';
import NextBtn from '../../components/NextBtn';
import {useNavigation} from '@react-navigation/core';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {api_signup, api_uploadImage} from '../../api_services';
import {MultiStepSignUpContext} from '../../../App';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {LOGIN_SUCCESS} from '../../redux/reducers/actionTypes';

const YELLOW_COLOR = '#FCCA27';
const DEFAULT_IMAGE = require('../../assets/icons/profile.png');
const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;
const AvatarScreen = () => {
  const navigation = useNavigation(null);
  const [pickedImageUri, setPickedImageUri] = React.useState(null);
  const [touched, setTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = React.useState(false);
  const {multiSetpSignUpObj, setMultiSetpSignUpObj} = React.useContext(
    MultiStepSignUpContext,
  );

  const dispatch = useDispatch(null);
  const {auth} = useSelector(s => s);
  const actionSheetRef = createRef();

  const uploadUserImage = async (userId, userObj) => {
    setLoadingImageUpload(true);
    try {
      const response = await api_uploadImage(userId, pickedImageUri);
      console.log({response}, 'image upload');
      if (response?.isSuccess) {
        handleLoginUser(userObj);
        Alert.alert('success', 'image uploaded successfully');
      } else {
        throw new Error(response?.error || 'image uploaded failed');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message);
    } finally {
      setLoadingImageUpload(false);
    }
  };

  const handleLoginUser = userObj => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: userObj,
    });
    navigation.navigate('Main');
  };

  const hitSignupApi = async deviceToken => {
    setLoading(true);
    try {
      console.log(multiSetpSignUpObj, 'bbb');
      const res = await api_signup({
        ...multiSetpSignUpObj,
        deviceToken: deviceToken,
      });
      console.log(res);
      if (res?.isSuccess) {
        uploadUserImage(res?.data?.id, res?.data);

        Alert.alert('Alert', res?.message || 'User Register Successfully');
      } else {
        throw new Error(res?.error || 'something went wrong');
      }
    } catch (e) {
      if (e?.message?.includes('choose another')) {
        Alert.alert('Alert', e.message, [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('SignUpUsername'),
          },
        ]);
      } else {
        Alert.alert('Alert', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextPress = async () => {
    if (pickedImageUri?.uri === DEFAULT_IMAGE?.uri) {
      setTouched(true);
    } else {
      try {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (fcmToken) {
          hitSignupApi(fcmToken);
        } else {
          Alert.alert(
            'Alert',
            'Authentication Failed!! , because your device failed to generate device token',
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('sheet');
    } else {
      actionSheetRef?.current?.hide();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
      handleOpenCameraForImage();
    } catch (err) {
      console.warn(err);
    }

    handldeSheet(false);
  };

  const handleOpenCameraForImage = async () => {
    const res = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => console.log(err));

    if (res) {
      try {
        const result = await launchCamera(
          {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          },
          response => {
            console.log('Response = ', response);
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
              Alert.alert(response.customButton);
            } else {
              const source = {uri: response.uri};
              console.log('response', JSON.stringify(response));

              setPickedImageUri(response?.assets[0]);
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      requestCameraPermission();
    }
  };

  const handleChooseFormGallary = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const res = await launchImageLibrary(options);
      console.log(res);
      const photo = res?.assets[0];
      console.log(photo);
      if (photo?.uri) {
        setPickedImageUri(photo);
      }
      handldeSheet(false);
    } catch (error) {
      console.log(error);
      handldeSheet(false);
    } finally {
      handldeSheet(false);
    }
  };

  return (
    <ScrollView
      style={{flex: 1, position: 'relative', backgroundColor: '#fff'}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        h1="Profile Picture"
        h2="Add your"
      />

      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          bottom: 100,
          borderRadius: 100,
        }}>
        {pickedImageUri ? (
          <Image
            source={{uri: pickedImageUri.uri}}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 6,
              borderColor: YELLOW_COLOR,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 6,
              backgroundColor: '#fff',
            }}
            source={DEFAULT_IMAGE}
            resizeMode="cover"
            tintColor="rgba(0,0,0,0.5)"
          />
        )}
        <TouchableOpacity
          onPress={() => handldeSheet(true)}
          style={{
            height: 40,
            width: 40,
            backgroundColor: YELLOW_COLOR,
            position: 'absolute',
            bottom: 0,
            borderRadius: 100,
            borderColor: '#fff',
            borderWidth: 3,
            left: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="ios-camera" size={20} color={'#fff'} />
        </TouchableOpacity>

        {pickedImageUri?.uri === DEFAULT_IMAGE?.uri && touched && (
          <View
            style={{
              position: 'absolute',
              bottom: -40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                maxWidth: 350,
                color: 'tomato',
                marginBottom: 5,
                fontSize: 10,
                textAlign: 'center',
              }}>
              Please Select Profile Picture
            </Text>
          </View>
        )}
      </View>

      <ActionSheet id="sheet" ref={actionSheetRef}>
        <View
          style={{
            height: 100,
          }}>
          <TouchableOpacity
            onPress={() => {
              handleOpenCameraForImage();
              handldeSheet(false);
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              Open Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChooseFormGallary();
              handldeSheet(false);
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              Choose From Gallary
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handldeSheet(false)}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              padding: 10,
              fontWeight: 'bold',
            }}>
            Close
          </Text>
        </TouchableOpacity>
      </ActionSheet>

      {/* BTN */}
      <View style={{alignItems: 'center', marginTop: 80}}>
        {/* <NextBtn title="Next" /> */}
        <NextBtn
          // title="Next"
          title="Next"
          onPress={handleNextPress}
          loading={loading || loadingImageUpload}
        />
      </View>
    </ScrollView>
  );
};

export default AvatarScreen;
