import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';

const FAQScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, paddingBottom: 80}}>
      <HeaderBackTitle title="FAQ's" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* FAKE CONTENT START */}
        <View style={{width: '80%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.8',
              marginVertical: 10,
            }}>
            1914 translation by H. Rackham
          </Text>
          <Text style={{color: 'rgba(0,0,0,0.8', textAlign: 'justify'}}>
            "But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?"
          </Text>
        </View>
        {/* FAKE CONTENT END */}
        {/* FAKE CONTENT START */}
        <View style={{width: '80%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.8',
              marginVertical: 10,
            }}>
            1914 translation by H. Rackham
          </Text>
          <Text style={{color: 'rgba(0,0,0,0.8', textAlign: 'justify'}}>
            "But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?"
          </Text>
        </View>
        {/* FAKE CONTENT END */}
        {/* FAKE CONTENT START */}
        <View style={{width: '80%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.8',
              marginVertical: 10,
            }}>
            1914 translation by H. Rackham
          </Text>
          <Text style={{color: 'rgba(0,0,0,0.8', textAlign: 'justify'}}>
            "But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?"
          </Text>
        </View>
        {/* FAKE CONTENT END */}
        {/* FAKE CONTENT START */}
        <View style={{width: '80%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'rgba(0,0,0,0.8',
              marginVertical: 10,
            }}>
            1914 translation by H. Rackham
          </Text>
          <Text style={{color: 'rgba(0,0,0,0.8', textAlign: 'justify'}}>
            "But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?"
          </Text>
        </View>
        {/* FAKE CONTENT END */}
      </ScrollView>
    </View>
  );
};

export default FAQScreen;
