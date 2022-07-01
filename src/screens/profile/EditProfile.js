import {Avatar} from 'native-base';
import {colors} from '../../constants';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import GenderModalPicker from '../../components/input_modals/GenderModalPicker';
import CountryModalPicker from '../../components/input_modals/CountryModalPicker';
import DayModalPicker from '../../components/input_modals/DayModalPicker';
import MonthModalPicker from '../../components/input_modals/MonthModalPicker';
import YearModalPicker from '../../components/input_modals/YearModalPicker';
import {Formik} from 'formik';
import * as yup from 'yup';
import globalStyles from '../../styles/globalStyles';
import {back} from 'react-native/Libraries/Animated/Easing';
import NextBtn from '../../components/NextBtn';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyLoader from '../../components/MyLoader';
import {
  api_removeProfileImage,
  api_update_user,
  api_uploadImage,
} from '../../api_services';
import {
  UPDATE_PROFILE_PHOTO,
  UPDATE_USER,
} from '../../redux/reducers/actionTypes';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {createRef} from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';

const profileFormValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(4, ({min}) => `firstName must be atleast ${min} character`),
  // .required('firstName is required!'),
  lastName: yup
    .string()
    .min(4, ({min}) => `lastName must be atleast ${min} character`),
  // .required('lastName is required!'),
  // phone: yup.number().required('phone is required!'),
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('email address is required!'),
});

