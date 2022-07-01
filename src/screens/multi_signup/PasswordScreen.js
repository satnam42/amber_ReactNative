import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import GraphicBox from './GraphicBox';
import NextBtn from '../../components/NextBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/core';

import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;

import * as yup from 'yup';
import {Formik} from 'formik';
import {MultiStepSignUpContext} from '../../../App';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const validationSchema = yup.object().shape({
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

const PasswordScreen = () => {
  const navigation = useNavigation(null);

  const [showHideToggleOne, setShowHideToggleOne] = React.useState(true);
  const [showHideToggleTwo, setShowHideToggleTwo] = React.useState(true);

  const {multiSetpSignUpObj, setMultiSetpSignUpObj} = React.useContext(
    MultiStepSignUpContext,
  );

  const handleNextPress = values => {
    console.log('here');
    setMultiSetpSignUpObj({
      ...multiSetpSignUpObj,
      password: values?.password,
    });
    navigation.navigate('SignUpDob');
  };

  return (
    <ScrollView style={{flex: 1}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        centerImage={require('../../assets/03.png')}
        h1="Password"
        h2="Enter your"
      />

      {/* INPUT */}
      <Formik
        initialValues={{
          password: '',
          passwordConfirmation: '',
        }}
        validateOnMount={true}
        validationSchema={validationSchema}
        onSubmit={values => handleNextPress(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  maxWidth: 350,
                  width: '80%',
                  marginLeft: 15,
                  color: 'rgba(0,0,0,0.6)',
                  marginBottom: 5,
                }}>
                Enter Your Password
              </Text>

              {errors?.password && touched?.password && (
                <Text
                  style={{
                    maxWidth: 350,
                    width: '80%',
                    marginLeft: 15,
                    color: 'tomato',
                    marginBottom: 5,
                    fontSize: 10,
                  }}>
                  {errors?.password}
                </Text>
              )}
              <View style={{width: '80%', position: 'relative'}}>
                <TextInput
                  style={{
                    maxWidth: 350,
                    width: '100%',
                    borderColor: 'rgba(0,0,0,0.6)',
                    borderWidth: 0.2,
                    borderRadius: 10,
                    padding: 10,
                    color: '#000',
                    paddingHorizontal: 20,
                  }}
                  secureTextEntry={showHideToggleOne}
                  placeholder="**********"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={handleChange('password')}
                  value={values.password.trim()}
                  onBlur={handleBlur('password')}
                />
                <TouchableOpacity
                  onPress={() => setShowHideToggleOne(!showHideToggleOne)}
                  style={{position: 'absolute', right: 20, bottom: 15}}>
                  <FontAwesome
                    name={showHideToggleOne ? 'eye-slash' : 'eye'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  maxWidth: 350,
                  width: '80%',
                  marginLeft: 15,
                  color: 'rgba(0,0,0,0.6)',
                  marginBottom: 5,
                }}>
                Confirm Password
              </Text>

              {errors?.passwordConfirmation && touched?.passwordConfirmation && (
                <Text
                  style={{
                    maxWidth: 350,
                    width: '80%',
                    marginLeft: 15,
                    color: 'tomato',
                    marginBottom: 5,
                    fontSize: 10,
                  }}>
                  {errors?.passwordConfirmation}
                </Text>
              )}
              <View style={{width: '80%', position: 'relative'}}>
                <TextInput
                  style={{
                    maxWidth: 350,
                    width: '100%',
                    borderColor: 'rgba(0,0,0,0.6)',
                    borderWidth: 0.2,
                    borderRadius: 10,
                    padding: 10,
                    color: '#000',
                    paddingHorizontal: 20,
                  }}
                  secureTextEntry={showHideToggleTwo}
                  placeholder="**********"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onChangeText={handleChange('passwordConfirmation')}
                  value={values.passwordConfirmation.trim()}
                  onBlur={handleBlur('passwordConfirmation')}
                />
                <TouchableOpacity
                  onPress={() => setShowHideToggleTwo(!showHideToggleTwo)}
                  style={{position: 'absolute', right: 20, bottom: 15}}>
                  <FontAwesome
                    name={showHideToggleTwo ? 'eye-slash' : 'eye'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* BTN */}
            <View style={{alignItems: 'center'}}>
              <NextBtn title="Next" onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default PasswordScreen;
