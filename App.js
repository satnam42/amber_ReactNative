import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {LogBox} from 'react-native';
import 'react-native-gesture-handler';
// redux
import store from './src/redux/store';
import {Provider} from 'react-redux';
import {StripeProvider} from '@stripe/stripe-react-native';
// ui kitten start
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
// ui kitten end
import SignupProvider from './src/context/SignupContext';
import Routes from './src/router';

import {colors, STRIPE_PUBLISH_KEY} from './src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'react-native-gesture-handler',
]);

export const TabBarContext = React.createContext();
export const MultiStepSignUpContext = React.createContext();

const App = () => {
  const [tabSettings, setTabSettings] = React.useState({
    blurTabMode: false,
    showTabBar: true,
  });
  const [multiSetpSignUpObj, setMultiSetpSignUpObj] = React.useState(null);

  const retriveLocalValues = async () => {
    //TabContext
    try {
      const data = await AsyncStorage.getItem('tabContext');
      setTabSettings(JSON.parse(data));
    } catch (error) {
      console.log(error, 'TabContext');
    }
  };

  console.log({multiSetpSignUpObj}, 'MultiStepSignUpContext');
  console.log(tabSettings, 'tabSettings');

  useEffect(() => {
    retriveLocalValues();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={colors.amberColor} />
      <TabBarContext.Provider value={{tabSettings, setTabSettings}}>
        <MultiStepSignUpContext.Provider
          value={{multiSetpSignUpObj, setMultiSetpSignUpObj}}>
          <Provider store={store}>
            <StripeProvider
              publishableKey={STRIPE_PUBLISH_KEY}
              urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
              merchantIdentifier="merchant.identifier">
              <NativeBaseProvider>
                <ApplicationProvider {...eva} theme={eva.light}>
                  <SignupProvider>
                    <SafeAreaView style={styles.container}>
                      <Routes />
                    </SafeAreaView>
                  </SignupProvider>
                </ApplicationProvider>
              </NativeBaseProvider>
            </StripeProvider>
          </Provider>
        </MultiStepSignUpContext.Provider>
      </TabBarContext.Provider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
