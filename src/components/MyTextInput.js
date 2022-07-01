import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const MyTextInput = props => {
  const {placeholder, label, width, secureTextEntry} = props;
  return (
    <View style={{...styles.inputRow, width: width ? width : '70%'}}>
      <Text style={styles.inputRow_Lable}>{label}</Text>
      <TextInput
        style={styles.inputRow_input}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.3)"
        {...props}
        secureTextEntry={secureTextEntry ? true : false}
      />
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  inputRow: {margin: 20, width: '70%'},
  inputRow_Lable: {
    backgroundColor: '#fff',
    zIndex: 1,
    paddingHorizontal: 5,
    position: 'absolute',
    top: -10,
    left: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  inputRow_input: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.6)',
    fontSize: 18,
    letterSpacing: 0.3,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    color: '#555',
  },
});
