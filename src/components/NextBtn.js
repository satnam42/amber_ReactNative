import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const NextBtn = ({title, onPress, loading, btnContainerStyle, textStyle}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        start={{x: 0.0, y: 1}}
        end={{x: 0.8, y: 1.0}}
        locations={[0.1, 1]}
        colors={['#7293fd', '#a149ff']}
        style={{
          width: 160,
          height: 52,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          ...btnContainerStyle,
        }}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 17,
              letterSpacing: 1,
              ...textStyle,
            }}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NextBtn;
