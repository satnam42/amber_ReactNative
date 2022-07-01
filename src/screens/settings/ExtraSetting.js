import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import HeaderBackTitle from '../../components/HeaderBackTitle';
import {Toggle} from '@ui-kitten/components';
import {TabBarContext} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExtraSettings = ({navigation}) => {
  const {tabSettings, setTabSettings} = React.useContext(TabBarContext);

  const saveToLocal = async bool => {
    try {
      await AsyncStorage.setItem(
        'tabContext',
        JSON.stringify({blurTabMode: bool}),
      );
      const data = await AsyncStorage.getItem('tabContext');
      console.log(data, 'll');
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlurChange = () => {
    if (tabSettings?.blurTabMode) {
      setTabSettings({
        ...tabSettings,
        blurTabMode: false,
      });
      saveToLocal(false);
    } else {
      setTabSettings({
        ...tabSettings,
        blurTabMode: true,
      });
      saveToLocal(true);
    }
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBackTitle title={'Extra Settings'} navigation={navigation} />
      <ScrollView style={styles.notificationContainer}>
        <View
          style={[
            styles.notificationList,
            {
              marginBottom: 20,
            },
          ]}>
          <Text style={styles.notificationText}>Transparent Tabbar</Text>
          <Toggle
            status="success"
            onChange={handleBlurChange}
            checked={tabSettings?.blurTabMode}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ExtraSettings;

const styles = StyleSheet.create({
  notificationContainer: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  notificationList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  notificationText: {
    backgroundColor: '#49cf76',
    fontSize: 17,
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    minWidth: 200,
    textAlign: 'center',
  },
});
