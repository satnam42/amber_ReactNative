import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

const OPTIONS = ['Male', 'Female'];
const GenderModalPicker = ({
  setSelectedGender,
  setIsSelectGenderModalVisible,
}) => {
  const onPressItem = option => {
    setSelectedGender(option);
    setIsSelectGenderModalVisible(false);
  };

  const options = OPTIONS.map((item, index) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'flex-start'}}
        key={index}
        onPress={() => onPressItem(item.toLocaleLowerCase())}>
        <Text
          style={{margin: 20, fontSize: 20, fontWeight: 'bold', color: '#333'}}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  });
  const WIDTH = Dimensions.get('window').width;
  const HEIGHT = Dimensions.get('window').height;

  return (
    <TouchableOpacity
      onPress={() => setIsSelectGenderModalVisible(false)}
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
          padding: 5,
        }}>
        <ScrollView>{options}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default GenderModalPicker;
