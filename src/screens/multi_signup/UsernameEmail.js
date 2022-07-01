import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import GraphicBox from './GraphicBox';

import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
import NextBtn from '../../components/NextBtn';
import {useNavigation} from '@react-navigation/core';
const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;

import * as yup from 'yup';
import {Formik} from 'formik';
import {MultiStepSignUpContext} from '../../../App';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, ({min}) => `Username must be atleast ${min} character`)
    .required('username is required!'),
});

const UsernameScreen = () => {
  const navigation = useNavigation(null);
  const {setMultiSetpSignUpObj} = React.useContext(MultiStepSignUpContext);

  const handleNextPress = values => {
    console.log('here', values);
    setMultiSetpSignUpObj({
      username: values?.username,
    });

    navigation.navigate('SignUpEmail');
  };

  return (
    <ScrollView style={{flex: 1}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        centerImage={require('../../assets/01.png')}
        h1="Amber"
        h2="Welcome to"
      />

      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Already have an Account ? login</Text>
        </TouchableOpacity>
      </View>
      {/* INPUT */}
      <Formik
        initialValues={{
          username: '',
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
            {console.log(errors)}
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
                Enter Your Username
              </Text>
              {errors?.username && touched?.username && (
                <Text
                  style={{
                    maxWidth: 350,
                    width: '80%',
                    marginLeft: 15,
                    color: 'tomato',
                    marginBottom: 5,
                    fontSize: 10,
                  }}>
                  {errors?.username}
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
                placeholder="username"
                placeholderTextColor="rgba(0,0,0,0.3)"
                onChangeText={handleChange('username')}
                value={values.username.trim()}
                onBlur={handleBlur('username')}
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

export default UsernameScreen;
