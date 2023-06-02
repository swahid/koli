import React, { Component } from 'react';
import { View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Alert, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
Linking } from 'react-native';
import FastImage from 'react-native-fast-image'
import { commonStyles } from '../../../../SupportingFIles/Constants'
import metrics from '../../../../Themes/Metrics';
import { observer, inject } from 'mobx-react';
import Loader from '../../../../SupportingFIles/Loader';
import colors from '../../../../Themes/Colors';
import { strings } from '../../../../Locales/i18';
import images from '../../../../Themes/Images';
import Moment from 'moment'
import { getUserId, Numberformatesunit } from '../../../../SupportingFIles/Utills';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import { join } from '../../../../Socket/index'
import ReadMoreText from '../../../CommonComponents/ReadMoreLess'
import { runInAction } from 'mobx';
import RBSheet from "react-native-raw-bottom-sheet";
import TransactionStatus from './Transaction/TransactionStatus'
import OfferStatusHeader from './OfferStatusHeader';
import StarRating from 'react-native-star-rating'

const formatCurrency = new Intl.NumberFormat('en-US')


class ApplicantTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      Selectedlisttab: 1
    };
  }


  showAlert = (data) => {
    Alert.alert(
      "",
      strings('Are_you_sure_you_unApply'),
      [
        { text: strings('No'), onPress: () => console.log('No Pressed') },
        {
          text: strings('Yes'), onPress: () => {
           
            let params = {
              cancelledByBrand: 1
            }
            console.log(';;;;',JSON.stringify(this.props.JobData))
            let cancelledByInfluencerValue = this.props.JobData.cancelledByInfluencer
            this.props.CompaignsStore.cancelCampaignfromBothInfluencerAndBrand(data.campaignId,params,cancelledByInfluencerValue)
            this.props.navigation.goBack()
            // this.setState({ isAppliedInitiate: false })
          }, style: 'destructive'
        },
      ],
      { cancelable: true }
    );

  }


  render() {
    const store = this.props.ApplicantListStore
    const { isLoading, applicantList } = store
    console.log("hiredData==",applicantList)
 
    var hiredData = [...applicantList]
         hiredData = hiredData.filter(el=> (el.isPayment === 1||el.isHired ===1))
        // hiredData = hiredData.filter(el=> el.offerStatus === 2 && el.remarkStatus === 1&& el.isPayment === 1)

    
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
       
        <Loader loading={isLoading} />
       
        <FlatList
          ref={(ref) => { this.flatList = ref }}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.noItemDisplay}
          numColumns={0}
          data={hiredData}
          //  renderItem={({ item }) => this.renderApplicant(item)}
          renderItem={({ item, index }) => {
            return this.renderApplicantsNew(item, index)}
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
  noItemDisplay = () => {
    return (
      <View style={styles.emptyListContainer}>
        <FastImage
          style={styles.imageEmptyComponent}
          source={images.emptyList}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={styles.labelEmptyList}>

          {strings('No_Applications_Yet')}
        </Text>
      </View>
    )
  }
  renderSeperator() {
    return (
      <View style={{ ...styles.seperatorStyle, marginHorizontal: metrics.dimen_20, marginVertical: metrics.dimen_15 }} />
    )
  }

  renderApplicantsNew = (item, index) => {
   // console.log('renderApplicant:', JSON.stringify(item))
    //   offerStatus 
    // 0 - No action taken
    // 1 - Pending
    // 2 - Accepted
    // 3 - Declined

    const campaignData = this.props.JobData
    const applicantsStore = this.props.ApplicantListStore
    var offerIcon = images.PendingOffer
    var textOffer = strings('Pending_offer_for')
    var styleOfferView = [styles.viewOfferStatus, { backgroundColor: colors.offerYellow }]
    if (item.offerStatus === 2) {
      offerIcon = images.jobAwarded
      textOffer = strings('Accepted_offer_for')
      styleOfferView = [styles.viewOfferStatus, { backgroundColor: colors.offerGreen }]
    }
    else if (item.offerStatus === 3) {
      offerIcon = images.RejectedOffer
      textOffer = strings('Rejected_offer_for')
      styleOfferView = [styles.viewOfferStatus, { backgroundColor: colors.offerRed }]
    }

    // const remarkTextDecoded = item.remarkText.replace('% ', 'percent')
    // console.log('decode resmark:',decodeURIComponent(remarkTextDecoded))
    var remarkTextDecoded = item.remarkText;
    //remarkTextDecoded = remarkTextDecoded.toString().replace(/~~pct~~/g,'%');    
    try {
      remarkTextDecoded = decodeURI(item.remarkText);
      remarkTextDecoded = remarkTextDecoded.toString().replace(/~~pct~~/g, '%');
    }
    catch (e) {
      remarkTextDecoded = unescape(item.remarkText);

    }

    let ratingCount = 0
    if (item.reviews.length > 0){
       const filterData = item.reviews.filter(el => el.remarkId === item.id)
       if (filterData.length > 0){
        ratingCount = filterData[0].reviewRating
       }

    }
    return (
      <View

        style={styles.viewContainerApplicantsList}>
                 <RBSheet
        ref={ref => {
          this.bottomSheet = ref;
      }}
      height={metrics.height * 0.7}

        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius:20,
            borderTopRightRadius:20

          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
<TransactionStatus paymentStatus={this.state.responseStatus}
remarkData={this.state.selectedItem}
isPayment={false}/>
      </RBSheet>
      <OfferStatusHeader item={item}/>
        {/* {item.offerStatus > 0 &&
          <View style={styleOfferView}>
            <Image source={offerIcon} style={styles.iconOffer} />
            <Text style={styles.textOfferStatus}>{`${textOffer} $${formatCurrency.format(item.offerAmount)}`}</Text>
          </View>} */}
        <View style={styles.viewInternalApplicantsList}>
          {item !== undefined && item.profile !== undefined &&
          this.renderUserListView(item)}
          {item.remarkText !== '' && item.remarkText !== null &&
            <View style={{ marginTop: metrics.dimen_10 }}>
              <ReadMoreText style={{ ...commonStyles.LatoItalic_Medium }}
                seeMoreStyle={{ ...commonStyles.LatoItalic_Medium, color: colors.app_Blue }}
                seeLessStyle={{ ...commonStyles.LatoItalic_Medium, color: colors.app_Blue }}
                backgroundColor='#F6F6F6'>
                {remarkTextDecoded}
              </ReadMoreText>
            </View>}

          {/* Hire button for free campaign */}
          {/* {ampaignData.campaignType !== "paid" &&campaignData.campaignType !== "sponsored"&&campaignData.campaignType !== "eventsAppearence"&&campaignData.campaignType !== "photoshootVideo"&&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
        onPress={() => {
          this.props.CompaignsStore.hireInfluencer(item.id, item.ownerId)
         this.props.ApplicantListStore.setReloadApplicantsList(true, campaignData.id)
        }}
        >
          <Text style={styles.textMessage}>{strings('HIRE_NOW')}</Text>
        </TouchableOpacity>} */}

         

          {/*Make Payment Message */}
          {/* {item.offerStatus === 2 
        && item.profile.stripeAccountNumber === null &&
        item.profile.stripeBankAccountId === null && 
        campaignData.campaignType === "paid" &&
        <View 
        >
          <Text style={styles.textNoPayment}>{strings('No_Payment_Error')}</Text>
        </View>} */}
        
{/*Mark As Done Text */}
{ item.markAsDoneText !== "" &&
item.isMarkAsDone === 1 &&
        <View style={styles.viewOption}>
            <Text style={styles.textOptionTitle}>{'Completion Info : '}
            <Text style={styles.textOptionDescription}>
              {item.markAsDoneText !== "NA" ? item.markAsDoneText : "--" }
              </Text>
            </Text>
        </View>}

        {/*Mark As Done URL */}
{ item.markAsDoneText !== "" &&
item.isMarkAsDone === 1 &&
        <View style={styles.viewOption}>
            <Text style={styles.textOptionTitle}>{'Completion URL : '}
            <Text style={[styles.textOptionDescription,{color:colors.app_Blue}]}
            onPress={() => Linking.openURL(item.markAsDoneTextUrl)}>
               {(item.markAsDoneTextUrl !== "NA" 
               && item.markAsDoneTextUrl !== "" &&
               item.markAsDoneTextUrl !== null) ? 
               item.markAsDoneTextUrl : "--" }
              {/* {item.markAsDoneTextUrl} */}
            </Text>
            </Text>
        </View>}

          {/*Release Button for Stripe Payment */}

          {/* // hide release payment process 12 May Due to paypal Comment */}
          {
          item.offerStatus === 2 && 
          item.isMarkAsDone === 1 &&
        item.isPaymentReleased === 0 && 
        item.remarkStatus==1 &&
        campaignData.campaignType !== "commissionBased" &&campaignData.campaignType !== "shoutout"&&campaignData.campaignType !== "sponsored"&&
        <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
            runInAction(() => {
                item.isPaymentReleased=1
              })
          
            this.setState({
              selectedItem: item
          }, () => {
           this.actionReleasePayment()         
           });
           
          }}
        >
          <Text style={styles.textMessage}>{strings('RELEASE_PAYMENT')}</Text>
        </TouchableOpacity>}
    
    {/* cancel button for both influuencer and brand side */}
        {
          item.offerStatus === 2 && 
          item.isMarkAsDone === 1 &&
        item.isPaymentReleased === 0 && 
        campaignData.cancelledByBrand==0 && 
        campaignData.campaignType !== "commissionBased" &&campaignData.campaignType !== "shoutout"&&campaignData.campaignType !== "sponsored"&&
       

        <TouchableOpacity  
        style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
                console.log(JSON.stringify(item))
                this.showAlert(item)
          }}
        >
          <Text style={styles.textMessage}>{strings('Cancel')}</Text>
        </TouchableOpacity>
        }

