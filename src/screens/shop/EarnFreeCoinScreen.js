import React from 'react';
import {View, Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SharePopup from '../../components/SharePopup';

const FreeDayCoin = ({coin = 0, day = 1}) => {
  return (
    <TouchableOpacity
      style={{
        width: 90,
        alignItems: 'center',
        margin: 4,
        transform: [{scale: 0.9}],
      }}>
      <Text style={{marginVertical: 5}}>{`Day ${day}`}</Text>
      <View
        style={{
          backgroundColor: '#333',
          padding: 10,
          alignItems: 'center',
          borderRadius: 20,
          width: 90,
          height: 90,
        }}>
        <Image
          source={require('../../assets/icons/shop/coin.png')}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
          }}
        />
        <Text style={{color: '#fff'}}>{`+ ${coin}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EarnFreeCoinScreen = ({navigation}) => {
  const [isShareScreenOpen, setIsShareScreenOpen] = React.useState(false);

  const handleSharePopupToggle = bool => setIsShareScreenOpen(bool);

  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle title={'Earn free Coins!'} navigation={navigation} />

      {/* days */}
      <ScrollView
        style={{
          marginBottom: 70,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderBottomColor: 'rgba(0,0,0,0.3)',
            borderBottomWidth: 1,
            justifyContent: 'center',
          }}>
          <FreeDayCoin day={1} coin={10} />
          <FreeDayCoin day={2} coin={20} />
          <FreeDayCoin day={3} coin={35} />
          <FreeDayCoin day={4} coin={45} />
          <FreeDayCoin day={5} coin={55} />
          <FreeDayCoin day={6} coin={75} />
          <FreeDayCoin day={7} coin={100} />
        </View>
        {/* Task */}
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 'bold',
              color: '#49cf76',
              letterSpacing: 0.5,
              marginVertical: 15,
            }}>
            Complete tasks to get diamonds!
          </Text>
          {/* item start */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 15,
            }}>
            <View
              style={{
                backgroundColor: '#49cf76',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginHorizontal: 10,
              }}>
              <Entypo name={'controller-play'} size={32} color={'#fff'} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#444',
                }}>{`Watch ads ${'(0/3)'}`}</Text>
              <Text style={{color: '#444'}}>watch the ad to get 50 coins</Text>
            </View>
          </TouchableOpacity>
          {/* item end */}
          {/* item start */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 15,
            }}>
            <View
              style={{
                backgroundColor: '#49cf76',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginHorizontal: 10,
              }}>
              <FontAwesome name={'dollar'} size={30} color={'#fff'} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#444',
                }}>{`First purchase`}</Text>
              <Text style={{color: '#444'}}>
                First purchase to get 200 coins
              </Text>
            </View>
          </TouchableOpacity>
          {/* item end */}
          {/* item start */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 15,
            }}>
            <View
              style={{
                backgroundColor: '#49cf76',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginHorizontal: 10,
              }}>
              <Ionicons name={'ios-gift'} size={30} color={'#fff'} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#444',
                }}>{`Confession ${'(0/3)'}`}</Text>
              <Text style={{color: '#444'}}>
                send gifts 3 times to get 400 coins
              </Text>
            </View>
          </TouchableOpacity>
          {/* item end */}
          {/* item start */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 15,
            }}>
            <View
              style={{
                backgroundColor: '#49cf76',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginHorizontal: 10,
              }}>
              <Ionicons name={'videocam'} size={30} color={'#fff'} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#444',
                }}>{`Video call ${'(0/300)'}`}</Text>
              <Text style={{color: '#444'}}>
                Video chat for 300sec to get 50 coins
              </Text>
            </View>
          </TouchableOpacity>
          {/* item end */}
          {/* item start */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 15,
            }}
            onPress={() => handleSharePopupToggle(true)}>
            <View
              style={{
                backgroundColor: '#49cf76',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginHorizontal: 10,
              }}>
              <Entypo name={'share'} size={30} color={'#fff'} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#444',
                }}>{`Share`}</Text>
              <Text style={{color: '#444'}}>
                share with friend to get +15 coins
              </Text>
            </View>
          </TouchableOpacity>
          {/* item end */}
        </View>
      </ScrollView>

      {isShareScreenOpen && (
        <SharePopup
          setIsShareScreenOpen={setIsShareScreenOpen}
          isShareScreenOpen={isShareScreenOpen}
        />
      )}
    </View>
  );
};

export default EarnFreeCoinScreen;
