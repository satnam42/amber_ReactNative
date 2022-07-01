import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import HeaderBackTitle from '../../../components/HeaderBackTitle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {
  api_removeProfileImage,
  api_userDeleteImageOrVideo,
} from '../../../api_services';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import {useRef} from 'react';
const {width, height} = Dimensions.get('window');
const PhotoBox = ({item, index, setFullPreviewImage, setCarouselShowIndex}) => {
  console.log({item});
  const handleImagePress = (item, index) => {
    setFullPreviewImage(item.name);
  };

  return (
    <TouchableOpacity
      style={{
        width: '33.3%',
        maxWidth: 150,
        height: 140,
        margin: 2,
      }}
      onPress={() => handleImagePress(item, index)}>
      {/* // onPress={() => setCarouselShowIndex(index)}> */}
      <Image
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
        source={{uri: item?.name}}
      />
    </TouchableOpacity>
  );
};

const PhotoGallary = ({
  setIsPhotoGallaryActive,
  images,
  setRefresh,
  showPhotoDeleteButton,
}) => {
  const [fullPreviewImage, setFullPreviewImage] = useState(null);
  const carouselRef = useRef(null);

  const [carouselShowIndex, setCarouselShowIndex] = useState(null);

  const {auth} = useSelector(state => state);

  console.log('images', images);

  const deleteImage = async name => {
    const ITEM_NAME = name?.split('/')?.slice(-1)?.pop();
    console.log({ITEM_NAME});

    const payload = {
      itemName: ITEM_NAME,
      token: auth?.accessToken,
      userId: auth?.user?.id,
      itemType: 'image',
    };

    try {
      const response = await api_userDeleteImageOrVideo(payload);
      console.log(response);
      if (response.isSuccess) {
        setRefresh(s => !s);
        Alert.alert('Success', 'Image Delete Success');
      } else {
        Alert.alert('Alert', response?.error || 'Failed to Delete Image!');
      }
    } catch (error) {
      Alert.alert('Alert', error?.message || 'Failed to Delete Image!');
    }
  };

  console.log({fullPreviewImage});

  return (
    <View style={[styles.container]}>
      <HeaderBackTitle
        title={'Photos'}
        onBackPress={() => setIsPhotoGallaryActive(false)}
      />

      {/* {carouselShowIndex !== null && ( */}
      {true && (
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => {
            setCarouselShowIndex(null);
            setIsPhotoGallaryActive(false);
          }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,

              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              zIndex: 10,
            }}>
            <Carousel
              ref={carouselRef.current}
              data={images}
              firstItem={carouselShowIndex}
              renderItem={data => {
                console.log(data);
                return (
                  <View
                    style={{
                      marginTop: '40%',
                    }}>
                    <View
                      style={{
                        width: '75%',
                        height: '85%',
                        // width: '100%',
                        // height: '100%',
                        borderColor: '#fff',
                        borderWidth: 15,
                        borderTopWidth: 30,
                        borderBottomWidth: showPhotoDeleteButton ? 50 : 30,
                        borderRadius: 5,
                        shadowColor: '#000',
                        shadowOffset: {width: -2, height: 4},
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 10,
                        zIndex: 10,
                        backgroundColor: 'lightgray',
                      }}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          zIndex: 10,
                        }}
                        resizeMode="contain"
                        source={{
                          uri: data.item.name,
                        }}
                      />
                      {showPhotoDeleteButton && (
                        <TouchableOpacity
                          style={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => deleteImage(fullPreviewImage)}>
                          <AntDesign
                            name={'delete'}
                            color={'tomato'}
                            size={24}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }}
              sliderWidth={300}
              itemWidth={Dimensions.get('window').width}
            />
          </View>
        </TapGestureHandler>
      )}

      {/* <FlatList
        style={{
          width: '98%',
          alignSelf: 'center',
          marginBottom: 70,
        }}
        initialNumToRender={100}
        columnWrapperStyle={{alignItems: 'center'}}
        data={images}
        ListEmptyComponent={
          <Text style={{color: '#000'}}>
            {images ? 'Loading...' : 'no photos'}
          </Text>
        }
        keyExtractor={item => item._id}
        numColumns={3}
        renderItem={({item, index}) => (
          <PhotoBox
            setFullPreviewImage={setFullPreviewImage}
            item={item}
            index={index}
            setCarouselShowIndex={setCarouselShowIndex}
          />
        )}
      /> */}

      {/* Full View */}
      {fullPreviewImage && (
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => setFullPreviewImage(null)}>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              backgroundColor: 'rgba(0,0,0,0.1)',
              width,
              height,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                height: '60%',
                borderColor: '#fff',
                borderWidth: 15,
                borderTopWidth: 30,
                borderBottomWidth: showPhotoDeleteButton ? 50 : 30,
                borderRadius: 5,
                shadowColor: '#000',
                shadowOffset: {width: -2, height: 4},
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 10,
                zIndex: 10,
                backgroundColor: 'lightgray',
              }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  zIndex: 10,
                }}
                source={{
                  uri: fullPreviewImage,
                }}
              />
              {showPhotoDeleteButton && (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => deleteImage(fullPreviewImage)}>
                    <AntDesign name={'delete'} color={'tomato'} size={24} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TapGestureHandler>
      )}
    </View>
  );
};

export default PhotoGallary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#FFF',
    ...StyleSheet.absoluteFillObject,
  },
});
