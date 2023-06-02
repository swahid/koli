import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image'
import { commonStyles } from '../../../SupportingFIles/Constants'
import metrics from '../../../Themes/Metrics';
import ReadMore from 'react-native-read-more-text';
import { observer, inject } from 'mobx-react';
import Loader from '../../../SupportingFIles/Loader';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import images from '../../../Themes/Images';
import Moment from 'moment'
import { getUserId, Numberformatesunit, getUserCorrentLocation, calculateDistance, checkLocationPermission,convertCurrencybyCode } from '../../../SupportingFIles/Utills';
import { Switch } from 'react-native-paper';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import { join } from '../../../Socket/index'
import { Media_Base_URL } from '../../../API/Campaign/ApiCampaign';
import ActionSheet from 'react-native-actionsheet'
import MakeOffer from './MakeOffer'
import Geolocation from 'react-native-geolocation-service';
import ReadMoreText from '../../CommonComponents/ReadMoreLess'
const formatCurrency = new Intl.NumberFormat('en-US')
import ApplicantTab from '../../Campaign/Screen/ApplicantTab/ApplicantTab'
import SuggestedApplicantTab from '../../Campaign/Screen/ApplicantTab/SuggestedApplicantTab'
import ShortListedTab from '../../Campaign/Screen/ApplicantTab/ShortListedTab'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HiredTab from './ApplicantTab/HiredTab';

class ApplicantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      selectedTab: 1,
      isSwitchOn: false,

      selecetdItem:null,
      tabs:[{tabName:"Applications", isSelected:true},
      {tabName:"Suggested", isSelected:false},
      {tabName:"Shortlisted", isSelected:false},
        {tabName:"Hired", isSelected:false}
    ]

    };
  }

  componentDidMount() {
    
    this.props.navigation.addListener('focus', () => {
      //this.getLocation()

      //this.props.ApplicantListStore.getApplicantList(954)
      //this.props.ApplicantListStore.getApplicantList(this.props.route.params.JobData.id)
    });
   // this.props.ApplicantListStore.getApplicantList(this.props.route.params.JobData.id)
    this.props.navigation.setOptions({
     // title: this.props.route.params.JobData.campaignTitle,
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: metrics.dimen_15 }} onPress={() => this.props.navigation.goBack()}>
          <Image source={images.backImage} />
        </TouchableOpacity>
      )
    })
    this.setSwitchData()
  }

  getLocation = async () => {
    const hasLocationPermission = await checkLocationPermission();

    if (!hasLocationPermission) {
      return;
    }
    this.props.ApplicantListStore.setisLoading(true)

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude, loading: false })
          console.log(position);
          //this.Apply()
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
         // enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
         // distanceFilter: 0,
          //forceRequestLocation: this.state.forceLocation,
         // showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };
  getAndSetUserLocation = ( ) =>{
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        //this.setState({initialPosition});
        console.log('User Location: ', initialPosition)
        if (position.coords.latitude !== null) {
            this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        }
        else {
          this.getAndSetUserLocation()
        }
      },
      error => {return error},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  setSwitchData = () =>{
    const data = this.props.route.params.JobData

    if (data.isDisabled === 1) {
      this.setState({ isSwitchOn: false })
    } else {
      this.setState({ isSwitchOn: true })

    }
  }
 
  componentWillUnmount() {
   // this.props.ApplicantListStore.setApplicantList([])
    //this.props.ApplicantListStore.setSuggestedList([])
  }
  render() {

    const store = this.props.ApplicantListStore
    const { isLoading } = store
    
  console.log("this.state.selectedTab",this.state.selectedTab)
    return (
      <KeyboardAwareScrollView>
      <View style={{ flex: 1, backgroundColor: colors.white }}>
          <MakeOffer modalVisible={true} 
          itemData = {this.state.selectedItem !== undefined ? this.state.selectedItem : null}
          hideMarkAsCompletedButton={() => this.hideMarkAsCompletedButton()}
                />
        <Loader loading={isLoading} />
        {this.renderHeader()}
        {/* {
        this.state.selectedTab===1?
        <ApplicantTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}
        ></ApplicantTab>

        :this.state.selectedTab===2?<SuggestedApplicantTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}

        ></SuggestedApplicantTab>:

       <ShortListedTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}

        ></ShortListedTab>
        } */}
    {this.renderSelectedTabData()}
        {/* <FlatList
        ref={(ref) => { this.flatList = ref }} 
        //  ref={(ref) => this.flatList = ref}
         onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          key={this.state.selectedTab}
          ListEmptyComponent={this.noItemDisplay}
          numColumns={this.state.selectedTab === 2 ? 2 : 0}
          data={
            this.state.selectedTab === 2 ? suggestedUsers : 
            (this.state.selectedTab === 1 ? applicantListData : hiredInfluencersList)
          }
          renderItem={({ item, index }) =>
          {
            if(this.state.selectedTab === 2)
            {
              return this.renderSuggestedApplicant(item, index)
  
            }
            else
            {
             return this.renderApplicantsNew(item,index)
            }
          }
          }
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.renderHeader}

        /> */}
        <View style={{ height: metrics.dimen_25 }}></View>
      </View></KeyboardAwareScrollView>
    );
  }
  renderSelectedTabData = () =>{
    const campaignData = this.props.route.params.JobData

    if(this.state.selectedTab===1 ){
      return (
        <ApplicantTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}
        isHired={this.state.selectedTab === 4 ? true : false}
        />
      )
    }
    else if(this.state.selectedTab===2){
      return (
        <SuggestedApplicantTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}
        />
      )
    }
    else if(this.state.selectedTab===3){
      return (
        <ShortListedTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}
       />
      )
    }
    // else if(campaignData.campaignType !== "commissionBased"&&campaignData.campaignType !== "shoutout"&& this.state.selectedTab===4){
    else if(this.state.selectedTab===4){
  
    return (
        <HiredTab
        JobData={this.props.route.params.JobData}
        navigation={this.props.navigation}
       />
      )
    }
  } 
  handleScroll = (event) => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
   }
  noItemDisplay = ( ) =>{
    return (
      <View style={styles.emptyListContainer}>
         <FastImage
            style={styles.imageEmptyComponent}
            source={images.emptyList}
            resizeMode={FastImage.resizeMode.cover}
          />
        <Text style={styles.labelEmptyList}>
          
          {this.state.selectedTab === 3 ?  strings('Not_yet_appointed_any_of_their_influencers') : strings('No_Applications_Yet')}
          </Text>
      </View>
    )
  }
  renderSeperator() {
    return (
      <View style={{ ...styles.seperatorStyle, marginHorizontal: metrics.dimen_20, marginVertical: metrics.dimen_15 }} />
    )
  }
  _onToggleSwitch = () => {

    this.setState(state => ({ isSwitchOn: !state.isSwitchOn })

    );
    const data = this.props.route.params.JobData
    if (!this.state.isSwitchOn) {
      // Alert.alert(
      //   strings('Enablecampaign'),
      //   strings('Are_you_surewanttoenable'),
      //   [
      //       {text: strings('No'), onPress: () => console.log('No Pressed')},
      //       {text: strings('Yes'), onPress: () => {
      //           this.props.CompaignsStore.getupdatecampaign(data.id,0)

      //       },style: 'destructive'},
      //   ],
      //   { cancelable: true }
      // );
      this.props.CompaignsStore.getupdatecampaign(data.id, 0)
    } else {
      Alert.alert(
        strings('Disablecampaign'),
        strings('Are_you_surewanttodisabel'),
        [
          { text: strings('No'), onPress: () => this.resetbutton() },
          {
            text: strings('Yes'), onPress: () => {
              this.props.CompaignsStore.getupdatecampaign(data.id, 1)

            }, style: 'destructive'
          },
        ],
        { cancelable: true }
      );
    }

  }

  resetbutton() {
    this.setState({ isSwitchOn: true })
  }
  renderSuggestedApplicant = (item,index) =>{
    const urlPic = item.avatarUrl
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
    console.log(JSON.stringify(item))
    const userName = item.username.replace("@", "")
    console.log("index renderSuggestedApplicant",JSON.stringify(index))
    const followersCount = item.followers !== null ? item.followers : '0'
    const postsCount = item.totalPosts !== null ? item.totalPosts : '0'

    return(
      <View style={styles.viewContainerSuggestedView}>
        <TouchableOpacity style={styles.viewImageSuggestedView}
        onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item })}
        >
          <FastImage
            style={styles.imageUserSuggestedView}
            source={imageUrl}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity style={styles.viewMessageContainer}
          onPress={()=>
            getUserId().then(userid => {
              const recerverUserData = {
                _id: parseInt(item.ownerId,10),
                name:(item.first ? item.first : '') + " " + (item.last ? item.last : ''),
                avatar: urlPic
              }
      
              join({ userId: userid })
              this.props.navigation.navigate('ChatDetail', { receiverUserId: parseInt(item.ownerId,10), 
                recerverUserData: recerverUserData, 
                title: recerverUserData.name,
                campaignId: this.props.route.params.JobData.id,
                receiverUserProfile:item  })
      
            })
          }
          >
            <Text style={styles.textMessageButton}>{strings('Message')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.viewDetailsSuggested}>
        <Text style={styles.textName}>{(item.first ? item.first : '') + " " + (item.last ? item.last : '')}</Text>
        <Text style={styles.textUserName}>@{userName}</Text>
        <View style={styles.instagramView}>
          <FastImage
            style={styles.instagramIcon}
            source={images.instaIcon}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View>
            <Text style={styles.textFollowersCount}>{Numberformatesunit(followersCount)}</Text>
            <Text style={styles.labelFollowersPosts}>{strings('Followers')}</Text>
          </View>
          {/* <View style={styles.viewVerticalLine}/>
          <View>
            <Text style={styles.textFollowersCount}>{Numberformatesunit(postsCount)}</Text>
            <Text style={styles.labelFollowersPosts}>{strings('Posts')}</Text>
          </View> */}
        </View>
        </View>
        

      </View>
    )

  }
  renderApplicantsNew = (item,index) => {
    //console.log('renderApplicant:', JSON.stringify(item))
    //   offerStatus 
// 0 - No action taken
// 1 - Pending
// 2 - Accepted
// 3 - Declined

const campaignData = this.props.route.params.JobData
const applicantsStore =  this.props.ApplicantListStore
var offerIcon = images.PendingOffer
var textOffer = strings('Pending_offer_for')
var styleOfferView = [styles.viewOfferStatus, {backgroundColor: colors.offerYellow}]
if(item.offerStatus === 2)
{
  offerIcon = images.jobAwarded
  textOffer = strings('Accepted_offer_for')
  styleOfferView = [styles.viewOfferStatus, {backgroundColor: colors.offerGreen}]
}
else if(item.offerStatus === 3)
{
  offerIcon = images.RejectedOffer
  textOffer = strings('Rejected_offer_for')
  styleOfferView = [styles.viewOfferStatus, {backgroundColor: colors.offerRed}]
}

  // const remarkTextDecoded = item.remarkText.replace('% ', 'percent')
  // console.log('decode resmark:',decodeURIComponent(remarkTextDecoded))
  var remarkTextDecoded = item.remarkText;
  //remarkTextDecoded = remarkTextDecoded.toString().replace(/~~pct~~/g,'%');    
  try {
     remarkTextDecoded = decodeURI(item.remarkText);
    remarkTextDecoded = remarkTextDecoded.toString().replace(/~~pct~~/g,'%');    
}
catch (e) {
  remarkTextDecoded = unescape(item.remarkText);

}

    return (
      <View 
      
      style={styles.viewContainerApplicantsList}>
        {this.state.selectedTab === 1 && item.offerStatus>0 && 
        <View style={styleOfferView}>
          <Image source={offerIcon} style={styles.iconOffer}/>
    <Text style={styles.textOfferStatus}>{`${textOffer} $${formatCurrency.format(item.offerAmount)}`}</Text>
        </View>}
        <View style={styles.viewInternalApplicantsList}>
       {item !== undefined && this.renderUserListView(item)}
        {item.remarkText !== '' && item.remarkText !== null &&
          <View style={{ marginTop: metrics.dimen_10 }}>
            <ReadMoreText style={{ ...commonStyles.LatoItalic_Medium }}
            seeMoreStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue}}
            seeLessStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue  }}
            backgroundColor='#F6F6F6'>
         {remarkTextDecoded}
            </ReadMoreText>
            {/* <ReadMore
           key={parseInt(index,10) }
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
            >
              <Text style={{ ...commonStyles.LatoItalic_Medium }}  key={index.toString() } numberOfLines={2}>{remarkTextDecoded}</Text>
            </ReadMore> */}
          </View>}
          {this.state.selectedTab === 1 && item.offerStatus === 0 &&campaignData.campaignType !== "commissionBased"&&campaignData.campaignType !== "shoutout"&&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
            applicantsStore.setSelectedUser(item)
            applicantsStore.setMakeOfferPopupStatus(true)
          }}
        >
          <Text style={styles.textMessage}>{strings('MAKE_OFFER')}</Text>
        </TouchableOpacity>}

  {/*Hire button for free campaign */}
        {/* {this.state.selectedTab === 1 && item.offerStatus === 0 && campaignData.campaignType !== "paid" &&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
        onPress={() => {
          this.props.CompaignsStore.hireInfluencer(item.id, item.ownerId)
         this.props.ApplicantListStore.setReloadApplicantsList(true, campaignData.id)
        }}
        >
          <Text style={styles.textMessage}>{strings('HIRE_NOW')}</Text>
        </TouchableOpacity>} */}

  {/*Make Payment Button for Stripe Payment */}
        {/* {this.state.selectedTab === 1 && item.offerStatus === 2 
        // && item.profile.stripeAccountNumber !== null &&
        // item.profile.stripeBankAccountId !== null 
        && campaignData.campaignType === "paid" &&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
            this.setState({
              selectedItem: item
          }, () => {
            this.actionSheetActions(1)         
           });
           
          }}
        >
          <Text style={styles.textMessage}>{strings('MAKE_PAYMENT')}</Text>
        </TouchableOpacity>} */}

        {/*Make Payment Message */}
        {/* {this.state.selectedTab === 1 && item.offerStatus === 2 
        && item.profile.stripeAccountNumber === null &&
        item.profile.stripeBankAccountId === null && 
        campaignData.campaignType === "paid" &&
        <View 
        >
          <Text style={styles.textNoPayment}>{strings('No_Payment_Error')}</Text>
        </View>} */}

          {/*Release Button for Stripe Payment */}
        {/* {this.state.selectedTab === 3 && item.offerStatus === 2 && item.isMarkAsDone === 1 && item.profile.stripeAccountNumber !== null &&
        item.profile.stripeBankAccountId !== null && item.isPaymentReleased === 0 && campaignData.campaignType === "paid" &&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
            item.isPaymentReleased=1
            this.setState({
              selectedItem: item
          }, () => {
           this.actionReleasePayment()         
           });
           
          }}
        >
          <Text style={styles.textMessage}>{strings('RELEASE_PAYMENT')}</Text>
        </TouchableOpacity>} */}

        {/*Release Payment Message */}
        {/* {this.state.selectedTab === 3 && item.offerStatus === 2 && item.isMarkAsDone === 1 && item.profile.stripeAccountNumber !== null &&
        item.profile.stripeBankAccountId !== null && item.isPaymentReleased === 1 && campaignData.campaignType === "paid" &&
        <View 
        >
          <Text style={styles.textNoPayment}>{strings('Payment_Released')}</Text>
        </View>} */}

