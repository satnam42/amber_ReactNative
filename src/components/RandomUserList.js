import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {dummyRandomUser} from '../utils/dummy';

import {RANDOM_VIEWS} from '../screens/home/MidTabViews/Random';
import LiveVideoCard from './LiveVideoCard';
const CLOSE_ICON_SIZE = 25;
const RandomUserList = ({setActiveRandomView}) => {
  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        marginBottom: 70,
      }}>
      <View
        style={{
          width: '100%',
          height: 30,
          justifyContent: 'center',
          alignItems: 'flex-end',
          position: 'relative',
        }}>
        <TouchableOpacity
          onPress={() => {
            setActiveRandomView(RANDOM_VIEWS.RANDOM_DEFAULT);
          }}
          style={{
            width: CLOSE_ICON_SIZE,
            height: CLOSE_ICON_SIZE,
            marginRight: 30,
            marginVertical: 5,
          }}>
          <Ionicons name="close-circle-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      {/* USERLIST START */}
      <FlatList
        initialNumToRender={100}
        style={{
          width: '90%',
          alignSelf: 'center',
        }}
        columnWrapperStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        data={dummyRandomUser}
        ListEmptyComponent={
          false ? (
            <View
              style={{
                width: '100%',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color="orange" size="large" />
            </View>
          ) : (
            <Text style={{textAlign: 'center', marginTop: 30}}>'no data'</Text>
          )
        }
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item, index}) => (
          <LiveVideoCard index={index} item={item} />
        )}
        onEndReached={() => {}}
        onEndReachedThreshold={0.1}
      />
      {/* USERLIST END */}
    </View>
  );
};

export default RandomUserList;

const styles = StyleSheet.create({});
