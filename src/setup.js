import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
// import storage from '@react-native-firebase/storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '552698976617-bo58b37asq9pjfocpjq9otu8mf9b0vlv.apps.googleusercontent.com',
});

const firebaseConfig = {
  apiKey: 'AIzaSyC8qPx9AxMzPoKaePad1YfmcppgxhpUq1U',
  authDomain: 'amber-9e965.firebaseapp.com',
  projectId: 'amber-9e965',
  storageBucket: 'amber-9e965.appspot.com',
  messagingSenderId: '552698976617',
  appId: '1:552698976617:web:10b9dc524e15c58e7485f8',
  measurementId: 'G-YF62FVQC92',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default () => {
  return {
    firebase,
    auth,
    // database, storage
  };
};
