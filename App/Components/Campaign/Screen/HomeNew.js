import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, RefreshControl, TouchableOpacity, Image, Alert, Platform, Linking } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import images from '../../../Themes/Images'
import { commonStyles, FBACampaignEntity } from '../../../SupportingFIles/Constants';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import { join, online } from '../../../Socket/index'
import { getUserId, checkLocationPermission, getGeoCode, getParams,convertCurrencybyCode } from '../../../SupportingFIles/Utills';
import messaging from '@react-native-firebase/messaging';
import { getUnreadChatCountFromALlChat, doMigration, addMessage } from '../../../Socket/ChatDb/LocalChatDb'
import socket from '../../../Socket/socket';
import AwesomeAlert from 'react-native-awesome-alerts';
import Geolocation from 'react-native-geolocation-service';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ChatIconHeader from '../../CommonComponents/ChatIconHeader'


import { useScrollToTop } from '@react-navigation/native';
// import analytics from '@react-native-firebase/analytics';
import { logClick, logCustom } from '../../../API/Analytics/Firebase';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var context = null
// import { getSectionName, SectionName } from './HomeNew/HomeNewDataHandler';

const formatCurrency = new Intl.NumberFormat('en-US')


@inject('CompaignsStore', 'AuthStore', 'ChatStore', 'NotificationStore',"HomeStore")
@observer
class HomeNew extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({ notiCount: 5 })
    this.state = {
      timer: null,
      searchvisible: false,
      backpagefalse: false,
      url: "",
      initialArr: [
        {
          id: 1,
          color: colors.app_Blue,
          text: "Loading..."
        },
        {
          id: 2,
          color: "red",
          text: "Loading..."
        },
        {
          id: 3,
          color: "red",
          text: "Loading..."
        },
        {
          id: 4,
          color: "red",
          text: "Loading..."
        },
      ]

    };
    context = this
    
  }


  handleDynamicLink=(link)=>{
    const params = getParams(link)
        setTimeout(() => {  
     this.props.AuthStore.navigationTabObj.navigate('CampaignDetails', { data: {id:params.params}, 
   })
   }, 100);
      
  }

  componentDidMount() {
    dynamicLinks().getInitialLink().then(url => {
     
     });
this.unsubscribe = dynamicLinks().onLink(url => {

  this.handleDynamicLink(url.url)
});
  this.props.HomeStore.setUserLoginID("")

    this.props.NotificationStore.getAllNotificationList()
    this.props.AuthStore.setNavigationTabObj(this.props.navigation)
    
    this.updateUser()
    doMigration()
    this.setupUserLastSeen()
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_15, flexDirection: 'row', }}>
          <TouchableOpacity onPress={() => this.SearchOnOf()} >
            <Image source={images.search} />
          </TouchableOpacity>
         
          {/* <NotificationIconHeader navigation={this.props.navigation} /> */}
          <ChatIconHeader navigation={this.props.navigation} />

        </View>
      ),
      // headerStyle: { top: 10 },
      headerShown: true,
      headerTransparent: true,
      height: 20,
      headerLeft: () => (
        <View style={{ marginLeft: metrics.dimen_15, flexDirection: 'row', }} >
          <Image source={images.headerlogo_ios} />
        </View>
      )

    })


    // this.props.navigation.addListener('focus', () => {
      
    //   //  store.setupdatedsearch('')
    //   //  store.getAppliedCampaignsStatus()

    // });
    this.props.HomeStore.getCampaignsPaid()
    this.props.HomeStore.getCampaignsshoutout()
    this.props.HomeStore.getCampaignssponsored()
    this.props.HomeStore.getCampaignsCommissionBased()
    this.props.HomeStore.getCampaignsEventsAppearence()
    this.props.HomeStore.getCampaignsPhotoshootVideo()
    this.props.CompaignsStore.getAndCheckAppVersion()
    this.props.CompaignsStore.doupdatedeviceinfo()
    this.joinToChat()
    setTimeout(() => {
      this.getLocation()

    }, 10);


    getUserId().then(userid => {
      this.props.HomeStore.setUserLoginID(userid)
    })
    this.props.HomeStore.getUserFollowesList()
  }

  _onRefresh = () => {
    this.props.HomeStore.getCampaignsPaid()
    this.props.HomeStore.getCampaignsshoutout()
    this.props.HomeStore.getCampaignssponsored()
    this.props.HomeStore.getCampaignsCommissionBased()
    this.props.HomeStore.getCampaignsEventsAppearence()
    this.props.HomeStore.getCampaignsPhotoshootVideo()
  }

  setupUserLastSeen() {
    let timer = setInterval(this.updateUser, 300000);
    this.setState({ timer });
  }
  updateUser = () => {
    this.props.AuthStore.updateUserLastSeen()
  }
  getLocation = async () => {
    const hasLocationPermission = await checkLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const initialPosition = JSON.stringify(position);
          console.log('User Location: ', initialPosition)
          if (this.props.AuthStore.isLogin) {
            const userParamsToUpdate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
            this.props.CompaignsStore.updateUserProfileData(userParamsToUpdate)
            if (this.props.AuthStore.userlocationcountry === "") {
              this.getUserCountryfromLocation(position.coords.latitude, position.coords.longitude)

            }

          }
        },
        (error) => {
          this.setState({ loading: false });
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best'
          },
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };


  getUserCountryfromLocation = async (latitude, longitude) => {
  var location_response = await getGeoCode(latitude + ',' + longitude)
    if (location_response) {

      let country = location_response.results[0].address_components.find(item => item.types[0] === 'country')
      if (country) {
        console.log('country.long_name==', country.long_name)
        this.props.AuthStore.setuserlocationcountry(country.long_name)

      }
    }
  }


  joinToChat = async () => {
    const token = await messaging().getToken();
    const chatStore = this.props.ChatStore

    getUserId().then(userid => {
      join({ userId: userid, fcmToken: token })
      online({ userId: userid })
      //this.getTotalUnreadMessages()
    })
    //this.getTotalUnreadMessages()
    socket.on('sendMessage', message => {
      //Alert.alert(JSON.stringify( JSON.stringify(message)))
      if (message !== null) {
        getUserId().then(userid => {
          console.warn('chtStore.isOnChatDetail:', chatStore.isOnChatDetail)
          if (parseInt(userid, 10) === parseInt(message.receiverId, 10) && !chatStore.isOnChatDetail) {
            console.warn('Response sendMessage:' + JSON.stringify(message))
            // console.warn('userid receiverId:'+userid,message.receiverId)
            message.message.read = false
          }
          addMessage(message, message.userId, message.receiverId, null)
          getUnreadChatCountFromALlChat().then(chats => {
            console.log('getUnreadChatCountFromALlChat sendMessage:', JSON.stringify(chats))

            chatStore.unreadConversations = chats.length
            chatStore.updateUnreadConversations(chats.length)
          })
        })

      }

    });

    
    socket.on('join', message => {
      this.getTotalUnreadMessages()
    });
    socket.on('online', message => {
      this.getTotalUnreadMessages()
    });
  }
  getTotalUnreadMessages = () => {
    getUnreadChatCountFromALlChat().then(chats => {
      //  console.log('getUnreadChatCountFromALlChat:', chats)
      if (chats !== undefined && chats !== null) {
        this.props.ChatStore.updateUnreadConversations(chats.length)
      }
    })
  }
  componentDidUpdate(nextProps) {
    if (this.props.CompaignsStore.isLoading !== nextProps.CompaignsStore.isLoading) {
      this.forceUpdate()

    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.unsubscribe();

  }
  SearchOnOf() {
    this.props.navigation.navigate('CampaignSearch')
    //this.setState({ searchvisible: this.state.searchvisible === false ? true : false })
  }

  OpenMyCampaign() {
    this.props.AuthStore.isLogin ? this.props.navigation.navigate('MyCompaign', { screen: 'MyCompaign' }) : this.props.navigation.navigate('AuthStack')

  }

  UpdateSerch = search => {
    const store = this.props.CompaignsStore
    store.setupdatedsearch(search)

  };
  render() {


    const {  compaignsList, isLoading,isAppUpdate,  compaignsListPaid ,
      compaignsListShoutout,
      compaignsListsponsored,
      compaignsListcommissionBased,
      compaignsListeventsAppearence,
      compaignsListphotoshootVideo,isRefreshinghome} = this.props.HomeStore
    return (

      <View style={styles.containerTop}>
        {/* <StatusBar backgroundColor='white' barStyle="dark-content" translucent={true} /> */}
        <Image source={images.Homepage} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />

        <AwesomeAlert
          show={isAppUpdate}
          showProgress={false}
          title= {strings("Mandatory_KOLI_App_Update")}
          message={strings("In_order_to_continue_you_must_update")}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          //cancelText="UPDATE"
          confirmText="UPDATE"
          confirmButtonColor="#1658D3"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            //this.hideAlert();
            this.handleAppUpdate()
          }}
        />

        <View style={{ height:Platform.OS === 'ios'? metrics.dimen_90:metrics.dimen_50 }}></View>
        

        <KeyboardAwareScrollView
         refreshControl={<RefreshControl
          colors={["#9Bd35A", "#689F38"]}
          refreshing={isRefreshinghome}
          onRefresh={this._onRefresh} />}
        >

      {this.renderAddCampaignButton()}
      {compaignsListPaid && compaignsListPaid.length > 0 && this.renderSection(strings('Paid_Post'), 'paid', compaignsListPaid)}
      {this.renderSection(strings('Commission_based'), 'commissionBased', compaignsListcommissionBased)}   
      {/* {this.renderSection(strings('Video_endorsement'), 'photoshootVideo', compaignsListphotoshootVideo)} */}
      {/* {this.renderSection(strings('Events_Appearance'), 'eventsAppearence', compaignsListeventsAppearence)} */}
      {this.renderSection(strings('Product_Sponsor'), 'sponsored', compaignsListsponsored)}
      {this.renderSection(strings('Shoutout_Exchange'), 'shoutout', compaignsListShoutout)}
     
     {!isLoading && compaignsList.length == 0 ? this.renderNoJobs() : null}
          <View style={{  marginVertical:metrics.dimen_20,justifyContent:'center',alignItems:'center',}} >
          <Text style={styles.stayTuned}>{"Stay tuned for more!"}</Text>


          </View>
        </KeyboardAwareScrollView>


      </View>
    );
  }
  renderAddCampaignButton = () =>{
    return(
      <TouchableOpacity style={{ alignItems:'center', 
      justifyContent:'center', 
      height: metrics.dimen_40,
      flexDirection: 'row', backgroundColor: colors.white, 
      marginTop: 10,
      marginHorizontal: metrics.dimen_15,
      shadowColor: "#4E575E",
      shadowOpacity: 0.04,
      shadowOffset: {width: 2, height: 2},}}
      onPress={() => this.props.AuthStore.isLogin ?        
        this.props.navigation.navigate('CreateCampaignForm', { type: 'Add' })
        : this.props.navigation.navigate('AuthStack')}>
                  <Image source={images.plusIcon} 
                  style={{width: metrics.dimen_10, 
                  height: metrics.dimen_10, tintColor: colors.app_Blue}}/>
                  <Text style={{marginLeft: metrics.dimen_7, color: colors.app_Blue,
                  fontFamily: metrics.Lato_Bold, fontSize: metrics.text_13}}>
                    {strings("Create_campaign")}
                    </Text>
      </TouchableOpacity>
    )
  }

  renderSection = (sectionTitle,sectionType, campaignData) =>{
    if(campaignData === null || campaignData.length>0)
    {
      var subtitle = " | Campaigns"
      if (sectionType !== 'paid'){
         subtitle = " | For Campaigns"
      }
      return(
        <>
         <View
            style={styles.campaignTypeheader}>
            <Text style={styles.campaignType}>{sectionTitle}
            {/* <Text style={{...styles.campaignText}}>{subtitle}</Text> */}
            </Text>
            {campaignData !== null && campaignData.length>3 && <TouchableOpacity
              onPress={() =>this.props.navigation.navigate('CampaignViewAll', {type: sectionType,campaignList:campaignData})
              }>
              <Text
                style={{
                  ...styles.showAlltext,
                  alignSelf: 'center',
  
                }}>
                {strings('See_all')}
                  </Text>
            </TouchableOpacity>}
          </View>
  
         <FlatList
            style={{
              height: metrics.dimen_205,
              flexGrow: 0,
            }}
            onScroll={this.handleScroll}
            ref={this.props.scrollRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
  
            data={campaignData === null ? this.state.initialArr : campaignData}
            renderItem={({ index,item }) => campaignData === null ?
            this.renderPlaceholder() : this.renderCompaign(index,item)
          }
            keyExtractor={(item, index) => index.toString()}
            
           
            // refreshControl={
            //   <RefreshControl
               
            //     onRefresh={this._onRefresh}
            //   />
            // }
          />
        </>
      )
    }
    
  }
  handleAppUpdate() {
    const linkToOpen = Platform.OS === 'ios' ?
      "itms-apps://itunes.apple.com/us/app/id1458269685?mt=8." : "http://play.google.com/store/apps/details?id=co.koli.android"
    Linking.canOpenURL(linkToOpen).then(supported => {
      supported && Linking.openURL(linkToOpen);
    }, (err) => console.log(err));
  }

  renderCompaign = (index, item) => {
    return (
      <View style={[styles.cellContainer, index === 0 && {marginLeft: metrics.dimen_10}]}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('CampaignDetails', { data: item })
            // logEvent(item)
            logClick(item.id, FBACampaignEntity)
            logCustom(item.id, item.campaignType, item.campaignTitle)
          }

          }
        >
          <FastImage
            style={styles.imageEmptyComponent}
            source={{ uri: item.campaignImage }}

          />
          <View style={{ marginHorizontal: metrics.dimen_10, marginVertical: metrics.dimen_10 }}>
            <Text numberOfLines={2} style={{ ...styles.boldText, marginBottom: metrics.dimen_8, width: 100,height:metrics.dimen_25 }}>{item.campaignTitle}</Text>
            {(item.campaignType!== "commissionBased"&&item.campaignType!== "shoutout") &&
            <Text style={{ ...styles.boldText, color: "#4E8BFE"}}>
              {convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}
              </Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderPlaceholder = () =>{
    return (
          <SkeletonPlaceholder>
           <View style={styles.cellContainer}>
       
          <View
            style={styles.imageEmptyComponent}

          />
          <View style={{ height: metrics.dimen_20}}>
        
          </View>
      </View>
        </SkeletonPlaceholder>
    );
  }
 
  renderNoJobs() {
    const store = this.props.CompaignsStore

    return (
      <View style={{
        alignItems: 'center', height: '70%', justifyContent: 'center',
        marginBottom: 100
      }}>
        <Image source={images.Campaign} />
        <Text style={{ ...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40 }}>{store.updatedsearch === '' ? store.FilterApply == true ? strings('No_Campaigns_available_matching_your_filters') : strings('No_Campaigns_Available') : strings('No_Campaigns_available_matching_your_search')}</Text>


      </View>)
  }

  updateAppNotice() {

    Alert.alert(
      strings("Update_Available"),
      strings("this_version_of_the_app_is_outdated") + (Platform.OS == 'ios' ? 'app store' : 'play store') + '.',
      [
        {
          text: 'Update Now', onPress: () => {
            if (Platform.OS == 'ios') {
              Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err));
            }
            else {
              Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('An error occurred', err));
            }
          }
        },
      ]
    );
  }
}
export default function (props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <HomeNew {...props} scrollRef={ref} />;
}
const styles = StyleSheet.create({
  containerTop: {
    flex: 1,

  },

  showAlltext: {
    fontSize: metrics.text_12,
    color: "#3E3E46",
    fontFamily: metrics.Lato_Bold,
  },

  campaignText: {
    fontSize: metrics.text_medium,
    color: "#7C8AA5",
    fontFamily: metrics.Lato_Regular,
  },

  emptyListContainer: {
    justifyContent: 'center',
    alignItems: "center"
  },
  imageEmptyComponent: {
    width: metrics.widthSize(440),
    height: metrics.widthSize(440),
    

  },
campaignTypeheader:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: metrics.dimen_15,
  marginBottom: metrics.dimen_13,
  marginHorizontal: metrics.dimen_10
},
campaignType:{
  color: "#3E3E46",
  fontFamily: metrics.Lato_Bold,
  fontSize: metrics.dimen_16,
},
stayTuned:{
  color: 'rgba(189, 189, 199, 1)',
  fontFamily: metrics.Lato_Bold,
  fontSize: metrics.dimen_16,

},
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(61, 64, 70, 1)',
  },

  
  boldText: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_small,
    color: 'rgba(61, 64, 70, 1)',
  },
 
  cellContainer: {
    marginRight: metrics.dimen_10,
    backgroundColor: colors.white,
    height: metrics.dimen_205,
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: metrics.dimen_2 },
    shadowOpacity: 0.4,
    marginBottom: metrics.dimen_3,
    elevation: metrics.dimen_6,
   
  },
 
  tagTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_13,
    color: '#7A818A',
    marginTop: -metrics.dimen_2,
    marginHorizontal: metrics.dimen_10,

  },
  tagTextStyleios: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: 'white',
    marginTop: metrics.widthSize(20),
    marginLeft: -10
  },


})