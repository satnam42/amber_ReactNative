import React, {useState} from 'react';
import {ScrollView, View, Text, TextInput, Image} from 'react-native';
import GraphicBox from './GraphicBox';
import NextBtn from '../../components/NextBtn';
import {useNavigation} from '@react-navigation/core';
import DatePicker from 'react-native-date-picker';

import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
import {MultiStepSignUpContext} from '../../../App';
const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;

const minDate = () => {
  const today = new Date();
  const year = today.getFullYear() - 18;
  let month = JSON.stringify(today.getMonth() + 1).padStart(2, 0);
  let day = JSON.stringify(today.getDate()).padStart(2, 0);

  return `${year}-${month}-${day}`;
};

const formatDob = d => {
  const year = d.getFullYear();
  const month = JSON.stringify(d.getMonth() + 1).padStart(2, 0);
  const day = JSON.stringify(d.getDate()).padStart(2, 0);
  return `${year}-${month}-${day}`;
};

const DobScreen = () => {
  const navigation = useNavigation(null);

  const {multiSetpSignUpObj, setMultiSetpSignUpObj} = React.useContext(
    MultiStepSignUpContext,
  );

  const handleNextPress = () => {
    console.log('here');

    setMultiSetpSignUpObj({
      ...multiSetpSignUpObj,
      dob: formatDob(date),
    });
    navigation.navigate('SignUpGender');
  };
  const [date, setDate] = useState(new Date());

  console.log(date, 'pppppp');
  return (
    <ScrollView style={{flex: 1}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        centerImage={require('../../assets/04.png')}
        h1="Date of Birth"
        h2="Enter your"
      />

      {/* <Text>{JSON.stringify(date)}</Text> */}

      {/* INPUT */}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <DatePicker
          date={date}
          style={{backgroundColor: 'transparent'}}
          onDateChange={setDate}
          mode={'date'}
          maximumDate={new Date(minDate())}
          fadeToColor={'#fff'}
          androidVariant="nativeAndroid"
        />
      </View>
      {/* BTN */}
      <View style={{alignItems: 'center'}}>
        <NextBtn title="Next" onPress={handleNextPress} />
      </View>
    </ScrollView>
  );
};

export default DobScreen;
