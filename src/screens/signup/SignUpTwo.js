import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import NextBtn from '../../components/NextBtn';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CountryModalPicker from '../../components/input_modals/CountryModalPicker';
import YearModalPicker from '../../components/input_modals/YearModalPicker';
import MonthModalPicker from '../../components/input_modals/MonthModalPicker';
import DayModalPicker from '../../components/input_modals/DayModalPicker';

import * as yup from 'yup';
import {Formik} from 'formik';
import globalStyles from '../../styles/globalStyles';
import GenderModalPicker from '../../components/input_modals/GenderModalPicker';
import {useContext} from 'react';
import {SignupContext} from '../../context/SignupContext';
import {colors} from '../../constants';
import {api_signup, api_uploadImage} from '../../api_services';
import MyLoader from '../../components/MyLoader';

import Toast from 'react-native-toast-message';
import {fromLocalStorage} from '../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, ({min}) => `firstName must be atleast ${min} character`)
    .required('firstName is required!'),
  lastName: yup
    .string()
    .min(3, ({min}) => `lastName must be atleast ${min} character`)
    .required('lastName is required!'),
  phone: yup.number().required('phone is required!'),
});

const SignUpTwo = ({navigation}) => {
  const {signupData, setSignupData} = useContext(SignupContext);
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

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

  const [customeInputErrors, setCustomeInputErrors] = useState(null);
  const [customeErrorsVisible, setCustomeErrorsVisible] = useState(false);

  const changeCountryModalVisibility = bool => setIsModalVisible(bool);

  const handleToast = (type = 'success', text1 = 'Success', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  console.log('selectedCountry', selectedCountry);

  const submitForm = async payload => {
    console.log({payload});
    setLoading(true);
    const res = await api_signup(payload);
    setLoading(false);
    console.log(res);
    if (res?.statusCode === 200) {
      const msg = res?.message ? res?.message : 'Someting Went Wrong!';
      handleToast('success', 'success', msg);

      if (signupData && signupData?.photo?.uri) {
        // HIDDEN IMAGE UPLOAD START
        setImageUploadLoading(true);
        try {
          const response = await api_uploadImage(
            res?.data?._id,
            signupData.photo,
          );
          console.log({response}, 'image upload');
          if (response?.isSuccess) {
            handleToast('success', 'success', 'image uploaded successfully');
          } else {
            handleToast(
              'failed',
              'failed',
              response?.error || 'image uploaded failed',
            );
          }
        } catch (error) {
          handleToast(
            'failed',
            'failed',
            error?.message || 'image uploaded failed',
          );
          console.log(error, 'image upload');
        } finally {
          setImageUploadLoading(false);
          setTimeout(() => {
            // navigation.navigate("Verification");
            navigation.navigate('Login');
          }, 1000);
        }
        // HIDDEN IMAGE UPLOAD END
      } else {
        setTimeout(() => {
          // navigation.navigate("Verification");
          navigation.navigate('Login');
        }, 1000);
      }
    } else {
      const msg = res?.error ? res?.error : 'Someting Went Wrong!';
      handleToast('error', 'error', msg);
    }
  };

  const handleSignIn = async values => {
    let customeInputErrors = [];
    //country
    if (selectedCountry === 'Select Country...' || !selectedCountry) {
      customeInputErrors.push({
        name: 'country',
        error: 'Please select your country!',
      });
    }
    //day
    if (selectedDay === 'Day' || !selectedDay) {
      customeInputErrors.push({
        name: 'day',
        error: 'Please select your Day of birth!',
      });
    }
    //Month
    if (selectedMonth === 'Month' || !selectedMonth) {
      customeInputErrors.push({
        name: 'month',
        error: 'Please select your Month of birth!',
      });
    }
    //Year
    if (selectedYear === 'Year' || !selectedYear) {
      customeInputErrors.push({
        name: 'year',
        error: 'Please select your Year of birth!',
      });
    }
    //Gender
    if (selectedGender === 'Select Gender...' || !selectedGender) {
      customeInputErrors.push({
        name: 'gender',
        error: 'Please select your gender!',
      });
    }

    if (customeInputErrors.length > 0) {
      setCustomeInputErrors(customeInputErrors);
      setCustomeErrorsVisible(true);
    } else {
      const dob = `${selectedYear}-${selectedMonth}-${selectedDay}`;

      await setSignupData({
        ...signupData,
        ...values,
        birthDay: selectedDay,
        birthMonth: selectedMonth,
        birthYear: selectedYear,
        dob,
        gender: selectedGender,
        country: selectedCountry,
      });
      const payload = {
        username: signupData?.username,
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: signupData?.email,
        gender: selectedGender,
        country: selectedCountry,
        dob: dob,
        phoneNo: values?.phone,
        password: signupData?.password,
      };
      const deviceToken = await AsyncStorage.getItem('fcmToken');

      console.log({...payload, deviceToken: deviceToken});
      if (deviceToken) {
        submitForm({...payload, deviceToken: deviceToken});
      } else {
        submitForm(payload);
      }
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        phone: '',
      }}
      validateOnMount={true}
      validationSchema={loginValidationSchema}
      onSubmit={values => handleSignIn(values)}>
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
            {loading && <MyLoader visible={loading} />}
            {imageUploadLoading && (
              <MyLoader
                visible={imageUploadLoading}
                text="please wait uploading... image"
              />
            )}
            <View style={styles.signUpForm.box}>
              <MyTextInput
                placeholder="Enter your first name"
                label="First name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName.trim()}
                width={250}
              />
              {errors.firstName && touched.firstName && (
                <Text style={globalStyles.inputError}>{errors.firstName}</Text>
              )}

              <MyTextInput
                placeholder="Enter your last name"
                label="Last name"
                width={250}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName.trim()}
              />

              {errors.lastName && touched.lastName && (
                <Text style={globalStyles.inputError}>{errors.lastName}</Text>
              )}

              {/* Country START */}
              <TouchableOpacity
                style={[styles.selectConatiner]}
                onPress={() => changeCountryModalVisibility(true)}>
                <Text style={styles.selectConatinerLable}>Country</Text>
                <Text style={styles.selectConatinerText}>
                  {selectedCountry}
                </Text>
                <View style={styles.selectConatinerIconBox}>
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
              {/* Country END */}

              <MyTextInput
                placeholder="Enter your phone number"
                label="Phone number"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                width={250}
                value={values.phone}
              />

              {errors.phone && touched.phone && (
                <Text style={globalStyles.inputError}>{errors.phone}</Text>
              )}

              {/* BIRTH DAY START */}

              <View style={[styles.birthDayContainer]}>
                {/* Day */}
                <TouchableOpacity
                  style={styles.daySelectBox}
                  onPress={() => setIsSelectDayModalVisible(true)}>
                  <Text style={styles.daySelectLable}>BirthDay</Text>
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
                      setIsSelectDayModalVisible={setIsSelectDayModalVisible}
                      setSelectedDay={setSelectedDay}
                    />
                  </Modal>
                </TouchableOpacity>

                {/* Month */}
                <TouchableOpacity
                  style={{...styles.daySelectBox, marginHorizontal: 5}}
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
                    nRequestClose={() => setIsSelectMonthModalVisible(false)}>
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
                  style={styles.daySelectBox}
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
                    nRequestClose={() => setIsSelectYearModalVisible(false)}>
                    <YearModalPicker
                      setIsSelectYearModalVisible={setIsSelectYearModalVisible}
                      setSelectedYear={setSelectedYear}
                    />
                  </Modal>
                </TouchableOpacity>
              </View>

              {/* BIRTH DAY END */}

              {/* Gender START */}
              <TouchableOpacity
                style={{...styles.selectConatiner, marginTop: 30}}
                onPress={() => setIsSelectGenderModalVisible(true)}>
                <Text style={styles.selectConatinerLable}>Gender</Text>
                <Text style={styles.selectConatinerText}>{selectedGender}</Text>
                <View style={styles.selectConatinerIconBox}>
                  <AntDesign name="down" size={15} />
                </View>

                <Modal
                  transparent={true}
                  animationType={'fade'}
                  visible={isSelectGenderModalVisible}
                  nRequestClose={() => setIsSelectGenderModalVisible(false)}>
                  <GenderModalPicker
                    setIsSelectGenderModalVisible={
                      setIsSelectGenderModalVisible
                    }
                    setSelectedGender={setSelectedGender}
                  />
                </Modal>
              </TouchableOpacity>
              {/* Gender END */}
            </View>
          </ScrollView>
          {/* next */}
          <View style={styles.nextBtnBox}>
            <TouchableOpacity>
              <NextBtn title="NEXT" onPress={handleSubmit} />
            </TouchableOpacity>
          </View>

          <Toast />
          {/* CUSTOME ERROR POPUP START */}
          {customeErrorsVisible && (
            <TouchableOpacity
              style={customeErrorStyles.conatiner}
              onPress={() => setCustomeErrorsVisible(false)}>
              <View style={customeErrorStyles.card}>
                {/* header */}
                <View style={customeErrorStyles.headerRow}>
                  <Text style={customeErrorStyles.headerTitle}>Note !</Text>
                  <TouchableOpacity
                    onPress={() => setCustomeErrorsVisible(false)}>
                    <FontAwesome name="close" size={20} color={'#222'} />
                  </TouchableOpacity>
                </View>
                {/* body */}
                <ScrollView style={{flex: 1, paddingBottom: 10}}>
                  {customeInputErrors &&
                    customeInputErrors.map(err => (
                      <View style={customeErrorStyles.list}>
                        <Text style={customeErrorStyles.listHeading}>
                          {`${err?.name} :`}
                        </Text>
                        <Text
                          style={
                            customeErrorStyles.listText
                          }>{`${err?.error} :`}</Text>
                      </View>
                    ))}
                </ScrollView>
                {/* body */}
              </View>
            </TouchableOpacity>
          )}
          {/* CUSTOME ERROR POPUP END */}
        </View>
      )}
    </Formik>
  );
};

export default SignUpTwo;

const styles = StyleSheet.create({
  signUpForm: {
    box: {
      alignItems: 'center',
    },
  },
  textInputContainer: {
    width: 250,
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
  selectConatinerText: {
    fontSize: 17,
    paddingHorizontal: 25,
    opacity: 0.8,
    color: '#333',
  },
  selectConatinerIconBox: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  birthDayContainer: {
    flexDirection: 'row',
    height: 52,
    marginTop: 10,
    maxWidth: 250,
  },
  daySelectBox: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderBlack,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  daySelectLable: {
    backgroundColor: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    top: -10,
    left: 10,
    paddingHorizontal: 3,
    zIndex: 11,
    color: '#555',
  },
  daySelectIconBox: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 15,
    right: 5,
  },
  nextBtnBox: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
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
