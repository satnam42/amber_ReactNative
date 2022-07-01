import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../constants';
import * as yup from 'yup';
import {Formik} from 'formik';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import GenderModalPicker from '../components/input_modals/GenderModalPicker';
import CountryModalPicker from '../components/input_modals/CountryModalPicker';
import DayModalPicker from '../components/input_modals/DayModalPicker';
import MonthModalPicker from '../components/input_modals/MonthModalPicker';
import YearModalPicker from '../components/input_modals/YearModalPicker';
import NextBtn from '../components/NextBtn';
import MyLoader from '../components/MyLoader';
import globalStyles from '../styles/globalStyles';

import {
  api_removeProfileImage,
  api_update_user,
  api_uploadImage,
} from '../api_services';

import {UPDATE_PROFILE_PHOTO, UPDATE_USER} from '../redux/reducers/actionTypes';

const profileFormValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(4, ({min}) => `firstName must be atleast ${min} character`)
    .required('firstName is required!'),
  lastName: yup
    .string()
    .min(4, ({min}) => `lastName must be atleast ${min} character`)
    .required('lastName is required!'),
  phone: yup.number().required('phone is required!'),
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('email address is required!'),
});

const ProfileReview = ({isProfileReviewActive, setIsProfileReviewActive}) => {
  const [isPhotoEditOptionOpen, setIsPhotoEditOptionOpen] =
    React.useState(false);
  const dispatch = useDispatch();
  const {user, accessToken} = useSelector(state => state.auth);
  const changeCountryModalVisibility = bool => setIsModalVisible(bool);
  const [loading, setLoading] = useState(false);

  const [updateBio, setUpdateBio] = useState('');
  const [updateWebsite, setUpdateWebsite] = useState('');

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

  useEffect(() => {
    if (user) {
      setSelectedGender(user?.gender || 'Select Gender...');
      setSelectedCountry(user?.country || 'Select Country...');
      setUpdateBio(user?.bio || '');
      setUpdateWebsite(user?.website || '');
    }

    if (user?.dob) {
      let [year, month, day] = user?.dob.split('-');
      day = day.substring(0, 2);
      setSelectedDay(day || '00');
      setSelectedMonth(month || '00');
      setSelectedYear(year || '0000');
    }
  }, [user]);

  const handleUpdateProfile = async values => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      website: updateWebsite,
      bio: updateBio,
      email: values.email,
      phoneNo: values.phone,
      gender: selectedGender,
      country: selectedCountry,
      dob: `${selectedYear}-${selectedMonth}-${selectedDay}`,
    };

    console.log({payload});
    setLoading(true);
    const res = await api_update_user(payload, user?.id, user?.token);

    console.log('res', res);
    if (res.isSuccess && res.statusCode === 200) {
      setIsProfileReviewActive(false);
      Alert.alert('Success', 'Profile Updated!');
      dispatch({type: UPDATE_USER, payload: res.data});
    } else {
      Alert.alert('error', res?.error || 'something went wrong!');
    }
    setLoading(false);
  };

  return (
    <View
      style={{
        zIndex: 123,
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <ScrollView
        style={{
          backgroundColor: '#FFF',
          width: '80%',
          alignSelf: 'center',

          marginVertical: 30,
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 10,
            paddingTop: 30,
          }}>
          <Text style={{fontSize: 20, color: 'black'}}>
            Review Your Profile !
          </Text>
        </View>
        {/* form  start*/}
        <Formik
          initialValues={{
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            website: user?.website || '',
            phone: user?.phoneNo || '',
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
                <View style={styles.form.inputBox}>
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
                </View>
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
                        nRequestClose={() => setIsSelectDayModalVisible(false)}>
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
                    <Text style={{color: '#333'}}>{selectedCountry || ''}</Text>
                    <View style={[styles.selectConatinerIconBox, {top: -5}]}>
                      <AntDesign name="down" size={15} />
                    </View>

                    <Modal
                      transparent={true}
                      animationType={'fade'}
                      visible={isModalVisible}
                      nRequestClose={() => changeCountryModalVisibility(false)}>
                      <CountryModalPicker
                        changeModalVisibility={changeCountryModalVisibility}
                        setSelectedCountry={setSelectedCountry}
                      />
                    </Modal>
                  </TouchableOpacity>
                </View>

                {/* Country END */}
                <View style={{marginTop: 30, marginBottom: 20}}>
                  <NextBtn title={'Update'} onPress={handleSubmit} />
                </View>
              </View>
            </View>
          )}
        </Formik>
        {/* form  end*/}
      </ScrollView>
    </View>
  );
};
export default ProfileReview;

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
      borderRadius: 100,
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

const customeErrorStyles = StyleSheet.create({
  conatiner: {
    zIndex: 1000,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 300,
    width: Dimensions.get('screen').width - 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingVertical: 8,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
  },
  headerTitle: {fontSize: 17, fontWeight: 'bold', marginLeft: 15},
  list: {marginHorizontal: 20, padding: 5},
  listHeading: {fontSize: 15, fontWeight: 'bold'},
  listText: {color: 'tomato', marginLeft: 5},
});
