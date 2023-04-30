// Import the functions you need from the SDKs you need
import firebase from '@react-native-firebase/app';



const firebaseConfig = {
  apiKey: 'AIzaSyAlFmHGPiZC-XXlfQN37zbz5gV6dYDAsrU',
  authDomain: 'workerfirebase-f1005.firebaseapp.com',
  projectId: 'workerfirebase-f1005',
  storageBucket: 'workerfirebase-f1005.appspot.com',
  messagingSenderId: '74243864435',
  appId: '1:74243864435:web:12e09f662e9b96816cf706',
  measurementId: 'G-7N3D9JHVKK',
  databaseURL: 'gs://workerfirebase-f1005.appspot.com/',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



// if (__DEV__) {
// let emulatorHost = 'http://localhost';
//   if (Platform.OS === 'android') {
//     emulatorHost = 'http://124.120.205.238';
//   }
//   firebase.functions().useEmulator(emulatorHost, 5001);
//   firebase.auth().useEmulator(`${emulatorHost}:9099`);

//   console.log('emulator' + emulatorHost);
// }

console.log('App name: ', firebase.app().name);

export default firebase;
