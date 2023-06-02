import React from 'react';
import { View, TouchableOpacity, Image, Platform, StyleSheet, Text, Keyboard, AppState, SafeAreaView } from 'react-native';
import {  Bubble, Actions, Composer, Send, MessageImage, MessageText, Time, Day, GiftedChat } from 'react-native-gifted-chat';
import { observer, inject } from 'mobx-react';
import { strings } from '../../Locales/i18';
import images from '../../Themes/Images';
import metrics from '../../Themes/Metrics';
import { join, sendMessage, online, getAllMessages } from '../../Socket'
import socket from '../../Socket/socket';
import { getUserId, gettUserData } from '../../SupportingFIles/Utills';
import { getAllChatForUser, getUnreadChatCountFromALlChat, getChatForCampaignId, addMessage } from '../../Socket/ChatDb/LocalChatDb'
import MyImagePicker from '../../Components/MyImagePicker'
// import {uploadChatFile} from '../../API/Chat/APIChat'
import Loader from '../../SupportingFIles/Loader';
import colors from '../../Themes/Colors';
import { isIphoneXorAbove } from '../../SupportingFIles/Utills'
import messaging from '@react-native-firebase/messaging';
import { uploadImage } from '../../API/Campaign/ApiCampaign';
import Config from "react-native-config";
import LinearGradient from 'react-native-linear-gradient';
import { getCampaigndatabyid } from '../../API/Campaign/ApiCampaign';
import { renderInputToolbar, renderActions, renderComposer, renderSend } from './InputToolbar';
import FastImage from 'react-native-fast-image'