{
          item.offerStatus === 2 && 
          item.isMarkAsDone === 1 &&
        item.isPaymentReleased === 0 && 
        campaignData.cancelledByBrand==1 && 
        campaignData.cancelledByInfluencer==0 &&
        campaignData.campaignType !== "commissionBased" &&campaignData.campaignType !== "shoutout"&&campaignData.campaignType !== "sponsored"&&
       

        <TouchableOpacity
        disabled={true}  
        style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
                console.log(JSON.stringify(item))
                this.showAlert(item)
          }}
        >
          <Text style={styles.textMessage}>{strings('Pending_Cancel')}</Text>
        </TouchableOpacity>
        }

      {
          item.offerStatus === 2 && 
          item.isMarkAsDone === 1 &&
        item.isPaymentReleased === 0 && 
        campaignData.cancelledByBrand==1 && 
        campaignData.cancelledByInfluencer==1 &&
        campaignData.campaignType !== "commissionBased" &&campaignData.campaignType !== "shoutout"&&campaignData.campaignType !== "sponsored"&&
       

        <TouchableOpacity 
        disabled={true}  
        style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer]}
          onPress={() => {
                console.log(JSON.stringify(item))
                this.showAlert(item)
          }}
        >
          <Text style={styles.textMessage}>{strings('Cancelled')}</Text>
        </TouchableOpacity>
        }

          {/*Release Payment Message  change by kuldeep 19April 2021*/}  

          {/* {item.offerStatus === 2 && item.isMarkAsDone === 1 && 
          (this.state.responseStatus === "success" || item.isPaymentReleased === 1) &&
         (this.state.responseStatus === undefined && item.isPaymentReleased === 1 ) &&
            campaignData.campaignType === "paid" &&
        <View 
        >
          <Text style={[styles.textNoPayment,{color:colors.app_green}]}>{strings('Payment_Released')}</Text>
        </View>} */}

        {
        item.offerStatus === 2 && item.isMarkAsDone === 1 && 
        item.isPaymentReleased === 1 &&
        item.isReviewgiven === 0 &&
       
       <TouchableOpacity
       onPress={() => {
       this.props.navigation.navigate("AddReview",{campaignData:campaignData,remarkdata:item})
      }}>
       <View style={{borderTopWidth:1,borderColor:colors.disable_gray_color,marginTop:metrics.dimen_15}} >
          <Text style={[styles.textwriteaReview]}>{strings('write_a_review')}</Text>
        </View></TouchableOpacity>}

        { item.offerStatus === 2 && item.isMarkAsDone === 1 && 
        // item.isPaymentReleased === 1 &&
        item.isReviewgiven === 1 &&
       
            <View style={{flexDirection: 'row',borderTopWidth:1,borderColor:colors.disable_gray_color,marginTop:metrics.dimen_15,justifyContent:"center",alignContent:"center"}} >

            <StarRating
                  containerStyle = {{marginTop:metrics.dimen_15,  width:metrics.getW(100)}}
                  disabled={true}
                      maxStars={5}
                      starSize={metrics.dimen_20}
                      // rating= {this.state.rating}
                      // starSize={18}
                      rating={ratingCount}
                      fullStarColor = {colors.RatingYellow}
                      selectedStar = {(val)=>this.setState({rating:val})}
                   />

             
               </View>}

          {/*Release Payment Error Message */}
          {/* {item.offerStatus === 2 
        //   && item.isMarkAsDone === 1 
          && (item.profile.paypal_email === null 
          || item.profile.paypal_email === "" )
          && item.isPaymentReleased === 0 && campaignData.campaignType === "paid" &&
        <View >
          <Text style={styles.textNoPayment}>{strings('No_Payment_Details_Added')}</Text>
        </View>} */}
        </View>
      </View>)

  }
  renderUserListView = (item) => {
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
        
       {item.offerStatus === 2&&item.isMarkAsDone===0
      //  &&
      //  item.isPaymentReleased === 0
       && 
       <View style={styles.ongoingViewStatus}>
        <Text style={styles.statuTitle}>
                    {"ONGOING"}
                  </Text>
        </View>}

        {item.offerStatus === 2&&item.isMarkAsDone===1&&
        // item.isPaymentReleased === 1
        // &&
        <View style={styles.completedViewStatus}>
        <Text style={styles.statuTitle}>
                    {"COMPLETED"}
                  </Text>
        </View>}


        {item.isHired===1&& (this.props.JobData.campaignType=== "commissionBased" ||this.props.JobData.campaignType == "shoutout"||this.props.JobData.campaignType == "sponsored")&&
        // item.isPaymentReleased === 1
        // &&
        <View style={styles.completedViewStatus}>
        <Text style={styles.statuTitle}>
                    {"COMPLETED"}
                  </Text>
        </View>}
       
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
                    _id: parseInt(item.ownerId, 10),
                    name: (item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : ''),
                    avatar: item.profile.avatarUrl !== null ? item.profile.avatarUrl : ''
                  }

                  join({ userId: userid })
                  this.props.navigation.navigate('ChatDetail', {
                    receiverUserId: parseInt(item.ownerId, 10),
                    recerverUserData: recerverUserData,
                    campaignId: this.props.JobData.id,
                    title: recerverUserData.name,
                    receiverUserProfile: item
                  })

                })
              }}
            >
              <Text style={styles.textMessage}>{strings('Message')}</Text>
            </TouchableOpacity>

          </View>

        </View>
      </TouchableOpacity>
    )
  }
  
  actionSheetActions = (index, userData) => {
    if (index === 0) {
      getUserId().then(userid => {
        const recerverUserData = {
          _id: parseInt(this.state.selectedItem.ownerId, 10),
          name: (this.state.selectedItem.profile.first ? this.state.selectedItem.profile.first : '') + " " + (this.state.selectedItem.profile.last ? this.state.selectedItem.profile.last : ''),
          avatar: this.state.selectedItem.profile.avatarUrl !== null ? this.state.selectedItem.profile.avatarUrl : ''
        }

        join({ userId: userid })
        this.props.navigation.navigate('ChatDetail', {
          receiverUserId: parseInt(this.state.selectedItem.ownerId, 10),
          recerverUserData: recerverUserData,
          campaignId: this.props.JobData.id,
          title: recerverUserData.name,
          receiverUserProfile: this.state.selectedItem
        })

      })
    }
    else if (index === 1) {
      //  console.log('actionSheetActions:', this.state.selectedItem)
      const campaignData = this.props.JobData
      this.props.navigation.navigate('PurchaseCampaign', { campignData: campaignData, userData: this.state.selectedItem })
      // initiatePayment(payType.card,10)
    }
  }
  
  actionReleasePayment = () => {
    const selectedUser = this.state.selectedItem
    
    //console.log('actionReleasePayment:',JSON.stringify(this.state.selectedItem) )
    const applicantStore = this.props.ApplicantListStore
    const params = {
      applicantOwnerId: selectedUser.ownerId,
      campaignId: selectedUser.campaignId,
      amount: selectedUser.offerAmount,
      receiveremail: selectedUser.profile.paypal_email !== null ? selectedUser.profile.paypal_email : ''
      
    }
    applicantStore.releasePaymentPaypal(params, this.responseCallback)


    // applicantStore.releasePayment(this.state.selectedItem.ownerId)
  }
  responseCallback=(status)=>{
    console.log('responseCallback:', status)
    this.setState({responseStatus: status})
    this.bottomSheet.open()

  }
}