const EditProfile = ({navigation, route}) => {
  console.log('llll', route?.params);
  const {headerTitle, hideForm} = route?.params;

  const [isPhotoEditOptionOpen, setIsPhotoEditOptionOpen] =
    React.useState(false);
  const dispatch = useDispatch();
  const {user, accessToken} = useSelector(state => state.auth);
  const changeCountryModalVisibility = bool => setIsModalVisible(bool);
  const [loading, setLoading] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);

  const [updateBio, setUpdateBio] = useState('');
  const [updateWebsite, setUpdateWebsite] = useState('');
  const actionSheetRef = createRef();
  // country state
  const [selectedCountry, setSelectedCountry] =
    React.useState('Select Country...');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  // day state
  const [selectedDay, setSelectedDay] = React.useState('Day');
  const [isSelectDayModalVisible, setIsSelectDayModalVisible] =
    React.useState(false);
  // Month state
  const [selectedMonth, setSelectedMonth] = React.useState('Month');
  const [isSelectMonthModalVisible, setIsSelectMonthModalVisible] =
    React.useState(false);
  // year state
  const [selectedYear, setSelectedYear] = React.useState('Year');
  const [isSelectYearModalVisible, setIsSelectYearModalVisible] =
    React.useState(false);
  // gender state
  const [selectedGender, setSelectedGender] =
    React.useState('Select Gender...');
  const [isSelectGenderModalVisible, setIsSelectGenderModalVisible] =
    React.useState(false);

  const [updateProfileImage, setUpdateProfileImage] = useState(
    require('../../assets/icons/profile.png'),
  );

  useEffect(() => {
    if (user) {
      setSelectedGender(user?.gender || 'Select Gender...');
      setSelectedCountry(user?.country || 'Select Country...');
      setUpdateBio(user?.bio || '');
      setUpdateWebsite(user?.website || '');
      setUpdateProfileImage({
        uri: user?.avatar,
      });
    }

    if (user?.dob) {
      let [year, month, day] = user?.dob.split('-');
      day = day.substring(0, 2);
      setSelectedDay(day || '00');
      setSelectedMonth(month || '00');
      setSelectedYear(year || '0000');
    }
  }, [user]);

  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const handldeSheet = bool => {
    if (bool) {
      SheetManager.show('sheetEditProfile');
    } else {
      actionSheetRef?.current?.hide();
    }
  };

  const doUpdateImage = async () => {
    setLoadingImageUpload(true);
    try {
      const imageResult = await api_uploadImage(user?.id, updateProfileImage);

      if (imageResult.isSuccess && imageResult.statusCode === 200) {
        handleToast('success', 'success', 'profile image updated!');
        route?.params?.setRefresh(s => !s);
        dispatch({type: UPDATE_PROFILE_PHOTO, payload: updateProfileImage.uri});
      } else {
        handleToast(
          'error',
          'error',
          imageResult?.error || 'something went wrong! while updating image!',
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImageUpload(false);
    }
  };

  const doRemoveImage = async () => {
    const res = await api_removeProfileImage(accessToken, user.id);

    if (res.isSuccess && res.statusCode === 200) {
      dispatch({type: UPDATE_PROFILE_PHOTO, payload: ''});
      handleToast('success', 'success', 'profile photo removed!');
    } else {
      handleToast(
        'error',
        'error',
        res?.error || 'something went wrong! while removing image!',
      );
    }
  };
  const handleUpdateProfile = async values => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      website: updateWebsite,
      bio: updateBio,
      email: values.email,
      // phoneNo: values.phone,
      gender: selectedGender,
      country: selectedCountry,
      dob: `${selectedYear}-${selectedMonth}-${selectedDay}`,
    };

    setLoading(true);
    const res = await api_update_user(payload, user?.id, user?.token);
    // image update start
    if (updateProfileImage.uri !== user?.avatar) {
      doUpdateImage();
    }
    // image update end
    // delete image start
    if (
      updateProfileImage?.uri === require('../../assets/icons/profile.png')?.uri
    ) {
      doRemoveImage();
    }
    // delete image end

    if (res.isSuccess && res.statusCode === 200) {
      handleToast('success', 'success', 'profile updated!');
      route?.params?.setRefresh(s => !s);

      dispatch({type: UPDATE_USER, payload: res.data});
    } else {
      handleToast('error', 'error', res?.error || 'something went wrong!');
    }
    setLoading(false);
  };

  const handleChooseProfileImage = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    const res = await launchImageLibrary(options);
    const photo = res?.assets[0];
    if (photo?.uri) setUpdateProfileImage(photo);
  };
  const handleRemoveProfileImage = () => {
    setUpdateProfileImage(require('../../assets/icons/profile.png'));
    setIsPhotoEditOptionOpen(false);
  };
  console.log({updateProfileImage});

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
        return true;
      } else {
        console.log('Camera permission denied');
      }
      openCameraForSelectImage();
    } catch (err) {
      console.warn(err);
    }
  };

  const openCameraForSelectImage = async () => {
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
              setUpdateProfileImage(response?.assets[0]);
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      requestCameraPermission();
    }
    setIsPhotoEditOptionOpen(false);
  };

  return (
    <View style={{marginBottom: 70}}>
      <View style={styles.header.container}>
        {/* icon */}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="ios-arrow-back"
            size={40}
            style={{
              paddingHorizontal: 10,
              marginTop: 5,
            }}
            color="#555"
          />
        </TouchableOpacity>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#666'}}>
          {headerTitle ? headerTitle : 'Edit Profile'}
        </Text>
      </View>

      {loading && <MyLoader visible={loading} />}
      {loadingImageUpload && (
        <MyLoader visible={loadingImageUpload} text="uploading image!!" />
      )}
      {/* end bar */}
      <ScrollView style={{zIndex: -21}}>
        <TouchableWithoutFeedback
          onPress={() => setIsPhotoEditOptionOpen(false)}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent',
            }}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.profile.container]}>
          <View
            style={[
              styles.profile.avatarBox,
              {borderRadius: hideForm ? 220 : 100},
            ]}>
            {hideForm || (
              <TouchableOpacity
                onPress={() => {
                  setIsPhotoEditOptionOpen(!isPhotoEditOptionOpen);
                  handldeSheet(true);
                }}
                style={{
                  paddingHorizontal: 10,
                  marginTop: 5,
                  backgroundColor: '#555',
                  position: 'absolute',
                  zIndex: 3,
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  textAlign: 'center',
                  bottom: 15,
                  left: 100,
                }}>
                <Icon
                  name={'ios-camera'}
                  size={30}
                  style={{
                    lineHeight: 50,
                  }}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
            {/* change photo option */}
            {updateProfileImage?.uri ? (
              <Image
                style={
                  hideForm
                    ? {width: 210, height: 210, borderRadius: 200}
                    : {width: 120, height: 120, borderRadius: 100}
                }
                source={updateProfileImage}
              />
            ) : (
              <View
                style={{
                  width: 130,
                  height: 130,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <MaterialCommunityIcons name="face-profile" size={120} />
              </View>
            )}
          </View>
        </View>
        {/* form  start*/}
        {hideForm || (
          <Formik
            initialValues={{
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              website: user?.website || '',
              // phone: user?.phoneNo || '',
              bio: user?.bio || '',
            }}
            validateOnMount={true}
            validationSchema={profileFormValidationSchema}
            onSubmit={values => handleUpdateProfile(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <View
                style={{
                  marginBottom: 40,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 50,
                  }}>
                  {/* FIRST NAME */}
                  <View style={styles.form.inputBox}>
                    <Text style={styles.form.inputLable}>FirstName</Text>
                    <TextInput
                      value={user?.firstName}
                      style={styles.form.input}
                      onChangeText={handleChange('firstName')}
                      value={values.firstName}
                      onBlur={handleBlur('firstName')}
                    />
                    {errors.firstName && touched.firstName && (
                      <Text style={[globalStyles.inputError, styles.errorFix]}>
                        {errors.firstName}
                      </Text>
                    )}
                  </View>
                  {/* LAST NAME */}
                  <View style={styles.form.inputBox}>
                    <Text style={styles.form.inputLable}>LastName</Text>
                    <TextInput
                      value={user?.lastName}
                      style={styles.form.input}
                      onChangeText={handleChange('lastName')}
                      value={values.lastName}
                      onBlur={handleBlur('lastName')}
                    />
                    {errors.lastName && touched.lastName && (
                      <Text style={[globalStyles.inputError, styles.errorFix]}>
                        {errors.lastName}
                      </Text>
                    )}
                  </View>
                  {/* EMAIL */}
                  <View style={styles.form.inputBox}>
                    <Text style={styles.form.inputLable}>Email</Text>
                    <TextInput
                      value={user?.username}
                      style={styles.form.input}
                      onChangeText={handleChange('email')}
                      value={values.email}
                      onBlur={handleBlur('email')}
                    />
                    {errors.email && touched.email && (
                      <Text style={[globalStyles.inputError, styles.errorFix]}>
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  {/* WEBSITE */}
                  <View style={styles.form.inputBox}>
                    <Text style={styles.form.inputLable}>Website</Text>
                    <TextInput
                      value={updateWebsite}
                      style={styles.form.input}
                      onChangeText={value => setUpdateWebsite(value)}
                    />
                  </View>
                  {/* PHONE NO */}
                  {/* <View style={styles.form.inputBox}>
                  <Text style={styles.form.inputLable}>Phone no</Text>
                  <TextInput
                    style={styles.form.input}
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    onBlur={handleBlur('phone')}
                  />

                  {errors.phone && touched.phone && (
                    <Text style={[globalStyles.inputError, styles.errorFix]}>
                      {errors.phone}
                    </Text>
                  )}
                </View> */}
                  {/* BIO */}
                  <View style={styles.form.inputBox}>
                    <Text style={styles.form.inputLable}>Bio</Text>
                    <TextInput
                      value={updateBio}
                      style={styles.form.input}
                      onChangeText={value => setUpdateBio(value)}
                    />
                  </View>
                  {/* Gender START */}
                  <View style={[styles.form.inputBox, {marginTop: 5}]}>
                    <Text style={styles.form.inputLable}>Gender</Text>
                    <TouchableOpacity
                      style={{...styles.form.input, marginTop: 15}}
                      onPress={() => setIsSelectGenderModalVisible(true)}>
                      <Text style={{padding: 5, color: '#333'}}>
                        {selectedGender}
                      </Text>
                      <View style={[styles.selectConatinerIconBox, {top: 5}]}>
                        <AntDesign name="down" size={15} />
                      </View>

                      <Modal
                        transparent={true}
                        animationType={'fade'}
                        visible={isSelectGenderModalVisible}
                        nRequestClose={() =>
                          setIsSelectGenderModalVisible(false)
                        }>
                        <GenderModalPicker
                          setIsSelectGenderModalVisible={
                            setIsSelectGenderModalVisible
                          }
                          setSelectedGender={setSelectedGender}
                        />
                      </Modal>
                    </TouchableOpacity>
                  </View>
                  {/* Gender END */}

                  {/* BIRTH DAY START */}
                  <View style={[styles.form.inputBox, {marginTop: 5}]}>
                    <Text style={styles.form.inputLable}>Birth Date</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      {/* day */}
                      <TouchableOpacity
                        style={[styles.form.input, styles.selectInputDateFix]}
                        onPress={() => setIsSelectDayModalVisible(true)}>
                        <Text style={{marginLeft: 8, color: '#333'}}>
                          {selectedDay}
                        </Text>
                        <View style={styles.daySelectIconBox}>
                          <AntDesign name="down" size={15} />
                        </View>

                        <Modal
                          transparent={true}
                          animationType={'fade'}
                          visible={isSelectDayModalVisible}
                          nRequestClose={() =>
                            setIsSelectDayModalVisible(false)
                          }>
                          <DayModalPicker
                            setIsSelectDayModalVisible={
                              setIsSelectDayModalVisible
                            }
                            setSelectedDay={setSelectedDay}
                          />
                        </Modal>
                      </TouchableOpacity>
                      {/* month */}
                      <TouchableOpacity
                        style={[styles.selectInputDateFix, styles.form.input]}
                        onPress={() => setIsSelectMonthModalVisible(true)}>
                        <Text style={{marginLeft: 8, color: '#333'}}>
                          {selectedMonth}
                        </Text>
                        <View style={styles.daySelectIconBox}>
                          <AntDesign name="down" size={15} />
                        </View>

                        <Modal
                          transparent={true}
                          animationType={'fade'}
                          visible={isSelectMonthModalVisible}
                          nRequestClose={() =>
                            setIsSelectMonthModalVisible(false)
                          }>
                          <MonthModalPicker
                            setIsSelectMonthModalVisible={
                              setIsSelectMonthModalVisible
                            }
                            setSelectedMonth={setSelectedMonth}
                          />
                        </Modal>
                      </TouchableOpacity>
                      {/* year */}
                      <TouchableOpacity
                        style={[styles.selectInputDateFix, styles.form.input]}
                        onPress={() => setIsSelectYearModalVisible(true)}>
                        <Text style={{marginLeft: 8, color: '#333'}}>
                          {selectedYear}
                        </Text>
                        <View style={styles.daySelectIconBox}>
                          <AntDesign name="down" size={15} />
                        </View>

                        <Modal
                          transparent={true}
                          animationType={'fade'}
                          visible={isSelectYearModalVisible}
                          nRequestClose={() =>
                            setIsSelectYearModalVisible(false)
                          }>
                          <YearModalPicker
                            setIsSelectYearModalVisible={
                              setIsSelectYearModalVisible
                            }
                            setSelectedYear={setSelectedYear}
                          />
                        </Modal>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* BIRTH DAY END */}

                  {/* Country START */}
                  <View style={[styles.form.inputBox, {marginTop: 5}]}>
                    <Text style={styles.form.inputLable}>Country</Text>
                    <TouchableOpacity
                      style={[
                        styles.form.input,
                        {marginTop: 25, paddingLeft: 5, paddingBottom: 8},
                      ]}
                      onPress={() => changeCountryModalVisibility(true)}>
                      <Text style={{color: '#333'}}>
                        {selectedCountry || ''}
                      </Text>
                      <View style={[styles.selectConatinerIconBox, {top: -5}]}>
                        <AntDesign name="down" size={15} />
                      </View>

                      <Modal
                        transparent={true}
                        animationType={'fade'}
                        visible={isModalVisible}
                        nRequestClose={() =>
                          changeCountryModalVisibility(false)
                        }>
                        <CountryModalPicker
                          changeModalVisibility={changeCountryModalVisibility}
                          setSelectedCountry={setSelectedCountry}
                        />
                      </Modal>
                    </TouchableOpacity>
                  </View>

                  {/* Country END */}
                  <View style={{marginTop: 30, marginBottom: 20}}>
                    <NextBtn title="Update" onPress={handleSubmit} />
                  </View>
                </View>
              </View>
            )}
          </Formik>
        )}

        {hideForm && (
          <TouchableOpacity
            style={{
              height: 100,
              marginVertical: 40,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              handldeSheet(true);
            }}>
            <View
              style={{
                width: 180,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 100,
                padding: 5,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Upload Photo
              </Text>
              <Icon name="md-add-circle" size={45} color={'gray'} />
            </View>
          </TouchableOpacity>
        )}
        {hideForm && (
          <View
            style={{
              marginTop: 30,
              width: '100%',
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <NextBtn title="Update" onPress={doUpdateImage} />
          </View>
        )}
        <ActionSheet id="sheetEditProfile" ref={actionSheetRef}>
          <View
            style={{
              height: 130,
            }}>
            <TouchableOpacity
              onPress={() => {
                openCameraForSelectImage();
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
                handleChooseProfileImage();
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
            <TouchableOpacity
              onPress={() => {
                handleRemoveProfileImage();
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
                Remove Photo
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

        {/* form  end*/}
      </ScrollView>
      <Toast />
    </View>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  header: {
    container: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftArrow: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
  },
  profile: {
    container: {
      alignItems: 'center',
    },
    avatarBox: {
      borderColor: 'orange',
      borderWidth: 5,

      padding: 5,
    },
  },
  form: {
    inputBox: {
      width: '80%',
    },
    inputLable: {
      marginBottom: -10,
      fontSize: 13,
      marginLeft: 5,
      color: '#000',
    },
    input: {
      borderColor: '#000',
      borderBottomWidth: 2,
      marginBottom: 15,
      color: '#666',
    },
  },
  selectConatiner: {
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 250,
    borderWidth: 2,
    borderColor: colors.borderBlack,
  },
  selectConatinerLable: {
    backgroundColor: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: -10,
    left: 40,
    paddingHorizontal: 5,
    zIndex: 11,
    color: '#555',
  },
  selectConatinerText: {fontSize: 17, paddingHorizontal: 25, opacity: 0.8},
  selectConatinerIconBox: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 15,
    right: 10,
  },
  selectInputDateFix: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  daySelectIconBox: {
    right: -10,
  },
  errorFix: {
    textAlign: 'left',
  },
});