{/*Release Payment Error Message */}
{/* {this.state.selectedTab === 3 && item.offerStatus === 2 && item.isMarkAsDone === 1 && item.profile.stripeAccountNumber === null &&
        item.profile.stripeBankAccountId === null && item.isPaymentReleased === 0 && campaignData.campaignType === "paid" &&
        <View 
        >
          <Text style={styles.textNoPayment}>{strings('No_Payment_Details_Added')}</Text>
        </View>} */}
      </View>
      </View>)

  }
  renderUserListView = (item) =>{
    const urlPic = item.profile.avatarUrl
    const imageUrl = (urlPic == null || urlPic === "NA") ? images.userPlaceholder : { uri: urlPic }
    const userName = item.profile.username.replace("@", "")

    return (
      <TouchableOpacity style={{ flexDirection: 'row', }}
      onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}>

      <FastImage
        style={{ width: metrics.dimen_60, height: metrics.dimen_60, borderRadius: metrics.dimen_30 }}
        source={imageUrl}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: metrics.dimen_6, justifyContent: 'space-between' }}>
          <View style={{ marginLeft: metrics.dimen_12, width: '60%', }}>
            <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_gray }}
              numberOfLines={1}
              onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
            >{(item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : '')}</Text>
            <Text style={{ ...commonStyles.LatoSemiBold_Small, color: 'rgba(122, 129, 138, 1)', marginTop: metrics.dimen_3, }}>@{userName}</Text>

            {item.profile.followers > 0 &&
              <View style={styles.viewInstaFollowers}>
                <Image style={{
                  width: metrics.dimen_12,
                  height: metrics.dimen_12,
                }} source={images.instaLineIcon}></Image>
                <Text style={styles.textFollowerCount}>
                  {Numberformatesunit(item.profile.followers)}
                </Text>
                <Text style={styles.textFollower}>
                  {strings('Followers')}
                </Text>
              </View>}
          </View>
          <TouchableOpacity style={styles.viewMessageContainerApplicantsList}
            onPress={() => {

              getUserId().then(userid => {
                const recerverUserData = {
                  _id: parseInt(item.ownerId,10),
                  name: (item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : ''),
                  avatar: item.profile.avatarUrl !== null ? item.profile.avatarUrl : ''
                }

                join({ userId: userid })
                this.props.navigation.navigate('ChatDetail', { 
                  receiverUserId: parseInt(item.ownerId,10) , 
                  recerverUserData: recerverUserData, 
                  campaignId: this.props.route.params.JobData.id,
                  title: recerverUserData.name,
                receiverUserProfile:item  })

              })

              // const url = 'mailto:' + item.profile.email
              // if (Linking.canOpenURL(url)) {
              //   const jobData = this.props.route.params.JobData
              //   let urlToOpen = 'mailto:' + item.profile.email + '?subject=' + jobData.campaignTitle + '&body=' + jobData.campaignDetails
              //   Linking.openURL(urlToOpen)
              // } else {
              //   showAlert('', strings('configure_email'))
              // }
            }}
          >
            <Text style={styles.textMessage}>{strings('Message')}</Text>
          </TouchableOpacity>

        </View>

      </View>
    </TouchableOpacity>
    )
  }


  renderApplicant = (item) => {
    const urlPic = item.profile.avatarUrl
    const imageUrl = urlPic == null ? images.userPlaceholder : { uri: urlPic }
    console.log('renderApplicant:',JSON.stringify(item))
    const userName = item.profile.username.replace("@", "")

    return (
      <View style={{ width: '100%', flexDirection: 'row', paddingLeft: metrics.dimen_20, backgroundColor: 'white' }}>
         <ActionSheet
         ref={(el) => { this.ActionSheet = el }}
          // ref={o => this.ActionSheet = o}
         // title={'Which one do you like ?'}
          options={['Send Message', 'Select Influencer', 'Cancel']}
          // options={['Send Message', 'Cancel']}

          cancelButtonIndex={2}
          //destructiveButtonIndex={1}
          onPress={(index) => { 
            
            this.actionSheetActions(index, item)
          }}
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}>
          <FastImage
            style={styles.profileImage}
            source={imageUrl}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
       <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
        accessible={false}>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: metrics.dimen_6, justifyContent: 'space-between' }}>
            <View style={{ marginLeft: metrics.dimen_12, width: '50%', }}>
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_gray }}
                onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
              >{(item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : '')}</Text>
              <Text style={{ ...commonStyles.LatoSemiBold_Small, color: 'rgba(122, 129, 138, 1)', marginTop: metrics.dimen_3, }}>@{userName}</Text>

              {item.profile.followers > 0 &&
                <View style={styles.viewInstaFollowers}>
                  <Image style={{
                    width: metrics.dimen_12,
                    height: metrics.dimen_12,
                  }} source={images.instaLineIcon}></Image>
                  <Text style={styles.textFollowerCount}>
                    {Numberformatesunit(item.profile.followers)}
                  </Text>
                  <Text style={styles.textFollower}>
                    {strings('Followers')}
                  </Text>
                </View>}
            </View>
            <TouchableOpacity style={styles.imageChatContentView}
              onPress={() => {
                
                  if(this.state.selectedTab === 1)
                  {
                    this.showActionSheet(item)
                  }
                  else
                  {
                    this.actionSheetActions(0)
                  }

                // getUserId().then(userid => {
                //   const recerverUserData = {
                //     _id: parseInt(item.ownerId),
                //     name: (item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : ''),
                //     avatar: item.profile.avatarUrl !== null ? item.profile.avatarUrl : ''
                //   }

                //   join({ userId: userid })
                //   this.props.navigation.navigate('ChatDetail', { receiverUserId: item.ownerId, recerverUserData: recerverUserData, title: recerverUserData.name })

                // })

                // const url = 'mailto:' + item.profile.email
                // if (Linking.canOpenURL(url)) {
                //   const jobData = this.props.route.params.JobData
                //   let urlToOpen = 'mailto:' + item.profile.email + '?subject=' + jobData.campaignTitle + '&body=' + jobData.campaignDetails
                //   Linking.openURL(urlToOpen)
                // }else{
                //   showAlert('',strings('configure_email'))
                // }
              }}
            >
              <Image source={this.state.selectedTab === 1 ? images.more : images.chatTabIcon}
                style={styles.imageChat} />
              {/* <Text style = {{...commonStyles.LatoRegular_Medium, color: 'rgba(104, 157, 255, 1)', marginLeft: metrics.dimen_6}}>{strings('send_message')}</Text> */}
            </TouchableOpacity>
            
          </View>
          <View style={{ marginLeft: metrics.dimen_12 }}>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
            >
              <Text style={{ ...commonStyles.LatoItalic_Medium }}>{decodeURIComponent(item.remarkText)}</Text>
            </ReadMore>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
  renderHeader = () => {
    const data = this.props.route.params.JobData
    const { isSwitchOn } = this.state;
    var campaignCategoriesArray = data.campaignCategories !== undefined ? data.campaignCategories : []
    var tabsData = this.state.tabs
    // if (data.campaignType !== "paid"&&data.campaignType !== "sponsored"&&data.campaignType !== "eventsAppearence"&&data.campaignType !== "photoshootVideo"){
    //   tabsData = tabsData.filter(el=>el.tabName !== "Hired")
    // }
    return (
      <View>

        <FastImage
          style={commonStyles.bannerImageStyle}
          source={{
            uri: data.campaignImage.length > 30 ? data.campaignImage : Media_Base_URL + data.campaignImage,
            priority: FastImage.priority.normal
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* <View style={{ position: 'absolute', top: 10, right: 10, }} >
          <Switch
            onTintColor={colors.app_Blue}
            tintColor={'rgba(112, 129, 138, 1)'}
            thumbTintColor={colors.white}
            ios_backgroundColor={'rgba(112, 129, 138, 1)'}
            value={isSwitchOn}
            onValueChange={this._onToggleSwitch}
          />
        </View> */}
        <View style={{ margin: metrics.dimen_10 }}>
        <View style={styles.containerSwitch}>

          <Text style={styles.postedOnText}>
            {`${strings('Posted_On')}: ${Moment(data.createdAt).format('MMM DD, YYYY')}`}</Text>
            {data.campaignStatus>1&&  <View style={styles.switchStyles} >
     <Text style = {[commonStyles.LatoItalic_Medium,styles.enabledDisableText ]}>
     {isSwitchOn ? strings("Enabled") : strings("Disabled")}
     </Text>

        <Switch
        onTintColor={colors.app_Blue}
        tintColor={'rgba(112, 129, 138, 1)'}
        thumbTintColor={colors.white}
        ios_backgroundColor={'rgba(112, 129, 138, 1)'}
        value={isSwitchOn}
        onValueChange={this._onToggleSwitch}
       />
        </View>}
     </View>
          <Text style={{ ...commonStyles.LatoBold_16, marginBottom: metrics.dimen_8 }}>{data.campaignTitle}</Text>
          <ReadMore
            numberOfLines={2}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
          >
            <Text style={{ ...commonStyles.LatoSemiBold_Normal }}>{data.campaignDetails}</Text>
          </ReadMore>



            <View style={{
              alignSelf:'baseline',
              marginTop: metrics.dimen_12,
              backgroundColor: data.campaignType === "shoutout" ? '#58DC72' : data.campaignType === "paid" ? colors.app_Blue : "#FFC107",
              paddingHorizontal: metrics.dimen_13,
              height: metrics.dimen_25,
              borderRadius: metrics.dimen_13,
              justifyContent: 'center'
            }}>

            {data.campaignType === "shoutout"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {"Shoutout Exchange"}
            </Text>}

            {data.campaignType === "paid"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Paid: ${convertCurrencybyCode(data.campaignAmountCurrency) +formatCurrency.format(data.campaignAmount)}`}
          </Text>}

            {data.campaignType === "sponsored"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Product Sponsor: ${convertCurrencybyCode(data.campaignAmountCurrency) + formatCurrency.format(data.campaignAmount)}`}             
            </Text>}
            {data.campaignType === "commissionBased"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Commission Based: ${formatCurrency.format(data.campaignAmount)+" "+"%"}`}             
            </Text>}

            {data.campaignType === "eventsAppearence"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Events Appearance: ${convertCurrencybyCode(data.campaignAmountCurrency) + formatCurrency.format(data.campaignAmount)}`}             
            </Text>}
            {data.campaignType === "photoshootVideo"&& <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {`Photo / Video Shoot: ${convertCurrencybyCode(data.campaignAmountCurrency) +  formatCurrency.format(data.campaignAmount)}`}             
            </Text>}
            </View>
          
          {campaignCategoriesArray.length > 0 &&
            <Text style={{ ...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_12 }}>
              {strings('Category')}
            </Text>}
          {campaignCategoriesArray.length > 0 &&
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>
              {data.campaignCategories.map(item => {
                return (
                  <Text style={[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                    {item.toUpperCase()}
                  </Text>
                )
              })}
            </View>
          }
          <TouchableOpacity style={styles.containerViewCampaignDetail}
           onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: data, isFromMyApplications:false,} )}
          >
            <Text style={styles.textCampaignDetail}>{strings('CampaignDetail')}</Text>
          </TouchableOpacity>
        </View>

        
        <ScrollView style={{ height:48, flexDirection:'row'}}
        showsHorizontalScrollIndicator={false}
        horizontal>
         {this.renderTabs(tabsData)}
        </ScrollView>
        <View style={{backgroundColor:'rgba(122, 129, 138, 0.1)', height:0.5, width:'100%',}}/>

        <View style={{ ...styles.seperatorStyle, marginHorizontal: metrics.dimen_20, marginBottom: metrics.dimen_18 }} />
       
      </View>
    )
  }
  renderTabs(tabsData) {
console.log('this.state.tabs:',tabsData)
    return tabsData.map((data) => {
      return (
        <TouchableOpacity style={{width:130, flexDirection:'column', alignItems:'center', justifyContent:'center' }}
        onPress={()=>this.selectTab(data)}>
          <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.getFontSize(16), color:'rgba(0,0,0,0.3)'}}>{data.tabName}</Text>
          {data.isSelected && 
          <View style={
            {
              backgroundColor:colors.app_Blue, 
              height:1.5, width:'90%', 
              position:'absolute', bottom: -1 }}/>}
          </TouchableOpacity>
      )
    })

}
selectTab = (data) =>{
  const selectedIndex = this.state.tabs.findIndex(obj => obj.tabName === data.tabName);
  const tabsArray = this.state.tabs.map((el)=>{
    el.isSelected = false
    return el
  })
  tabsArray[selectedIndex].isSelected=true
  this.setState({
    tabs:tabsArray,
    selectedTab:selectedIndex+1
  })
  const offset = this.state.scrollPosition

  setTimeout(() => {
  }, 100)
  
}
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ ...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('More')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ ...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('Less')}
      </Text>
    );
  }
  showActionSheet = (item) => {
    this.setState({selectedItem:item})
    this.ActionSheet.show()
  }
  actionSheetActions = (index, userData) =>{
    if(index === 0)
    {
      getUserId().then(userid => {
        const recerverUserData = {
          _id: parseInt(this.state.selectedItem.ownerId,10),
          name: (this.state.selectedItem.profile.first ? this.state.selectedItem.profile.first : '') + " " + (this.state.selectedItem.profile.last ? this.state.selectedItem.profile.last : ''),
          avatar: this.state.selectedItem.profile.avatarUrl !== null ? this.state.selectedItem.profile.avatarUrl : ''
        }

        join({ userId: userid })
        this.props.navigation.navigate('ChatDetail', { receiverUserId: parseInt(this.state.selectedItem.ownerId,10), 
          recerverUserData: recerverUserData, 
          campaignId: this.props.route.params.JobData.id,
          title: recerverUserData.name,
          receiverUserProfile:this.state.selectedItem })

      })
    }
    else if (index === 1)
    {
     const campaignData = this.props.route.params.JobData
     this.props.navigation.navigate('PurchaseCampaign',{campignData:campaignData, userData:this.state.selectedItem})
    }
  }
  actionReleasePayment = () =>{

    //console.log('actionReleasePayment:',JSON.stringify(this.state.selectedItem) )
    const applicantStore = this.props.ApplicantListStore
    const params = {
      ownerId:this.state.selectedItem.ownerId,
      campaignId:this.props.route.params.JobData.id,
      payoutAmount:this.state.selectedItem.offerAmount
    }
    applicantStore.onRelaseCampaignAmount(params)
   // applicantStore.releasePayment(this.state.selectedItem.ownerId)
  }
}

