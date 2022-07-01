import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import History from './MidTabViews/History';
import Random from './MidTabViews/Random';
import AmberClub from './MidTabViews/AmberClub';
import ShowCoinCount from '../../components/ShowCoinCount';
import {useDispatch, useSelector} from 'react-redux';
import {COIN_REDUCER_REFRESH} from '../../redux/reducers/actionTypes';
import {NavigationContext, useNavigation} from '@react-navigation/core';
const midTabs = ['AMBER_CLUB', 'RANDOM', 'HISTORY'];
import ProfileReview from '../../components/ProfileReview';
import {getUserCoin} from '../../redux/actions/coin.actions';
import {getBlockList} from '../../redux/actions/block.action';

const HomeScreen = ({route, activeTab = 'AMBER_CLUB'}) => {
  const [isProfileReviewActive, setIsProfileReviewActive] =
    React.useState(false);

  const [activeMinNav, setActiveMinNav] = useState(
    route?.params?.activeTab ? route?.params?.activeTab : activeTab,
  );
  const navigation = useNavigation();

  const {coin, auth} = useSelector(state => state);
  const dispatch = useDispatch(null);

  if (coin?.error) {
    Alert.alert('Failed', coin?.error);
    dispatch({type: COIN_REDUCER_REFRESH});
  }

  useEffect(() => {
    if (route?.params?.activeTab) {
      setActiveMinNav(route?.params?.activeTab);
    } else {
      setActiveMinNav(activeTab);
    }
  }, []);

  console.log({activeMinNav});

  const handleMidNavChange = midTabName => {
    setActiveMinNav(midTabName);
  };

  const forceProfileReview = () => {
    console.log('CHECKING COUNTRY', auth);
    if (!auth?.user?.country) {
      setIsProfileReviewActive(true);
    }
    if (auth?.user?.country === 'Select Country...') {
      setIsProfileReviewActive(true);
    }
  };

  React.useEffect(() => {
    // forceProfileReview();  :(
    // navigation.navigate('Test');
  }, []);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          minHeight: 40,
          alignItems: 'flex-end',
          width: '100%',
          paddingBottom: 20,
        }}>
        {coin?.loading ? (
          <ActivityIndicator
            size="small"
            style={{position: 'absolute', top: 15, right: 25}}
          />
        ) : (
          <ShowCoinCount coinCount={coin?.currectCoin || 0} />
        )}
      </View>
      {/* mid Nav Start */}
      <View
        style={{
          alignItems: 'center',
        }}>
        <View style={styles.midNav.box}>
          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[0])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                backgroundColor:
                  activeMinNav === midTabs[0] ? '#f6af00' : '#222',
              }}>
              Amber club
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
                  activeMinNav === midTabs[1] ? '#f6af00' : '#222',
              }}>
              Random
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleMidNavChange(midTabs[2])}>
            <Text
              style={{
                color: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 50,
                backgroundColor:
                  activeMinNav === midTabs[2] ? '#f6af00' : '#222',
              }}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* mid Nav END */}

      {/* DYNAMIC VIEW  START*/}
      {activeMinNav === midTabs[0] && <AmberClub />}
      {activeMinNav === midTabs[1] && <Random />}
      {activeMinNav === midTabs[2] && <History />}
      {/* DYNAMIC VIEW  END*/}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  midNav: {
    box: {
      backgroundColor: '#222',
      height: 40,
      width: wp(85),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: 50,
    },
  },
});
