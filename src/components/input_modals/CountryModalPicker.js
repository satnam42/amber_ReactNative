import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import {countryCode} from '../../screens/signup/helper';

const CountryModalPicker = ({changeModalVisibility, setSelectedCountry}) => {
  const onPressItem = option => {
    setSelectedCountry(option);
    changeModalVisibility(false);
  };

  const options = countryCode.map((item, index) => {
    if (item?.name === 'ALL') return null;
    return (
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        key={index}
        onPress={() => onPressItem(`${item.name}`)}>
        <Text
          style={{margin: 20, fontSize: 20, fontWeight: 'bold', color: '#333'}}>
          {`${item.name} ${item.dial_code}`}
        </Text>
      </TouchableOpacity>
    );
  });
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  return (
    <TouchableOpacity
      onPress={() => changeModalVisibility(false)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: WIDTH - 20,
          height: HEIGHT / 2,
          padding: 5,
        }}>
        <ScrollView>{options}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default CountryModalPicker;
