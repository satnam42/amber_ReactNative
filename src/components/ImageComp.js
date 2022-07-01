import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
const ImageComp = ({
  URI,
  imageStyles,
  imageContainerStyles,
  loaderStyles,
  loaderSize,
}) => {
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  return (
    <View
      style={{
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
        ...imageStyles,
        ...imageContainerStyles,
      }}>
      {isImageLoading && (
        <Progress.Circle
          indeterminate={true}
          animated={true}
          useNativeDriver={true}
          animationType="spring"
          size={loaderSize}
          color="orange"
          style={{
            position: 'absolute',
            zIndex: 10,
            ...loaderStyles,
          }}
        />
      )}
      {URI && (
        <FastImage
          style={{...imageStyles}}
          source={{
            uri: URI,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={() => {
            setIsImageLoading(true);
          }}
          onLoad={() => {
            setIsImageLoading(false);
          }}
          onError={() => {
            setIsImageLoading(false);
          }}
          onLoadEnd={() => {
            setIsImageLoading(false);
          }}
        />
      )}
    </View>
  );
};

export default ImageComp;
