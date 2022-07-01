import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import {countryCode, generteBirthYears} from '../../screens/signup/helper';

const YearModalPicker = ({setIsSelectYearModalVisible, setSelectedYear}) => {
  const onPressItem = option => {
    setSelectedYear(option);
    setIsSelectYearModalVisible(false);
  };

  const options = generteBirthYears(100, 16).map((year, index) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        key={index}
        onPress={() => onPressItem(year.year)}>
        <Text
          style={{margin: 20, fontSize: 20, fontWeight: 'bold', color: '#333'}}>
          {year.year}
        </Text>
      </TouchableOpacity>
    );
  });
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  return (
    <TouchableOpacity
      onPress={() => setIsSelectYearModalVisible(false)}
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

export default YearModalPicker;