export default inject("ApplicantListStore", "CompaignsStore")(observer(ApplicantList))


const styles = StyleSheet.create({
  profileImage: {
    width: metrics.dimen_60,
    height: metrics.dimen_60
  },
  seperatorStyle: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    height: metrics.dimen_1,
  },
  
  imageChatContentView: {
    marginLeft: metrics.dimen_10,
    width: metrics.getHeightAspectRatio(48),
    height: metrics.getHeightAspectRatio(48),
    //backgroundColor:'red',
    marginTop: -metrics.dimen_15
  },
  imageChat: {
    alignSelf: 'flex-end',
    tintColor: '#689DFF',
    width: metrics.dimen_18,
    height: metrics.dimen_18,
    marginTop: metrics.dimen_15,
    marginRight: metrics.dimen_15
  },
  viewInstaFollowers: {
    flexDirection: 'row',
    marginTop: metrics.dimen_5,
    //alignItems:'center',
  },
  textFollowerCount: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: colors.text_black,
    marginLeft: metrics.dimen_5,
    alignSelf: 'flex-end',
  },
  textFollower: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.text_grey,
    marginLeft: metrics.dimen_5,
    alignSelf: 'flex-end'
  },
  postedOnText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: '#7A818A',
    //marginBottom: metrics.dimen_8
  },
  tagViewLabel: {
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    marginTop: metrics.dimen_6,
    backgroundColor: 'rgba(235, 235, 235, 1)',
    paddingHorizontal: metrics.dimen_6,
    paddingVertical: metrics.dimen_4,
    marginRight: metrics.dimen_6,
    borderRadius: 4
  },
  switchStyles:{
    //marginTop:metrics.aspectRatioHeight(12),
  marginRight:metrics.widthSize(10),
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center' 
},
  enabledDisableText:{
    color: 'rgba(112, 129, 138, 1)',
    marginRight:10
  },
  containerSwitch:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:metrics.dimen_5
   // backgroundColor:'red'
  },
  containerViewCampaignDetail:{
    marginTop:metrics.aspectRatioHeight(51),
    backgroundColor:colors.app_Blue, 
    borderRadius:5, 
   // width:metrics.widthSize(441),
    alignItems:'center',
    justifyContent:'center',
    //paddingHorizontal: metrics.widthSize(42),
    height: metrics.aspectRatioHeight(144),
    // shadowColor: colors.app_Blue,
    // shadowOpacity: 0.5,
    // shadowOffset: {width: 2, height: 2},

  },
  textCampaignDetail:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'white',
    textTransform:'uppercase'
  },
  viewContainerSuggestedView:{
    backgroundColor: "#F6F6F6",
    borderRadius: metrics.widthSize(15),
    marginLeft: metrics.widthSize(60),
    //marginRight: metrics.widthSize(10),
    width: metrics.widthSize(480),
   marginBottom: metrics.widthSize(33)

  },
  viewImageSuggestedView:{
    marginHorizontal: metrics.widthSize(39),
    marginTop: metrics.aspectRatioHeight(54),
    flexDirection:'row',
  },
  imageUserSuggestedView:{
    width:metrics.widthSize(150),
    height:metrics.widthSize(150),
    borderRadius: metrics.widthSize(75)
  },
  viewMessageContainer:{
    borderRadius: metrics.widthSize(6),
    borderColor: colors.app_Blue,
    borderWidth: metrics.widthSize(3),
    paddingHorizontal: metrics.widthSize(30),
    height: metrics.dimen_22,
    justifyContent:'center',
    //paddingVertical: metrics.aspectRatioHeight(15),
    marginLeft: metrics.widthSize(39)
  },
  textMessageButton:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    textTransform:'uppercase'
  },
  textName:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: colors.app_black,
  },
  textUserName:{
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
  },
  instagramView:{
    marginTop: metrics.aspectRatioHeight(33),
    marginBottom: metrics.aspectRatioHeight(42),
   // justifyContent:'center',
    flexDirection:'row',
  },
  instagramIcon:{
    width:metrics.widthSize(66),
    height:metrics.widthSize(66),
    marginRight: metrics.widthSize(45),
  },
  // viewCount:{
  //   flexDirection:'row',
  // },
  textFollowersCount:{
    alignSelf:'center',
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: "#3D4046",
  },
  labelFollowersPosts:{
    alignSelf:'center',
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: colors.text_grey,
  },
  viewDetailsSuggested:{
    marginHorizontal: metrics.widthSize(39),
    marginTop:metrics.dimen_7,

  },
  viewVerticalLine:{
    height:'100%',
    width:metrics.widthSize(3),
    backgroundColor: '#E7E9EC',
    marginHorizontal: metrics.widthSize(36)

  },
  emptyListContainer:{
    justifyContent:'center',
    alignItems:"center"
  },
  imageEmptyComponent:{
    width:metrics.widthSize(100),
    height:metrics.widthSize(100),
  },
  labelEmptyList:{
    textAlign:'center',
    marginTop: metrics.dimen_12,
    width: metrics.dimen_160,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_16,
    color: "#C0C4CC",
  },
  viewContainerApplicantsList :{
    backgroundColor: '#F6F6F6',
    borderRadius: metrics.dimen_5,
    marginHorizontal: metrics.dimen_22,
    marginTop: metrics.dimen_14,
   
  },
  viewInternalApplicantsList :{
    paddingTop: metrics.dimen_13,
    paddingBottom: metrics.dimen_18,
    paddingHorizontal: metrics.dimen_15,
  },
  viewMessageContainerApplicantsList:{
    borderRadius: metrics.dimen_3, 
    borderWidth: metrics.widthSize(3), 
    borderColor: colors.app_Blue, 
    paddingHorizontal: metrics.dimen_10, 
    height: metrics.dimen_22, 
    justifyContent: 'center'
  },
  textMessage: {
    fontFamily: metrics.Lato_Regular, 
    fontSize: metrics.getFontSize(11), 
    color: colors.app_Blue, 
    alignSelf:'center',
    textTransform: 'uppercase'
  },
  textNoPayment: {
    marginTop: metrics.dimen_10,
    fontFamily: metrics.Lato_Bold, 
    fontSize: metrics.getFontSize(13), 
    color: colors.app_Blue, 
    alignSelf:'center',
  },
  makePaymentContainer: {
     height: metrics.aspectRatioHeight(99), 
     justifyContent: 'center', 
     marginTop: metrics.dimen_14 
  },
  viewOfferStatus: {
    backgroundColor: colors.offerGreen,
    borderTopLeftRadius: metrics.dimen_5,
    borderTopRightRadius: metrics.dimen_5,
    height: metrics.dimen_28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textOfferStatus: {
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: colors.white
  },
  iconOffer: {
    marginRight:metrics.dimen_6,
    width: metrics.dimen_14,
    height: metrics.dimen_14,
    tintColor: colors.white
  }
    

})


