/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import store from './App/Stores/RootStore'
import { StatusBar,  } from 'react-native';
//import AppContainer from './App/Routes';
import AppContainer from './App/Navigations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import FlashMessage from "react-native-flash-message";
import Config from "react-native-config";
const Yellowwarninbox = Config.Yellowwarninbox


export default class App extends Component {


  async componentDidMount() {
    //crashlytics().crash()
     crashlytics().setCrashlyticsCollectionEnabled(true)   
     this.requestUserPermission()
    // messaging().onMessage(onMessageReceived);-
    // messaging().setBackgroundMessageHandler(onMessageReceived);
  }


  render() {
   
    console.disableYellowBox = Yellowwarninbox;

    return (
      <Provider {...store}>
        <StatusBar backgroundColor='white' barStyle="dark-content"/>
        <AppContainer />
        {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
        <FlashMessage position="top" />
      </Provider>
    );

  }

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getFcmToken() 
    }
  }

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    } else {
     console.log("Failed==", "No token received");
    }
  }
  
}
