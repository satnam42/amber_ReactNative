// import React, {useState, useEffect, useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// // import Image from 'react-native-image-progress';
// import ProgressPie from 'react-native-progress/Pie';

// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {ScrollView} from 'react-native-gesture-handler';
// import Spin from 'react-native-spinkit';
// let audioRecorderPlayer = null;
// const Test = () => {
//   const [recordSecs, setRecordSecs] = React.useState(null);
//   const [recordTime, setRecordTime] = React.useState(null);
//   const [currentPositionSec, setCurrentPositionSec] = React.useState(null);
//   const [currentDurationSec, setCurrentDurationSec] = React.useState(null);
//   const [playTime, setPlayTime] = React.useState(null);
//   const [duration, setDuration] = React.useState(null);

//   const askForPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);
//         console.log('write external stroage', grants);
//         if (
//           grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants['android.permission.READ_EXTERNAL_STORAGE'] ===
//             PermissionsAndroid.RESULTS.GRANTED &&
//           grants['android.permission.RECORD_AUDIO'] ===
//             PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log('Permissions granted');
//         } else {
//           console.log('All required permissions not granted');
//           return;
//         }
//       } catch (err) {
//         console.warn(err);
//         return;
//       }
//     }
//   };

//   const audioRecorderInit = () => {
//     audioRecorderPlayer = new AudioRecorderPlayer();
//     console.log(audioRecorderPlayer);
//   };

//   const onStartRecord = async () => {
//     const result = await audioRecorderPlayer.startRecorder();
//     audioRecorderPlayer.addRecordBackListener(e => {
//       setRecordSecs(e.currentPosition);
//       setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//       return;
//     });
//     console.log(result);
//   };

//   const onStopRecord = async () => {
//     const result = await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//     setRecordSecs(0);
//     console.log(result);
//   };

//   const onStartPlay = async () => {
//     console.log('onStartPlay');
//     const msg = audioRecorderPlayer.startPlayer();
//     console.log(msg);
//     audioRecorderPlayer.addPlayBackListener(e => {
//       setCurrentPositionSec(e.currentPosition);
//       setCurrentDurationSec(e.duration);
//       setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//       setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
//       return;
//     });
//   };

//   const onPausePlay = async () => {
//     console.log('onPausePlay');
//     await audioRecorderPlayer.pausePlayer();
//   };

//   const onStopPlay = async () => {
//     console.log('onStopPlay');
//     audioRecorderPlayer.stopPlayer();
//     audioRecorderPlayer.removePlayBackListener();
//   };
//   const imagex =
//     'https://images.unsplash.com/photo-1655930145107-2612b76cd2da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80';
//   return (
//     <ScrollView style={{flex: 1, minHeight: '100%'}}>
//       <View style={styles.container}>
//         <Text> - - - - - T E S T - - - - - - - </Text>

//         <Image
//           source={{
//             uri: imagex,
//           }}
//           onProgress={ProgressPie}
//           style={{width: '100%', height: 600}}
//           resizeMode="cover"
//         />
//         {/* <Image
//           source={{uri: 'http://loremflickr.com/640/480/dog'}}
//           indicator={ProgressBar}
//           style={{
//             width: 320,
//             height: 240,
//           }}
//         /> */}
//       </View>
//     </ScrollView>
//   );
//   return (
//     <ScrollView style={{flex: 1}}>
//       <View style={styles.container}>
//         <Spin type="9CubeGrid" isVisible={true} color="red" size={30} />
//         <Spin type="Arc" isVisible={true} color="red" size={30} />
//         <Spin type="Bounce" isVisible={true} color="red" size={30} />
//         <Spin type="ChasingDots" isVisible={true} color="red" size={30} />
//         <Spin type="CircleFlip" isVisible={true} color="red" size={30} />
//         <Spin type="Circle" isVisible={true} color="red" size={30} />
//         <Spin type="FadingCircleAlt" isVisible={true} color="red" size={30} />
//         <Spin type="FadingCircle" isVisible={true} color="red" size={30} />
//         <Spin type="Plane" isVisible={true} color="red" size={30} />
//         <Spin type="Pulse" isVisible={true} color="red" size={30} />
//         <Spin type="ThreeBounce" isVisible={true} color="red" size={30} />
//         <Spin type="WanderingCubes" isVisible={true} color="red" size={30} />
//         <Spin type="Wave" isVisible={true} color="red" size={30} />
//         <Spin type="WordPress" isVisible={true} color="red" size={30} />
//         <Text> - - - - - - - - - - - - </Text>
//         <Text>recordTime: {recordTime}</Text>
//         <Text>recordSecs: {recordSecs}</Text>
//         <Text>currentPositionSec: {currentPositionSec}</Text>
//         <Text>currentDurationSec: {currentDurationSec}</Text>
//         <Text>playTime: {playTime}</Text>
//         <Text>duration: {duration}</Text>
//         <Text> - - - - - - - - - - - - </Text>

