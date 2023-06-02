import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import {strings} from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import {commonStyles} from '../../../SupportingFIles/Constants';
import Moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import Report from './Report';
import Slideshow from '../../../SupportingFIles/Slideshow';
import Share from 'react-native-share';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
const formatCurrency = new Intl.NumberFormat('en-US');
import {Switch} from 'react-native-paper';

import MarkAsComplete from '../Screen/MarkAsComplete/MarkAsComplete';
import {
  gettUserData,
  showAlert,
  kFormatter,
  showFlashBanner,
  convertCurrencybyCode,
  generateFirebaseCampaignlink,
  NumberformatesunitUptoOneDecimal,
  getFeesAndCommission,
  getUserId,
} from '../../../SupportingFIles/Utills';
import CampaignDetailSkeleton from '../../CommonComponents/CampaignDetailSkeleton';
import {color} from 'react-native-reanimated';
const countriesJson = require('../../../SupportingFIles/countries.json');
import RBSheet from 'react-native-raw-bottom-sheet';
import campaignStyles from '../../CreateCampaign/CreateCampaignFrom/styles';
import FeesInfoPoup from './CampaignResuableComponent/FeesInfoPoup';
import CampaignOfferStatus from './CampaignResuableComponent/CampaignOffeStatus';
import CounterOffer from './CampaignResuableComponent/CounterOffer';
import ChatLike from '../../../Assets/Images/chatLike';
import Heart from '../../../Assets/Images/heart';
import ShareCampaign from '../../../Assets/Images/comment';
import {runInAction} from 'mobx';

