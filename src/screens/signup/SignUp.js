import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyTextInput from '../../components/MyTextInput';
import NextBtn from '../../components/NextBtn';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import * as yup from 'yup';
import {Formik} from 'formik';
import globalStyles from '../../styles/globalStyles';
import {SignupContext} from '../../context/SignupContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const signupOneValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('email address is required!'),
  username: yup
    .string()
    .min(4, ({min}) => `Username must be atleast ${min} character`)
    .required('username is required!'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be atleast ${min} character`)
    .required('Password is required!'),
  // .matches(
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // ),
  passwordConfirmation: yup
    .string()
    .required('Please Confirm Password!')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SignUp = ({navigation}) => {
  const {signupData, setSignupData} = useContext(SignupContext);
  const [pickedImageUri, setPickedImageUri] = useState('');
  const [pickupOptions, setPickupOptions] = useState(false);

  const sheetRef = React.useRef(null);

  const handleShowPickOptions = () => {};

  const handleSignUp = data => {
    setSignupData({...signupData, ...data, photo: pickedImageUri});
    navigation.navigate('SignUpTwo');
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
    } catch (err) {
      console.warn(err);
    }
  };

  const pickImage = async () => {
    requestCameraPermission();
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

    setPickupOptions(false);
  };

  const handleChooseFormGallary = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    const res = await launchImageLibrary(options);
    console.log(res);
    const photo = res?.assets[0];
    console.log(photo);

    if (photo?.uri) setPickedImageUri(photo);
    setPickupOptions(false);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        username: '',
        password: '',
        passwordConfirmation: '',
      }}
      validateOnMount={true}
      validationSchema={signupOneValidationSchema}
      onSubmit={values => handleSignUp(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <HeaderBackTitle title={'Sign Up'} navigation={navigation} />

          <ScrollView>
            {/* profile */}
            <View
              style={[
                styles.profileContainer,
                {
                  // backgroundColor: 'red',
                  position: 'relative',
                },
              ]}>
              {pickupOptions && (
                <View
                  style={{
                    backgroundColor: '#000',
                    borderRadius: 10,
                    paddingVertical: 5,
                    position: 'absolute',
                    bottom: 10,
                    right: 30,
                    zIndex: 1,
                  }}>
                  <TouchableOpacity onPress={() => pickImage()}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        marginBottom: 5,
                      }}>
                      open camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleChooseFormGallary()}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                      }}>
                      choose for gallary
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {pickedImageUri ? (
                <Image
                  source={{uri: pickedImageUri.uri}}
                  style={[styles.profileImage, {borderRadius: 100}]}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/profile.png')}
                  style={styles.profileImage}
                  tintColor="rgba(0,0,0,0.5)"
                />
              )}
              <View style={[styles.profileIconBox]}>
                {/* <TouchableOpacity onPress={pickImage}> */}
                {pickupOptions ? (
                  <TouchableOpacity onPress={() => setPickupOptions(false)}>
                    <Text
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: 50,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      X
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setPickupOptions(true)}>
                    <Image
                      source={require('../../assets/icons/camera.png')}
                      style={styles.profileIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* form */}
            <View>
              <View style={styles.signUpForm.box}>
                <MyTextInput
                  placeholder="Enter your username"
                  label="Username"
                  onChangeText={handleChange('username')}
                  value={values.username.trim()}
                  onBlur={handleBlur('username')}
                />
                {errors.username && touched.username && (
                  <Text style={globalStyles.inputError}>{errors.username}</Text>
                )}
                {/* email */}
                <MyTextInput
                  placeholder="Enter your email"
                  label="Email"
                  onChangeText={handleChange('email')}
                  value={values.email.trim()}
                  onBlur={handleBlur('email')}
                />
                {errors.email && touched.email && (
                  <Text style={globalStyles.inputError}>{errors.email}</Text>
                )}

                {/* Password */}
                <MyTextInput
                  secureTextEntry={true}
                  placeholder="Enter your password"
                  label="Password"
                  onChangeText={handleChange('password')}
                  value={values.password.trim()}
                  onBlur={handleBlur('password')}
                />
                {errors.password && touched.password && (
                  <Text style={globalStyles.inputError}>{errors.password}</Text>
                )}
                <MyTextInput
                  placeholder="Re-type your password"
                  label="Confirm Password"
                  onChangeText={handleChange('passwordConfirmation')}
                  value={values.passwordConfirmation.trim()}
                  onBlur={handleBlur('passwordConfirmation')}
                  secureTextEntry={true}
                />
                {/* Confirm Password */}
                {errors.passwordConfirmation &&
                  touched.passwordConfirmation && (
                    <Text style={globalStyles.inputError}>
                      {errors.passwordConfirmation}
                    </Text>
                  )}
              </View>
            </View>
          </ScrollView>
          {/* next */}
          <View style={styles.nextBtn}>
            <NextBtn title="NEXT" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signUpForm: {
    box: {
      alignItems: 'center',
    },
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  profileIconBox: {
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 50,
    top: 60,
    position: 'absolute',
  },
  profileIcon: {
    width: 35,
    height: 35,
    tintColor: 'rgba(0,0,0,0.8)',
  },
  nextBtn: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
});
