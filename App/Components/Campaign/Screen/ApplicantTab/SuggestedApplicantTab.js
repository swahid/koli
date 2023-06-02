import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image'
import { commonStyles } from '../../../../SupportingFIles/Constants'
import metrics from '../../../../Themes/Metrics';
import ReadMore from 'react-native-read-more-text';
import { observer, inject } from 'mobx-react';
import Loader from '../../../../SupportingFIles/Loader';
import colors from '../../../../Themes/Colors';
import { strings } from '../../../../Locales/i18';
import images from '../../../../Themes/Images';
import Moment from 'moment'
import { getUserId, Numberformatesunit, getUserCorrentLocation, calculateDistance, checkLocationPermission,convertCurrencybyCode } from '../../../../SupportingFIles/Utills';
import { Switch } from 'react-native-paper';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import { join } from '../../../../Socket/index'
import { Media_Base_URL } from '../../../../API/Campaign/ApiCampaign';
import ActionSheet from 'react-native-actionsheet'
import MakeOffer from '../MakeOffer'
import Geolocation from 'react-native-geolocation-service';
import ReadMoreText from '../../../CommonComponents/ReadMoreLess'
const formatCurrency = new Intl.NumberFormat('en-US')


class SuggestedApplicantTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
     

    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      //this.getLocation()

      // //this.props.ApplicantListStore.getApplicantList(954)
      // this.props.ApplicantListStore.getApplicantList(this.props.JobData.id)
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

  
  componentWillUnmount() {
  
  }
  render() {

    const store = this.props.ApplicantListStore
    const { isLoading, applicantList, suggestedUsers } = store
    // const hiredInfluencersList = applicantList.filter(el=>(el.isPayment === 1 || el.isHired === 1))
    // var applicantListData = applicantList.filter(el=>(el.isPayment === 0 && el.isHired === 0))
    
    

    // if (this.state.latitude !== null) {
    //   var applicantDataWithoutLocation = [...applicantListData]
    //   var applicantDataWithLocation = [...applicantListData]

    //   applicantDataWithoutLocation = applicantDataWithoutLocation.filter(obj => obj.profile.latitude === null)
    //   applicantDataWithLocation = applicantDataWithLocation.filter(obj => obj.profile.latitude !== null)
    //   applicantDataWithLocation = applicantDataWithLocation.sort((p1, p2) => {
    //     console.log("p1:", p1)
    //     if (p1.profile.latitude !== null && p2.profile.latitude !== null) {
    //       console.log("p1.ownerId:", p1.ownerId)
    //       console.log("distance:", this.calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p1.profile.latitude), parseFloat(p1.profile.longitude)) -
    //         this.calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p2.profile.latitude), parseFloat(p2.profile.longitude)))

    //       return calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p1.profile.latitude), parseFloat(p1.profile.longitude)) -
    //         calculateDistance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(p2.profile.latitude), parseFloat(p2.profile.longitude))
    //     }
    //     else {
    //       return 1
    //     }
    //   }
    //   )
    //    applicantListData = [...applicantDataWithLocation, ...applicantDataWithoutLocation];

    //   console.log("combinedData:", applicantListData)
    
    // }
    // else {
    //   getUserCorrentLocation()
    // }

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
          <MakeOffer modalVisible={true} 
          itemData = {this.state.selectedItem !== undefined ? this.state.selectedItem : null}
          hideMarkAsCompletedButton={() => this.hideMarkAsCompletedButton()}
                />
        <Loader loading={isLoading} />
        <FlatList
        ref={(ref) => { this.flatList = ref }} 
        //  ref={(ref) => this.flatList = ref}
         onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.noItemDisplay}
          numColumns={2}
          data={suggestedUsers}
          renderItem={({ item, index }) =>
          {
           
              return this.renderSuggestedApplicant(item, index)
  
           
          }
          }
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={{ height: metrics.dimen_25 }}></View>
      </View>
    );
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
          
          { strings('No_Applications_Yet')}
          </Text>
      </View>
    )
  }
  renderSeperator() {
    return (
      <View style={{ ...styles.seperatorStyle, marginHorizontal: metrics.dimen_20, marginVertical: metrics.dimen_15 }} />
    )
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
                campaignId: this.props.JobData.id,
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

const campaignData = this.props.JobData
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
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
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
                  campaignId: this.props.JobData.id,
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
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
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
                
                 
                  this.actionSheetActions(0)

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
              <Image source={images.chatTabIcon}
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
//   renderHeader = () => {
//     const data = this.props.JobData
//     const { isSwitchOn } = this.state;
//     var campaignCategoriesArray = data.campaignCategories !== undefined ? data.campaignCategories : []
//     return (
//       <View>

//         <FastImage
//           style={commonStyles.bannerImageStyle}
//           source={{
//             uri: data.campaignImage.length > 30 ? data.campaignImage : Media_Base_URL + data.campaignImage,
//             priority: FastImage.priority.normal
//           }}
//           resizeMode={FastImage.resizeMode.cover}
//         />
       
//         <View style={{ margin: metrics.dimen_20 }}>
//         <View style={styles.containerSwitch}>

//           <Text style={styles.postedOnText}>
//             {`${strings('Posted_On')}: ${Moment(data.createdAt).format('MMM DD, YYYY')}`}</Text>
//             {data.campaignStatus>1&&  <View style={styles.switchStyles} >
//      <Text style = {[commonStyles.LatoItalic_Medium,styles.enabledDisableText ]}>
//      {isSwitchOn ? strings("Enabled") : strings("Disabled")}
//      </Text>

//         <Switch
//         onTintColor={colors.app_Blue}
//         tintColor={'rgba(112, 129, 138, 1)'}
//         thumbTintColor={colors.white}
//         ios_backgroundColor={'rgba(112, 129, 138, 1)'}
//         value={isSwitchOn}
//         onValueChange={this._onToggleSwitch}
//        />
//         </View>}
//      </View>
//           <Text style={{ ...commonStyles.LatoBold_16, marginBottom: metrics.dimen_8 }}>{data.campaignTitle}</Text>
//           <ReadMore
//             numberOfLines={2}
//             renderTruncatedFooter={this._renderTruncatedFooter}
//             renderRevealedFooter={this._renderRevealedFooter}
//           >
//             <Text style={{ ...commonStyles.LatoSemiBold_Normal }}>{data.campaignDetails}</Text>
//           </ReadMore>
//           {data.campaignType === "paid" && <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_12 }}>
//               {convertCurrencybyCode(data.campaignAmountCurrency) + " " + formatCurrency.format(data.campaignAmount)}
//             </Text>}

//             {data.campaignType !== "paid" &&
//             <View style={{backgroundColor:data.campaignType === "shoutout" ? '#58DC72' : "#FFC107", 
//             marginTop: metrics.dimen_12 ,
//             paddingHorizontal:metrics.dimen_13, 
//             height: metrics.dimen_25, 
//             borderRadius: metrics.dimen_13, 
//             justifyContent:'center',
//             alignItems:'center',
//             maxWidth: metrics.widthSize(410)}}>
//             <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
//             {data.campaignType === "shoutout" ? "Shoutout Exchange" : "Sponsored"}
//             </Text>
//             </View>}
//           {/* <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_12 }}>
//             {data.campaignAmountCurrency + " " + formatCurrency.format(data.campaignAmount)}
//             </Text> */}

     
//           {campaignCategoriesArray.length > 0 &&
//             <Text style={{ ...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_12 }}>
//               {strings('Category')}
//             </Text>}
//           {campaignCategoriesArray.length > 0 &&
//             <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>
//               {data.campaignCategories.map(item => {
//                 return (
//                   <Text style={[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
//                     {item.toUpperCase()}
//                   </Text>
//                 )
//               })}
//             </View>
//           }
//           <TouchableOpacity style={styles.containerViewCampaignDetail}
// onPress={() => this.props.navigation.navigate('MYCampaignDetails', {data: data, isFromMyApplications:false,} )}
//           >
//             <Text style={styles.textCampaignDetail}>{strings('CampaignDetail')}</Text>
//           </TouchableOpacity>
//         </View>

        
//         <View style={{width:'100%', height:48, flexDirection:'row'}}>
//          {this.renderTabs()}
//         </View>
//         <View style={{backgroundColor:'rgba(122, 129, 138, 0.1)', height:0.5, width:'100%',}}/>

//         <View style={{ ...styles.seperatorStyle, marginHorizontal: metrics.dimen_20, marginBottom: metrics.dimen_18 }} />
       
//       </View>
//     )
//   }
 
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
          campaignId: this.props.JobData.id,
          title: recerverUserData.name,
          receiverUserProfile:this.state.selectedItem })

      })
    }
    else if (index === 1)
    {
    //  console.log('actionSheetActions:', this.state.selectedItem)
     const campaignData = this.props.JobData
     this.props.navigation.navigate('PurchaseCampaign',{campignData:campaignData, userData:this.state.selectedItem})
     // initiatePayment(payType.card,10)
    }
  }
  actionReleasePayment = () =>{

    //console.log('actionReleasePayment:',JSON.stringify(this.state.selectedItem) )
    const applicantStore = this.props.ApplicantListStore
    const params = {
      ownerId:this.state.selectedItem.ownerId,
      campaignId:this.props.JobData.id,
      payoutAmount:this.state.selectedItem.offerAmount
    }
    applicantStore.onRelaseCampaignAmount(params)
   // applicantStore.releasePayment(this.state.selectedItem.ownerId)
  }
}

export default inject("ApplicantListStore", "CompaignsStore")(observer(SuggestedApplicantTab))


const styles = StyleSheet.create({
  profileImage: {
    width: metrics.dimen_60,
    height: metrics.dimen_60
  },
  seperatorStyle: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    height: metrics.dimen_1,
  },
  // tagTextStyle: {
  //   fontFamily: metrics.Lato_Regular,
  //   fontSize: metrics.text_small,
  //   color: 'white',
  //   marginTop: -metrics.dimen_2,
  //   marginLeft: metrics.dimen_5
  // },
  // tagViewStyle: {
  //   position: 'absolute',
  //   top: metrics.dimen_5,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-around',
  //   left: metrics.dimen_5,
  // },
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
    marginLeft: metrics.widthSize(50),
    //marginRight: metrics.widthSize(10),
    width: metrics.widthSize(490),
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