export default inject("ApplicantListStore", "CompaignsStore")(observer(ApplicantTab))


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
  switchStyles: {
    //marginTop:metrics.aspectRatioHeight(12),
    marginRight: metrics.widthSize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enabledDisableText: {
    color: 'rgba(112, 129, 138, 1)',
    marginRight: 10
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.dimen_5
    // backgroundColor:'red'
  },
  containerViewCampaignDetail: {
    marginTop: metrics.aspectRatioHeight(51),
    backgroundColor: colors.app_Blue,
    borderRadius: 5,
    // width:metrics.widthSize(441),
    alignItems: 'center',
    justifyContent: 'center',
    //paddingHorizontal: metrics.widthSize(42),
    height: metrics.aspectRatioHeight(144),
    // shadowColor: colors.app_Blue,
    // shadowOpacity: 0.5,
    // shadowOffset: {width: 2, height: 2},

  },
  textCampaignDetail: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'white',
    textTransform: 'uppercase'
  },
  viewContainerSuggestedView: {
    backgroundColor: "#F6F6F6",
    borderRadius: metrics.widthSize(15),
    marginLeft: metrics.widthSize(60),
    //marginRight: metrics.widthSize(10),
    width: metrics.widthSize(480),
    marginBottom: metrics.widthSize(33)

  },
  viewImageSuggestedView: {
    marginHorizontal: metrics.widthSize(39),
    marginTop: metrics.aspectRatioHeight(54),
    flexDirection: 'row',
  },
  imageUserSuggestedView: {
    width: metrics.widthSize(150),
    height: metrics.widthSize(150),
    borderRadius: metrics.widthSize(75)
  },
  viewMessageContainer: {
    borderRadius: metrics.widthSize(6),
    borderColor: colors.app_Blue,
    borderWidth: metrics.widthSize(3),
    paddingHorizontal: metrics.widthSize(30),
    height: metrics.dimen_22,
    justifyContent: 'center',
    //paddingVertical: metrics.aspectRatioHeight(15),
    marginLeft: metrics.widthSize(39)
  },
  textMessageButton: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    textTransform: 'uppercase'
  },
  textName: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: colors.app_black,
  },
  textUserName: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
  },
  instagramView: {
    marginTop: metrics.aspectRatioHeight(33),
    marginBottom: metrics.aspectRatioHeight(42),
    // justifyContent:'center',
    flexDirection: 'row',
  },
  instagramIcon: {
    width: metrics.widthSize(66),
    height: metrics.widthSize(66),
    marginRight: metrics.widthSize(45),
  },
  // viewCount:{
  //   flexDirection:'row',
  // },
  textFollowersCount: {
    alignSelf: 'center',
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: "#3D4046",
  },
  labelFollowersPosts: {
    alignSelf: 'center',
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: colors.text_grey,
  },
  viewDetailsSuggested: {
    marginHorizontal: metrics.widthSize(39),
    marginTop: metrics.dimen_7,

  },
  viewVerticalLine: {
    height: '100%',
    width: metrics.widthSize(3),
    backgroundColor: '#E7E9EC',
    marginHorizontal: metrics.widthSize(36)

  },
  emptyListContainer: {
    marginTop: metrics.dimen_20,
    justifyContent: 'center',
    alignItems: "center"
  },
  imageEmptyComponent: {
    width: metrics.widthSize(100),
    height: metrics.widthSize(100),
  },
  labelEmptyList: {
    textAlign: 'center',
    marginTop: metrics.dimen_12,
    width: metrics.dimen_160,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_16,
    color: "#C0C4CC",
  },
  viewContainerApplicantsList: {
    backgroundColor: '#F6F6F6',
    borderRadius: metrics.dimen_5,
    marginHorizontal: metrics.dimen_10,
    marginTop: metrics.dimen_10,

  },
  viewInternalApplicantsList: {
    paddingTop: metrics.dimen_13,
    paddingBottom: metrics.dimen_18,
    paddingHorizontal: metrics.dimen_15,
  },
  viewMessageContainerApplicantsList: {
    borderRadius: metrics.dimen_3,
    borderWidth: metrics.widthSize(3),
    borderColor: "#A7B1C5",   
     paddingHorizontal: metrics.dimen_10,
    height: metrics.dimen_22,
    backgroundColor:colors.white,
    justifyContent: 'center'
  },
  textMessage: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(11),
    color: colors.app_Blue,
    alignSelf: 'center',
    textTransform: 'uppercase'
  },
  textNoPayment: {
    marginTop: metrics.dimen_10,
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.getFontSize(12),
    color: colors.app_RedColor,
    alignSelf: 'center',
  },
  textwriteaReview: {
    marginTop: metrics.dimen_14,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(15),
   
    alignSelf: 'center',
    color:'rgba(58,109,208,1)'
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
    marginRight: metrics.dimen_6,
    width: metrics.dimen_14,
    height: metrics.dimen_14,
    tintColor: colors.white
  },
  tabselected: {
    flexDirection: 'column',
    width:"50%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E8BFE'
  },
  tabunselected: {
    flexDirection: 'column',
    width:"50%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'

  },
  tabselectedtext: {
    color: "#ffffff"
  },
  tabunselectedtext: {
    color: "#4E8BFE"
  },
  tabmainstyle:
  {
    width: "94%",
    flexDirection: 'row', borderWidth: 2,
    borderColor: '#4E8BFE',
    height: metrics.dimen_35,
    marginHorizontal: metrics.dimen_10,
    borderRadius: metrics.dimen_5,
  },

  sortview: {
    flexDirection: 'row', borderWidth: 2,
    borderColor: colors.app_light_gray,
    height: metrics.dimen_35,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colors.app_light_gray,
    borderRadius: metrics.dimen_5,
  },
  headerTextStyle: {
    fontSize: metrics.text_normal,
    color: colors.light_appblue,
  },
  viewOption:{
marginTop: metrics.dimen_10
  },
  textOptionTitle:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(13),
    color: '#3E3E46',
  },
  textOptionDescription:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(13),
    color: '#3E3E46',
    flex: 1,
    //backgroundColor:'red'
  },
  ongoingViewStatus:{
    position:'absolute',
    top:metrics.dimen_45,left:-1, 
    padding:metrics.dimen_4,
    backgroundColor:colors.offerYellow 
    ,borderRadius:metrics.dimen_3, 
  },
  completedViewStatus:{
  position:'absolute',
  top:metrics.dimen_45,left:-5, 
  padding:metrics.dimen_4,
  backgroundColor:"#6BD981" 
  ,borderRadius:metrics.dimen_3,
  }, 
  statuTitle:{
    color:colors.white,
    fontFamily:metrics.Lato_Regular,
    fontSize:metrics.text_small
  }
})

