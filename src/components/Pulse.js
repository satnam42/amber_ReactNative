import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const Pulse = ({delay = 0, repeat}) => {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.linear,
        }),
        repeat ? -1 : 1,
        false,
      ),
    );
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, 1],
      [0.6, 0],
      Extrapolate.CLAMP,
    );
    return {
      opacity: opacity,
      transform: [{scale: animation.value}],
    };
  });
  return <Animated.View style={[styles.circle, animatedStyles]} />;
};

export default Pulse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  circle: {
    width: 300,
    borderRadius: 150,
    height: 300,
    position: 'absolute',
    // borderColor: '#e91e63',
    borderColor: 'green',
    borderWidth: 4,
    // backgroundColor: '#ff6090',
    backgroundColor: '#49cf76',
  },
});
