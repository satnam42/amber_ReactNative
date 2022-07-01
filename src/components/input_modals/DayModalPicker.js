import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {bDays} from '../../screens/signup/helper';

const DayModalPicker = ({setSelectedDay, setIsSelectDayModalVisible}) => {
  const onPressItem = option => {
    setSelectedDay(option);
    setIsSelectDayModalVisible(false);
  };

  const options = bDays.map((item, index) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        key={index}
        onPress={() => onPressItem(item.dayInt)}>
        <Text
          style={{margin: 20, fontSize: 20, fontWeight: 'bold', color: '#333'}}>
          {item.dayInt}
        </Text>
      </TouchableOpacity>
    );
  });
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  return (
    <TouchableOpacity
      onPress={() => setIsSelectDayModalVisible(false)}
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

export default DayModalPicker;
