import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDZGaMiBR-ucXbfDcg0LHcesacAqJ31SqQ',
  authDomain: 'chatapp-afd58.firebaseapp.com',
  projectId: 'chatapp-afd58',
  storageBucket: 'chatapp-afd58.appspot.com',
  messagingSenderId: '832683992723',
  appId: '1:832683992723:web:26dbde1301af7396630f66',
  measurementId: 'G-D4R8FNTB8M'
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;