import Svg, {
  Path,
} from 'react-native-svg';
import moment from 'moment';
import { getBottomSpace, ifIphoneX } from 'react-native-iphone-x-helper';
class ChatDetail extends React.Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
    var d = new Date();
    //var intArray = new Uint32Array(1);
    //const randomNumber = Math.floor(crypto.getRandomValues(intArray));
    this.state = {
      userId: null,isError:false,
      messageArray: [],
      isLoading: false,
      text: '', height: 0,
      messages: [
        {
          _id: 1,
          text: '',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          image: 'https://placeimg.com/140/140/any',
          // You can also add a video prop:
          // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          // Mark the message as sent, using one tick
          sent: true,
          // Mark the message as received, using two tick
          received: true,
          // Mark the message as pending with a clock loader
          pending: true,
          // Any additional custom parameters are passed through
        },
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: d.setDate(d.getDate() - 1),
          user: {
            _id: 1,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.ChatStore.setIsOnChatDetail(true)
    console.log("recerverUserData:", this.props.route.params.recerverUserData)
    console.log("receiverUserProfile:", this.props.route.params.receiverUserProfile)
    
    const userDataToDisplay = this.props.route.params.recerverUserData
    var imageUrl = userDataToDisplay.avatar === null || userDataToDisplay.avatar === '' || userDataToDisplay.avatar === 'NA' ? images.userPlaceholder : { uri: userDataToDisplay.avatar }
    const receiverUserProfile = this.props.route.params.receiverUserProfile.profile !== undefined ?
      this.props.route.params.receiverUserProfile.profile : this.props.route.params.receiverUserProfile
    this.props.navigation.setOptions({
      //title: this.props.route.params.title
      headerTitle: (props) => ( // App Logo
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }}
          onPress={() => {
            Keyboard.dismiss()
            // if (this.props.route.params.receiverUserProfile) {
            //   this.props.navigation.navigate('UserProfile', { UserData: receiverUserProfile })
            // }
          }
          }>
            {this.state.isError==false &&<FastImage
        renderPlaceholder={this.renderPlaceholder}
        renderErrorImage={this.renderPlaceholder}
      // fallback
      onError={()=>{
        this.setState({isError:true})
      }}
        //defaultSource={images.KoliSquarePlaceholder}
        style={{ width: metrics.dimen_30, height: metrics.dimen_30, borderRadius: metrics.dimen_30 / 2, }}
        resizeMode='cover'
        source={imageUrl}
        />}
          {/* <Image
            style={{ width: metrics.dimen_30, height: metrics.dimen_30, borderRadius: metrics.dimen_30 / 2, }}
            source={imageUrl}
            resizeMode='cover'
          /> */}
          <Text style={styles.headerUserName} numberOfLines={1}>
            {this.props.route.params.title}</Text>
        </TouchableOpacity>

      ),
    })


    gettUserData().then(userData => {
      // console.log('user data value =', userData)
      this.setState({userData})
      // this.props.AuthStore.setFirstName(userData.first)
      // this.props.AuthStore.setLastName(userData.last)
      // this.props.AuthStore.setUserImage(userData.avatarUrl)
      // this.props.AuthStore.setUserName(userData.username)
    })
    getUserId().then(userid => {
      const chatObj = this.props.route.params.chatObj
      console.log('chatObj:', chatObj)
      // console.log('userid:',userid)

      if (chatObj != null) {
        if (parseInt(userid, 10) === parseInt(chatObj.userId, 10)) {
          // console.log('in 1')

          this.setState({ userId: parseInt(userid, 10), receiverUserId: parseInt(chatObj.receiverId, 10) })
        }
        else {
          this.setState({ userId: parseInt(userid, 10), receiverUserId: parseInt(chatObj.userId, 10) })
        }
        // console.log('userId:',this.state.userId )
        // console.log('receiverId:',this.state.receiverUserId )

      }
      else {
        this.setState({ userId: parseInt(userid, 10), receiverUserId: parseInt(this.props.route.params.receiverUserId, 10) })
      }

      const receiverUserId = this.state.receiverUserId
      const senderUserId = this.state.userId

      // console.log('this.props.receiverUserId:',this.props.route.params.receiverUserId )

      const roomId = receiverUserId > senderUserId ? `${parseInt(senderUserId, 10)}${parseInt(receiverUserId, 10)}` : `${parseInt(receiverUserId, 10)}${parseInt(senderUserId, 10)}`
      console.log('roomId:', roomId)
     // getAllMessages(roomId, 1618649496279, 1618649547271)
      //getAllMessages(roomId, 0, new Date().getTime())

      this.setState({ roomId: roomId.toString() })
      getAllChatForUser(roomId.toString()).then(chats => {
        getChatForCampaignId(roomId.toString(), parseInt(this.state.userId, 10)).then(campaignChats => {
          if (campaignChats.length > 0) {
            this.getCampaignData(campaignChats[0].campaignId, chats)
            this.setState({ campaignChatObj: campaignChats[0] })
          }
          else if (this.props.route.params.campaignId !== undefined) {
            this.getCampaignData(this.props.route.params.campaignId, chats)
          }
          else {
            this.setState({ messageArray: chats },()=>{
              const lastObj = chats[chats.length-1]
              if (lastObj !== undefined){
                const timeOfLast = new Date(lastObj.createdAt).getTime()
              
                getAllMessages(roomId, 0, timeOfLast)
              }
            
            })
          }
        })
        //   this.setState({messageArray:chats})
        //   getUnreadChatCountFromALlChat().then(chatsEntries => {
        //     console.log('getUnreadChatCountFromALlChat:',chatsEntries)
        //    this.props.ChatStore.updateUnreadConversations(chatsEntries.length)
        // })
        console.log('chats:',JSON.stringify(chats))
      })
    })

    this.props.ChatStore.clearMessages()
    socket.on('sendMessage', message => {
     // console.log('Response server chat detail:' + JSON.stringify(message))
      this.props.ChatStore.setMessages(message.message)
      //       let messageObj = this.state.messageArray.find(o => o.messageId === message.message.messageId);
      //       console.log('Response server messageObj:'+messageObj)
      // if(messageObj !== undefined)
      // {
      //   messageObj.pending=false

      // }
      // const messageArr = this.state.messageArray
      //  this.setState({ messageArray: [] }) 
      //  this.setState({ messageArray: messageArr }) 

      if (message.message.roomId === this.state.roomId && 
        this.state.messageArray.filter(e => e._id === message.message._id).length === 0) {
        this.setState({ messageArray: [message.message, ...this.state.messageArray] })
      }

    });
    this.props.navigation.setOptions({

      headerLeft: () => (
        <TouchableOpacity style={styles.backButtonContainer}
          onPress={() => {
            this.props.ChatStore.clearMessages()
            this.props.navigation.goBack()
          }}
        >
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
    })
    this.addSocketForSync()
  }
  addSocketForSync = () =>{
    socket.on('sync', message => {
      //console.log('Response online sync:' + JSON.stringify(message))
      // Alert.alert(JSON.stringify(message))
      let messageArr = message.map(el => {
        return {
          ...el,
          message : JSON.parse(el.reqmessagedata)
        }
      })
      let arrToAddInList = messageArr.map(el => el.message)
      console.log('Response online arrToAddInList:' + JSON.stringify(arrToAddInList))
      if(arrToAddInList.length>0)
      {
        this.setState({ messageArray: [...this.state.messageArray,...arrToAddInList] })
      }
      messageArr.forEach(element => {
          console.log('Response sync:',element)
          addMessage(element ,element.userId,element.receiverId,null)
      //  console.log('Response sync message:' + JSON.stringify(obj))
    });
  });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.props.ChatStore.setIsOnChatDetail(false)
  }
  renderPlaceholder = () =>{
    return (<Image source={images.KoliSquarePlaceholder}         style={{ width: metrics.dimen_30, height: metrics.dimen_30, borderRadius: metrics.dimen_30 / 2, }}

      />)

  }
  _handleAppStateChange = async (nextAppState) => {

    this.setState({ appState: nextAppState });

    if (nextAppState === 'background') {

      // Do something here on app background.
      console.log("App is in Background Mode.")
      socket.disconnect()
    }

    if (nextAppState === 'active') {

      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode.")
      socket.connect()
      const token = await messaging().getToken();
      join({ userId: this.state.userId, fcmToken: token })
      online({ userId: this.state.userId })

    }

    if (nextAppState === 'inactive') {
      socket.disconnect()
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };

  send(message) {
    const { firstName, lastName, userImage } = this.props.AuthStore
    const imageUrl = userImage == null || userImage === '' ? '' : userImage
    console.log(imageUrl)
    console.log(firstName)
    message.user = {
      _id: parseInt(this.state.userId, 10),
      name: firstName + ' ' + lastName,
      avatar: imageUrl,
    }
    message.userId = parseInt(this.state.userId, 10)
    message.receiverId = this.state.receiverUserId
    message.roomId = this.state.roomId
    message.messageId = message._id
    message.pending = false
    message.read = true
    message.senderData = this.state.userData
    if (this.state.campaignId !== undefined && this.state.campaignId !== '') {
      //console.log("this.state.campaignId:", this.state.campaignId)
      message.campaignId = parseInt(this.state.campaignId, 10)
    }
    //console.warn('this recerverUserData:' + JSON.stringify(this.props.route.params.recerverUserData))

    if (this.props.route.params.recerverUserData != null) {
      const receiverUserData = this.props.route.params.recerverUserData
      message.receiver = receiverUserData
      const receiverImageUrl = receiverUserData.avatar === null || receiverUserData.avatar === '' ? '' : receiverUserData.avatar
      message.receiver.avatar = receiverImageUrl

    }
    //Handling message send conditions for both Image and Text Messages

    if (message.messageType === undefined) {
      message.messageType = 'text'
      message.image = null
      message.pending = false
      sendMessage(message, this.state.userId, this.state.receiverUserId)
    }
    else {
      message.pending = false
      sendMessage(message, this.state.userId, this.state.receiverUserId)
      // setTimeout(() => {
      //   this.setState(prevState => ({
      //     messageArray: [message, ...prevState.messageArray]
      //   }), () => {
      //     sendMessage(message,this.state.userId,this.state.receiverUserId) 
      //   })
      //  }, 100)
    }

    //sendMessage(message,this.state.userId,this.state.receiverUserId) 
  }

  //Render Main View
  render() {
    return (
      <View style={styles.mainView}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

          <Image style={{ width: '100%', height: '100%', position: 'absolute' }} source={images.ChatBackground}></Image>
          {Platform.OS === 'android' &&
            <View style={[styles.overlay, { height: "100%" }]} />}

          <Loader loading={this.state.isLoading} />
          <MyImagePicker
          iscroppingEnabled={false}
            ref={ref => { this.sheet = ref }}
            width={metrics.width}
            height={metrics.width} />

          {this.state.userId != null && <GiftedChat

            messages={this.state.messageArray}
            //placeholder={strings('Write_a_message')}
            placeholder={''}

            onSend={message => this.send(message[0])}
            renderSend={this.renderSendButton}
            // renderMessage={this.renderMessage}
            bottomOffset={Platform.OS === "ios" && isIphoneXorAbove() ? metrics.dimen_12 : -metrics.dimen_14}

            renderInputToolbar={renderInputToolbar}
            //renderActions={renderActions}
            // renderComposer={renderComposer}
            //renderSend={renderSend}
            textInputProps={{textAlignVertical:'top',}}
          
           
            renderBubble={this.renderBubble}
            textInputStyle={styles.tfI}
            renderComposer={this.renderComposer}
            showUserAvatar={false}
            showAvatarForEveryMessage={false}
            
            renderAvatar={null}
           renderActions={this.renderAddImage}
            renderMessageImage={this.renderMessageImage}
            renderMessageText={this.renderMessageText}
            renderTime={this.renderTime}
            renderDay={this.renderMessageDay}
            //renderAvatarOnTop={true}
            user={{
              _id: parseInt(this.state.userId, 10),
            }}
          />}
        </SafeAreaView>

      </View>
    );
  }
  renderMessageDay = props => {
    return (
      <Day
        {...props}
        wrapperStyle={[props.containerStyle, { backgroundColor: '#DEDFEA', borderRadius: 4 }]}
        textStyle={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.getFontSize(13), color: '#545454', marginHorizontal: 5, marginVertical: 4 }}
      />);
  }
  renderMessageText(props) {
    return (
      <>
      <MessageText
        {...props}
        // wrapperStyle={[props.wrapperStyle,{backgroundColor:'red', borderColor:'red'}]}
        // containerStyle={[props.containerStyle]}
        textStyle={{
          left: [
            props.textStyle,
            {
              color: "black",
              // backgroundColor:'red', 
              marginRight: 70
            }
          ],
          right: [
            props.textStyle,
            { color: "black", marginRight: 70 }
          ],
        }}
      />
      <View style={{height:10}}/>
       <Time
          {...props}
          // wrapperStyle={[props.wrapperStyle,{backgroundColor:'red', borderColor:'red'}]}
          // containerStyle={[props.containerStyle]}
         
          containerStyle={{
            left: {
              // backgroundColor:"red",
              marginTop: -10,
              alignItems: 'flex-end'
            },
            right: {
              marginTop: -10
            }
          }}
          timeTextStyle={{
            right: {
              color: 'darkgrey',
              textAlign: 'right'
            },
            left: {
              color: 'darkgrey',
              textAlign: 'right',
            },
          }}
        />
      </>);
  }
  renderTime(props) {
    //console.log("renderTime:", props)
    if (props.currentMessage.image === null) {
      return (
        <Time
          {...props}
          // wrapperStyle={[props.wrapperStyle,{backgroundColor:'red', borderColor:'red'}]}
          // containerStyle={[props.containerStyle]}
         
          containerStyle={{
            left: {
              // backgroundColor:"red",
              marginTop: -10,
              alignItems: 'center'
            },
            right: {
              marginTop: -10
            }
          }}
          timeTextStyle={{
            right: {
              color: 'transparent',
              textAlign: 'right'
            },
            left: {
              color: 'transparent',
              textAlign: 'right',
            },
          }}
        />);
    }

  }

  renderMessageImage = props => {
    return (
      <View style={{ backgroundColor: "transparent", marginBottom: metrics.dimen_15 }}>

        <MessageImage
          {...props}
          containerStyle={[props.containerStyle, { width: metrics.widthSize(930), height: metrics.aspectRatioHeight(600) }]}
          imageStyle={{ width: "99%", height: "99%", marginBottom: 0, borderRadius: 3 }}
        />
        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']} style={{ height: 40, position: 'absolute', bottom: -4, left: 3, right: 0, borderRadius: 3, justifyContent: 'flex-end' }}>
          <Time
            {...props}
            // wrapperStyle={[props.wrapperStyle,{backgroundColor:'red', borderColor:'red'}]}
            // containerStyle={[props.containerStyle]}
            // position='left'
            containerStyle={{
              left: {
                // backgroundColor:"red",
                //marginTop:10,
                alignItems: 'center'
              },
              right: {
                //marginTop:10
              }
            }}
            timeTextStyle={{
              right: {
                color: 'white',
                textAlign: 'right'
              },
              left: {
                color: 'white',
                textAlign: 'right',


              },
            }}
          />
        </LinearGradient>

      </View>
    );
  }
  renderBubble = props => {
    //console.log("props renderBubble:", props)
    if (props.currentMessage.campaignData === undefined) {
      return (
        <View >
          {/* {this.renderName(props)} */}
          {/* {props.position === "right" && 
            <View style={styles.triangle}></View> } */}

          <Bubble {...props}
            // textStyle = {{color:"black"}}

            wrapperStyle={{
              left: {
                padding: metrics.dimen_4,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 1
                },
                shadowRadius: 5,
                shadowOpacity: 0.1,
                backgroundColor: props.currentMessage.image === null ? colors.white : "transparent",
                paddingVertical: 0,
                marginVertical: props.currentMessage.image === null ? Platform.OS === 'ios' ? metrics.dimen_2 : metrics.dimen_5 : 0,
                borderRadius: props.currentMessage.image === null ? metrics.dimen_12 : metrics.dimen_2,
                marginLeft: 10,
                //elevation:1
              },
              right: {
                padding: metrics.dimen_4,
                backgroundColor: props.currentMessage.image === null ? "#CAE1FF" : "transparent",
                paddingVertical:  0,
                marginVertical: props.currentMessage.image === null ? Platform.OS === 'ios' ? metrics.dimen_2 : metrics.dimen_5 : 0,
                borderRadius: props.currentMessage.image === null ? metrics.dimen_12 : metrics.dimen_2,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 1
                },
                shadowRadius: 5,
                shadowOpacity: 0.1,
                marginRight: 10,
              }
            }}

            // renderTime={() => null}
            containerStyle={{
              left: {},
              right: {},
            }} />
          {props.currentMessage.userId !== this.state.userId && props.currentMessage.image === null &&

            <Svg style={{
              marginLeft: Platform.OS === 'android' ? metrics.dimen_1 : 0,
              marginTop: Platform.OS === 'ios' ? -metrics.dimen_20 : -metrics.dimen_24,
              marginBottom: metrics.dimen_10,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 0,
              shadowOpacity: 0.1,
            }} width="13.486" height="13.673" viewBox="0 0 13.486 13.673">
              <Path
                id="Subtraction_9" data-name="Subtraction 9" d="M12.813,17.594h0C12.686,17.582.067,16.41,0,15.054c-.017-.349.8-.685,2.423-1a11.429,11.429,0,0,0,8.231-5.678,11.582,11.582,0,0,0,1.4-4.362l1.431-.094V17.368l-.672.226Z" 
                transform="translate(0 -3.921)" fill="#fff"
              />
            </Svg>}
          {props.currentMessage.userId === this.state.userId && props.currentMessage.image === null &&

            <Svg style={{
              alignSelf: 'flex-end',
              marginRight: Platform.OS === 'android' ? metrics.dimen_1 : 0,
              marginTop: Platform.OS === 'ios' ? -metrics.dimen_20 : -metrics.dimen_24,
              marginBottom: metrics.dimen_10,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 0,
              shadowOpacity: 0.1,
            }} width="13.486" height="13.673" viewBox="0 0 13.486 13.673">
              <Path
                id="Subtraction_9" data-name="Subtraction 9" 
                d="M.672,17.594h0c.127-.012,12.746-1.184,12.813-2.54.017-.349-.8-.685-2.423-1A11.429,11.429,0,0,1,2.831,8.376a11.582,11.582,0,0,1-1.4-4.362L0,3.92V17.368Z" 
                transform="translate(0 -3.92)" fill="#CAE1FF" />
            </Svg>}
        </View>
      );
    }
    else {
      const campaignData = props.currentMessage.campaignData
      return (
        <View >
          {/* {this.renderName(props)} */}
          {/* {props.position === "right" && 
        <View style={styles.triangle}></View> } */}

          <Bubble {...props}
            // textStyle = {{color:"black"}}

            wrapperStyle={{
              left: {
                backgroundColor: props.currentMessage.image === null ? colors.white : "transparent",
                borderRadius: props.currentMessage.image === null ? metrics.dimen_10 : metrics.dimen_2,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 0
                },
                shadowRadius: metrics.dimen_5,
                shadowOpacity: 0.1,
                marginLeft: metrics.dimen_10,
                marginTop: metrics.dimen_12
              },
              right: {
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 0
                },
                shadowRadius: metrics.dimen_5,
                shadowOpacity: 0.1,
                backgroundColor: props.currentMessage.image === null ? colors.white : "transparent",
                borderRadius: props.currentMessage.image === null ? metrics.dimen_10 : metrics.dimen_2,
                marginTop: metrics.dimen_12,
                marginRight: metrics.dimen_10,

              }
            }}
            renderMessageText={() => {
              if (props.currentMessage.userId !== this.state.userId) {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', }}
                  activeOpacity={1}
                  onPress={()=>
                    {
                      Keyboard.dismiss()
                      this.props.navigation.navigate('CampaignDetails', { data: campaignData })
                    }
                }
                  >
                    <View style={{ marginVertical: metrics.dimen_8, marginHorizontal: metrics.dimen_10, maxWidth:metrics.dimen_200 }}>
                      <Text style={{}} numberOfLines={2}>{campaignData.campaignTitle}</Text>
                      <Text style={styles.textCampaignId}>{strings('Campaign_ID')}: {campaignData.id}</Text>
                    </View>
                    <Image
                      resizeMode='cover'
                      style={{ width: metrics.dimen_50, height: '100%', marginLeft: metrics.dimen_5, borderTopRightRadius: metrics.dimen_5, borderBottomRightRadius: metrics.dimen_5 }}
                      source={{
                        uri: campaignData.campaignImage,
                      }}
                    />

                  </TouchableOpacity>
                )

              }
              else if (props.currentMessage.userId === this.state.userId) {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', backgroundColor:'#CAE1FF', borderRadius:  metrics.dimen_5,  }}
                  activeOpacity={1}
                  onPress={()=>
                    {
                      Keyboard.dismiss()
                      this.props.navigation.navigate('CampaignDetails', { data: campaignData })
                    }
                  }
                  >
                    <Image
                      resizeMode='cover'
                      style={{ width: metrics.dimen_50, height: '100%', borderTopLeftRadius: metrics.dimen_5, borderBottomLeftRadius: metrics.dimen_5 }}
                      source={{
                        uri: campaignData.campaignImage,
                      }}
                    />
                    <View style={{ marginVertical: metrics.dimen_8, marginHorizontal: metrics.dimen_10,maxWidth:metrics.dimen_200 }}>
                      <Text style={{}} numberOfLines={2}>{campaignData.campaignTitle}</Text>
                      <Text style={styles.textCampaignId}>{strings('Campaign_ID')}: {campaignData.id}</Text>
                    </View>


                  </TouchableOpacity>
                )

              }


            }}
            renderTime={null}
            containerStyle={{
              left: {},
              right: {},
            }} />
          {props.currentMessage.userId !== this.state.userId && props.currentMessage.image === null &&

            <Svg style={{
              marginTop: -metrics.dimen_20, marginBottom: metrics.dimen_15,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 0,
              shadowOpacity: 0.1,
              marginLeft: Platform.OS === 'ios' ? 0 : -metrics.dimen_1,
              //elevation:2,
              //borderRadius: 10,
              // zIndex:5
            }} width="13.486" height="13.673" viewBox="0 0 13.486 13.673">
              <Path
                //strokeWidth="0.5"
                //stroke="rgb(0,0,0,0.2)"
                id="Subtraction_9" data-name="Subtraction 9" d="M12.813,17.594h0C12.686,17.582.067,16.41,0,15.054c-.017-.349.8-.685,2.423-1a11.429,11.429,0,0,0,8.231-5.678,11.582,11.582,0,0,0,1.4-4.362l1.431-.094V17.368l-.672.226Z" transform="translate(0 -3.921)" fill="#fff"
              />
            </Svg>}
          {props.currentMessage.userId === this.state.userId && props.currentMessage.image === null &&

            <Svg style={{
              marginTop: -metrics.dimen_20, marginBottom: metrics.dimen_15,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 0,
              shadowOpacity: 0.1,
              alignSelf: 'flex-end',
              v: Platform.OS === 'ios' ? 0 : -metrics.dimen_1,
              //marginRight: -metrics.dimen_1,
            }} width="13.486" height="13.673" viewBox="0 0 13.486 13.673">
              <Path
                id="Subtraction_9" 
                data-name="Subtraction 9" 
                d="M.672,17.594h0c.127-.012,12.746-1.184,12.813-2.54.017-.349-.8-.685-2.423-1A11.429,11.429,0,0,1,2.831,8.376a11.582,11.582,0,0,1-1.4-4.362L0,3.92V17.368Z" 
                transform="translate(0 -3.92)" fill="#CAE1FF" />
            </Svg>}
        </View>)
    }

  };
  renderComposer = props => {
    //console.log('in rednerday:',props)
    return (
      <View style={{ backgroundColor: '#EDF1F7', width:'80%', borderWidth: 0.3,flexDirection:'row',padding:0,
       borderColor: '#D8D8D8',borderRadius:25}}>
      <Composer
        {...props}
        multiline={true}
        textInputStyle={{
          width: metrics.dimen_44,
          height: metrics.dimen_44,
          color: '#222B45',
          borderRadius: 25,
          backgroundColor: '#EDF1F7',
          borderColor: '#D8D8D8',
          paddingHorizontal: 8,
          marginRight: 10,
          marginLeft: 0,
          paddingLeft: 20,
          paddingBottom:0

        }}
      />
      </View>);
  };
  renderAddImage = props => {
    return (
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => this.showImagePicker()} >
        <Image
          style={styles.imagePlus}
          source={images.plusIcon}
        />
      </TouchableOpacity>
    );
  };
  renderSendButton = props => {

    return (
      <Send
        {...props}
        disabled={!props.text}
        containerStyle={[styles.plusButton, { alignItems: 'center' }]}
      >
        <Image
          style={{ width: 20, height: 17 }}
          source={images.ChatSendButton}
        />
      </Send>
    )
    // return (
    //   <TouchableOpacity 
    //   style={styles.plusButton}
    //    onPress={()=>
    //     {
    //       console.log('props:',props)
    //       const message = {};
    //       message._id = this.messageIdGenerator();
    //      message.createdAt = new Date();
    //      message.messageType = "text";
    //      message.text=props.text;
    //      this.send(message)
    //     }

    //    } >
    //   <Image
    //   style={styles.imagePlus}
    //   source={images.ChatSendButton}
    //   />
    //   </TouchableOpacity>
    // );
  };
  renderAction = props => {
    return (<Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Image
          style={{ width: 15, height: 15 }}
          source={images.plusIcon}
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library');
        },
        Cancel: () => {
          console.log('Cancel');
        },
      }}
      optionTintColor="#222B45"
    />)
  }
  renderAvatar = props => {
    console.log(this.state.userId)
    const { userImage } = this.props.AuthStore
    var imageUrl = userImage == null || userImage === '' ? images.koliIcon : { uri: userImage }
    if (this.state.userId !== props.currentMessage.userId) {
      const receiverImage = this.props.route.params.recerverUserData.avatar
      imageUrl = receiverImage == null || receiverImage === '' ? images.koliIcon : { uri: receiverImage }
    }
    return (
      <Image
        style={styles.imageAvatar}
        source={imageUrl}
      />
    );
  };

  renderName = props => {
    //console.warn(JSON.stringify(props))

    return (
      <View style={styles.bubbleMainView}>
        <View style={styles.bubbleSubView}>
          {props.currentMessage.image == null &&
            <Text style={styles.bubbleMessage}>
              {/* {`${user.name}`} */}
              {props.currentMessage.text}
              {/* {props.currentMessage.image} */}
            </Text>}
          {props.currentMessage.image != null &&
            <Image source={{ uri: props.currentMessage.image }}
              style={styles.bubbleImage}></Image>}
        </View>
        {/* <Text style={{ color: "grey",color:'black',fontSize:5,marginTop:5 }}>
        fgdfgdf 
    </Text> */}
      </View>
    );
  };
  renderLoading() {
    if (!this.state.messages.messageArray && !this.state.fetchChats) {
      return (
        <View style={{ marginTop: 100 }}>
          {/* <ActivityIndicator color="black" animating size="large" /> */}
        </View>
      );
    }
  }
  showImagePicker = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      this.sheet.openSheet().then(image => {
        // const stamp = Math.floor(Date.now() * 1000)
        // let intArray = new Uint32Array(1);
        // const randomNumber = Math.floor(crypto.getRandomValues(intArray));
        // const picName = stamp.toString() + randomNumber.toString() + '.png'
        // let file = {
        //   uri: image.path,
        //   name: picName,
        //   type: image.mime
        // }
        this.setState({ isLoading: true })
        const param = { base64ImageData: image.data, folderPath: "chat" + "/" + this.state.userId, bucketName: Config.CHAT_BUCKET }

        uploadImage(param).then(response => {
          const message = {};
          message._id = this.messageIdGenerator();
          message.createdAt = new Date();
          message.image = response.data.path;
          message.messageType = "image";
          message.text = '';
          this.send(message)
          this.setState({ isLoading: false })


        }).catch(error => {
          this.setState({ isLoading: false })
          console.log("uploadImage data response =", error)
        })


        // uploadChatFile('chat', file).then(res => {
        //   console.log('res:',res)
        //   if (res) {
        //     //let photos = this.state.uploadedPhoto
        //    // let imagePicked = { name: image.path, value: picName }
        //     const message = {};
        //   message._id = this.messageIdGenerator();
        //  message.createdAt = new Date();
        //  message.image = res.headers.Location;
        //  message.messageType = "image";
        //  message.text='';
        //  this.send(message)
        //  this.setState({isLoading:false})

        //   } else {

        //     showAlert('', strings('SomethingWentWrong'))
        //   }
        // })

      })
    }, 700);
  }

  messageIdGenerator() {
    // generates uuid.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      var intArray = new Uint32Array(1);
      const randomNumber = Math.floor(crypto.getRandomValues(intArray));
      let r = (randomNumber * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  getCampaignData = (campaignid, chats) => {
    this.setState({isLoading:true})
    getCampaigndatabyid(campaignid).then(response => {

      console.log("response:", response)
      const addMessagesToArr = [...chats]
      var campaignId = ''
      const { status, data } = response
      if (status && data !== undefined) {
        const { firstName, lastName, userImage } = this.props.AuthStore
        const imageUrl = userImage == null || userImage === '' ? '' : userImage
        console.log(imageUrl)
        console.log(firstName)
        const campaignMessage = {};
        campaignMessage._id = this.messageIdGenerator();
        // campaignMessage.createdAt = new Date();
        campaignMessage.messageType = "text";
        campaignMessage.image = null;
        campaignMessage.text = data.campaignTitle;
        campaignMessage.roomId = this.state.roomId
        campaignMessage.pending = false
        campaignMessage.read = true
        campaignMessage.campaignData = data
        //     campaignMessage.user = {
        //   _id: parseInt(this.state.receiverUserId,10),
        //   name: this.props.route.params.receiverUserProfile.first+' '+this.props.route.params.receiverUserProfile.last,
        //   avatar: this.props.route.params.receiverUserProfile.avatarUrl,
        // }
        const campaignChatObj = this.state.campaignChatObj
        console.log("campaignChatObj:", campaignChatObj)
        if (campaignChatObj !== undefined) {
          if (campaignChatObj.userId === this.state.userId) {
            campaignMessage.userId = parseInt(this.state.userId, 10)
            campaignMessage.receiverId = parseInt(this.state.receiverUserId, 10)
            campaignMessage.user = {
              _id: parseInt(this.state.userId, 10),
            }
          }
          else {
            campaignMessage.userId = parseInt(this.state.receiverUserId, 10)
            campaignMessage.receiverId = this.state.userId
            campaignMessage.user = {
              _id: parseInt(this.state.receiverUserId, 10),
            }
          }
        }
        else if (this.props.route.params.campaignId !== undefined) {
          campaignMessage.userId = parseInt(this.state.userId, 10)
          campaignMessage.receiverId = parseInt(this.state.receiverUserId, 10)
          campaignMessage.user = {
            _id: parseInt(this.state.userId, 10),
          }
        }



        addMessagesToArr.push(campaignMessage)
        campaignId = parseInt(data.id, 10)
      }

      this.setState({ messageArray: addMessagesToArr, campaignId,isLoading:false })
      getUnreadChatCountFromALlChat().then(chatsEntries => {
        console.log('getUnreadChatCountFromALlChat:', chatsEntries)
        this.props.ChatStore.updateUnreadConversations(chatsEntries.length)
      })

    }).catch(error => {
      this.setState({isLoading:false})
      //this.setLoading(false)
      console.log("campain data  =", error)
    })
  }
}


const styles = StyleSheet.create({

  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS === 'android' ? metrics.dimen_6 : 0
  },
  mainView:
  {
    flex: 1
  },
  plusButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: metrics.dimen_44,
    height: metrics.dimen_44,
    // backgroundColor:'green'
  },
  imagePlus: {
    //marginLeft:metrics.dimen_10,
    alignSelf: 'center',
    width: metrics.dimen_14,
    height: metrics.dimen_14,
    tintColor: colors.app_Blue
  },
  imageAvatar: {
    width: metrics.dimen_32,
    height: metrics.dimen_32,
    borderRadius: metrics.dimen_16
  },
  bubbleMainView:
  {
    marginTop: 10
  },
  bubbleSubView: {
    backgroundColor: '#1658D3',
    borderRadius: metrics.dimen_20
  },
  bubbleMessage: {
    paddingHorizontal: metrics.dimen_20,
    paddingVertical: metrics.dimen_10,
    alignSelf: "center",
    color: colors.white
  },
  bubbleImage: {
    color: "grey",
    paddingHorizontal: metrics.dimen_20,
    paddingVertical: metrics.dimen_10,
    alignSelf: "center",
    width: metrics.dimen_200,
    height: metrics.dimen_200,
    borderRadius: 5
  },
  tfI: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    paddingTop: metrics.dimen_8,
    // backgroundColor:'red',

  },
  triangle: {
    right: -6,
    bottom: 0,
    position: 'absolute',
    borderTopWidth: 7,
    borderRightWidth: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.app_Blue,
  },
  headerUserName: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(16),
    marginLeft: 10,
    textTransform: 'capitalize',
    width: Platform.OS === 'ios' ? metrics.dimen_130 : metrics.dimen_190,
    textAlignVertical: 'center'
  },
  textCampaignId: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(10),
    color: colors.bankInfoListTitle,
    marginTop: metrics.dimen_4
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.1,
    backgroundColor: '#000000',
    width: "100%"
  }



})

export default inject("ChatStore", "AuthStore")(observer(ChatDetail))