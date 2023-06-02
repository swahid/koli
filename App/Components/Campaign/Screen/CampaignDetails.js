import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  TextInput,
  TouchableHighlight,
  Modal,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import {strings} from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import {commonStyles} from '../../../SupportingFIles/Constants';
import Moment from 'moment';
import Share from 'react-native-share';
import ActionSheet from 'react-native-actionsheet';
import Report from './Report';
import Slideshow from '../../../SupportingFIles/Slideshow';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import {Avatar} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
const formatCurrency = new Intl.NumberFormat('en-US');
import {
  gettUserData,
  kFormatter,
  convertCurrencybyCode,
  NumberformatesunitUptoOneDecimal,
  getUserId,
  getParams,
  generateFirebaseCampaignlink,
} from '../../../SupportingFIles/Utills';
import CampaignDetailSkeleton from '../../CommonComponents/CampaignDetailSkeleton';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeesInfoPoup from './CampaignResuableComponent/FeesInfoPoup';
import CampaignOfferStatus from './CampaignResuableComponent/CampaignOffeStatus';
import RaiseDispute from './CampaignResuableComponent/RaiseDispute';
import {join} from '../../../Socket/index';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import CounterOffer from './CampaignResuableComponent/CounterOffer';
var currentdatetoday = new Date();
var currentdate = Moment(currentdatetoday).format('YYYY-MM-DD');
import CommentView from './CampaignResuableComponent/LikeCommentView';
import moment from 'moment';

var context = null;

