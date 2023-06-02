import React, { Component } from 'react';
import { StyleSheet, Platform, ImageBackground,Linking,useEffect} from 'react-native';
import images from '../Themes/Images';
import { isUserLoggedin, gettUserData,showFlashBanner, getUserId ,getParams, getChatDataFetched, setChatDataFetched} from '../SupportingFIles/Utills';
import {observer, inject} from 'mobx-react';
import messaging from '@react-native-firebase/messaging';
import { join } from '../Socket/index'
import dynamicLinks from '@react-native-firebase/dynamic-links';

class Splash extends Component {
  constructor(props) {
    super(props);
    getChatDataFetched().then(isFetched=>{
      console.log("getChatDataFetched:",isFetched)
      if(!isFetched){
        setChatDataFetched('false')
      }
    })
    
        isUserLoggedin().then(isLoggedIn =>{
          // console.log('is login value =', isLoggedIn)
          setTimeout(() => {
            this.props.AuthStore.setIsFirstLaunch(false)
            if (isLoggedIn) {
                this.props.AuthStore.setIsLogin(true)
                gettUserData().then(userData => {
                  // console.log('user data value =', userData)
                  this.props.AuthStore.setFirstName(userData.first)
                  this.props.AuthStore.setLastName(userData.last)
                  this.props.AuthStore.setUserImage(userData.avatarUrl)
                  this.props.AuthStore.setUserName(userData.username)
                })
            }else{
                this.props.AuthStore.setIsLogin(false)
            }

          

          }, 1000);
        })
        this.initiateMessageHandlers()


     dynamicLinks()
    .getInitialLink()
    .then(link => {
      console.warn("Splash.js: firebase link", link)
      if(link!=null)
      {
        

        this.handleDynamicLink(link)
      
       
      }
     });
  }

  
  render() {
    // if (Platform.OS === 'ios')
    //   return null
    return (
      <ImageBackground style={styles.splash}
        source={images.splash} /> 
    );
  }
  initiateMessageHandlers = () =>{
   
    messaging().onMessage(async remoteMessage => {
      if(this.props.AuthStore.isLogin && !this.props.ChatStore.isOnChatDetail)
      {
        showFlashBanner(remoteMessage.notification.title,remoteMessage.notification.body)
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      this.notificationRedirection(remoteMessage)
     
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          //showFlashBanner(remoteMessage.notification.title,remoteMessage.notification.body)
          this.notificationRedirection(remoteMessage)

        }
      });
  }
  notificationRedirection = (remoteMessage) =>{
    console.log('notificationRedirection:',remoteMessage)
    if(remoteMessage.data.message !== undefined){
    //  getUserId().then(userid => {

        const messageObj = JSON.parse(remoteMessage.data.message) 
        console.log('notificationRedirection:',messageObj)

        const recerverUserData = {
          _id: parseInt(messageObj.userId,10),
          name:messageObj.message.senderData.first+''+messageObj.message.senderData.last,
          avatar: messageObj.message.senderData.avatarUrl
        }

        const userProfileReceiver=messageObj.message.senderData

       // join({ userId: userid })
       setTimeout(() => {
         console.log('notificationRedirection:',recerverUserData)
        this.props.AuthStore.navigationTabObj.navigate('ChatDetail', { receiverUserId: parseInt(messageObj.userId,10), 
          recerverUserData: recerverUserData, 
          title: recerverUserData.name,
          campaignId: messageObj.message.campaignId,
          receiverUserProfile:userProfileReceiver })
      }, 1500);
       

    //  })
     // this.props.AuthStore.navigationTabObj.navigate('ChatListing')
      //this.props.navigation.navigate('ChatTab');
    }
    else if(remoteMessage.data.body === undefined)
    {
    //   setTimeout(() => {
    //     this.props.AuthStore.navigationTabObj.navigate('ChatListing')
    //  }, 1500);
     setTimeout(() => {
      this.props.NotificationStore.setReloadPage(true)
      if(this.props.AuthStore.navigationTabObj !== null)
      {
        this.props.AuthStore.navigationTabObj.navigate('NotificationTab')
      }
    }, 1500);
    }
    else
    {
      setTimeout(() => {
        this.props.NotificationStore.setReloadPage(true)
        if(this.props.AuthStore.navigationTabObj !== null)
        {
          this.props.AuthStore.navigationTabObj.navigate('NotificationTab')
        }
      }, 1500);

      //this.props.navigation.navigate('NotificationTab');

    }
  }

  //   else if(remoteMessage.data.body === undefined)
  //   {
  //     setTimeout(() => {
  //       this.props.AuthStore.navigationTabObj.navigate('ChatListing')
  //    }, 1500);
  //   }
  //   else
  //   {
  //     setTimeout(() => {
  //       this.props.NotificationStore.setReloadPage(true)
  //       if(this.props.AuthStore.navigationTabObj !== null)
  //       {
  //         this.props.AuthStore.navigationTabObj.navigate('NotificationTab')
  //       }
  //     }, 1500);

  //     //this.props.navigation.navigate('NotificationTab');

  //   }
  // }
handleDynamicLink=(link)=>{
  const params = getParams(link.url)
  
  setTimeout(() => {
    
   this.props.AuthStore.navigationTabObj.navigate('CampaignDetails', { data: {id:params.params}, 
 })
 }, 1500);
  
 
}
 
}

export default inject("AuthStore","ChatStore","NotificationStore","CompaignsStore")(observer(Splash))

const styles = StyleSheet.create({
    splash: {
      flex: 1,
      resizeMode: 'cover'
    }
  })
