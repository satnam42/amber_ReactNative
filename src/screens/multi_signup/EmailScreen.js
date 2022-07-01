import React from 'react';
import {ScrollView, View, Text, TextInput, Image} from 'react-native';
import GraphicBox from './GraphicBox';
import NextBtn from '../../components/NextBtn';
import {useNavigation} from '@react-navigation/core';

import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;

import * as yup from 'yup';
import {Formik} from 'formik';
import globalStyles from '../../styles/globalStyles';
import {MultiStepSignUpContext} from '../../../App';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email.')
    .required('email address is required!'),
});

const EmailScreen = () => {
  const navigation = useNavigation(null);
  const {multiSetpSignUpObj, setMultiSetpSignUpObj} = React.useContext(
    MultiStepSignUpContext,
  );
  const handleNextPress = values => {
    console.log('here', values);
    setMultiSetpSignUpObj({
      ...multiSetpSignUpObj,
      email: values?.email,
    });
    navigation.navigate('SignUpPassword');
  };

  return (
    <ScrollView style={{flex: 1}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        centerImage={require('../../assets/02.png')}
        h1="Email Address"
        h2="Enter your"
      />

      {/* INPUT */}
      <Formik
        initialValues={{
          email: '',
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
                marginVertical: 50,
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
                Enter Your Email
              </Text>

              {errors?.email && touched?.email && (
                <Text
                  style={{
                    maxWidth: 350,
                    width: '80%',
                    marginLeft: 15,
                    color: 'tomato',
                    marginBottom: 5,
                    fontSize: 10,
                  }}>
                  {errors?.email}
                </Text>
              )}
              <TextInput
                style={{
                  maxWidth: 350,
                  width: '80%',
                  borderColor: 'rgba(0,0,0,0.6)',
                  borderWidth: 0.2,
                  borderRadius: 10,
                  padding: 10,
                  color: '#000',
                  paddingHorizontal: 20,
                }}
                placeholder="example@gmail.com"
                placeholderTextColor="rgba(0,0,0,0.3)"
                onChangeText={handleChange('email')}
                value={values.email.trim()}
                onBlur={handleBlur('email')}
              />
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

export default EmailScreen;
