/**
 * @format
 */

import {AppRegistry,Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values'
import messaging from '@react-native-firebase/messaging';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.warn('Message handled in the background!', remoteMessage);
  });
  
AppRegistry.registerComponent(appName, () => App);
