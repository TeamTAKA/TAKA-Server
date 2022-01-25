const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyBZqvC1hPvM56XYcY03Wm_5VKEvhTL3MkY',
  authDomain: 'taka-1dd38.firebaseapp.com',
  projectId: 'taka-1dd38',
  storageBucket: 'taka-1dd38.appspot.com',
  messagingSenderId: '163208334064',
  appId: '1:163208334064:web:92cef572aa6fb5c4579035',
  measurementId: 'G-3DVYYEHDRB',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

module.exports = { firebaseApp, firebaseAuth, firebaseConfig };
