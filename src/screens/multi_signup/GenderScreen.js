import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';
import GraphicBox from './GraphicBox';
import NextBtn from '../../components/NextBtn';
import {useNavigation} from '@react-navigation/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BACKGROUND_HEADER_IMAGE from '../../assets/signupBackground.png';
import {MultiStepSignUpContext} from '../../../App';

const BACKGROUND_HEADER_IMAGE_URI = Image.resolveAssetSource(
  BACKGROUND_HEADER_IMAGE,
).uri;
const GenderScreen = () => {
  const navigation = useNavigation(null);

  const [gender, setGender] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  const {multiSetpSignUpObj, setMultiSetpSignUpObj} = React.useContext(
    MultiStepSignUpContext,
  );

  const handleNextPress = values => {
    console.log('here');

    if (!gender) {
      setTouched(true);
    } else {
      setMultiSetpSignUpObj({
        ...multiSetpSignUpObj,
        gender: gender,
      });
      navigation.navigate('SignUpAvatar');
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <GraphicBox
        bgImageUri={BACKGROUND_HEADER_IMAGE_URI}
        centerImage={require('../../assets/05.png')}
        h1="Gender Details"
        h2="Please fill in your"
      />

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            marginVertical: 30,
            width: 200,
          }}>
          <Text style={{fontSize: 18, color: '#666'}}>
            What's Your Gender ?
          </Text>

          {!gender && touched && (
            <Text
              style={{
                maxWidth: 350,
                width: '80%',
                marginLeft: 15,
                color: 'tomato',
                marginBottom: 5,
                fontSize: 10,
                textAlign: 'center',
              }}>
              Please Select Gender
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 30,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{position: 'relative'}}
              onPress={() => setGender('male')}>
              {gender === 'male' && (
                <View
                  style={{
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    right: -5,
                    top: -5,
                  }}>
                  <FontAwesome name="check" color="lightblue" size={20} />
                </View>
              )}
              <Image
                source={require('../../assets/icons/male.png')}
                style={{
                  height: 65,
                  width: 65,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(0,0,0,0.5)',
                  position: 'absolute',
                  bottom: 4,
                  left: 18,
                }}>
                male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{position: 'relative'}}
              onPress={() => setGender('female')}>
              {gender === 'female' && (
                <View
                  style={{
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    right: -5,
                    top: -5,
                  }}>
                  <FontAwesome name="check" color="pink" size={20} />
                </View>
              )}

              <Image
                source={require('../../assets/icons/female.png')}
                style={{
                  height: 65,
                  width: 65,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(0,0,0,0.5)',
                  position: 'absolute',
                  bottom: 4,
                  left: 15,
                }}>
                female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BTN */}
      <View style={{alignItems: 'center'}}>
        <NextBtn title="Next" onPress={handleNextPress} />
      </View>
    </ScrollView>
  );
};

export default GenderScreen;
