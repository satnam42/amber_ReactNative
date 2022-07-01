import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {colors} from '../../constants';
import GetPaidView from './GetPaidView';
import ShopView from './ShopView';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {useSelector} from 'react-redux';
import ShowCoinCount from '../../components/ShowCoinCount';

const ShowGemCount = ({gemCount}) => {
  return (
    <View
      style={{
        // width: 100,
        padding: 10,
        // backgroundColor: 'red'
      }}>
      {/* tray */}

      {/* gem */}
      <Image
        source={require('../../assets/icons/shop/gem.png')}
        style={{
          width: 50,
          height: 50,
          marginHorizontal: 10,
          resizeMode: 'contain',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 18,
          right: -36,
          zIndex: 2,
        }}
      />
      <View
        style={{
          backgroundColor: 'orange',
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          top: 16,
          left: 14,
          height: 35,
          paddingRight: 20,
        }}>
        <Text
          style={{
            color: '#fff',
            padding: 10,
            fontSize: 13,
            fontWeight: 'bold',
          }}>
          {gemCount}
        </Text>
      </View>
    </View>
  );
};

const ShopHeader = ({navigation}) => {
  const {coin} = useSelector(state => state);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {Platform.OS === 'ios' && (
        <>
          <Image
            source={require('../../../ios/Assets/BackButton.png')}
            style={{
              width: 40,
              height: 40,
              marginLeft: 10,
            }}></Image>

          <Text
            style={{
              fontSize: 25,
              marginRight: 'auto',
              marginLeft: 5,
            }}>
            Shop
          </Text>
        </>
      )}
      {Platform.OS === 'android' && (
        // <HeaderBackTitle
        //   color={colors.bgWhite}
        //   navigation={navigation}
        //   title={'Shop'}
        //   disableBack={true}
        // />
        <View
        // onPress={() => {
        //   navigation.navigate('GiftShop');
        // }}
        >
          <Text
            style={{
              color: colors.bgWhite,
              fontSize: 25,
              fontWeight: 'bold',
              marginLeft: 25,
            }}>
            Shop
          </Text>
        </View>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          maxWidth: 200,
        }}>
        {/* gem */}
        {/* <ShowGemCount gemCount={3000000000} /> */}
        {/* coin */}
        {coin?.loading ? (
          <View style={{width: 100, height: 10}}>
            <ActivityIndicator
              size="small"
              style={{position: 'absolute', top: 15, right: 25}}
            />
          </View>
        ) : (
          <ShowCoinCount coinCount={coin?.currectCoin || 0} />
        )}
      </View>
    </View>
  );
};
const GetPaidHeader = ({navigation, onBackPress}) => {
  return (
    <HeaderBackTitle
      navigation={navigation}
      color={colors.bgWhite}
      title={'Get Paid'}
      onBackPress={onBackPress}
    />
  );
};

const midTabs = ['SHOP', 'GET_PAID'];
const Shop = ({navigation, route}) => {
  const [activeMinNav, setActiveMinNav] = useState('SHOP');
  const [paymentStatus, setPaymentStatus] = useState(false);

  React.useEffect(() => {
    if (route?.params?.paymentStatus) {
      setPaymentStatus(true);
    }
  }, [route]);

  const handleMidNavChange = midTabName => {
    setActiveMinNav(midTabName);
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: colors.darkPurpleColor,
        paddingBottom: 70,
      }}>
      {activeMinNav === midTabs[0] ? (
        <ShopHeader navigation={navigation} />
      ) : (
        <GetPaidHeader
          navigation={navigation}
          onBackPress={() => setActiveMinNav('SHOP')}
        />
      )}
      {/* MidNav Start*/}
      <View
        style={{
          alignItems: 'center',
          marginTop: 15,
        }}>
        {/* <View style={styles.midNav.box}>
          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[0])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                marginLeft: 2,
                backgroundColor:
                  activeMinNav === midTabs[0]
                    ? '#f6af00'
                    : colors.midPurpleColor,
              }}>
              Shop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[1])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                backgroundColor:
                  activeMinNav === midTabs[1]
                    ? '#f6af00'
                    : colors.midPurpleColor,
              }}>
              Get Paid
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* MidNav END */}

      {/* DYNAMIC BODY */}
      <View style={{flex: 1, marginTop: 20}}>
        {activeMinNav === midTabs[0] ? (
          <ShopView navigation={navigation} paymentStatus={paymentStatus} />
        ) : (
          <GetPaidView />
        )}
      </View>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  midNav: {
    box: {
      backgroundColor: colors.midPurpleColor,
      height: 40,
      minWidth: 150,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderRadius: 50,
    },
  },
});