//         <TouchableOpacity onPress={() => askForPermission()}>
//           <Text>askForPermission</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => audioRecorderInit()}>
//           <Text>audioRecorderInit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onStartRecord()}>
//           <Text>onStartRecord</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onStopRecord()}>
//           <Text>onStopRecord</Text>
//         </TouchableOpacity>

//         <Text> - - - - - - - - - - - - </Text>
//         <TouchableOpacity onPress={() => onStartPlay()}>
//           <Text>onStartPlay</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onPausePlay()}>
//           <Text>onPausePlay</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onStopPlay()}>
//           <Text>onStopPlay</Text>
//         </TouchableOpacity>
//         <Text> - - - - - - - - - - - - </Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default Test;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 10,
//   },
// });

// ? --- IAP ------ //

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import IAP, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
// import * as RNIap from 'react-native-iap';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
const ImageX = 'https://wallpaperaccess.com/full/43867.jpg';
const items = Platform.select({
  ios: [],
  android: [
    '1amber',
    '2amber',
    '3amber',
    '4amber',
    '5amber',
    '6amber',
    '7amber',
  ],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const Test = () => {
  const [purchased, setPurchased] = React.useState(false);
  const [products, setProducts] = React.useState();

  const handleMount = async () => {
    const res = await IAP.initConnection();
    console.log(res, 'initConnection');
    IAP.getProducts(items)
      .then(productList => {
        console.log(productList, 'HERE---- listofconsole');
        setProducts(productList);
      })
      .catch(error => {
        console.log(error.message);
      });

    IAP.flushFailedPurchasesCachedAsPendingAndroid()
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
          console.log('????S?F?DFD?  purchaseUpdatedListener', purchase);
          const receipt = purchase?.transactionReceipt;
          console.log(receipt, '????S?F?DFD?');
        });
        purchaseErrorSubscription = purchaseErrorListener(error => {
          console.log('purchaseErrorListener', error);
        });
      });
  };

  const handleUnMount = async () => {
    purchaseUpdateSubscription.remove();
    purchaseErrorSubscription.remove();
    IAP.endConnection();
  };
  const buyPro = async sku => {
    // Purchase
    try {
      await IAP.requestPurchase(sku, false);
    } catch (err) {
      console.warn(err.code, err.message);
    }
    // Subscription
    // try {
    //   await RNIap.requestSubscription(sku);
    // } catch (err) {
    //   console.warn(err.code, err.message);
    // }
  };

  React.useEffect(() => {
    handleMount();
    return () => {
      handleUnMount();
    };
  }, []);

  console.log(products, 'products');
  return (
    <View style={{marginTop: 100}}>
      {products &&
        products.map(item => {
          return (
            <View key={item?.productId}>
              <TouchableOpacity onPress={() => buyPro(item?.productId)}>
                <Text>ID : {item?.productId}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
};

export default Test;