class CampaignDetails extends Component {
  constructor(props) {
    super(props);
    context = this;
    this.state = {
      ownerid: '',
      isAppliedInitiate: false,
      profileupdate: false,
      userloginID: '',
      raisdisputeview: false,
      enterFeesValidation: false,
      alertVisibility: false,
      RequiredParameter: '',
    };
  }
  componentDidMount() {
    this.unsubscribe = dynamicLinks().onLink((url) => {
      const params = getParams(url.url);
      this.checkForCampaignData(params.params);
    });
    //this.props.CompaignsStore.campaignDetails(this.props.route.params.data.id)
    this.props.navigation.setOptions({
      headerRight: () => (
        // this.props.AuthStore.isLogin &&
        <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>
          {/* <TouchableOpacity onPress={() => { context.generatelinklink() }}>
            <Image source={images.ShareIcon} style={{ marginRight: metrics.dimen_20 }} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => context.showActionSheet()}>
            <Image source={images.MoreIcon} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{...commonStyles.backButtonContainer}}
          onPress={() => this.props.navigation.goBack()}>
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
    });

    gettUserData().then((data) => {
      // if (data.avatarUrl && data.gender && data.email && data.first && data.last && data.country && data.bio && data.interests.length > 0 && data.instaUsername && data.facebookUsername && data.instaPerPost > 0 && data.facebookPerPost > 0) {

      if (
        data !== undefined &&
        data.ownerId !== undefined &&
        data.ownerId !== null
      ) {
        this.setState({ownerid: data.ownerId});
      }
    });
  }

  componentWillMount() {
    this.props.navigation.addListener('focus', () => {
      this.checkForCampaignData(this.props.route.params.data.id);

      this.props.CompaignsStore.getCampaignStatus(
        this.props.route.params.data.id,
      );
      this.props.CompaignsStore.setCampaignReported(false);
      this.props.CompaignsStore.setReport('');
      //this.props.CompaignsStore.setCampaignApplied(false)
      // this.props.CompaignsStore.setCampaignStatus(null)
      this.props.CompaignsStore.setJobAwarded(null);
      this.props.CompaignsStore.geApplicantcountbaseoncampaign(
        this.props.route.params.data.id,
      );
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkForCampaignData = (campaignId) => {
    //const campaignIdFromNavigation = this.props.route.params.data.id
    const campaignData = this.props.CompaignsStore.campaignDetailData;
    //console.log("campaignData:", JSON.stringify(campaignData))
    //console.log("checkForCampaignData:", campaignId)

    this.props.CompaignsStore.campaignDetails(campaignId);
    // if(campaignData.id !== campaignId)
    // {
    //   this.props.CompaignsStore.campaignDetails(campaignId)
    // }
  };

  // raiseDisputeView=()=>
  //         {
  //         return (
  //           <View style={{paddingHorizontal:metrics.dimen_2}}>
  //           <Text style={[styles.textPopupTitle,
  //             {alignSelf:'center', fontSize:metrics.text_large, fontFamily:metrics.Lato_Bold}]}>
  //             {'Raise Dispute'}</Text>

  //       <View>
  //       <TextInput style={[styles.multilineTextInputStyle,

  //       styles.textInputRaiseDispute
  //       ]}
  //       placeholder={strings('Please_provide_dispute_reason')}
  //       multiline={true}
  //       autoCapitalize="none"
  //       autoCorrect={false}
  //       autoCompleteType="off"
  //       value={this.props.CompaignsStore.campaignRemark}
  //       onChangeText={(text) => { this.props.CompaignsStore.setCampaignRemark(text) }}
  //       />

  //       </View>

  //       <TouchableOpacity activeOpacity={0.8} style={{ ...styles.ApplyButton }}
  //         onPress={() => {
  //           //this.onApply(data)
  //           this.checkUserUpdatedData(data)
  //         }
  //         }
  //       >
  //         <Text style={{ ...commonStyles.LatoBold_16, color: 'white',  textTransform: 'uppercase',alignItems:'center' }}>{strings('Apply')}</Text>
  //       </TouchableOpacity>
  //       </View>
  //         );
  //       }

  applyCampaignView = (data) => {
    return (
      <View style={{paddingHorizontal: metrics.dimen_2}}>
        <Text
          style={[
            styles.textPopupTitle,
            {
              alignSelf: 'center',
              fontSize: metrics.text_large,
              fontFamily: metrics.Lato_Bold,
            },
          ]}>
          {'Apply for Campaign'}
        </Text>

        {data.campaignType !== 'commissionBased' &&
        data.campaignType !== 'shoutout' &&
        data.campaignType !== 'sponsored' ? (
          <Text
            style={{
              ...commonStyles.LatoSemiBold_Normal,
              color: 'rgba(62, 62, 70, 1)',
              marginTop: metrics.dimen_20,
              marginHorizontal: metrics.dimen_20,
            }}>
            {strings('enter_MyFee') + ' *'}
          </Text>
        ) : null}

        {data.campaignType !== 'commissionBased' &&
        data.campaignType !== 'shoutout' &&
        data.campaignType !== 'sponsored' ? (
          <View style={[styles.TextInputStyle]}>
            <Text style={[styles.inputTextFieldStyle]}>{strings('USD')}</Text>

            <TextInput
              style={{
                width: '100%',
                backgroundColor: colors.clear,
                paddingLeft: metrics.dimen_5,
                height: metrics.dimen_45,
              }}
              placeholder={'250'}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="off"
              keyboardType="numeric"
              value={this.props.CompaignsStore.MyBidFee}
              onChangeText={(text) => {
                this.setUpdateMyBidFee(text);
              }}
            />
          </View>
        ) : null}
        {data.campaignType !== 'commissionBased' &&
          data.campaignType !== 'shoutout' &&
          data.campaignType !== 'sponsored' &&
          this.state.enterFeesValidation && (
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: colors.app_red,
                marginTop: metrics.dimen_2,
                marginHorizontal: metrics.dimen_20,
              }}>
              {this.props.CompaignsStore.MyBidFee === ''
                ? strings('Please_enter_myfee')
                : 'Minimum fee amount should be $1'}
            </Text>
          )}

        <Text
          style={{
            ...commonStyles.LatoSemiBold_Normal,
            color: 'rgba(62, 62, 70, 1)',
            marginTop: metrics.dimen_20,
            marginHorizontal: metrics.dimen_20,
          }}>
          {strings('Message_To_Brand')}
        </Text>

        <View>
          <TextInput
            style={[styles.multilineTextInputStyle, styles.textInputRemark]}
            placeholder={strings('Enter_Remark')}
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="off"
            value={this.props.CompaignsStore.campaignRemark}
            onChangeText={(text) => {
              this.props.CompaignsStore.setCampaignRemark(text);
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{...styles.ApplyButton}}
          onPress={() => {
            //this.onApply(data)
            this.checkUserUpdatedData(data);
          }}>
          <Text
            style={{
              ...commonStyles.LatoBold_16,
              color: 'white',
              textTransform: 'uppercase',
              alignItems: 'center',
            }}>
            {strings('Apply')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  setUpdateMyBidFee(text) {
    this.props.CompaignsStore.setMyBidFee(text);
    this.setState({enterFeesValidation: false});
  }

  render() {
    const data = this.props.CompaignsStore.campaignDetailData;
    console.log('------>', JSON.stringify(data));
    const {
      jobAwarded,
      isLoading,
      showReport,
      jobStatus,
      campaignStatusLoading,
      campaignAppliedRemarkId,
      appliedRemarkData,
      campaignByRemarklist,
      campaignRemark,
      appliedForCampaign,
      MyBidFee,
      isPaymentReleased,
    } = this.props.CompaignsStore;

    var campaignCategoriesArray =
      data.campaignCategories !== undefined ? data.campaignCategories : [];
    const imageUrl = data.profile
      ? data.profile.avatarUrl == null ||
        data.profile.avatarUrl === '' ||
        data.profile.avatarUrl === 'NA'
        ? images.userPlaceholder
        : {uri: data.profile.avatarUrl}
      : '';
    const feesData = data ? this.getFeesData(data) : null;

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        {/* <Loader loading={isLoading}/> */}

        {(isLoading || campaignStatusLoading) && <CampaignDetailSkeleton />}

        <Modal
          visible={this.state.alertVisibility}
          transparent={true}
          animationType={'fade'}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.Alert_Main_View}>
              <Text style={styles.Alert_Title}>{'Profile Update'}</Text>
              <View style={styles.Alert_Message}>
                <Text style={styles.Alert_Messagetext}>
                  {strings(
                    'Please_update_missing_details_from_your_Profile_to_continue_applying_on_Collaborations_Jobs',
                  )}
                </Text>

                <Text style={styles.Alert_MessageMissingtext}>
                  {'Missing details : ' + this.state.RequiredParameter}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: colors.white,
                }}
              />

              <View style={{flexDirection: 'row', padding: metrics.dimen_8}}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={this.ok_Button}
                  activeOpacity={0.7}
                  onPress={() => {
                    this.setState({alertVisibility: false});
                  }}>
                  <Text style={styles.TextStyleDoItLater}>
                    {strings('Do_it_Later')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: colors.white,
                  }}
                />
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    this.fetchUserData();
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.TextStyle}>{strings('Update_Now')} </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <RBSheet
          ref={(ref) => {
            this.bottomSheet = ref;
          }}
          height={
            data.campaignType !== 'commissionBased' &&
            data.campaignType !== 'shoutout' &&
            data.campaignType !== 'sponsored'
              ? metrics.dimen_360
              : metrics.dimen_280
          }
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopLeftRadius: metrics.dimen_30,
              borderTopRightRadius: metrics.dimen_30,
            },
            draggableIcon: {
              backgroundColor: colors.white,
            },
          }}>
          {this.applyCampaignView(data)}
        </RBSheet>

        <RaiseDispute
          modalVisible={true}
          itemData={data !== [] ? data : null}
        />
        <CounterOffer
          modalVisible={this.state.showcounterOffer}
          appliedRemarkData={appliedRemarkData}
          counterOfferStatusUpdate={() => this.counterOfferStatusUpdate()}
        />

        <ActionSheet
          accessible={true}
          ref={(o) => {
            this.ActionSheet = o;
          }}
          // ref={o => this.ActionSheet = o}
          // title={'Which one do you like ?'}
          options={
            parseInt(this.state.ownerid, 10) !== parseInt(data.ownerId, 10)
              ? [
                  strings('send_message'),
                  strings('Raise_dispute'),
                  strings('Report'),
                  strings('Cancel'),
                ]
              : [strings('Raise_dispute'), strings('Report'), strings('Cancel')]
          }
          cancelButtonIndex={
            parseInt(this.state.ownerid, 10) !== parseInt(data.ownerId, 10)
              ? 3
              : 2
          }
          // destructiveButtonIndex={0}
          onPress={(index) => {
            parseInt(this.state.ownerid, 10) !== parseInt(data.ownerId, 10)
              ? this.actionSheetActions(index, data)
              : this.actionSheetActionSelfProfile(index, data);
          }}
          // onPress={(index) => {if(index === 2){
          //   setTimeout(() => {
          //     this.props.CompaignsStore.setShowReport(true)
          //   }, 1000);
          // } }}
        />

        <Report
          show={showReport}
          onClose={this.onCloseReport}
          title={data.campaignTitle}
          campaignData={data}
          fromUserReport={false}
        />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Slideshow
            // onPress={() => this.onPropertySelect(item, index) }
            //height={metrics.width - metrics.dimen_48}
            width={metrics.width}
            dataSource={data.campaignGallery ? data.campaignGallery : []}
            indicatorColor={colors.white}
            indicatorSelectedColor={colors.indicaterselected}
            arrowSize={0}
            titleStyle={{marginTop: 50, color: 'red'}}
            containerStyle={styles.imageContainer}
            isCampaignDetail={true}
          />
          <CommentView campaignData={data} navigation={this.props.navigation} />
          {data.profile !== undefined && (
            <TouchableOpacity
              onPress={() => this.OpenUserProfile(data.profile)}>
              <View style={styles.ProfileView}>
                <Image
                  source={imageUrl ? imageUrl : images.userPlaceholder}
                  fallback
                  defaultSource={images.userPlaceholder}
                  style={styles.userImageStyle}
                />

                <View
                  style={{
                    marginTop: metrics.dimen_5,
                    marginLeft: metrics.dimen_12,
                  }}>
                  <Text numberOfLines={1} style={[styles.title]}>
                    {data.profile.first + ' ' + data.profile.last}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{...styles.addresTextStyle, width: '48%'}}>
                      {data.profile.country}
                    </Text>
                    {/* <Text style = {{...styles.addresTextStyle, }}>{ strings('Posted_On') + " : " + Moment(data.createdAt).format('DD MMM, YYYY')}</Text> */}
                  </View>
                  {/* <Text numberOfLines={1} style={[styles.subtitle]}>{data.profile.username ? "@" + data.profile.username : ""}</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          )}
          <View
            style={{
              borderBottomColor: colors.app_light_gray,
              borderBottomWidth: 1,
            }}
          />

          <View
            style={{
              position: 'absolute',
              top: metrics.dimen_10,
              right: metrics.dimen_8,
              backgroundColor:
                data.endStoryPostDate >= currentdate
                  ? colors.app_green
                  : colors.app_red,
              borderRadius: metrics.dimen_2,
            }}>
            {/* <Text style={{fontFamily:metrics.Lato_Bold,fontSize:metrics.text_small, paddingLeft:metrics.dimen_5,paddingRight:metrics.dimen_4,paddingTop:metrics.dimen_2,paddingBottom:metrics.dimen_2,color:colors.white}}>{data.endStoryPostDate>=currentdate?strings('Open'):strings('Expired')}</Text> */}
          </View>
          {/* <FastImage
          style={{width: '100%', height: (metrics.width)/1.43}}
          source={{
            uri: data.campaignImage.length > 30 ? data.campaignImage : Media_Base_URL + data.campaignImage,
            priority: FastImage.priority.normalÆ’
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> */}
          <View style={{marginHorizontal: metrics.dimen_16}}>
            <Text
              style={{
                ...commonStyles.LatoBold_16,
                marginTop: metrics.dimen_16,
              }}>
              {data.campaignTitle}
            </Text>

            {data.comments && data.comments.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  gettUserData().then((Userdata) => {
                    this.props.navigation.navigate('UserComment', {
                      campaignData: data,
                      userProfileUrl: Userdata ? Userdata.avatarUrl : '',
                      Userdata: Userdata,
                    });
                  });
                }}>
                <Text
                  style={{
                    fontFamily: metrics.Lato_Regular,
                    fontSize: metrics.text_medium,
                    marginTop: metrics.dimen_8,
                    color: '#7A818A',
                  }}>
                  {'View all ' + data.comments.length + ' comments'}
                </Text>
              </TouchableOpacity>
            ) : null}

            {data.campaignType !== 'commissionBased' &&
            data.campaignType !== 'shoutout' &&
            data.campaignType !== 'sponsored' &&
            jobStatus === 1 &&
            appliedRemarkData.offerStatus !== 3 ? (
              <CampaignOfferStatus
                campaignData={data}
                appliedRemarkData={appliedRemarkData}
                statusUpdate={() => this.StatusUpdate()}
                statusUpdateDelete={() => this.StatusUpdateDelete()}
                hideCounterOfferPopup={() => this.hideCounterOfferPopup()}
              />
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: metrics.dimen_20,
              }}>
              <View
                style={{
                  backgroundColor:
                    data.campaignType === 'shoutout'
                      ? '#58DC72'
                      : data.campaignType === 'paid'
                      ? colors.app_Blue
                      : '#FFC107',
                  paddingHorizontal: metrics.dimen_13,
                  height: metrics.dimen_25,
                  borderRadius: metrics.dimen_13,
                  justifyContent: 'center',
                }}>
                {data.campaignType === 'shoutout' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {'Shoutout Exchange'}
                  </Text>
                )}
                {data.campaignType === 'paid' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Paid: ${
                      convertCurrencybyCode(data.campaignAmountCurrency) +
                      formatCurrency.format(data.campaignAmount)
                    }`}
                  </Text>
                )}
                {data.campaignType === 'sponsored' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Product Sponsor: ${
                      convertCurrencybyCode(data.campaignAmountCurrency) +
                      formatCurrency.format(data.campaignAmount)
                    }`}
                  </Text>
                )}
                {data.campaignType === 'commissionBased' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Commission Based: ${
                      formatCurrency.format(data.campaignAmount) + ' ' + '%'
                    }`}
                  </Text>
                )}

                {data.campaignType === 'eventsAppearence' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Events Appearance: ${
                      convertCurrencybyCode(data.campaignAmountCurrency) +
                      formatCurrency.format(data.campaignAmount)
                    }`}
                  </Text>
                )}
                {data.campaignType === 'photoshootVideo' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Photo / Video Shoot: ${
                      convertCurrencybyCode(data.campaignAmountCurrency) +
                      formatCurrency.format(data.campaignAmount)
                    }`}
                  </Text>
                )}
              </View>
              {/* } */}
              <View
                style={{
                  alignItems: 'center',
                  marginRight: -metrics.dimen_10,
                  height: 25,
                  justifyContent: 'center',
                }}>
                {data.campaignType === 'shoutout' && (
                  <Text style={[styles.tagTextStyle]}>
                    {this.returnShoutoutContent(data)}
                  </Text>
                )}

                {data.remarks !== undefined &&
                  data.campaignType !== 'shoutout' && (
                    <Text style={[styles.tagTextStyle]}>
                      {data.remarks.length > 0
                        ? `${campaignByRemarklist.length} ${strings(
                            'Applications',
                          )}`
                        : `${strings('New_Listing')}`}
                    </Text>
                  )}

                {/* </View> */}
              </View>
            </View>

            {data.campaignType === 'shoutout' ? null : (
              <Text
                style={{
                  ...commonStyles.LatoBold_12,
                  color: 'rgba(112, 129, 138, 1)',
                  marginTop: metrics.dimen_15,
                }}>
                {data.campaignType !== 'paid'
                  ? strings('ProductValue')
                  : strings('Campaigns_budget')}
              </Text>
            )}
            {data.campaignType === 'shoutout' ? null : (
              <Text
                style={{
                  ...commonStyles.LatoSemiBold_Normal,
                  color: 'rgba(62, 62, 70, 1)',
                  marginTop: metrics.dimen_6,
                }}>{`${
                data.campaignType === 'commissionBased'
                  ? formatCurrency.format(data.campaignAmount) + ' %'
                  : convertCurrencybyCode(data.campaignAmountCurrency) +
                    formatCurrency.format(data.campaignAmount)
              }`}</Text>
            )}

            {data.profile !== undefined && data.profile.followers > 0 ? (
              <Text
                style={{
                  ...commonStyles.LatoBold_12,
                  color: 'rgba(112, 129, 138, 1)',
                  marginTop: metrics.dimen_20,
                }}>
                {strings('My_Followers')}
              </Text>
            ) : null}
            {data.profile !== undefined && data.profile.followers > 0 ? (
              <Text
                style={{
                  ...commonStyles.LatoSemiBold_Normal,
                  color: 'rgba(62, 62, 70, 1)',
                  marginTop: metrics.dimen_6,
                }}>
                {NumberformatesunitUptoOneDecimal(data.profile.followers)}
              </Text>
            ) : null}

            <Text
              style={{
                ...commonStyles.LatoBold_12,
                color: 'rgba(112, 129, 138, 1)',
                marginTop: metrics.dimen_20,
              }}>
              {strings('Description_withouts')}
            </Text>
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(62, 62, 70, 1)',
                marginTop: metrics.dimen_6,
              }}>
              {data.campaignDetails}
            </Text>

            <Text
              style={{
                ...commonStyles.LatoBold_12,
                color: 'rgba(112, 129, 138, 1)',
                marginTop: metrics.dimen_20,
              }}>
              {strings('Expiry_Date')}
            </Text>
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(62, 62, 70, 1)',
                marginTop: metrics.dimen_6,
              }}>
              {data.endStoryPostDate !== null ||
              data.endStoryPostDate !== undefined
                ? moment(data.endStoryPostDate).format('DD/MM/YYYY')
                : ''}
            </Text>

            {campaignCategoriesArray.length > 0 && (
              <Text
                style={{
                  ...commonStyles.LatoBold_12,
                  color: 'rgba(112, 129, 138, 1)',
                  marginTop: metrics.dimen_20,
                }}>
                {strings('Category')}
              </Text>
            )}
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(62, 62, 70, 1)',
                marginTop: metrics.dimen_6,
                textTransform: 'capitalize',
              }}>
              {campaignCategoriesArray.join(', ')}
            </Text>
            {/* {campaignCategoriesArray.length > 0 && 
      <View style = {{flexWrap: 'wrap', flexDirection: 'row', flex : 1}}>
      {campaignCategoriesArray.map(item =>{
            return(
              <Text style = {[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                {item.toUpperCase()}
                </Text>
              )
        })}
      </View>
      } */}

            {data.country !== null || data.country !== undefined ? (
              <Text
                style={{
                  ...commonStyles.LatoBold_12,
                  color: 'rgba(112, 129, 138, 1)',
                  marginTop: metrics.dimen_20,
                }}>
                {strings('Location')}
              </Text>
            ) : null}
            {data.country !== null || data.country !== undefined ? (
              <Text
                style={{
                  ...commonStyles.LatoSemiBold_Normal,
                  color: 'rgba(62, 62, 70, 1)',
                  marginTop: metrics.dimen_6,
                }}>
                {data.country}
              </Text>
 ) : null}
            {/* <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>{ strings('Product_Shipped')}</Text>
      <Text style = {{...commonStyles.LatoSemiBold_Normal, color: 'rgba(62, 62, 70, 1)', marginTop: metrics.dimen_6}}>{data.shipping ? strings('Yes'): strings('No')}</Text> */}

            <Text
              style={{
                ...commonStyles.LatoBold_12,
                color: 'rgba(112, 129, 138, 1)',
                marginTop: metrics.dimen_20,
              }}>
              {strings('Preferred_gender')}
            </Text>
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(62, 62, 70, 1)',
                marginTop: metrics.dimen_6,
                textTransform: 'capitalize',
              }}>
              {data.lookingInfluencerGender}
            </Text>

            <Text
              style={{
                ...commonStyles.LatoBold_12,
                color: 'rgba(112, 129, 138, 1)',
                marginTop: metrics.dimen_20,
              }}>
              {strings('InfluencerAge')}
            </Text>
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: 'rgba(62, 62, 70, 1)',
                marginTop: metrics.dimen_6,
                textTransform: 'capitalize',
              }}>
              {data.minAge === 0 && data.maxAge === 0
                ? 'Any'
                : data.minAge + ' - ' + data.maxAge}
            </Text>

            {data.minimumFollowers > 0 && (
              <Text
                style={{
                  ...commonStyles.LatoBold_12,
                  color: 'rgba(112, 129, 138, 1)',
                  marginTop: metrics.dimen_20,
                }}>
                {strings('minimum_followers')}
              </Text>
            )}
            {data.minimumFollowers > 0 && (
              <Text
                style={{
                  ...commonStyles.LatoSemiBold_Normal,
                  color: 'rgba(62, 62, 70, 1)',
                  marginTop: metrics.dimen_6,
                }}>
                {kFormatter(data.minimumFollowers)}
                {/* {formatCurrency.format(data.minimumFollowers)} */}
              </Text>
            )}
            {/* <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>{ strings('Delivered_on')}</Text>
      <Text style = {{...commonStyles.LatoSemiBold_Normal, color: 'rgba(62, 62, 70, 1)', marginTop: metrics.dimen_6}}>{Moment(data.endStoryPostDate).format('DD MMM, YYYY')}</Text> */}

            {/* <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>{ strings('Website_Product_Swipe-up Link')}</Text> */}
            {/* <Text style = {{...commonStyles.LatoSemiBold_Normal, color: colors.app_Blue, marginTop: metrics.dimen_6}} 
      onPress={ ()=> {
        let link = data.productUrl
        if (!link.toLowerCase().startsWith('https', 0) || !link.toLowerCase().startsWith('www', 0)) {
          link = 'https://' + link
        }
        Linking.openURL(link) 
      }}
      >
        {data.productUrl}
      </Text> */}

            {/* {data.hashtags.trim().length > 0 && <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>{ strings('Hashtags')}</Text>}
      {data.hashtags.trim().length > 0 && 
      <View style = {{flexWrap: 'wrap', flexDirection: 'row', flex : 1}}>
      {hashTagsArray.map(item =>{
            return(
              <Text style = {[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                {item.toUpperCase()}
                </Text>
              )
        })}
      </View>
      } */}

            {/* // fee info paypal 13 May */}
            {data.campaignType !== 'commissionBased' &&
              data.campaignType !== 'shoutout' &&
              data.campaignType !== 'sponsored' &&
              feesData !== null && (
                <FeesInfoPoup
                  koliCommission={feesData.koliCommission}
                  payPalFees={feesData.payPalFees}
                  campaignData={data}
                />
              )}
            {/* {this.props.AuthStore.isLogin&&jobStatus != null && jobStatus && parseInt(this.state.ownerid,10)  !== data.ownerId && 

      <View style={{height:metrics.dimen_60}}>

      </View>} */}
          </View>

          <View
            style={{
              height:
                Platform.OS === 'ios' ? metrics.dimen_60 : metrics.dimen_70,
            }}></View>
        </ScrollView>

        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            marginBottom: metrics.dimen_25,
          }}>
          {isLoading === false &&
            campaignStatusLoading === false &&
            this.props.AuthStore.isLogin &&
            jobAwarded != null &&
            !jobAwarded &&
            (jobStatus === null ||
              jobStatus === 2 ||
              isPaymentReleased === 1) &&
            parseInt(this.state.ownerid, 10) !== parseInt(data.ownerId, 10) && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{...styles.applyForCampaignButton}}
                onPress={() => this.openApplyJobBottomSheet()}>
                <Text
                  style={{
                    ...commonStyles.LatoBold_14,
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>
                  {strings('Apply_for_campaign')}
                </Text>
              </TouchableOpacity>
            )}

          {isLoading === false &&
            campaignStatusLoading === false &&
            this.props.AuthStore.isLogin === false &&
            jobAwarded != null &&
            !jobAwarded &&
            (jobStatus === null || jobStatus === 2) &&
            parseInt(this.state.ownerid, 10) !== data.ownerId && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{...styles.applyForCampaignButton}}
                onPress={() => this.props.navigation.navigate('AuthStack')}>
                <Text
                  style={{
                    ...commonStyles.LatoBold_14,
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>
                  {strings('Please_Login_or_Register_to_Apply')}
                </Text>
              </TouchableOpacity>
            )}

          {this.props.AuthStore.isLogin &&
            jobStatus === 1 &&
            isPaymentReleased === 0 &&
            parseInt(this.state.ownerid, 10) !== data.ownerId && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{...styles.applyForCampaignButton}}
                onPress={() => this.showAlert(campaignAppliedRemarkId)}>
                <Text
                  style={{
                    ...commonStyles.LatoBold_14,
                    color: 'white',
                    textTransform: 'uppercase',
                  }}>
                  {strings('Cancel_My_Application')}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  }

  actionSheetActions = (index, userData) => {
  
    if (this.props.AuthStore.isLogin) {
      if (index === 0) {
        getUserId().then((userid) => {
          const recerverUserData = {
            _id: parseInt(userData.profile.ownerId, 10),
            name:
              (userData.profile.first ? userData.profile.first : '') +
              ' ' +
              (userData.profile.last ? userData.profile.last : ''),
            avatar:
              userData.profile.avatarUrl !== null
                ? userData.profile.avatarUrl
                : '',
          };

          join({userId: userid});
          this.props.navigation.navigate('ChatDetail', {
            receiverUserId: parseInt(userData.profile.ownerId, 10),
            recerverUserData: recerverUserData,
            campaignId: userData.id,
            title: recerverUserData.name,
            receiverUserProfile: userData.profile,
          });
        });
      } else if (index === 1) {
        this.props.CompaignsStore.setRaiseDisputePopupStatus(true);
        // this.setState({raisdisputeview:true})
        // this.bottomSheet.open()
      } else if (index === 2) {
        this.props.CompaignsStore.setShowReport(true);
      }
    } else {
      this.props.navigation.navigate('AuthStack');
    }
  };

  actionSheetActionSelfProfile = (index, userData) => {
    // if (index === 0) {
    //   getUserId().then(userid => {
    //     const recerverUserData = {
    //       _id: parseInt(userData.profile.ownerId, 10),
    //       name: (userData.profile.first ? userData.profile.first : '') + " " + (userData.profile.last ? userData.profile.last : ''),
    //       avatar: userData.profile.avatarUrl !== null ? userData.profile.avatarUrl : ''
    //     }

    //     join({ userId: userid })
    //     this.props.navigation.navigate('ChatDetail', {
    //       receiverUserId: parseInt(userData.profile.ownerId, 10),
    //       recerverUserData: recerverUserData,
    //       campaignId: userData.id,
    //       title: recerverUserData.name,
    //       receiverUserProfile: userData.profile
    //     })

    //   })
    // }
    if (index === 0) {
      this.props.CompaignsStore.setRaiseDisputePopupStatus(true);
      // this.setState({raisdisputeview:true})
      // this.bottomSheet.open()
    } else if (index === 1) {
      this.props.CompaignsStore.setShowReport(true);
    }
  };

  openApplyJobBottomSheet() {
    this.setState({raisdisputeview: false});
    this.props.CompaignsStore.setCampaignRemark('');
    this.props.CompaignsStore.setMyBidFee('');
    this.bottomSheet.open();
  }
  returnShoutoutContent = (item) => {
    if (item.profile !== undefined && item.remarks.length > 0) {
      return `${
        this.props.CompaignsStore.campaignByRemarklist.length
      } ${strings('Applications')}`;
    } else {
      return `${strings('New_Listing')}`;
    }

    //   if(item.profile !== undefined && item.profile.followers>0 && item.remarks.length>0)
    //   {
    //     return `${NumberformatesunitUptoOneDecimal(item.profile.followers)} Followers | ${this.props.CompaignsStore.campaignByRemarklist.length} ${strings('Applications')}`
    //   }
    //  else if(item.profile !== undefined && item.profile.followers>0 && item.remarks.length===0)
    //   {
    //     return `${NumberformatesunitUptoOneDecimal(item.profile.followers)} Followers | ${strings('New_Listing')}`
    //   }
    //   else if(item.profile === undefined && item.remarks.length>0)
    //   {
    //     return `${this.props.CompaignsStore.campaignByRemarklist.length} ${strings('Applications')}`
    //   }
  };
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  StatusUpdate = () => {
    const applicantDataToChange = JSON.parse(
      JSON.stringify(this.props.CompaignsStore.appliedRemarkData),
    );
    applicantDataToChange.offerStatus = 2;
    this.props.CompaignsStore.setappliedRemarkData(applicantDataToChange);
  };
  StatusUpdateDelete = () => {
    const applicantDataToChange = JSON.parse(
      JSON.stringify(this.props.CompaignsStore.appliedRemarkData),
    );
    applicantDataToChange.offerStatus = 3;
    this.props.CompaignsStore.setappliedRemarkData(applicantDataToChange);
  };

  hideCounterOfferPopup = () => {
    this.props.CompaignsStore.setcounterOfferPopupStatus(true);
  };

  counterOfferStatusUpdate = () => {
    getUserId().then((userId) => {
      const applicantDataToChange = JSON.parse(
        JSON.stringify(this.props.CompaignsStore.appliedRemarkData),
      );
      applicantDataToChange.offerAmount =
        this.props.CompaignsStore.counterAmount;
      applicantDataToChange.isCounter = 1;
      applicantDataToChange.counterBy = userId;
      applicantDataToChange.lastOfferAmount =
        this.props.CompaignsStore.counterAmount;
      this.props.CompaignsStore.setappliedRemarkData(applicantDataToChange);

      this.props.CompaignsStore.setcounterAmount('');
    });
  };

  generatelinklink() {
    generateFirebaseCampaignlink(this.props.route.params.data.id).then(
      (campaignlink) => {
        this.shareCampaignlink(campaignlink);
      },
    );
  }

  shareCampaignlink = async (campaignlink) => {
    const shareOptions = {
      title: 'Share via',
      message: this.props.CompaignsStore.campaignDetailData.campaignTitle,
      url: campaignlink,
      social: Share.Social.WHATSAPP,
    };
    await Share.open(shareOptions);
  };

  onCloseReport = () => {
    this.props.CompaignsStore.setShowReport(false);
  };
  renderPlaceholder = () => {
    return (
      <Image
        source={images.KoliSquarePlaceholder}
        style={styles.userImageStyle}
      />
    );
  };

  showAlert = (campaignAppliedRemarkId) => {
    Alert.alert(
      '',
      strings('Are_you_sure_you_unApply'),
      [
        {text: strings('No'), onPress: () => console.log('No Pressed')},
        {
          text: strings('Yes'),
          onPress: () => {
            this.props.CompaignsStore.cancelOnAppliedJob(
              campaignAppliedRemarkId,
              this.props.route.params.data.id,
            );
            this.setState({isAppliedInitiate: false});
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  checkUserUpdatedData = (applyData) => {
    gettUserData().then((data) => {
      // if (data.avatarUrl && data.gender && data.email && data.first && data.last && data.country && data.bio && data.interests.length > 0 && data.instaUsername && data.facebookUsername && data.instaPerPost > 0 && data.facebookPerPost > 0) {
      if (
        data.gender &&
        data.email &&
        data.first &&
        data.last &&
        data.country &&
        data.bio &&
        // data.instaUsername &&
        // data.instaPerPost > 0 &&
        data.dob &&
        data.mobile &&
        data.phoneCode
      ) {
        this.setState({profileupdate: false}, () => {
          this.onApply(applyData, data);
        });
      } else {
        this.setState({profileupdate: true}, () => {
          this.onApply(applyData, data);
        });
      }
    });
  };

  onApply = (applyData, data) => {
   
    if (this.state.profileupdate) {
      this.bottomSheet.close();
      let requiredValue = '';
      if (!data.first) {
        requiredValue = requiredValue + 'First Name , ';
      }
      if (!data.last) {
        requiredValue = requiredValue + 'Last Name , ';
      }
      if (!data.email) {
        requiredValue = requiredValue + 'Email , ';
      }

      if (!data.gender) {
        requiredValue = requiredValue + 'Gender , ';
      }

      if (!data.country) {
        requiredValue + 'Country , ';
      }
      if (!data.bio) {
        requiredValue = requiredValue + 'Bio , ';
      }
      if (!data.instaUsername) {
        requiredValue = requiredValue + 'Insta UserName , ';
      }
      if (!data.instaPerPost) {
        requiredValue = requiredValue + 'Instagram price per post , ';
      }
      if (!data.dob) {
        requiredValue = requiredValue + 'DOB , ';
      }
      if (!data.mobile) {
        requiredValue = requiredValue + 'Mobile Number , ';
      }
      if (!data.phoneCode) {
        requiredValue = requiredValue + 'Phone Code';
      }

      requiredValue = requiredValue.replace(/,\s*$/, '');

      
      this.setState({RequiredParameter: requiredValue});
      setTimeout(() => {
        this.setState({alertVisibility: true});
      }, 500);

      // Alert.alert(
      //   '',
      //   strings('Please_update_missing_details_from_your_Profile_to_continue_applying_on_Collaborations_Jobs'),
      //   [
      //     { text: strings('Do_it_Later') },
      //     {
      //       text: strings('Update_Now'), onPress: () => {
      //         this.fetchUserData()

      //       }, style: 'destructive'
      //     },
      //   ],
      //   { cancelable: true }
      // );
    } else {
      // if (applyData.campaignType === "sponsored") {
      //   this.setState({ isAppliedInitiate: true }, () => {
      //     this.props.CompaignsStore.applyForCampaign(applyData.id)
      //     this.bottomSheet.close()
      //     this.setState({ enterFeesValidation: false })
      //   })
      // } else
      if (
        applyData.campaignType !== 'commissionBased' &&
        applyData.campaignType !== 'shoutout'
      ) {
        if (applyData.campaignType === 'sponsored') {
          this.setState({isAppliedInitiate: true}, () => {
            this.props.CompaignsStore.applyForCampaign(applyData.id);
            this.bottomSheet.close();
            this.setState({enterFeesValidation: false});
          });
        }
        if (
          this.props.CompaignsStore.MyBidFee === '' ||
          this.props.CompaignsStore.MyBidFee < 1
        ) {
          this.setState({enterFeesValidation: true});
        } else {
          if (!this.state.isAppliedInitiate) {
            this.setState({isAppliedInitiate: true}, () => {
              this.props.CompaignsStore.applyForCampaign(applyData.id);
              this.bottomSheet.close();
              this.setState({enterFeesValidation: false});
            });
          }
        }
      } else {
        if (!this.state.isAppliedInitiate) {
          this.setState({isAppliedInitiate: true}, () => {
            this.props.CompaignsStore.applyForCampaign(applyData.id);
            this.bottomSheet.close();
            this.setState({enterFeesValidation: false});
          });
        }
      }
    }
  };

  fetchUserData() {
    const store = this.props.MyProfileStore;
    store.setFollowersCount('0');
    store.setPosts([]);
    store.setPostsCount('0');
    gettUserData().then((data) => {
      store.setUserImage(data.avatarUrl);
      store.setUserName(data.username);
      store.setFirstName(data.first);
      store.setLastName(data.last);
      store.setInstaUserName(data.instaUsername ? data.instaUsername : '');
      store.setBio(data.bio ? data.bio : '');
      this.setState({bio: data.bio ? data.bio : ''});
      store.setCity(data.city ? data.city : '');
      store.setCountry(data.country ? data.country : '');
      store.setFollowersCount("0")
      store.setPostsCount(data.totalPosts ? data.totalPosts : "0")
      store.setDisplayEmail(data.displayedEmail);
      store.setEmail(data.email);
      store.setGender(data.gender);
      store.setMyInterest(data.interests);
      store.setFacebookUserName(data.facebookUsername);
      store.setinstaperpost('' + data.instaPerPost);
      store.setfacebookperpost('' + data.facebookPerPost);
      store.setdob(data.dob ? data.dob : '');
      store.setMobilecode(data.phoneCode ? data.phoneCode : '');
      store.setMobile(data.mobile ? data.mobile : '');
      store.setPaypalEmail(data.paypal_email ? data.paypal_email : '');
      store.setblogUrl(data.blogUrl ? data.blogUrl : '');
      // if (data.instaUsername != null) {
      //   store.getInstaPosts(data.instaUsername)
      // }else
      // {
      //   store.setIsLoading(false)
      // }
    });
    this.setState({alertVisibility: false});
    setTimeout(() => {
      this.bottomSheet.close();
      this.props.navigation.navigate('EditProfile', {isFromApplyJob: true});
    }, 500);
  }

  OpenUserProfile(item) {
    getUserId().then((userId) => {
      if (item.ownerId != userId) {
        this.props.navigation.navigate('UserProfile', {UserData: item});
      } else {
        if (this.props.AuthStore.isLogin) {
          this.props.navigation.navigate('ProfileStackScreen');
        } else {
          this.props.navigation.navigate('UserProfile', {UserData: item});
        }
      }
    });
  }
  getFeesData = (campaignData) => {
    console.log('getFeesData:', JSON.stringify(campaignData));
    const campaignStore = this.props.CompaignsStore;
    const feesData = campaignStore.feesAndTransactionData;

    const offerAmount = parseFloat(campaignData.campaignAmount);
    const paymentFees =
      (offerAmount * parseFloat(feesData.paypalPercentFee)) / 100;
    const payoutFees =
      (offerAmount * parseFloat(feesData.paypalReleaseFee)) / 100;
    const total = paymentFees + payoutFees + feesData.paypalFixedFee;
    const koliCom = (offerAmount * parseFloat(feesData.koliPlateformFee)) / 100;
    return {payPalFees: total.toFixed(2), koliCommission: koliCom.toFixed(2)};
    // this.setState({payPalFees:total.toFixed(2), koliCommission: koliCom.toFixed(2)})
  };
  // showSuccessAlert = () => {

  //   this.bottomSheet.close()
  //   setTimeout(() => {
  //     Alert.alert(
  //       strings('Successfully'),
  //       strings('CampaignApplied'),
  //       [
  //         { text: strings('Ok'), onPress: () => { this.goBackscreen() } },
  //       ],
  //       { cancelable: false }
  //     );
  //   }, 200);
  // }
  // goBackscreen() {
  //   this.props.CompaignsStore.getCampaignStatus(this.props.route.params.data.id)
  //   this.props.CompaignsStore.setCampaignReported(false)
  //   this.props.CompaignsStore.setReport('')
  //   this.props.CompaignsStore.setCampaignStatus(null)
  //   this.props.CompaignsStore.setJobAwarded(null)
  //   this.props.CompaignsStore.geApplicantcountbaseoncampaign(this.props.route.params.data.id)
  //   this.props.CompaignsStore.setCampaignApplied(false)
  // }
}
export default inject(
  'CompaignsStore',
  'AuthStore',
  'MyProfileStore',
)(observer(CampaignDetails));

const styles = StyleSheet.create({
  imageContainer: {
    width: metrics.width,
    height: metrics.width,
  },
  bottomViewStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: metrics.dimen_72,
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
  },
  tagViewLabel: {
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    marginTop: metrics.dimen_6,
    backgroundColor: 'rgba(235, 235, 235, 1)',
    paddingHorizontal: metrics.dimen_6,
    paddingVertical: metrics.dimen_4,
    marginRight: metrics.dimen_6,
    borderRadius: 4,
  },
  tagTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_13,
    color: '#7A818A',
    marginTop: -metrics.dimen_2,
    marginHorizontal: metrics.dimen_10,
  },
  ProfileView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginLeft: metrics.dimen_12,
    marginTop: metrics.dimen_5,
    marginRight: metrics.dimen_12,
    marginBottom: metrics.dimen_14,
    backgroundColor: colors.white,
  },
  imageViewContainer: {
    height: metrics.dimen_70,
    width: metrics.dimen_70,
  },
  userImageStyle: {
    alignSelf: 'flex-start',
    width: metrics.dimen_50,
    height: metrics.dimen_50,
    borderRadius: metrics.dimen_25,
  },
  userAvatrar: {
    width: metrics.dimen_56,
    height: metrics.dimen_56,
    borderRadius: metrics.dimen_28,
  },
  title: {
    fontSize: metrics.text_normal,
    color: colors.gray,
    fontFamily: metrics.Lato_SemiBold,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Regular,
    color: colors.app_Blue,
  },
  imageThumbnailSheetView: {
    aspectRatio: 1,
  },
  textInputRemark: {
    marginHorizontal: metrics.dimen_20,
    marginTop: metrics.dimen_6,
    height: metrics.dimen_85,
    backgroundColor: colors.app_light_gray,
  },
  textInputRaiseDispute: {
    marginHorizontal: metrics.dimen_20,
    marginTop: metrics.dimen_6,
    height: metrics.dimen_120,
    marginTop: metrics.dimen_15,
    backgroundColor: colors.app_light_gray,
  },
  ApplyButton: {
    height: metrics.dimen_45,
    backgroundColor: colors.app_Blue,
    borderRadius: metrics.dimen_8,
    alignItems: 'center',
    marginHorizontal: metrics.dimen_15,
    justifyContent: 'center',
    marginTop: metrics.dimen_20,
  },
  applyForCampaignButton: {
    height: metrics.dimen_45,
    backgroundColor: colors.app_Blue,
    borderRadius: metrics.dimen_8,
    alignItems: 'center',
    marginHorizontal: metrics.dimen_15,
    justifyContent: 'center',
  },
  multilineTextInputStyle: {
    backgroundColor: colors.app_light_gray,
    borderColor: colors.app_light_gray,
    borderWidth: metrics.dimen_4,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_150,
    textAlignVertical: 'top',
    paddingHorizontal: metrics.dimen_10,
    fontFamily: metrics.LatoSemiBold_Normal,
    color: colors.app_gray,
  },

  TextInputStyle: {
    marginHorizontal: metrics.dimen_20,
    marginTop: metrics.dimen_6,
    height: metrics.dimen_46,
    alignItems: 'center',
    backgroundColor: colors.app_light_gray,
    flexDirection: 'row',
  },
  addresTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: '#7A818A',
    marginVertical: metrics.dimen_2,
  },
  inputTextFieldStyle: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.getFontSize(14),
    marginLeft: metrics.dimen_10,
    color: '#C0C4CC',
  },

  Alert_Main_View: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    height: metrics.dimen_183,
    width: '80%',
    borderWidth: 1,
    borderColor: '#F8F8F8',
    borderRadius: metrics.dimen_10,
  },

  Alert_Title: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_16,
    color: '#000000',
    textAlign: 'center',
    paddingTop: metrics.dimen_10,
  },
  requiredTitle: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: '#707070',
  },

  Alert_Message: {
    paddingHorizontal: metrics.dimen_12,
    padding: metrics.dimen_15,
  },
  Alert_Messagetext: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Regular,
    color: '#707070',
    textAlign: 'center',
  },
  Alert_MessageMissingtext: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Regular,
    marginTop: metrics.dimen_2,
    color: '#707070',
    textAlign: 'center',
  },
  Alert_MessageMissingtext: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Regular,
    marginTop: metrics.dimen_2,
    color: '#707070',
  },

  buttonStyle: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextStyle: {
    color: colors.app_red,
    textAlign: 'center',
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_16,
  },
  TextStyleDoItLater: {
    color: colors.app_Blue,
    textAlign: 'center',
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_16,
  },
});
