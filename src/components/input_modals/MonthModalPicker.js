import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import {bMonths} from '../../screens/signup/helper';

const MonthModalPicker = ({setIsSelectMonthModalVisible, setSelectedMonth}) => {
  const onPressItem = option => {
    setSelectedMonth(option);
    setIsSelectMonthModalVisible(false);
  };

  const options = bMonths.map((item, index) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        key={index}
        onPress={() => onPressItem(item.value)}>
        <Text
          style={{margin: 20, fontSize: 20, fontWeight: 'bold', color: '#333'}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  });
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  return (
    <TouchableOpacity
      onPress={() => setIsSelectMonthModalVisible(false)}
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

export default MonthModalPicker;