class MYCampaignDetails extends Component {
  constructor(props) {
    super(props);
    // context = this
    this.state = {
      offerResponded: false,
      isSwitchOn: false,
      showMarkAsCompleted: false,
      hideMarkAsCompletedButton: false,
      stripeBankAccountAdded: false,
      applicantData: this.props.route.params.applicantData,
      showcounterOffer: false,
    };
  }

  
  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{...commonStyles.backButtonContainer}}
          onPress={() => this.props.navigation.goBack()}>
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
      // headerRight: () => this.props.route.params.data.campaignStatus>=2?(
      //   <TouchableOpacity onPress={() => this.generatelinklink()}>
      //       <Image style={{marginRight:metrics.dimen_15}} source={images.ShareIcon} />
      //     </TouchableOpacity>
      // ):null,
    });
    this.setSwitchData();
    this.checkBankInfo();
    this.getFeesData(this.state.applicantData, this.props.route.params.data);
  }

  generatelinklink() {
    generateFirebaseCampaignlink(this.props.route.params.data.id).then(
      (campaignlink) => {
        this.shareCampaignlink(campaignlink);
        console.log('campaignlink', campaignlink);
      },
    );
  }

  shareCampaignlink = async (campaignlink) => {
    const shareOptions = {
      title: 'Share via',
      message: this.props.route.params.data.campaignTitle,
      url: campaignlink,
      social: Share.Social.WHATSAPP,
    };
    await Share.open(shareOptions);
  };

  checkBankInfo = () => {
    gettUserData().then((userData) => {
      console.log('user data value =', userData);

      if (
        userData.stripeBankAccountId !== null &&
        userData.stripeBankAccountId !== ''
      ) {
        this.setState({stripeBankAccountAdded: true});
      }
    });
  };
  setSwitchData = () => {
    const data = this.props.route.params.data;

    if (this.props.route.params.data.campaignStatus > 1) {
      if (data.isDisabled === 1) {
        this.setState({isSwitchOn: false});
      } else {
        this.setState({isSwitchOn: true});
      }
    }
  };

  _onToggleSwitch = () => {
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));
    const data = this.props.route.params.data;
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
      this.props.CompaignsStore.getupdatecampaign(data.id, 0);
    } else {
      Alert.alert(
        strings('Disablecampaign'),
        strings('Are_you_surewanttodisabel'),
        [
          {text: strings('No'), onPress: () => this.resetbutton()},
          {
            text: strings('Yes'),
            onPress: () => {
              this.props.CompaignsStore.getupdatecampaign(data.id, 1);
            },
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    }
  };
  resetbutton() {
    this.setState({isSwitchOn: true});
  }
  componentWillMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.CompaignsStore.getCampaignStatus(
        this.props.route.params.data.id,
      );
      this.props.CompaignsStore.setCampaignReported(false);
      this.props.CompaignsStore.setReport('');
      this.props.CompaignsStore.setCampaignApplied(false);
      this.props.CompaignsStore.setCampaignStatus(null);
      this.props.CompaignsStore.setJobAwarded(null);
      if (this.props.route.params.data) {
        setTimeout(() => {
          this.props.CompaignsStore.setLoading(false);
          this.props.CreateCampaignStore.setLoading(false);
        }, 500);
      }
    });
  }

  openUserCommentBox(item) {
    gettUserData().then((data) => {
      this.props.navigation.navigate('UserComment', {
        campaignData: item,
        userProfileUrl: data ? data.avatarUrl : '',
        Userdata: data,
      });
    });
  }

  openUserLike(item) {
    this.props.navigation.navigate('CampaignLike', {campaignData: item});
  }

  render() {
    const data = this.props.route.params.data;
    const {isLoading, showReport} = this.props.CompaignsStore;
    const applicantData = this.state.applicantData;
    //const applicantData = this.props.route.params.applicantData
    //  const { isLoading} = this.props.CreateCampaignStore
    //  console.log('applicantData.id: ',applicantData.id)

    var hashTagsArray = data.hashtags.split(',');
    const {isSwitchOn} = this.state;
    var campaignCategoriesArray =
      data.campaignCategories !== undefined ? data.campaignCategories : [];
    const isFromMyApplications =
      this.props.route.params !== undefined
        ? this.props.route.params.isFromMyApplications
        : false;
    console.log('myCampaignDetail: ', JSON.stringify(data));
    console.log('isFromMyApplications: ', isFromMyApplications);
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <RBSheet
          ref={(ref) => {
            this.bottomSheet = ref;
          }}
          height={200}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          {/* <FeesInfoPoup 
        applicantData={applicantData}
        koliCommission={this.state.koliCommission}
        payPalFees={this.state.payPalFees}
        /> */}
        </RBSheet>
        <MarkAsComplete
          modalVisible={this.state.showMarkAsCompleted}
          id={applicantData !== undefined ? applicantData.id : ''}
          campaignId={data.id}
          hideMarkAsCompletedButton={() => this.hideMarkAsCompletedButton()}
        />

        <CounterOffer
          modalVisible={this.state.showcounterOffer}
          appliedRemarkData={applicantData}
          counterOfferStatusUpdate={() => this.counterOfferStatusUpdate()}
        />

        {/* <Loader loading={isLoading} />
        <Loader loading={this.props.CreateCampaignStore.isLoading} /> */}
        {(isLoading || this.props.CreateCampaignStore.isLoading) && (
          <CampaignDetailSkeleton />
        )}

        <ActionSheet
          ref={(el) => {
            this.ActionSheet = el;
          }}
          //ref={o => this.ActionSheet = o}
          // title={'Which one do you like ?'}
          options={[strings('Report'), strings('Cancel')]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={(index) => {
            if (index === 0) {
              setTimeout(() => {
                this.props.CompaignsStore.setShowReport(true);
              }, 1000);
            }
          }}
        />
        <Report
          show={showReport}
          onClose={this.onCloseReport}
          title={data.campaignTitle}
          campaignData={data}
          fromUserReport={false}
        />

        {(!isLoading || !this.props.CreateCampaignStore.isLoading) && (
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
            {/* <FastImage
          style={{width: '100%', height: (metrics.width)/1.43}}
          source={{
            uri: data.campaignImage.length > 30 ? data.campaignImage : Media_Base_URL + data.campaignImage,
            priority: FastImage.priority.normalƒ
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> */}
            {/* {this.props.route.params.data.campaignStatus>1&&  <View style={{position:'absolute',top:10,right:10, }} >
        <Switch
        onTintColor={colors.app_Blue}
        tintColor={'rgba(112, 129, 138, 1)'}
        thumbTintColor={colors.white}
        ios_backgroundColor={'rgba(112, 129, 138, 1)'}
        value={isSwitchOn}
        onValueChange={this._onToggleSwitch}
       />
        </View>} */}
            <View style={{marginHorizontal: metrics.dimen_16}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    ...commonStyles.LatoRegular_Medium,
                    color: 'rgba(112, 129, 138, 1)',
                    marginTop: metrics.dimen_12,
                  }}>
                  {strings('Posted_On') +
                    ' : ' +
                    Moment(data.createdAt).format('DD MMM, YYYY')}
                </Text>

                <TouchableOpacity
                  style={{
                    marginTop: metrics.dimen_12,
                    marginRight: metrics.dimen_3,
                  }}
                  onPress={() => {
                    this.generatelinklink(data);
                  }}>
                  <ShareCampaign
                    width={metrics.widthSize(55)}
                    height={metrics.widthSize(55)}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.containerSwitch}>
                <Text
                  style={{
                    ...commonStyles.LatoBold_16,
                    marginTop: metrics.dimen_1,
                    width:
                      this.props.route.params.data.campaignStatus > 1 &&
                      !isFromMyApplications
                        ? '65%'
                        : '90%',
                  }}>
                  {data.campaignTitle}
                </Text>

                {this.props.route.params.data.campaignStatus > 1 &&
                  !isFromMyApplications && (
                    <View style={styles.switchStyles}>
                      <Text
                        style={[
                          commonStyles.LatoItalic_Medium,
                          styles.enabledDisableText,
                        ]}>
                        {isSwitchOn ? strings('Enabled') : strings('Disabled')}
                      </Text>

                      <Switch
                        onTintColor={colors.app_Blue}
                        tintColor={'rgba(112, 129, 138, 1)'}
                        thumbTintColor={colors.white}
                        ios_backgroundColor={'rgba(112, 129, 138, 1)'}
                        value={isSwitchOn}
                        onValueChange={this._onToggleSwitch}
                      />
                    </View>
                  )}
              </View>

              <View style={{flexDirection: 'row', marginTop: metrics.dimen_10}}>
                {data.likes && data.likes.length > 0 ? (
                  <TouchableOpacity
                    style={{flexDirection: 'row', marginTop: metrics.dimen_2}}
                    onPress={() => {
                      this.openUserLike(data);
                    }}>
                    <Heart
                      width={metrics.widthSize(50)}
                      height={metrics.widthSize(50)}
                    />

                    <Text
                      style={{
                        marginLeft: metrics.dimen_8,
                        marginRight: metrics.dimen_15,
                        fontFamily: metrics.Lato_Regular,
                        fontSize: metrics.text_11,
                        marginTop:
                          Platform.OS === 'android'
                            ? metrics.dimen_2
                            : metrics.dimen_1,
                        color: '#7A818A',
                      }}>
                      {data.likes.length + ' likes'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {data.comments && data.comments.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.openUserCommentBox(data);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: metrics.dimen_2,
                      }}>
                      <ChatLike
                        width={metrics.widthSize(50)}
                        height={metrics.widthSize(50)}
                      />

                      <Text
                        style={{
                          marginLeft: metrics.dimen_8,
                          marginRight: metrics.dimen_15,
                          fontFamily: metrics.Lato_Regular,
                          fontSize: metrics.text_11,
                          marginTop:
                            Platform.OS === 'android'
                              ? metrics.dimen_2
                              : metrics.dimen_1,
                          color: '#7A818A',
                        }}>
                        {data.comments.length + ' comments'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              {/* {data.campaignType === "paid" && <Text style={{ ...styles.boldText, color: 'rgba(22, 88, 211, 1)' }}>
              {data.campaignAmountCurrency + " " + formatCurrency.format(data.campaignAmount)}
            </Text>} */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: metrics.dimen_12,
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
                    alignSelf: 'flex-start',
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

                      {/* {`Paid: ${data.commission>0?convertCurrencybyCode(data.campaignAmountCurrency) +formatCurrency.format(data.campaignAmount)+"  +  "+data.commission+"% "+"Commission" :convertCurrencybyCode(data.campaignAmountCurrency) + formatCurrency.format(data.campaignAmount)}`} */}
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
                        formatCurrency.format(data.campaignAmount) + ' %'
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

                  {/*            
            <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {data.campaignType === "shoutout" ? 
            "Shoutout Exchange" : 
            data.campaignType !== "paid" ? 
            `Sponsored: ${convertCurrencybyCode(data.campaignAmountCurrency) + " " + formatCurrency.format(data.campaignAmount)}` 
            : `Paid: ${convertCurrencybyCode(data.campaignAmountCurrency) + " " + formatCurrency.format(data.campaignAmount)}`}
            </Text> */}
                </View>
                {/* { applicantData !== undefined && applicantData.offerStatus < 1 &&  this.renderInfoView()} */}
                {/* {applicantData !== undefined && 
            data.campaignType === "paid" &&
              <TouchableOpacity style={{flexDirection:'row',   marginTop: metrics.dimen_15,
              alignSelf: 'flex-start' ,
              justifyContent:'center'}}
                onPress={() => {
                  this.bottomSheet.open()
                  }}>
                <Text style={[campaignStyles.textFieldTitle, { marginRight:5, marginTop:0, marginLeft:10 }]}>Info</Text>
<Image style={{alignSelf:'center', width:15, height:15, tintColor: colors.app_Blue}}
                    source={images.infoIcon}
                    resizeMode="contain"
                  ></Image>
</TouchableOpacity>} */}
              </View>
              {/* <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_12 }}>
              {data.campaignAmountCurrency + " " + formatCurrency.format(data.campaignAmount)}
              </Text> */}

              {/* // comment offer status view by kuldeep 11 May */}
              {data.remarks !== undefined && data.remarks.length > 0 && (
                <TouchableOpacity
                  style={styles.containerViewCampaignDetail}
                  onPress={() =>
                    this.props.navigation.navigate('ApplicantList', {
                      JobData: data,
                    })
                  }>
                  <Text style={styles.textCampaignDetail}>
                    {strings('Hired_Influencers')}
                  </Text>
                </TouchableOpacity>
              )}

              {applicantData !== undefined &&
              applicantData.remarkStatus === 1 &&
              applicantData.offerStatus !== 3 &&
              data.campaignType !== 'commissionBased' &&
              data.campaignType !== 'shoutout' &&
              data.campaignType !== 'sponsored' &&
              applicantData.offerAmount > 0
                ? this.showCampaignOfferStatus(applicantData, data)
                : null}

              {/* {applicantData !== undefined &&
              applicantData.offerAmount !== '' &&
              applicantData.offerStatus > 1 &&
              <View style={{ backgroundColor: '#F6F6F666', borderRadius: metrics.dimen_5, width: '100%', padding: metrics.dimen_15, marginTop: metrics.dimen_20 }}>
                <View style={{flexDirection:'row'}}>
                <View style={{ backgroundColor: applicantData.offerStatus === 2 ? "#58DC72" : '#FF4444', 
                borderRadius: metrics.dimen_2, 
                height: metrics.dimen_22, 
                paddingHorizontal:metrics.dimen_10,
                alignItems: 'center', 
                justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontFamily: metrics.Lato_Regular, fontSize: metrics.text_11 }}>
                  {this.getStatusForCampaignOffer(applicantData)}
                    </Text>
                </View> */}
              {/* {this.renderInfoView()} */}

              {/* </View>
                <Text style={{ color: '#707070', fontFamily: metrics.Lato_Regular, fontSize: metrics.text_14, marginVertical: metrics.dimen_7 }}>
              
            {this.getOfferStatusText(applicantData)}
                </Text>
                {applicantData.offerStatus === 2 && 
                ((applicantData.isPayment === 1 && applicantData.isPaymentReleased === 0) || applicantData.paymentOutStatus === 'DONOTHAVEEMAIL') &&
                <TouchableOpacity style={{paddingHorizontal:metrics.dimen_10, 
                  height: metrics.dimen_30, 
                  borderRadius:metrics.dimen_15, 
               
                  alignItems:'center',
                  justifyContent: 'center'
                  }}
                  onPress={()=>this.props.navigation.navigate('EditProfile')}>
                  <Text style={{fontFamily: metrics.Lato_Bold, 
                    fontSize: metrics.text_normal, 
                    color: colors.app_Blue,
                    textDecorationLine: 'underline'}}>
                    {strings('update_paypal_details')}</Text>
                </TouchableOpacity>}
              </View>} */}

              {/* {applicantData !== undefined &&
              applicantData.offerAmount !== '' &&
              applicantData.offerStatus > 1 &&
              !this.state.stripeBankAccountAdded &&
              <View style={{ backgroundColor: '#F6F6F6', borderRadius: metrics.dimen_5, width: '100%', padding: metrics.dimen_14, marginTop: metrics.dimen_20 }}>
                <View style={{ backgroundColor: '#FFC107', borderRadius: metrics.dimen_2, height: metrics.dimen_22, width: metrics.dimen_80, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontFamily: metrics.Lato_Regular, fontSize: metrics.text_11 }}>BANK INFO</Text>
                </View>
                <Text style={{ color: '#707070', fontFamily: metrics.Lato_Regular, fontSize: metrics.text_14, marginVertical: metrics.dimen_7 }}>
                  Please update your bank details in settings section of the app
                </Text>
              </View>} */}

              {data.campaignType === 'shoutout' ? null : (
                <Text
                  style={{
                    ...commonStyles.LatoBold_12,
                    color: 'rgba(112, 129, 138, 1)',
                    marginTop: metrics.dimen_20,
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
                  }}>
                  {data.campaignType === 'commissionBased'
                    ? `${data.campaignAmount + ' %'}`
                    : `${
                        convertCurrencybyCode(data.campaignAmountCurrency) +
                        formatCurrency.format(data.campaignAmount)
                      }`}
                </Text>
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
                {strings('Description')}
              </Text>
              <Text
                style={{
                  ...commonStyles.LatoSemiBold_Normal,
                  color: 'rgba(62, 62, 70, 1)',
                  marginTop: metrics.dimen_6,
                }}>
                {data.campaignDetails}
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
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>
                {campaignCategoriesArray.map(item => {
                  return (
                    <Text style={[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                      {item.toUpperCase()}
                    </Text>
                  )
                })}
              </View>
            } */}
              {/* // Country is removed from capaign creation so no need of this filter for now */}

              {/* <Text style = {{...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20}}>{ strings('Location')}</Text>
      <Text style = {{...commonStyles.LatoSemiBold_Normal, color: 'rgba(62, 62, 70, 1)', marginTop: metrics.dimen_6}}>{data.country}</Text> */}

              {data.shipping && (
                <Text
                  style={{
                    ...commonStyles.LatoBold_12,
                    color: 'rgba(112, 129, 138, 1)',
                    marginTop: metrics.dimen_20,
                  }}>
                  {strings('Product_Shipped')}
                </Text>
              )}
              {data.shipping && (
                <Text
                  style={{
                    ...commonStyles.LatoSemiBold_Normal,
                    color: 'rgba(62, 62, 70, 1)',
                    marginTop: metrics.dimen_6,
                  }}>
                  {data.shipping ? strings('Yes') : strings('No')}
                </Text>
              )}

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
                  {/* {formatCurrency.format(data.minimumFollowers)} */}
                  {kFormatter(data.minimumFollowers)}
                </Text>
              )}

              {/* // End/Expiry Date is removed from capaign creation so no need of this filter for now */}

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

              {data.hashtags.trim().length > 0 && (
                <Text
                  style={{
                    ...commonStyles.LatoBold_12,
                    color: 'rgba(112, 129, 138, 1)',
                    marginTop: metrics.dimen_20,
                  }}>
                  {strings('Hashtags')}
                </Text>
              )}
              {data.hashtags.trim().length > 0 && (
                <View style={{flexWrap: 'wrap', flexDirection: 'row', flex: 1}}>
                  {hashTagsArray.map((item) => {
                    return (
                      <Text
                        style={[
                          commonStyles.LatoRegular_Normal,
                          styles.tagViewLabel,
                        ]}>
                        {item.toUpperCase()}
                      </Text>
                    );
                  })}
                </View>
              )}

              {/* fee info Paypl comment 13 May */}
              {data.campaignType === 'paid' &&
                isFromMyApplications !== undefined &&
                isFromMyApplications === true && (
                  <FeesInfoPoup
                    applicantData={applicantData}
                    koliCommission={this.state.koliCommission}
                    payPalFees={this.state.payPalFees}
                  />
                )}
              <View style={{height: metrics.dimen_60}}></View>
            </View>
            <View style={{height: metrics.dimen_40}}></View>
          </ScrollView>
        )}
        {/* Update 31-Aug-2020 
      Editing Campaign button should be enabled even after Approval */}
        {/* Update 3-Feb-2021 
      Editing Campaign button should be disable after campaign Approval */}
        {this.props.route.params.data.campaignStatus > 0 &&
          this.props.route.params.data.campaignStatus < 2 &&
          !isFromMyApplications && (
            <TouchableOpacity
              style={{...styles.applyForCampaignButton}}
              onPress={() => this.OpenUpdateCampaign()}>
              <Text
                style={{
                  ...commonStyles.LatoBold_16,
                  color: 'white',
                  textTransform: 'uppercase',
                }}>
                {strings('Edit')}
              </Text>
            </TouchableOpacity>
          )}

        {this.props.route.params.data.campaignStatus >= 2 &&
          !isFromMyApplications && (
            <TouchableOpacity
              style={[
                {...styles.applyForCampaignButton},
                {bottom: 50, marginHorizontal: metrics.dimen_13},
              ]}
              onPress={() => this.OpenUpdateCampaign()}>
              <Text
                style={{
                  ...commonStyles.LatoBold_16,
                  color: 'white',
                  textTransform: 'uppercase',
                }}>
                {strings('Edit')}
              </Text>
            </TouchableOpacity>
          )}

        {this.props.route.params.data.campaignStatus >= 2 &&
          applicantData === undefined && (
            <View
              style={{
                ...styles.bottomViewStyle,
                backgroundColor: colors.app_light_gray,
              }}>
              <Text
                style={{
                  ...commonStyles.LatoBold_14,
                  color: '#7A818A',
                  textTransform: 'uppercase',
                  marginTop: metrics.dimen_15,
                }}>
                {strings('approved')}
              </Text>
            </View>
          )}

        {isFromMyApplications &&
          applicantData.isMarkAsDone === 0 &&
          applicantData.offerStatus === 2 &&
          applicantData.isPayment === 1 &&
          !this.state.hideMarkAsCompletedButton && (
            <TouchableOpacity
              style={{...styles.applyForCampaignButton}}
              onPress={
                () => this.props.CompaignsStore.setMarkAsDonPopupStatus(true)
                //this.setState({showMarkAsCompleted:true})
              }>
              <Text
                style={{
                  ...commonStyles.LatoBold_14,
                  color: 'white',
                  textTransform: 'uppercase',
                }}>
                {strings('Mark_As_Completed')}
              </Text>
            </TouchableOpacity>
          )}

        {/* {isFromMyApplications &&
          applicantData.isMarkAsDone === 0 &&
          applicantData.offerStatus < 2 &&
          applicantData.isPayment === 0 &&
          applicantData.remarkStatus === 1 && (
            <TouchableOpacity
              style={{...styles.applyForCampaignButton}}
              onPress={() => this.showAlert(applicantData, data)}>
              <Text
                style={{
                  ...commonStyles.LatoBold_14,
                  color: 'white',
                  textTransform: 'uppercase',
                }}>
                {strings('Cancel_My_Application')}
              </Text>
            </TouchableOpacity>
          )}  */}

        
        {isFromMyApplications &&
       
           (applicantData.isMarkAsDone === 0 ||
           applicantData.isMarkAsDone === 1) &&
          applicantData.offerStatus === 2 &&
          applicantData.isPaymentReleased === 0 &&
          applicantData.remarkStatus === 1 &&
         (applicantData.campaigns.cancelledByInfluencer==0)&&
           (
            <TouchableOpacity
              style={{...styles.applyForCampaignButton}}
              onPress={() => this.showAlert(applicantData, data,applicantData.isMarkAsDone,applicantData.campaigns.cancelledByBrand)}>
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

{isFromMyApplications &&
       
       (applicantData.isMarkAsDone === 0 ||
       applicantData.isMarkAsDone === 1) &&
      applicantData.offerStatus === 2 &&
      applicantData.isPaymentReleased === 0 &&
      applicantData.remarkStatus === 1 &&
     applicantData.campaigns.cancelledByInfluencer==1 && 
     applicantData.campaigns.cancelledByBrand == 0 &&
       (
        <TouchableOpacity
          disabled={true}
          style={{...styles.applyForCampaignButton}}
          onPress={() =>this.showAlert(applicantData, data,applicantData.isMarkAsDone,applicantData.campaigns.cancelledByBrand)}>
          <Text
            style={{
              ...commonStyles.LatoBold_14,
              color: 'white',
              textTransform: 'uppercase',
            }}>
            {strings('Pending_Cancel')}
          </Text>
        </TouchableOpacity>
      )}

{isFromMyApplications &&
       
       (applicantData.isMarkAsDone === 0 ||
       applicantData.isMarkAsDone === 1) &&
      applicantData.offerStatus === 2 &&
      applicantData.isPaymentReleased === 0 &&
      applicantData.remarkStatus === 1 &&
     applicantData.campaigns.cancelledByInfluencer==1 && 
     applicantData.campaigns.cancelledByBrand == 1 &&
       (
        <TouchableOpacity
        disabled={true}
          style={{...styles.applyForCampaignButton}}
          onPress={() => this.showAlert(applicantData, data,applicantData.isMarkAsDone,applicantData.campaigns.cancelledByBrand)}>
          <Text
            style={{
              ...commonStyles.LatoBold_14,
              color: 'white',
              textTransform: 'uppercase',
            }}>
            {strings('Cancelled')}
          </Text>
        </TouchableOpacity>
      )}
          
      </View>
    );
  }

  showCampaignOfferStatus = (applicantData, data) => {
    return (
      <View>
        <CampaignOfferStatus
          campaignData={data}
          appliedRemarkData={applicantData}
          statusUpdate={() => this.StatusUpdate()}
          statusUpdateDelete={() => this.StatusUpdateDelete()}
          hideCounterOfferPopup={() => this.hideCounterOfferPopup()}
        />
      </View>
    );
  };
  renderInfoView = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          this.bottomSheet.open();
        }}>
        <Text
          style={[
            campaignStyles.textFieldTitle,
            {marginRight: 5, marginTop: 0, marginLeft: 10},
          ]}>
          Info
        </Text>
        <Image
          style={{
            alignSelf: 'center',
            width: 15,
            height: 15,
            tintColor: colors.app_Blue,
          }}
          source={images.infoIcon}
          resizeMode="contain"></Image>
      </TouchableOpacity>
    );
  };

  showAlert = (applicantData, data,markAsCompleted,cancelledByBrand) => {
    console.log('applicant Data',JSON.stringify(applicantData));
    console.log('data',JSON.stringify(data))
    Alert.alert(
      '',
      strings('Are_you_sure_you_unApply'),
      [
        {text: strings('No'), onPress: () => console.log('No Pressed')},
        {
          text: strings('Yes'),
          onPress: () => {
              if(markAsCompleted==0){

              console.log(JSON.stringify(applicantData),
              JSON.stringify(data))
              this.props.CompaignsStore.cancelOnAppliedJob(applicantData.id,data.id)
              const applicantDataToChange = JSON.parse(JSON.stringify(this.state.applicantData))
              applicantDataToChange.remarkStatus = 2
              this.setState({applicantData:applicantDataToChange})

              }else if(markAsCompleted==1){

                let params = {
                  cancelledByInfluencer: 1
                }
                console.log(this.props.CompaignsStore.appliedRemarkData.campaignId,params,cancelledByBrand)
                this.props.CompaignsStore.cancelCampaignfromBothInfluencerAndBrand(this.props.CompaignsStore.appliedRemarkData.campaignId,params,cancelledByBrand)
                this.props.navigation.goBack()

              }
            
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  getOfferStatusText = (applicantData) => {
    if (applicantData.offerStatus === 2) {
      var statusStr = `${strings(
        'Offer_Accepted_Message_1',
      )} $${formatCurrency.format(applicantData.offerAmount)}. `;
      if (
        applicantData.isPayment === 1 &&
        applicantData.isPaymentReleased === 1
      ) {
        if (applicantData.paymentOutStatus === 'PENDING') {
          return `${statusStr}${strings('payment_released_but_pending')}`;
        } else if (applicantData.paymentOutStatus === 'DONOTHAVEEMAIL') {
          return `${statusStr}${strings('payment_released_but_no_details')}`;
        } else if (applicantData.paymentOutStatus === 'UNCLAIMED') {
          return `${statusStr}${strings('payment_released_but_unclaimed')}`;
        }
      } else if (
        applicantData.isPayment === 1 &&
        applicantData.isPaymentReleased === 0
      ) {
        return `${statusStr}${strings('task_completed_but_no_payment')}`;
      } else if (applicantData.isPayment === 0) {
        return `${statusStr}${strings('Offer_Accepted_but_payment_not_done')}`;
      }
      return `${statusStr}${strings('Offer_Accepted_Message_2')}`;
    } else {
      return `${strings('Offer_Rejected_Message_1')} $${formatCurrency.format(
        applicantData.offerAmount,
      )}`;
    }
  };
  getStatusForCampaignOffer = (item) => {
    if (item.offerStatus === 0) {
      return strings('Applied');
    } else if (item.offerStatus === 1) {
      return strings('Offer_Received');
    } else if (item.offerStatus === 2) {
      if (item.isPayment === 1 && item.isPaymentReleased === 0) {
        return strings('Payment_Added');
      } else if (item.isPayment === 1 && item.isPaymentReleased === 1) {
        return strings('Payment_Released');
      }
      return strings('Offer_Accepted');
    } else if (item.offerStatus === 3) {
      return strings('Offer_Declined');
    }
  };
  OpenUpdateCampaign() {
    this.props.CreateCampaignStore.setNavigation(this.props.navigation);

    this.props.CreateCampaignStore.getCampaigndatabyid(
      this.props.route.params.data.id,
    );
    setTimeout(() => {
      //this.props.navigation.navigate('CreateCampaign1',{type:'Edit',campaignid:this.props.route.params.data.id})
      //this.props.navigation.navigate('CreateCampaignForm',{type:'Edit',campaignid:this.props.route.params.data.id})
    }, 500);
  }
  hideMarkAsCompletedButton = () => {
    const applicantData = this.props.route.params.applicantData;
    runInAction(() => {
      applicantData.isMarkAsDone = 1;
      // this.props.navigation.setParams({applicantData:applicantData})
    });

    this.setState({hideMarkAsCompletedButton: true});
  };

  StatusUpdate = () => {
    const applicantDataToChange = JSON.parse(
      JSON.stringify(this.state.applicantData),
    );
    applicantDataToChange.offerStatus = 2;
    this.setState({offerResponded: true, applicantData: applicantDataToChange});
  };

  StatusUpdateDelete = () => {
    const applicantDataToChange = JSON.parse(
      JSON.stringify(this.state.applicantData),
    );
    applicantDataToChange.offerStatus = 3;
    this.setState({offerResponded: true, applicantData: applicantDataToChange});
  };

  hideCounterOfferPopup = () => {
    this.props.CompaignsStore.setcounterOfferPopupStatus(true);
  };
  counterOfferStatusUpdate = () => {
    getUserId().then((userId) => {
      const applicantDataToChange = JSON.parse(
        JSON.stringify(this.state.applicantData),
      );
      applicantDataToChange.offerAmount =
        this.props.CompaignsStore.counterAmount;
      applicantDataToChange.isCounter = 1;
      applicantDataToChange.counterBy = userId;
      applicantDataToChange.lastOfferAmount =
        this.props.CompaignsStore.counterAmount;
      this.setState({
        offerResponded: true,
        applicantData: applicantDataToChange,
      });
      this.props.CompaignsStore.setcounterAmount('');
    });
  };

  accectDeclineOffer = (status) => {
    //   offerStatus
    // 0 - No action taken
    // 1 - Pending
    // 2 - Accepted
    // 3 - Declined
    const applicantData = this.props.route.params.applicantData;

    const store = this.props.CompaignsStore;
    Alert.alert(
      strings('OFFER'),
      strings('Are_you_sure_want_to_submit_your_response'),
      [
        {
          text: strings('Cancel'),
          onPress: () => console.log('cancel offer'),
          style: 'cancel',
        },
        {
          text: strings('Yes'),
          onPress: () => {
            // if(status === 2)
            // {
            //   this.checkBankAccount(applicantData.id, status, applicantData.ownerId,store,applicantData)
            // }
            // else
            // {
            store.acceptDeclineOffer(
              applicantData.id,
              status,
              applicantData.ownerId,
            );
            const applicantDataToChange = JSON.parse(
              JSON.stringify(this.state.applicantData),
            );
            applicantDataToChange.offerStatus = status;
            this.setState({
              offerResponded: true,
              applicantData: applicantDataToChange,
            });
            //  }

            //Stripe check for country and create account for user
            //this.getUserDataAndCheckForCountryId(applicantData.id, status, applicantData.ownerId)
            // this.checkBankAccount(applicantData.id, status, applicantData.ownerId,store,applicantData)

            //store.acceptDeclineOffer(applicantData.id, status, applicantData.ownerId)

            //this.setState({offerResponded: true})

            //  const applicantDataToChange = JSON.parse(JSON.stringify(this.state.applicantData))
            //  applicantDataToChange.offerStatus = status
            //  this.setState({offerResponded: true,applicantData:applicantDataToChange})
          },
        },
      ],
      {cancelable: false},
    );
  };
  checkBankAccount = (id, status, ownerId, store, applicantData) => {
    gettUserData().then((userData) => {
      console.log('user data value =', userData);
      if (
        userData.stripeAccountNumber === null ||
        userData.stripeAccountNumber === ''
      ) {
        Alert.alert(
          '',
          strings('Error_Accept_Offer'),
          [
            {
              text: 'Continue',
              onPress: () => {
                store.acceptDeclineOffer(
                  applicantData.id,
                  status,
                  applicantData.ownerId,
                );
                const applicantDataToChange = JSON.parse(
                  JSON.stringify(this.state.applicantData),
                );
                applicantDataToChange.offerStatus = status;
                this.setState({
                  offerResponded: true,
                  applicantData: applicantDataToChange,
                });
              },
            },
            {
              text: 'Add Bank',
              onPress: () =>
                this.props.navigation.navigate('SettingStackScreen', {
                  screen: 'BankInfoDetail',
                }),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } else {
        store.acceptDeclineOffer(
          applicantData.id,
          status,
          applicantData.ownerId,
        );
        const applicantDataToChange = JSON.parse(
          JSON.stringify(this.state.applicantData),
        );
        applicantDataToChange.offerStatus = status;
        this.setState({
          offerResponded: true,
          applicantData: applicantDataToChange,
        });
      }

      //   if (userData.country !== null && userData.country !== "") {
      //     if (userData.countryShortCode !== null && (userData.countryShortCode === "NA" || userData.countryShortCode === "")) {
      //       //const selectedCountry = countriesJson.filter(obj => obj.name === userData.country)
      //       const userParams = { countryShortCode: "SG" }
      //       store.updateUserCountry(userParams, id, offerStatus, ownerId)
      //       const applicantData = JSON.parse(JSON.stringify(this.state.applicantData))
      //       console.log("checkStripeAccount:", applicantData)
      //       applicantData.offerStatus = offerStatus
      //       this.setState({offerResponded: true,applicantData})
      //      //  console.log("selectedCountry:", selectedCountry)
      //     }
      //     else {
      //       //showAlert('Please update your country')
      //       this.checkStripeAccount(userData, ownerId, id, offerStatus, store)

      //     }
      //   }
      //   else {
      //     this.checkStripeAccount(userData, ownerId, id, offerStatus, store)
      //   }
    });
  };

  getUserDataAndCheckForCountryId = (id, offerStatus, ownerId) => {
    const store = this.props.CompaignsStore;
    gettUserData().then((userData) => {
      console.log('user data value =', userData);

      if (userData.country !== null && userData.country !== '') {
        if (
          userData.countryShortCode !== null &&
          (userData.countryShortCode === 'NA' ||
            userData.countryShortCode === '')
        ) {
          //const selectedCountry = countriesJson.filter(obj => obj.name === userData.country)
          const userParams = {countryShortCode: 'SG'};
          store.updateUserCountry(userParams, id, offerStatus, ownerId);
          const applicantData = JSON.parse(
            JSON.stringify(this.state.applicantData),
          );
          console.log('checkStripeAccount:', applicantData);
          applicantData.offerStatus = offerStatus;
          this.setState({offerResponded: true, applicantData});
          //  console.log("selectedCountry:", selectedCountry)
        } else {
          //showAlert('Please update your country')
          this.checkStripeAccount(userData, ownerId, id, offerStatus, store);
        }
      } else {
        this.checkStripeAccount(userData, ownerId, id, offerStatus, store);
      }
    });
  };
  checkStripeAccount = (userData, ownerId, id, offerStatus, store) => {
    if (userData.stripeAccountNumber === null) {
      store.onRegisterStripeAccount(ownerId, 'SG', id, offerStatus);
    } else {
      store.acceptDeclineOffer(id, offerStatus, ownerId);
      //this.setState({ offerResponded: true })

      const applicantData = JSON.parse(
        JSON.stringify(this.state.applicantData),
      );
      console.log('checkStripeAccount:', applicantData);
      applicantData.offerStatus = offerStatus;

      this.setState({offerResponded: true, applicantData});
    }
  };
  getFeesData = (item, campaignData) => {
    // console.log("getFeesData:",item)
    getFeesAndCommission().then((feesData) => {
      if (feesData !== undefined) {
        var offerAmount = parseFloat(campaignData.campaignAmount);
        if (item.offerStatus > 0) {
          offerAmount = parseFloat(item.offerAmount);
        }
        const paymentFees =
          (offerAmount * parseFloat(feesData.paypalPercentFee)) / 100;
        const payoutFees =
          (offerAmount * parseFloat(feesData.paypalReleaseFee)) / 100;
        const total = paymentFees + payoutFees + feesData.paypalFixedFee;
        const koliCom =
          (offerAmount * parseFloat(feesData.koliPlateformFee)) / 100;
        // console.log("getFeesData:",total.toFixed(2))
        this.setState({
          payPalFees: total.toFixed(2),
          koliCommission: koliCom.toFixed(2),
        });
      }
    });
  };
}
export default inject(
  'CompaignsStore',
  'AuthStore',
  'CreateCampaignStore',
)(observer(MYCampaignDetails));

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
  switchStyles: {
    marginRight: metrics.widthSize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  enabledDisableText: {
    color: 'rgba(112, 129, 138, 1)',
    marginRight: 10,
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: metrics.dimen_16,
    marginBottom: metrics.dimen_5,
    alignItems: 'center',
    //backgroundColor:'red'
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
    textTransform: 'uppercase',
  },

  applyForCampaignButton: {
    height: metrics.dimen_45,
    backgroundColor: colors.app_Blue,
    borderRadius: metrics.dimen_8,
    alignItems: 'center',
    marginHorizontal: metrics.dimen_15,
    justifyContent: 'center',
    marginBottom: metrics.dimen_30,
  },
  textOfferStatus: {
    marginVertical: metrics.dimen_8,
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: colors.bankInfoListValue,
  },
  imageOfferStatus: {
    width: metrics.dimen_12,
    height: metrics.dimen_12,
    tintColor: colors.bankInfoListValue,
    marginRight: metrics.dimen_4,
  },
});
