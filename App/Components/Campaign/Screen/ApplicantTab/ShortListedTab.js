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
import { getUserId, Numberformatesunit, calculateDistance, checkLocationPermission, convertCurrencybyCode,checkArrayEquals } from '../../../../SupportingFIles/Utills';
import { Switch } from 'react-native-paper';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import { join } from '../../../../Socket/index'
import { Media_Base_URL } from '../../../../API/Campaign/ApiCampaign';
import ActionSheet from 'react-native-actionsheet'
import MakeOffer from '../MakeOffer'
import Geolocation from 'react-native-geolocation-service';
import ReadMoreText from '../../../CommonComponents/ReadMoreLess'
import {
  requestOneTimePayment,
} from 'react-native-paypal';
import RBSheet from "react-native-raw-bottom-sheet";
import TransactionStatus from './Transaction/TransactionStatus'
import OfferStatusHeader from './OfferStatusHeader';

const formatCurrency = new Intl.NumberFormat('en-US')


class ShortListedTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      
    };
  }

  componentDidMount() {

   

  }

     
  
  componentWillUnmount() {
    //this.props.ApplicantListStore.setApplicantList([])
  }
  render() {
    const store = this.props.ApplicantListStore
    const { isLoading, applicantList} = store
    var applicantShortlisted=applicantList
    applicantShortlisted = applicantShortlisted.filter(obj =>obj.shortlisted===1  && obj.isPayment !== 1  && obj.remarkStatus === 1)
     
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
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
isPayment={true}/>
      </RBSheet>
        <MakeOffer modalVisible={true}
          itemData={this.state.selectedItem !== undefined ? this.state.selectedItem : null}
          hideMarkAsCompletedButton={() => this.hideMarkAsCompletedButton()}
        />
        <Loader loading={isLoading} />
        

        <FlatList
          ref={(ref) => { this.flatList = ref }}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.noItemDisplay}
          numColumns={0}
          data={applicantShortlisted}
          renderItem={({ item, index }) => {


            return this.renderApplicantsNew(item, index)

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


  resetbutton() {
    this.setState({ isSwitchOn: true })
  }
  renderSuggestedApplicant = (item, index) => {
    const urlPic = item.avatarUrl
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
    console.log(JSON.stringify(item))
    const userName = item.username.replace("@", "")
    console.log("index renderSuggestedApplicant", JSON.stringify(index))
    const followersCount = item.followers !== null ? item.followers : '0'
    const postsCount = item.totalPosts !== null ? item.totalPosts : '0'

    return (
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
            onPress={() =>
              getUserId().then(userid => {
                const recerverUserData = {
                  _id: parseInt(item.ownerId, 10),
                  name: (item.first ? item.first : '') + " " + (item.last ? item.last : ''),
                  avatar: urlPic
                }

                join({ userId: userid })
                this.props.navigation.navigate('ChatDetail', {
                  receiverUserId: parseInt(item.ownerId, 10),
                  recerverUserData: recerverUserData,
                  title: recerverUserData.name,
                  campaignId: this.props.JobData.id,
                  receiverUserProfile: item
                })

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
  renderApplicantsNew = (item, index) => {
    //console.log('renderApplicant:', JSON.stringify(item))
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

    return (
      <View

        style={styles.viewContainerApplicantsList}>
                <OfferStatusHeader item={item}/>

        {/* {item.offerStatus > 0 &&
          <View style={styleOfferView}>
            <Image source={offerIcon} style={styles.iconOffer} />
            <Text style={styles.textOfferStatus}>{`${textOffer} $${formatCurrency.format(item.offerAmount)}`}</Text>
          </View>} */}
        <View style={styles.viewInternalApplicantsList}>
          {item !== undefined && this.renderUserListView(item)}
          {item.remarkText !== '' && item.remarkText !== null &&
            <View style={{ marginTop: metrics.dimen_10 }}>
              <ReadMoreText style={{ ...commonStyles.LatoItalic_Medium }}
                seeMoreStyle={{ ...commonStyles.LatoItalic_Medium, color: colors.app_Blue }}
                seeLessStyle={{ ...commonStyles.LatoItalic_Medium, color: colors.app_Blue }}
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


            {(item.offerStatus === 0)
            && campaignData.campaignType !== "commissionBased" && campaignData.campaignType !== "shoutout"&& campaignData.campaignType !== "sponsored" &&
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
              {/* {item.offerAmount > 0 && <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer, { width: '48%', marginRight: metrics.dimen_7 }]}
                onPress={() => {

                  this.setState({
                    selectedItem: item
                  }, () => {
                    this.initiatePayPalPayment(item)
                  });
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.textHireFor}>{"HIRE FOR"}</Text>
                  <Text style={styles.textHireForprice}> {" $" + formatCurrency.format(item.offerAmount)}</Text>
                </View>

              </TouchableOpacity>} */}

              <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer, { width: item.offerAmount > 0 ? '48%' : "98%", marginLeft: metrics.dimen_7 }]}
                onPress={() => {
                  this.props.CompaignsStore.setLoading(false)
                  applicantsStore.setSelectedUser(item)
                  applicantsStore.setMakeOfferPopupStatus(true)
                }}
              >
                <Text style={styles.textHireFor}>{"COUNTER OFFER"}</Text>




              </TouchableOpacity>


            </View>}

          {(item.offerStatus === 1)
            && campaignData.campaignType !== "commissionBased" && campaignData.campaignType !== "shoutout"&& campaignData.campaignType !== "sponsored" &&
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>


              <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer, { width: "100%" }]}
                onPress={() => {
                  this.props.CompaignsStore.setLoading(false)
                  applicantsStore.setSelectedUser(item)
                  applicantsStore.setMakeOfferPopupStatus(true)
                }}
              >
                <Text style={styles.textHireFor}>{"UPDATE OFFER"}</Text>




              </TouchableOpacity>


            </View>}


          {/* {item.offerStatus === 2 && item.isPayment === 0 &&
            campaignData.campaignType !== "commissionBased" && campaignData.campaignType !== "shoutout"&& campaignData.campaignType !== "sponsored" &&

              <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer, { width: '100%', marginRight: metrics.dimen_7 }]}
                onPress={() => {
                  this.setState({
                    selectedItem: item
                  }, () => {
                    this.initiatePayPalPayment(item)
                  });
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.textHireFor}>{"HIRE FOR"}</Text>
                  <Text style={styles.textHireForprice}> {" $" + formatCurrency.format(item.offerAmount)}</Text>
                </View>


              </TouchableOpacity>} */}

          {/*Hire button for free campaign */}
          {item.offerStatus === 0 && (campaignData.campaignType === "commissionBased" || campaignData.campaignType === "shoutout"||campaignData.campaignType === "sponsored") &&


              <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer, { width: '100%', marginRight: metrics.dimen_7 }]}
                onPress={() => {
                  this.props.CompaignsStore.hireInfluencer(item.id, item.ownerId)
                  this.props.ApplicantListStore.setReloadApplicantsList(true, campaignData.id)
                }}
              >
                <Text style={styles.textHireFor}>{strings('HIRE_NOW')}</Text>
              </TouchableOpacity>
              
          }


            

            {/* {(item.offerStatus === 0  )  */}
          {/* {(item.offerStatus === 0 || item.offerStatus === 2 ) 
          && campaignData.campaignType === "paid"  ?
          <View style={{ flexDirection:'row',justifyContent:'center',alignItems:'center', }}>
            <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer,{width:'48%',marginRight:metrics.dimen_7}]}
              onPress={() => {
                if(item.offerStatus === 0)
                {
                  applicantsStore.setSelectedUser(item)
                  applicantsStore.setMakeOfferPopupStatus(true)
                }
                else
                {
                  this.setState({
                    selectedItem: item
                }, () => {
                  this.initiatePayPalPayment()      
                 });
                }
               
              }}
            >
             <Text style={styles.textMessage}>{ 
              item.offerStatus === 0 ?
              strings('MAKE_OFFER') : strings('MAKE_PAYMENT')
              }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer,{width:'48%',marginLeft:metrics.dimen_7}]}
              onPress={() => {
                applicantsStore.remarkShortlisted(item.id,0,campaignData.id)
              }}
            >
              <Text style={styles.textMessage}>{strings('Remove')}</Text>
             
          
              
            </TouchableOpacity>
            </View>:<TouchableOpacity style={[styles.viewMessageContainerApplicantsList, styles.makePaymentContainer,{marginLeft:metrics.dimen_7}]}
              onPress={() => {
                applicantsStore.remarkShortlisted(item.id,0,campaignData.id)
              }}
            >
              <Text style={styles.textMessage}>{strings('Remove')}</Text>
             
          
              
            </TouchableOpacity>} */}

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
  renderUserListView = (item) => {
    const urlPic = item.profile.avatarUrl
    const imageUrl = (urlPic == null || urlPic === "NA" || urlPic === "") ? images.userPlaceholder : { uri: urlPic }
    const userName = item.profile.username.replace("@", "")

    return (
      <View>
      <ActionSheet
        ref={(el) => { this.ActionSheet = el }}
        // ref={o => this.ActionSheet = o}
        // title={'Which one do you like ?'}
          options={['Send Message','Remove',  'Cancel']}

        // options={['Send Message', 'Cancel']}

        cancelButtonIndex={2}
        //destructiveButtonIndex={1}
        onPress={(index) => {

          this.actionSheetActions(index, this.state.selectedItem)
        }}
      />
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

              {/* {item.profile.followers > 0 &&
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
                </View>} */}
            </View>
            <TouchableOpacity style={styles.imageChatContentView}
              onPress={() => {

                this.setState({ selectedItem: "" })
                this.setState({ selectedItem: item })
                this.showActionSheet(item)
              }}
            >
             <Image source={images.more}
                  style={styles.imageChat} />
            </TouchableOpacity>

          </View>
          <View style={{ flexDirection: 'row' ,marginLeft:metrics.dimen_12 }}>
          {item.profile.followers > 0 && <View style={styles.viewInstaFollowers}>
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

            {item.offerStatus ===1&&<View style={{position:'absolute',right:0,flexDirection:'row'}}>
             <Text style={styles.textofferStatusPrice}>
                    {"$"+formatCurrency.format(item.offerAmount)}
                  </Text>
                  <Text style={[styles.textFollower,{color:"#A7B1C5"}]}>
                    {"Service Fee"}
                  </Text>
      </View>}
            
          </View>
        </View>
      </TouchableOpacity></View>
    )
  }


  // renderApplicant = (item) => {
  //   const urlPic = item.profile.avatarUrl
  //   const imageUrl = urlPic == null ? images.userPlaceholder : { uri: urlPic }
  //   console.log('renderApplicant:', JSON.stringify(item))
  //   const userName = item.profile.username.replace("@", "")

  //   return (
  //     <View style={{ width: '100%', flexDirection: 'row', paddingLeft: metrics.dimen_20, backgroundColor: 'white' }}>
  //       <ActionSheet
  //         ref={(el) => { this.ActionSheet = el }}
  //         // ref={o => this.ActionSheet = o}
  //         // title={'Which one do you like ?'}
  //         options={['Send Message','REMOVE',  'Cancel']}
  //         // options={['Send Message', 'Cancel']}

  //         cancelButtonIndex={2}
  //         //destructiveButtonIndex={1}
  //         onPress={(index) => {

  //           this.actionSheetActions(index, this.state.selectedItem)
  //         }}
  //       />
  //       <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}>
  //         <FastImage
  //           style={styles.profileImage}
  //           source={imageUrl}
  //           resizeMode={FastImage.resizeMode.cover}
  //         />
  //       </TouchableOpacity>
  //       <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
  //         accessible={false}>

  //         <View style={{ flex: 1 }}>
  //           <View style={{ flexDirection: 'row', marginBottom: metrics.dimen_6, justifyContent: 'space-between' }}>
  //             <View style={{ marginLeft: metrics.dimen_12, width: '50%', }}>
  //               <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_gray }}
  //                 onPress={() => this.props.navigation.navigate('UserProfile', { UserData: item.profile })}
  //               >{(item.profile.first ? item.profile.first : '') + " " + (item.profile.last ? item.profile.last : '')}</Text>
  //               <Text style={{ ...commonStyles.LatoSemiBold_Small, color: 'rgba(122, 129, 138, 1)', marginTop: metrics.dimen_3, }}>@{userName}</Text>

  //               {item.profile.followers > 0 &&
  //                 <View style={styles.viewInstaFollowers}>
  //                   <Image style={{
  //                     width: metrics.dimen_12,
  //                     height: metrics.dimen_12,
  //                   }} source={images.instaLineIcon}></Image>
  //                   <Text style={styles.textFollowerCount}>
  //                     {Numberformatesunit(item.profile.followers)}
  //                   </Text>
  //                   <Text style={styles.textFollower}>
  //                     {strings('Followers')}
  //                   </Text>
  //                 </View>}
  //             </View>
  //             <TouchableOpacity style={styles.imageChatContentView}
  //               onPress={() => {


  //                 this.showActionSheet(item)


               
  //               }}
  //             >
  //               <Image source={images.more}
  //                 style={styles.imageChat} />
  //             </TouchableOpacity>

  //           </View>
  //           <View style={{ marginLeft: metrics.dimen_12 }}>
  //             <ReadMore
  //               numberOfLines={2}
  //               renderTruncatedFooter={this._renderTruncatedFooter}
  //               renderRevealedFooter={this._renderRevealedFooter}
  //             >
  //               <Text style={{ ...commonStyles.LatoItalic_Medium }}>{decodeURIComponent(item.remarkText)}</Text>
  //             </ReadMore>
  //           </View>
  //         </View>
  //       </TouchableWithoutFeedback>
  //     </View>
  //   )
  // }
  

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
    this.setState({ selectedItem: item })
    this.ActionSheet.show()
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
      const campaignData = this.props.JobData

      this.props.ApplicantListStore.remarkShortlisted(userData.id,0,campaignData.id)
    }
  }
  initiatePayPalPayment = async (selectedUser) => {
  
    this.props.navigation.navigate('PayPalWebview', {
      amount: selectedUser.offerAmount,
      applicantOwnerId: selectedUser.ownerId,
      campaignId: selectedUser.campaignId,
      ownerId: this.props.JobData.ownerId,
      onClosePaymentPopup: this.onClosePaymentPopup,
      responseCallback: this.responseCallback
    })


    
  }
  actionReleasePayment = () => {

    //console.log('actionReleasePayment:',JSON.stringify(this.state.selectedItem) )
    const applicantStore = this.props.ApplicantListStore
    const params = {
      ownerId: this.state.selectedItem.ownerId,
      campaignId: this.props.JobData.id,
      payoutAmount: this.state.selectedItem.offerAmount
    }
    applicantStore.onRelaseCampaignAmount(params)
    // applicantStore.releasePayment(this.state.selectedItem.ownerId)
  }
  responseCallback=(status)=>{
    console.log('responseCallback:', status)
    this.setState({responseStatus: status})
    this.bottomSheet.open()

  }
}

export default inject("ApplicantListStore", "CompaignsStore")(observer(ShortListedTab))


const styles = StyleSheet.create({
  profileImage: {
    width: metrics.dimen_60,
    height: metrics.dimen_60
  },
  seperatorStyle: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
    height: metrics.dimen_1,
  },
 

  imageChat: {
    alignSelf: 'flex-end',
    tintColor: '#C0C4CC',
    width: metrics.dimen_18,
    height: metrics.dimen_18,
    marginTop: metrics.dimen_15,
   
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
    marginTop:metrics.dimen_20,
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
    justifyContent: 'center',
    backgroundColor: colors.white
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
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(13),
    color: colors.app_Blue,
    alignSelf: 'center',
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
  tabselected:{
    flexDirection: 'column', 
    flex: 0.5, 
    justifyContent: 'center',
     alignItems: 'center',
     backgroundColor:'#3978CF'
  },
  tabunselected:{
    flexDirection: 'column', 
    flex: 0.5, 
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor:'#ffffff'

  },
  tabselectedtext:{
    color:"#ffffff"
  },
  tabunselectedtext:{
   color:"#3978CF"
  },
  tabmainstyle:
  {
    flex: 1, flexDirection: 'row', borderWidth: 2,
          borderColor: '#3978CF',
          height:metrics.dimen_50,
          marginHorizontal:metrics.dimen_10,
          borderRadius: metrics.dimen_5, 
  },
  textHireFor: {
    fontFamily: metrics.Lato,
    fontSize: metrics.getFontSize(12),
    color: "#3E3E46",
    alignSelf: 'center',

    textTransform: 'uppercase'
  },
  textHireForprice: {
    fontFamily: metrics.Lato,
    fontSize: metrics.getFontSize(12),
    color: colors.app_Blue,
    alignSelf: 'center',
    textTransform: 'uppercase'
  },
  imageChatContentView: {
    marginLeft: metrics.dimen_10,
    width: metrics.getHeightAspectRatio(48),
    height: metrics.getHeightAspectRatio(48),
    //backgroundColor:'red',
    marginTop: -metrics.dimen_15
  },
})

