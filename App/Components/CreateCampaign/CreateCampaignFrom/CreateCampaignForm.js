import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Button} from 'react-native-paper';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';

import colors from '../../../Themes/Colors';
import {commonStyles} from '../../../SupportingFIles/Constants';
import {strings} from '../../../Locales/i18';
import {observer, inject} from 'mobx-react';
// import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerComp from '../../DateTimePickerComp';
import Moment from 'moment';
import styles from './styles';
import MyImagePicker from '../../MyImagePicker';
import Loader from '../../../SupportingFIles/Loader';
import {uploadImage} from '../../../API/Campaign/ApiCampaign';
// import { Media_Base_URL } from '../../../API/Campaign/ApiCampaign';
import Config from 'react-native-config';
import {
  kFormatter,
  gettUserData,
  NumberformatesunitUptoOneDecimal,
  fnum,
} from '../../../SupportingFIles/Utills';
import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import ConnectIG from '../../../Assets/Images/ConnectIG';
import IGConnectView from '../../CommonComponents/IGConnectView';
import MyProfileStore from '../../../Stores/Profile/MyProfileStore';
import {ScrollView} from 'react-native-gesture-handler';
const countriesJson = require('../../../SupportingFIles/countries.json');

const formatCurrency = new Intl.NumberFormat('en-US');

class CreateCampaignForm extends Component {
  constructor(props) {
    super(props);
    let gallery = [];
    const {campainData} = this.props.CreateCampaignStore;
    if (campainData.imagegallery) {
      gallery = campainData.imagegallery.map((item) => {
        let obj = {};
        obj.name = item;
        obj.value = item;
        return obj;
      });
    }
    this.state = {
      scrollEnabledView: true,
      selectedCountries: [],
      isLoading: false,
      show_country_modal: false,
      showbutton: false,
      genderArray: [
        {title: strings('Any'), isSelected: true},
        {title: strings('Male'), isSelected: false},
        {title: strings('Female'), isSelected: false},
        {title: strings('Other'), isSelected: false},
      ],
      ageArray: [
        {minAge: 0, maxAge: 0, isSelected: true},
        {minAge: 0, maxAge: 12, isSelected: false},
        {minAge: 13, maxAge: 17, isSelected: false},
        {minAge: 18, maxAge: 24, isSelected: false},
        {minAge: 25, maxAge: 34, isSelected: false},
        {minAge: 35, maxAge: 44, isSelected: false},
        {minAge: 45, maxAge: 100, isSelected: false},
      ],

      gallery: [{name: 'empty', value: ''}, ...gallery],
      followersArray: [
        {title: 'Any', isSelected: true},
        {title: '1000', isSelected: false},
        {title: '10000', isSelected: false},
        {title: '100000', isSelected: false},
      ],
      paid: true,
      sponsored: false,
      shoutout: false,
      commissionBased: false,
      eventsAppearence: false,
      photoshootVideo: false,

      followersCount: 0,
      showConnectedView: false,
      showIgView: false,
      SocialMediaSelectArray: [
        {
          type: 'instagram',
          image: images.instaIcon,
          isSelected: false,
        },
        {
          type: 'facebook',
          image: images.fbSocial,
          isSelected: false,
        },
        {
          type: 'youtube',
          image: images.youtubeSocial,
          isSelected: false,
        },
        {
          type: 'tiktok',
          image: images.tictocSocial,
          isSelected: false,
        },
        {
          type: 'email',
          image: images.emailCreateCampaign,
          isSelected: false,
        },
        {
          type: 'twitter',
          image: images.twitterSocial,
          isSelected: false,
        },
        {
          type: 'linkedin',
          image: images.linkedinSocial,
          isSelected: false,
        },
        {
          type: 'clubhouse',
          image: images.clubhouseSocial,
          isSelected: false,
        },

        {
          type: 'twitch',
          image: images.twitchSocial,
          isSelected: false,
        },
        {
          type: 'livestream',
          image: images.livestreamSocial,
          isSelected: false,
        },
      ],
      showTypeInfo: false,
      minMaxAge: [],
    };
  }
  componentDidMount() {
    //this.props.CreateCampaignStore.setCampaignData({campaigntype: 'Add'})
    const store = this.props.CreateCampaignStore;
    let type = this.props.route.params.type;

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{...commonStyles.backButtonContainercampaign}}
          onPress={() => this.props.navigation.goBack()}>
          <Image
            style={{tintColor: colors.app_black}}
            source={images.backImage}
          />
        </TouchableOpacity>
      ),
    });
    //  this.props.navigation.addListener('focus', () => {
    if (type === 'Edit') {
      store.setCampaignData({campaigntype: type});
      store.setCampaignData({campaignid: this.props.route.params.campaignid});
      store.setJobPosted(false);
      store.setEnabled(true);
      const genderIndex = this.state.genderArray.findIndex(
        (x) => x.title === store.campainData.lookingInfluencerGender,
      );
      //const ageIndex = this.state.ageArray.findIndex(x => x.minAge === store.campainData.minAge)

      var followerIndex = -1;
      if (store.campainData.followercountcampaign === 10000) {
        followerIndex = 1;
      } else if (store.campainData.followercountcampaign === 100000) {
        followerIndex = 2;
      } else if (store.campainData.followercountcampaign === 1000) {
        followerIndex = 0;
      }
      // if (ageIndex !== -1) {
      //   this.selectAgeGender(ageIndex, 'age')
      // }
      if (genderIndex !== -1) {
        this.selectAgeGender(genderIndex, 'gender');
      }
      if (followerIndex !== -1) {
        this.selectDeselectFollower(followerIndex, 'followers');
      }
      this.setCampaignType(store.campainData);

      //==this.selectAgeGender(ageIndex,'age')

      console.log('store.pricePerInstaStory:', store.pricePerInstaStory);

      this.Editselectagetype(store.campainData.minMaxAge);
      this.EditselectDeselectSocialtype(store.socialmediaTagsforupdate);
    } else {
      this.resetStoreData();
      store.setCampaignData({campaigntype: type});
    }
    this.checkInstaData();
    //  console.log('this.props.AuthStore.userlocationcountry:', this.props.AuthStore.userlocationcountry)
    this.setAndAddUserCountry(type, store);
  }
  setAndAddUserCountry = (type, store) => {
    var countriesData = [];
    if (type === 'Edit') {
      const countryNameArr = store.campainData.country.split(',');
      let newCountryList = countriesJson.filter(function (country) {
        return countryNameArr.includes(country.name);
      });
      countriesData = newCountryList.map((el) => {
        return {name: el.name, cca2: el.code};
      });
      // countriesData = countryNameArr.map(el => {return {name:el}})
      // console.log('selectedCountries:',this.state.selectedCountries)
      //countriesData=[ ...this.state.selectedCountries, ...countriesData ]
      // this.setState({
      //   selectedCountries: countriesData
      // })
    }
    if (this.props.AuthStore.userlocationcountry !== '') {
      //   const userCountryName = this.props.AuthStore.userlocationcountry
      //   var userCountryObj = countriesJson.filter(function(country){
      //     return country.name === userCountryName
      //  })
      //  userCountryObj=userCountryObj.map(el=>{
      //   return {name:el.name, cca2:el.code}
      // })
      const userCountryObj = this.getUserCountryObj();

      if (
        userCountryObj.length > 0 &&
        countriesData.filter((e) => e.name === userCountryObj[0].name)
          .length === 0
      ) {
        countriesData = [...userCountryObj, ...countriesData];
      }

      this.setState((prevState) => ({
        selectedCountries: [...prevState.selectedCountries, ...countriesData],
      }));
    }
    store.setCampaignData({countryArr: countriesData});
    store.deleteValidationError('countryError');
  };
  getUserCountryObj = () => {
    const userCountryName =
      this.props.route.params.type !== 'Edit'
        ? this.props.AuthStore.userlocationcountry
        : '';
    var userCountryObj = countriesJson.filter(function (country) {
      return country.name === userCountryName;
    });
    userCountryObj = userCountryObj.map((el) => {
      return {name: el.name, cca2: el.code};
    });
    return userCountryObj;
  };
  checkInstaData = () => {
    this.props.navigation.addListener('focus', () => {
      gettUserData().then((userData) => {
        console.log('userData:', userData);

        if (
          userData.instaUsername !== '' &&
          userData.instaUsername !== null &&
          userData.instaUsername !== undefined
        ) {
          this.setState({showIgView: false, showConnectedView: true});
          if (userData.instaUsername !== null) {
            this.props.MyProfileStore.getInstaPosts(userData.instaUsername);
          }
        } else {
          this.setState({showIgView: true, showConnectedView: false});
        }
      });
    });
  };

  setCampaignType = (campainData) => {
    console.log('campainData.ssasdfsd:', campainData);
    if (campainData.campaignType === 'paid') {
      this.setState({
        paid: true,
        sponsored: false,
        shoutout: false,
        commissionBased: false,
        eventsAppearence: false,
        photoshootVideo: false,
      });
    } else if (campainData.campaignType === 'shoutout') {
      this.setState({
        paid: false,
        sponsored: false,
        shoutout: true,
        commissionBased: false,
        eventsAppearence: false,
        photoshootVideo: false,
      });
    } else if (campainData.campaignType === 'sponsored') {
      this.setState({
        paid: false,
        sponsored: true,
        shoutout: false,
        commissionBased: false,
        eventsAppearence: false,
        photoshootVideo: false,
      });
    } else if (campainData.campaignType === 'commissionBased') {
      this.setState({
        paid: false,
        sponsored: false,
        shoutout: false,
        commissionBased: true,
        eventsAppearence: false,
        photoshootVideo: false,
      });
    } else if (campainData.campaignType === 'eventsAppearence') {
      this.setState({
        paid: false,
        sponsored: false,
        shoutout: false,
        commissionBased: false,
        eventsAppearence: true,
        photoshootVideo: false,
      });
    } else if (campainData.campaignType === 'photoshootVideo') {
      this.setState({
        paid: false,
        sponsored: false,
        shoutout: false,
        commissionBased: false,
        eventsAppearence: false,
        photoshootVideo: true,
      });
    }
  };
  resetStoreData() {
    const store = this.props.CreateCampaignStore;

    store.setCampaignData({pricePerInstaStory: ''});
    store.setCampaignData({
      storyDate: Moment().add(6, 'M').format('DD/MM/YYYY'),
      endStoryPostDate: Moment().add(6, 'M').format('YYYY-MM-DD'),
    });
    store.setHashTag('');
    store.setCampaignData({hashtags: []});
    store.setCampaignData({shipping: ''});
    store.setCampaignData({
      campaignImage: '',
      campaignTitle: '',
      imagegallery: [],
    });
    store.setCampaignData({lookingInfluencerGender: 'Any'});
    store.setCampaignData({campaignDetails: ''});
    store.setCampaignData({followercountcampaign: ''});
    store.setCampaignData({campaignCategories: []});
    store.setCampaignData({imagegallery: []});
    store.setImagePath('');
    store.setEnabled(false);
    store.setJobPosted(false);
    store.setCampaignData({minAge: 0, maxAge: 0});
    this.setState({gallery: [{name: 'empty', value: ''}]});
    store.setCampaignData({commisionbase: 0});
    store.setCampaignData({campaignType: 'paid'});
  }
  removeIgConnectView = () => {
    this.setState({showIgView: false});
  };
  render() {
    const editType = this.props.route.params.type;
    const store = this.props.CreateCampaignStore;
    const {campainData, validationError, isLoading, categoriesArray, enabled} =
      this.props.CreateCampaignStore;
    // const categories = campaignCategories !== undefined ? campaignCategories : []
    console.log('minMaxAge==', campainData.minMaxAge);
    const selectedCategories = categoriesArray.filter((item) => {
      return item.isSelected;
    });

    var followersCount = this.props.MyProfileStore.followersCount;
    // if(followersCount === "" || followersCount === "0" || followersCount === 0 )
    // {
    //   if(this.state.userData !== undefined)
    //   {
    //     followersCount=this.state.userData.followers
    //   }
    // }
    // console.log('followersCount:',followersCount)

    const {selectedCountries} = this.state;
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <Loader loading={isLoading} />
        <Loader loading={this.state.isLoading} />
        <RBSheet
          ref={(ref) => {
            this.bottomSheet = ref;
          }}
          height={450}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View style={{paddingHorizontal: metrics.dimen_27, flex: 1}}>
            <Text
              style={[
                styles.textPopupTitle,
                {
                  alignSelf: 'center',
                  fontSize: metrics.dimen_15,
                  textDecorationLine: 'underline',
                  marginTop: 10,
                },
              ]}>
              {'Campaign Types & Examples'}
            </Text>

            <View style={{marginTop: 20, marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>Paid Campaign</Text>
              <Text style={styles.textPopupDescription}>
                {'eg. $300 for Posting on Tiktok'}
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>{'Commission Based'}</Text>
              <Text style={styles.textPopupDescription}>
                eg. 30% commission for every sale
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>{'Events Appearance'}</Text>
              <Text style={styles.textPopupDescription}>
                eg. $500, Restaurant, 7PM - 10PM
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>{'Photo / Video Shoot'}</Text>
              <Text style={styles.textPopupDescription}>
                eg. $800 for 3 hours photoshoot
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>{'Sponsored'}</Text>
              <Text style={styles.textPopupDescription}>
                eg. Free review for brand products or service for review
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text style={styles.textPopupTitle}>{'Shoutout Exchange'}</Text>
              <Text style={styles.textPopupDescription}>
                eg. Free shoutout between 2 Instagram accounts
              </Text>
            </View>
          </View>
        </RBSheet>
        <MyImagePicker
          ref={(ref) => {
            this.sheet = ref;
          }}
          //  ref={ref => this.sheet = ref}
          iscroppingEnabled={true}
          width={metrics.width}
          height={metrics.width}
          isMultiple={true}
        />
        <DateTimePickerComp
          isDateTimePickerVisible={store.showDatePicker}
          handleDatePicked={this.handleDatePicked}
          hideDateTimePicker={this.hideDateTimePicker}
          mode="date"
          minimumDate={new Date()}
        />
        {/* {this.state.showConnectedView && 
        <View style={styles.viewIgMain}>
          <View style={styles.viewIgTopBottomBorder} />
          <View style={styles.viewIgConnect}>
            <Text style={styles.textIgConnect}>Your IG followers</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ConnectIG styles={styles.instagramIcon} />
              <Text style={[styles.textIgConnect, { marginLeft: metrics.dimen_5 }]}>
                {(followersCount !== "" && followersCount !== "0" && followersCount !== 0 ) ? NumberformatesunitUptoOneDecimal(followersCount) : "-"}
                </Text>
            </View>
          </View>
          <View style={styles.viewIgTopBottomBorder} />
        </View>}
        {this.state.showIgView && <IGConnectView
        navigation={this.props.navigation}
        removeIgConnectView={this.removeIgConnectView}
        />} */}

        <ScrollView
          style={{marginTop: 0}}
          scrollEnabled={this.state.scrollEnabledView}
          ref="_scrollView">
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({
                show_country_modal: false,
                scrollEnabledView: true,
              });
              Keyboard.dismiss();
            }}
            accessible={false}>
            <View style={{justifyContent: 'space-between', flex: 1}}>
              <View>
                <Text style={[styles.textFieldTitle, {marginTop: 20}]}>
                  {strings('Campaigns_title')}
                </Text>
                <View style={styles.campaignViewStyle}>
                  <TextInput
                    style={[
                      styles.inputTextFieldStyle,
                      {
                        width: '100%',
                        height: metrics.dimen_46,
                        backgroundColor: colors.clear,
                        paddingLeft: metrics.dimen_10,
                      },
                    ]}
                    placeholder={strings('Enter_Title')}
                    placeholderTextColor="rgba(62,62,70,0.5)"
                    value={campainData.campaignTitle}
                    maxLength={75}
                    onChangeText={(text) => {
                      store.setCampaignData({campaignTitle: text});
                      if (
                        store.campainData.campaignTitle.length > 0 &&
                        this.state.gallery.length > 1
                      ) {
                        store.setEnabled(true);
                      } else {
                        store.setEnabled(false);
                      }
                    }}
                  />
                </View>

                <Text
                  style={[
                    styles.textFieldTitle,
                    {marginTop: metrics.dimen_15},
                  ]}>
                  {strings('Campaigns_decription')}
                </Text>
                <TextInput
                  style={styles.multilineTextInputStyle}
                  placeholder={strings('Enter_Campaign_Description')}
                  placeholderTextColor="rgba(62,62,70,0.5)"
                  multiline={true}
                  returnKeyType="done"
                  value={campainData.campaignDetails}
                  onChangeText={(text) => {
                    store.setCampaignData({campaignDetails: text});
                    store.deleteValidationError('CampaignDetailError');
                  }}
                  onBlur={() => this.setState({isTfActive: false})}
                  onFocus={() => this.setState({isTfActive: true})}
                />
                {validationError.CampaignDetailError ? (
                  <Text
                    style={{
                      ...commonStyles.errorTextStyle,
                      marginHorizontal: metrics.dimen_27,
                    }}>
                    {validationError.CampaignDetailError}
                  </Text>
                ) : null}

                {/* <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_15 }]}>Type</Text> */}
                {/* <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}}
                onPress={() => this.bottomSheet.open()}>
                <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_15, marginRight:10 }]}>Type</Text>
<Image style={{alignSelf:'center', width:15, height:15, tintColor: colors.app_Blue,marginTop: metrics.dimen_15}}
                    source={images.infoIcon}
                    resizeMode="contain"
                  ></Image>
</TouchableOpacity> */}

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: metrics.dimen_27,
                    marginTop: metrics.dimen_5,
                  }}>
                  <Text
                    style={[
                      styles.textFieldTitletype,
                      {marginRight: metrics.dimen_10},
                    ]}>
                    {strings('Type')}
                  </Text>

                  <TouchableOpacity
                    style={{}}
                    onPress={() => this.bottomSheet.open()}>
                    <Text
                      style={[
                        styles.textFieldTitletype,
                        {color: colors.app_Blue},
                      ]}>
                      {strings('SeeExample')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Radio Button Saving */}
                <View style={styles.viewAccountTypeSelction}>
                  <TouchableOpacity
                    style={styles.radioButtonContainer}
                    activeOpacity={1}
                    onPress={() => {
                      if (editType !== 'Edit') {
                        store.setCampaignData({campaignType: 'paid'});
                        this.setState({
                          paid: true,
                          sponsored: false,
                          shoutout: false,
                          commissionBased: false,
                          eventsAppearence: false,
                          photoshootVideo: false,
                        });
                      }
                    }}>
                    <View
                      style={[
                        styles.radioButton,
                        !this.state.paid && styles.radioButtonUnselected,
                      ]}>
                      {this.state.paid ? (
                        <View style={styles.radioButtonInnerCircle} />
                      ) : null}
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>
                      Paid Campaign
                    </Text>
                  </TouchableOpacity>

                  {/* Radio Button Current */}
                  <TouchableOpacity
                    style={styles.radioButtonContainer}
                    activeOpacity={1}
                    onPress={() => {
                      if (editType !== 'Edit') {
                        store.setCampaignData({
                          campaignType: 'commissionBased',
                        });
                        this.setState({
                          paid: false,
                          sponsored: false,
                          shoutout: false,
                          commissionBased: true,
                          eventsAppearence: false,
                          photoshootVideo: false,
                        });
                      }
                    }}>
                    <View
                      style={[
                        styles.radioButton,
                        !this.state.commissionBased &&
                          styles.radioButtonUnselected,
                      ]}>
                      {this.state.commissionBased ? (
                        <View style={styles.radioButtonInnerCircle} />
                      ) : null}
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>
                      Commission Based
                    </Text>
                  </TouchableOpacity>

                  {/* Radio Button Current */}
                  {/* <TouchableOpacity style={styles.radioButtonContainer}
                    activeOpacity={1}

                    onPress={() => {
                      if (editType !== "Edit") {
                        store.setCampaignData({ campaignType: "eventsAppearence" })
                        this.setState({ paid: false, sponsored: false, shoutout: false, commissionBased: false, eventsAppearence: true, photoshootVideo: false })
                      }

                    }}>
                    <View style={[styles.radioButton, !this.state.eventsAppearence && styles.radioButtonUnselected]}>
                      {

                        this.state.eventsAppearence ?
                          <View style={styles.radioButtonInnerCircle} />
                          : null
                      }
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>Events Appearance</Text>
                  </TouchableOpacity> */}

                  {/* Radio Button Current */}
                  {/* <TouchableOpacity style={styles.radioButtonContainer}
                    activeOpacity={1}

                    onPress={() => {
                      if (editType !== "Edit") {
                        store.setCampaignData({ campaignType: "photoshootVideo" })
                        this.setState({ paid: false, sponsored: false, shoutout: false, commissionBased: false, eventsAppearence: false, photoshootVideo: true })
                      }

                    }}>
                    <View style={[styles.radioButton, !this.state.photoshootVideo && styles.radioButtonUnselected]}>
                      {

                        this.state.photoshootVideo ?
                          <View style={styles.radioButtonInnerCircle} />
                          : null
                      }
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>Photo / Video Shoot</Text>
                  </TouchableOpacity> */}

                  {/* Radio Button Current */}
                  <TouchableOpacity
                    style={styles.radioButtonContainer}
                    activeOpacity={1}
                    onPress={() => {
                      if (editType !== 'Edit') {
                        store.setCampaignData({campaignType: 'sponsored'});
                        this.setState({
                          paid: false,
                          sponsored: true,
                          shoutout: false,
                          commissionBased: false,
                          eventsAppearence: false,
                          photoshootVideo: false,
                        });
                      }
                    }}>
                    <View
                      style={[
                        styles.radioButton,
                        !this.state.sponsored && styles.radioButtonUnselected,
                      ]}>
                      {this.state.sponsored ? (
                        <View style={styles.radioButtonInnerCircle} />
                      ) : null}
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>
                      {'Product Sponsor'}
                    </Text>
                  </TouchableOpacity>

                  {/* Radio Button Current */}
                  <TouchableOpacity
                    style={styles.radioButtonContainer}
                    activeOpacity={1}
                    onPress={() => {
                      if (editType !== 'Edit') {
                        store.setCampaignData({campaignType: 'shoutout'});
                        this.setState({
                          paid: false,
                          sponsored: false,
                          shoutout: true,
                          commissionBased: false,
                          eventsAppearence: false,
                          photoshootVideo: false,
                        });
                      }
                    }}>
                    <View
                      style={[
                        styles.radioButton,
                        !this.state.shoutout && styles.radioButtonUnselected,
                      ]}>
                      {this.state.shoutout ? (
                        <View style={styles.radioButtonInnerCircle} />
                      ) : null}
                    </View>
                    <Text style={[styles.textFieldTitle, styles.textSaving]}>
                      Shoutout Exchange
                    </Text>
                  </TouchableOpacity>
                </View>

                {(this.state.paid ||
                  this.state.sponsored ||
                  this.state.commissionBased ||
                  this.state.eventsAppearence ||
                  this.state.photoshootVideo) && (
                  <Text
                    style={[
                      styles.textFieldTitle,
                      {marginTop: metrics.dimen_15},
                    ]}>
                    {this.state.paid
                      ? strings('Campaigns_budget')
                      : strings('Value')}
                  </Text>
                )}
                {(this.state.paid ||
                  this.state.sponsored ||
                  this.state.commissionBased ||
                  this.state.eventsAppearence ||
                  this.state.photoshootVideo) && (
                  <View style={styles.campaignViewStyle}>
                    <Text
                      style={[
                        styles.inputTextFieldStyle,
                        {color: colors.app_Blue, marginLeft: metrics.dimen_14},
                      ]}>
                      {this.state.commissionBased ? '%' : strings('USD')}
                    </Text>
                    <TextInput
                      style={[
                        styles.inputTextFieldStyle,
                        {
                          width: '100%',
                          height: metrics.dimen_46,
                          backgroundColor: colors.clear,
                          paddingLeft: metrics.dimen_5,
                        },
                      ]}
                      placeholder={
                        this.state.commissionBased
                          ? ' '
                          : '0.00 (minimum price $5)'
                      }
                      keyboardType="decimal-pad"
                      maxLength={5}
                      placeholderTextColor={'rgba(62,62,70,0.5)'}
                      value={campainData.pricePerInstaStory}
                      onChangeText={(text) => {
                        let price = text;
                        // price = price.replace(/[^0-9]/ig, '')
                        store.setCampaignData({pricePerInstaStory: price});
                        store.deleteValidationError('priceError');
                      }}
                      onBlur={() => this.setState({isTfActive: false})}
                      onFocus={() => this.setState({isTfActive: true})}
                    />
                  </View>
                )}
                {(this.state.paid ||
                  this.state.sponsored ||
                  this.state.commissionBased ||
                  this.state.eventsAppearence ||
                  this.state.photoshootVideo) &&
                validationError.priceError ? (
                  <Text
                    style={{
                      ...commonStyles.errorTextStyle,
                      marginHorizontal: metrics.dimen_27,
                    }}>
                    {validationError.priceError}
                  </Text>
                ) : null}

                {/* {this.state.paid ? <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_15 }]}>
                    { strings('Commision') }
                  </Text>:null} */}
                {/* {this.state.paid ?  <View style={styles.campaignViewStyle}>
                    <Text style={[styles.inputTextFieldStyle, { color: colors.app_Blue, marginLeft: metrics.dimen_14 }]}>{""}</Text>
                    <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_5 }]}
                      placeholder={"E.g 10"}
                      keyboardType="decimal-pad"
                      maxLength={5}
                      placeholderTextColor={'rgba(62,62,70,0.5)'}
                      value={campainData.commisionbase}
                      onChangeText={(text) => {
                        let price = text
                        // price = price.replace(/[^0-9]/ig, '')
                        store.setCampaignData({ commisionbase: price })
                       
                      }}
                      onBlur={() => this.setState({ isTfActive: false })}
                      onFocus={() => this.setState({ isTfActive: true })}
                    />
                  </View>:null} */}

                {/* comment follower count */}
                {/* {this.state.showConnectedView &&
                  <Text style={[styles.textFieldTitle, { marginTop: metrics.dimen_15 }]}>
                    {strings('My_followers_count')}
                  </Text>} */}
                {/* {this.state.showConnectedView &&
                  <View style={styles.campaignViewStyle}>
                    <Text style={[styles.inputTextFieldStyle, { width: '100%', backgroundColor: colors.clear, paddingLeft: metrics.dimen_15 }]}>
                      {(followersCount !== "" && followersCount !== "0" && followersCount !== 0) ? NumberformatesunitUptoOneDecimal(followersCount) : "-"}</Text> */}
                {/* <TextInput style={[styles.inputTextFieldStyle, { width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_5 }]}
                    editable={false}
                     
                      value= {(followersCount !== "" && followersCount !== "0" && followersCount !== 0 ) ? NumberformatesunitUptoOneDecimal(followersCount) : "-"}
                     
                    /> */}
                {/* </View>} */}

                <Text style={styles.textFieldTitle}>{strings('Category')}</Text>
                <TouchableOpacity
                  style={styles.campaignViewStyle}
                  onPress={() =>
                    this.props.navigation.navigate('CampaignAddCategory', {
                      isFromAdd: true,
                    })
                  }>
                  <TextInput
                    style={[
                      styles.inputTextFieldStyle,
                      {
                        width: '100%',
                        height: metrics.dimen_46,
                        backgroundColor: colors.clear,
                        paddingLeft: metrics.dimen_10,
                      },
                    ]}
                    placeholder={strings('Select_Category')}
                    placeholderTextColor="rgba(62,62,70,1.0)"
                    editable={false}
                    //value={campainData.campaignTitle}
                    pointerEvents="none"
                    // onChangeText={(text) => {
                    //   console.warn('text',text)
                    //   store.setCampaignData({ campaignTitle: text })
                    //   if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                    //     store.setEnabled(true)
                    //   }else{
                    //     store.setEnabled(false)

                    //   }
                    // }}
                  />
                  <Image
                    style={styles.imageArrow}
                    source={images.rightArrowIcon}
                    resizeMode="contain"></Image>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_27,
                  }}>
                  {selectedCategories.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={styles.textCategoryContainer}
                        onPress={() => this.selectDeselectCategories(item)}>
                        <Text style={styles.textCategory}>
                          {item.categoryName}
                        </Text>
                        <Image
                          style={styles.imageCross}
                          source={images.cross}></Image>
                      </TouchableOpacity>
                      //     {/* <Chip
                      //    // icon={images.cross}
                      //     style = {{marginRight: metrics.dimen_10, marginBottom: metrics.dimen_10,borderRadius: 5, backgroundColor:'#F8F8F8'}}
                      //     //onClose = {()=>this.onRemoveTags(index)}
                      //     textStyle = {{...commonStyles.LatoRegular_Medium, color: colors.app_Blue}}
                      //     accessibilityLabel = {index+''}
                      //     >
                      //         {item}
                      //     </Chip> */}
                    );
                  })}
                  {validationError.categoryError ? (
                    <Text style={{...commonStyles.errorTextStyle}}>
                      {validationError.categoryError}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.textFieldTitle}>
                  {strings('Expiry_Date')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    store.setShowDatePicker(true);
                  }}>
                  <View
                    style={[
                      styles.campaignViewStyle,
                      {justifyContent: 'space-between'},
                    ]}>
                    <Text
                      style={{
                        fontFamily: metrics.Lato_SemiBold,
                        fontSize: metrics.getFontSize(14),
                        color: 'rgba(62,62,70,1.0)',
                        marginLeft: metrics.dimen_14,
                      }}>
                      {store.campainData.storyDate.length > 0
                        ? store.campainData.storyDate
                        : strings('Select_Date')}
                    </Text>
                    <Image
                      source={images.CalendarIcon}
                      style={{marginRight: metrics.dimen_10}}
                    />
                  </View>
                  {validationError.dateError ? (
                    <Text
                      style={{
                        ...commonStyles.errorTextStyle,
                        marginHorizontal: metrics.dimen_27,
                      }}>
                      {validationError.dateError}
                    </Text>
                  ) : null}
                </TouchableOpacity>

                <Text style={styles.textFieldTitle}>
                  {strings('Campaign_Countries')}
                </Text>
                <TouchableOpacity
                  style={styles.campaignViewStyle}
                  onPress={() =>
                    this.setState({
                      show_country_modal: true,
                      scrollEnabledView: false,
                    })
                  }>
                  <TextInput
                    style={[
                      styles.inputTextFieldStyle,
                      {
                        width: '100%',
                        height: metrics.dimen_46,
                        backgroundColor: colors.clear,
                        paddingLeft: metrics.dimen_10,
                      },
                    ]}
                    placeholder={strings('Select_country')}
                    placeholderTextColor="rgba(62,62,70,1.0)"
                    editable={false}
                    pointerEvents="none"
                  />
                  <Image
                    style={styles.imageArrow}
                    source={images.rightArrowIcon}
                    resizeMode="contain"></Image>
                </TouchableOpacity>
                {this.state.show_country_modal && (
                  <View style={styles.countryPickerboxWithShadow}>
                    <CountryPicker
                      // theme={DARK_THEME}
                      //   containerButtonStyle={{ height: 0}}
                      multipleSelectedCountries={this.state.selectedCountries}
                      visible={this.state.show_country_modal}
                      onClose={() =>
                        this.setState({
                          show_country_modal: false,
                          scrollEnabledView: true,
                        })
                      }
                      isMultiple={true}
                      withEmoji={true}
                      withFlag={true}
                      withFilter={true}
                      withAlphaFilter={true}
                      withCallingCode={false}
                      withModal={false}
                      translation={'en'}
                      // withd
                      filterProps={{
                        filterable: false,
                        placeholder: strings('search_country'),
                      }}
                      onSelect={(country) => {
                        console.log(
                          'country onSelect: =================>>>>>>. ',
                          country,
                        );
                        store.setCampaignData({
                          country: country.name,
                          countryCode: country.cca2,
                        });
                        let data = this.state.selectedCountries;
                        data.push({name: country.name, cca2: country.cca2});

                        var result = data.reduce((unique, o) => {
                          if (
                            !unique.some(
                              (obj) =>
                                obj.name === o.name && obj.cca2 === o.cca2,
                            )
                          ) {
                            unique.push(o);
                          }
                          return unique;
                        }, []);

                        if (result[0] && result[0].name === 'Any') {
                          result.shift();
                        }
                        store.setCampaignData({
                          countryArr: result,
                        });

                        console.log('in Form:', selectedCountries);
                        this.setState({
                          show_country_modal: false,
                          selectedCountries: result,
                          scrollEnabledView: true,
                        });
                        store.deleteValidationError('countryError');
                      }}
                      onDone={(selectedCountries) => {
                        console.log('on done ', selectedCountries);

                        store.setCampaignData({
                          countryArr: selectedCountries,
                        });

                        console.log('in Form:', selectedCountries);
                        this.setState({
                          show_country_modal: false,
                          selectedCountries: selectedCountries,
                          scrollEnabledView: true,
                        });
                      }}
                    />
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_27,
                  }}>
                  {selectedCountries.length === 250 &&
                    this.renderCountryTag({name: 'ANY'})}
                  {selectedCountries.length < 250 &&
                    selectedCountries.map((item, index) => {
                      return this.renderCountryTag(item);
                    })}
                  {validationError.countryError ? (
                    <Text style={{...commonStyles.errorTextStyle}}>
                      {validationError.countryError}
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.textFieldTitle}>
                  {strings('Influencers_Gender')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_27,
                  }}>
                  {this.state.genderArray.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.itemAgeGender,
                          item.isSelected && styles.selectedItemAgeGender,
                        ]}
                        onPress={() => this.selectAgeGender(index, 'gender')}>
                        <Text
                          style={[
                            styles.textItemAgeGender,
                            item.isSelected && styles.textSelectedItemAgeGender,
                          ]}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.textFieldTitle}>
                  {strings('Influencers_Age')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_27,
                  }}>
                  {this.state.ageArray.map((item, index) => {
                    const ageLabel =
                      item.maxAge === 0
                        ? 'Any'
                        : item.maxAge === 12
                        ? 'Below 13'
                        : item.maxAge === 100
                        ? 'Above 44'
                        : `${item.minAge}-${item.maxAge}`;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.itemAgeGender,
                          item.isSelected && styles.selectedItemAgeGender,
                        ]}
                        onPress={() =>
                          this.selectMultipleAgeGender(item, 'age')
                        }>
                        <Text
                          style={[
                            styles.textItemAgeGender,
                            item.isSelected && styles.textSelectedItemAgeGender,
                          ]}>
                          {ageLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.textFieldTitle}>
                  {strings('Min_Followers')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_27,
                  }}>
                  {this.state.followersArray.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.itemAgeGender,
                          item.isSelected && styles.selectedItemAgeGender,
                        ]}
                        onPress={() =>
                          this.selectDeselectFollower(index, 'followers')
                        }>
                        <Text
                          style={[
                            styles.textItemAgeGender,
                            item.isSelected && styles.textSelectedItemAgeGender,
                          ]}>
                          {item.title === 'Any'
                            ? 'Any'
                            : kFormatter(item.title)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.textFieldTitle}>
                    {strings('Platforms')}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.state.showbutton
                        ? this.clearAllSocialtype()
                        : this.selectAllSocialtype()
                    }>
                    <Text style={[styles.textFieldTitle, {color: '#4E8BFE'}]}>
                      {this.state.showbutton
                        ? strings('Clear_All')
                        : strings('Select_All')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{
                    marginTop: metrics.dimen_15,
                    marginBottom: metrics.dimen_10,
                    marginHorizontal: metrics.dimen_10,
                  }}
                  contentContainerStyle={{flexGrow: 1}}
                  numColumns={5}
                  keyboardShouldPersistTaps={'handled'}
                  data={this.state.SocialMediaSelectArray}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) =>
                    this.renderSocialIcon(item, index)
                  }
                />
                {/* <View style = {styles.campaignViewStyle}>
            {this.state.genderArray.map((item, index) =>{
                        return(
                          <TouchableOpacity style={[styles.itemAgeGender, item.isSelected && styles.selectedItemAgeGender]}
                          onPress={()=>this.selectAgeGender(index,'gender')}>
                              <Text style={[styles.textItemAgeGender, item.isSelected && styles.textSelectedItemAgeGender]}>
                                {item.title}</Text>
                              </TouchableOpacity>
                            )
                        }
                    )}
                <TextInput style={[styles.inputTextFieldStyle,{ width: '100%', height: metrics.dimen_46, backgroundColor: colors.clear, paddingLeft: metrics.dimen_10}]}
                 placeholder = {strings('Example')}
                 keyboardType="number-pad"
                 maxLength={20}
                 placeholderTextColor = {'rgba(192, 196, 204, 1)'}
                 value = {campainData.followercountcampaign?formatCurrency.format(campainData.followercountcampaign):''}
                 onChangeText = {(text)=>{
                     let price = text
                     price = price.replace(/[^0-9]/ig, '')
                     store.setCampaignData({followercountcampaign: price})
                 }}
                />
              </View> */}

                <Text style={styles.textFieldTitle}>
                  {strings('Provide_Campaign_image')}
                </Text>
                <FlatList
                  style={{
                    marginBottom: metrics.dimen_20,
                    marginLeft: metrics.dimen_14,
                  }}
                  numColumns={3}
                  keyboardShouldPersistTaps={'handled'}
                  data={this.state.gallery}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => this.renderGallery(item)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Button
            style={[
              styles.buttonSubmit,
              {
                backgroundColor: enabled
                  ? colors.app_Blue
                  : 'rgba(192, 196, 204, 0.6)',
                shadowOpacity: enabled > 0 ? 0.5 : 0,
              },
            ]}
            labelStyle={{...commonStyles.LatoBold_14, color: 'white'}}
            onPress={() => this.setuserdataandredirect()}
            disabled={!enabled}>
            {strings('Preview')}
          </Button>
          {/* <KeyboardAccessoryNavigation
          avoidKeyboard={true}
          androidAdjustResize
          onDone={()=>this.onNext()}
          nextHidden={true}
          previousHidden={true}
          doneButtonTitle={strings('Next')}
        /> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
  renderCountryTag = (item) => {
    if (item && item.name !== 'Any') {
      return (
        <TouchableOpacity
          style={styles.textCategoryContainer}
          onPress={() => this.removeCountry(item)}>
          <Text style={styles.textCategory}>{item.name}</Text>
          <Image style={styles.imageCross} source={images.cross}></Image>
        </TouchableOpacity>
      );
    } else {
      return <Text style={styles.textCategory}>{item.name}</Text>;
    }
  };
  removeCountry = (item) => {
    const selectedCountries = this.state.selectedCountries;
    if (selectedCountries.length < 250) {
      var filteredArr = this.state.selectedCountries.filter(function (el) {
        return el.cca2 !== item.cca2;
      });
      this.props.CreateCampaignStore.setCampaignData({
        countryArr: filteredArr,
      });
      if (filteredArr.length === 0) {
        // this.props.CreateCampaignStore.setValidationData({ countryError: strings('Country_error') })
        filteredArr.unshift({name: 'Any'});
      }

      this.setState({selectedCountries: filteredArr});
    } else {
      const userCountryObj = this.getUserCountryObj();
      console.log('userCountryObj:', userCountryObj);
      this.setState({selectedCountries: userCountryObj});
    }
  };
  selectDeselectCategories = (item) => {
    const store = this.props.CreateCampaignStore;
    const indexOfItem = store.categoriesArray.findIndex(
      (obj) => obj.categoryName === item.categoryName,
    );
    store.setSelectDeselectCatgories(indexOfItem);
    store.deleteValidationError('categoryError');
  };
  selectDeselectFollower = (index, type) => {
    console.log('selectDeselectFollower, index:', index);
    const store = this.props.CreateCampaignStore;
    var arr = [...this.state.followersArray];
    const updatedArr = arr.map((el, elIndex) => {
      if (elIndex !== index) {
        el.isSelected = false;
      }
      return el;
    });
    if (updatedArr[index].isSelected) {
      store.setCampaignData({
        followercountcampaign: 0,
      });
    } else {
      store.setCampaignData({
        followercountcampaign: updatedArr[index].title,
      });
    }
    updatedArr[index].isSelected = !updatedArr[index].isSelected;

    this.setState({
      followersArray: updatedArr,
    });

    // store.setCampaignData({minAge: updatedArr[index].minAge,maxAge: updatedArr[index].maxAge})
  };

  selectAllSocialtype() {
    for (index = 0; index < this.state.SocialMediaSelectArray.length; index++) {
      var arrNew = this.state.SocialMediaSelectArray;
      var newItem = arrNew[index];
      newItem.isSelected = true;
      arrNew[index] = newItem;
      this.setState({
        SocialMediaSelectArray: arrNew,
      });
      this.props.CreateCampaignStore.setCampaignData({socialMediaTags: arrNew});
      this.setState({showbutton: true});
    }
  }

  clearAllSocialtype() {
    for (index = 0; index < this.state.SocialMediaSelectArray.length; index++) {
      var arrNew = this.state.SocialMediaSelectArray;
      var newItem = arrNew[index];
      newItem.isSelected = false;
      arrNew[index] = newItem;
      this.setState({
        SocialMediaSelectArray: arrNew,
      });
      this.props.CreateCampaignStore.setCampaignData({socialMediaTags: arrNew});

      this.setState({showbutton: false});
    }
  }

  EditselectDeselectSocialtype = (socialmediaTagsforupdate) => {
    var nameArr = socialmediaTagsforupdate.split(',');

    if (nameArr != '') {
      if (nameArr.length === 10) {
        this.setState({showbutton: true});
      }
      try {
        for (let i = 0; i < nameArr.length; i++) {
          const index = this.state.SocialMediaSelectArray.findIndex((obj) =>
            obj.type.includes(nameArr[i]),
          );
          console.log('index', index);
          var arrNew = this.state.SocialMediaSelectArray;
          console.log('arrNew', arrNew);
          var newItem = arrNew[index];
          console.log('newItem', newItem);

          if (newItem.isSelected) {
            newItem.isSelected = false;
          } else {
            newItem.isSelected = true;
          }
          arrNew[index] = newItem;
          this.setState({
            SocialMediaSelectArray: arrNew,
          });

          const selectedMediatagtype = arrNew.filter((items) => {
            return items.isSelected;
          });
          this.props.CreateCampaignStore.setCampaignData({
            socialMediaTags: selectedMediatagtype,
          });
        }
      } catch (error) {}
    }
  };

  Editselectagetype = (ageSelectedvalue) => {
    var agearray = ageSelectedvalue.split(',');
    console.log('agearray====', agearray);

    if (agearray !== '' && agearray !== null) {
      try {
        for (let i = 0; i < agearray.length; i++) {
          var minmax = agearray[i].split('-');

          const index = this.state.ageArray.findIndex(
            (obj) =>
              obj.minAge.toString().includes(minmax[0]) &&
              obj.maxAge.toString().includes(minmax[1]),
          );
          console.log('index==', index);
          var arrNew = this.state.ageArray;
          var newItem = arrNew[index];
          console.log('newItem==', newItem);

          if (newItem.isSelected) {
            newItem.isSelected = false;
          } else {
            newItem.isSelected = true;
          }
          arrNew[index] = newItem;
          this.setState({
            agearray: arrNew,
          });
        }
      } catch (error) {}
    }
  };

  selectDeselectSocialtype = (item) => {
    const index = this.state.SocialMediaSelectArray.findIndex(
      (obj) => obj.type === item.type,
    );
    console.log('index', index);
    var arrNew = this.state.SocialMediaSelectArray;
    console.log('arrNew', arrNew);

    var newItem = arrNew[index];

    console.log('newItem', newItem);

    if (newItem.isSelected) {
      newItem.isSelected = false;
    } else {
      newItem.isSelected = true;
    }
    arrNew[index] = newItem;
    this.setState({
      SocialMediaSelectArray: arrNew,
    });

    const selectedMediatagtype = arrNew.filter((items) => {
      return items.isSelected;
    });
    this.props.CreateCampaignStore.setCampaignData({
      socialMediaTags: selectedMediatagtype,
    });
  };

  selectMultipleAgeGender = (item) => {
    if (item.maxAge === 0) {
      for (index = 0; index < this.state.ageArray.length; index++) {
        var arrNew = this.state.ageArray;
        var newItem = arrNew[index];
        newItem.isSelected = false;
        arrNew[index] = newItem;
        this.setState({
          ageArray: arrNew,
        });
      }

      var arrNew = this.state.ageArray;
      var newItem = arrNew[0];
      if (newItem.isSelected) {
        newItem.isSelected = false;
      } else {
        newItem.isSelected = true;
      }
      arrNew[0] = newItem;
      this.setState({
        ageArray: arrNew,
      });

      selectedagedate = [];
      selectminmax = [];

      const selectedagetype = arrNew.filter((items) => {
        if (items.isSelected) {
          selectedagedate.push(items.minAge + '-' + items.maxAge);
          selectminmax.push(items.minAge);
          selectminmax.push(items.maxAge);
        }
        return items.isSelected;
      });
      const maxvalue = this.getArrayMax(selectminmax);
      const minvalue = this.getArrayMin(selectminmax);

      this.props.CreateCampaignStore.setCampaignData({
        minAge: minvalue,
        maxAge: maxvalue,
      });
      this.props.CreateCampaignStore.setCampaignData({
        minMaxAge: selectedagedate,
      });
    } else {
      const index = this.state.ageArray.findIndex(
        (obj) => obj.maxAge === item.maxAge,
      );

      var arrNew = this.state.ageArray;
      var newItem = arrNew[0];
      newItem.isSelected = false;
      arrNew[0] = newItem;
      this.setState({
        ageArray: arrNew,
      });
      arrNew = this.state.ageArray;
      var newItem = arrNew[index];
      if (newItem.isSelected) {
        newItem.isSelected = false;
      } else {
        newItem.isSelected = true;
      }

      arrNew[index] = newItem;
      this.setState({
        ageArray: arrNew,
      });
      selectedagedate = [];
      selectminmax = [];

      const selectedagetype = arrNew.filter((items) => {
        if (items.isSelected) {
          selectedagedate.push(items.minAge + '-' + items.maxAge);
          selectminmax.push(items.minAge);
          selectminmax.push(items.maxAge);
        }
        return items.isSelected;
      });
      const maxvalue = this.getArrayMax(selectminmax);
      const minvalue = this.getArrayMin(selectminmax);

      this.props.CreateCampaignStore.setCampaignData({
        minAge: minvalue,
        maxAge: maxvalue,
      });
      this.props.CreateCampaignStore.setCampaignData({
        minMaxAge: selectedagedate,
      });
      //console.log("CampaignData",this.props.CreateCampaignStore.campainData)
    }
  };
  getArrayMax(array) {
    return Math.max.apply(null, array);
  }
  getArrayMin(array) {
    return Math.min.apply(null, array);
  }

  selectAgeGender = (index, type) => {
    const store = this.props.CreateCampaignStore;
    var arr = [...this.state.ageArray];
    if (type === 'gender') {
      arr = [...this.state.genderArray];
    } else if (type === 'followers') {
      arr = [...this.state.followersArray];
    }
    //const updatedArr = arr.map((el) => el.isSelected = false)
    const updatedArr = arr.map((el) => {
      el.isSelected = false;
      return el;
    });
    updatedArr[index].isSelected = true;
    if (type === 'age') {
      this.setState({
        ageArray: updatedArr,
      });
      store.setCampaignData({
        minAge: updatedArr[index].minAge,
        maxAge: updatedArr[index].maxAge,
      });
    } else if (type === 'followers') {
      this.setState({
        followersArray: updatedArr,
      });
      store.setCampaignData({
        followercountcampaign:
          index === 1 ? '10000' : index === 2 ? '100000' : '1000',
      });

      // store.setCampaignData({minAge: updatedArr[index].minAge,maxAge: updatedArr[index].maxAge})
    } else {
      this.setState({
        genderArray: updatedArr,
      });
      store.setCampaignData({lookingInfluencerGender: updatedArr[index].title});
    }
  };
  hideDateTimePicker = () => {
    this.props.CreateCampaignStore.setShowDatePicker(false);
  };

  handleDatePicked = (date) => {
    this.hideDateTimePicker();
    this.props.CreateCampaignStore.setCampaignData({
      storyDate: Moment(date).format('DD/MM/YYYY'),
      endStoryPostDate: Moment(date).format('YYYY-MM-DD'),
    });
    this.props.CreateCampaignStore.deleteValidationError('dateError');
  };

  renderSocialIcon = (item, index) => {
    return (
      <TouchableOpacity
        style={{marginLeft: metrics.dimen_10}}
        onPress={() => this.selectDeselectSocialtype(item)}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: metrics.dimen_6,
          }}>
          <Image
            style={{height: metrics.dimen_45, width: metrics.dimen_45}}
            source={item.image}
          />
          <Text
            style={{
              fontSize: metrics.dimen_9,
              fontFamily: metrics.Lato_SemiBold,
              color: colors.app_gray,
              textTransform: 'capitalize',
            }}>
            {item.type}
          </Text>
        </View>

        <Image
          style={{
            position: 'absolute',
            right: 1,
            height: metrics.dimen_18,
            width: metrics.dimen_18,
          }}
          source={item.isSelected ? images.socialselect : images.socialnormal}
        />
      </TouchableOpacity>
    );
  };
  renderGallery = (item) => {
    return (
      <TouchableOpacity
        style={{marginLeft: metrics.dimen_10}}
        onPress={() => this.showImagePickerMultipleImages()}>
        <View style={{...commonStyles.squareCellStyle, marginRight: 0}}>
          <View style={{...commonStyles.squareCellSubViewStyle}}>
            {item.name === 'empty' ? (
              <Image
                source={images.UploadImage}
                style={{width: '30%', height: '30%'}}
              />
            ) : (
              <Image
                style={{...commonStyles.squareImageContainerStyle}}
                source={{uri: item.name}}></Image>
            )}
            {item.name !== 'empty'
              ? this.renderCancelButton('gallery', item)
              : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  showImagePickerMultipleImages = () => {
    Keyboard.dismiss();
    // const store = this.props.CreateCampaignStore

    this.sheet
      .openSheet()
      .then((imagesPicked) => {
        console.log('imagesPicked:', Array.isArray(imagesPicked));
        //store.setLoading(true)
        this.setState({isLoading: true});
        if (Array.isArray(imagesPicked)) {
          imagesPicked.map(async (item, index) => {
            this.uploadAndShowImage(item, index, imagesPicked);
          });
        } else {
          this.uploadAndShowImage(imagesPicked, 0, [imagesPicked]);
        }
      })
      .catch((error) => {
        this.setState({isLoading: false});
      });
  };
  uploadAndShowImage = (item, index, imagesArr) => {
    const store = this.props.CreateCampaignStore;
    //store.setLoading(true)

    // const stamp = Math.floor(Date.now() * 1000)
    // var intArray = new Uint32Array(1);
    // const randomNumber = Math.floor(crypto.getRandomValues(intArray));
    // const picName = stamp.toString() + randomNumber.toString() + '.png'
    // let file = {
    //   uri: item.path,
    //   name: picName,
    //   type: item.mime
    // }
    // store.setLoading(true)
    this.setState({isLoading: true});
    //Upload image to server using API

    const param = {
      base64ImageData: item.data,
      folderPath: 'campaigns',
      bucketName: Config.BUCKET,
    };
    //console.log("POST IMAZGE PARAMS:",param)
    uploadImage(param)
      .then((response) => {
        console.log('uploadImage response success 1234:', response.data);
        let photos = this.state.gallery;
        let imagePicked = {name: item.path, value: response.data.path};
        // photos.push(imagePicked)
        photos.splice(1, 0, imagePicked);
        this.setState({gallery: photos});
        if (
          store.campainData.campaignTitle.length > 0 &&
          this.state.gallery.length > 1
        ) {
          store.setEnabled(true);
        }
        if (index === imagesArr.length - 1) {
          this.setState({isLoading: false});
          store.setLoading(false);
        }
      })
      .catch((error) => {
        console.log('uploadImage data response error=', error);
      });

    //Upload image using s3
    // let val = await uploadFile('campaigns', file)

    // if (val) {

    //     let photos = this.state.gallery
    //     let imagePicked = { name: item.path, value: picName }
    //     photos.push(imagePicked)
    //     this.setState({ gallery: photos })
    //     if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
    //       store.setEnabled(true)
    //     }
    // }
  };
  renderCancelButton = (id, data) => {
    return (
      <TouchableOpacity
        style={{...commonStyles.cancelButtonMainViewStyle}}
        onPress={() => this.onRemovePhoto(id, data)}>
        <View style={{...commonStyles.cancelButtonStyle}}>
          <Text style={{fontSize: 10, fontWeight: '500', color: colors.white}}>
            X
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  onRemovePhoto = (id, data) => {
    let {gallery} = this.state;

    let array = [...gallery];
    let index = array.indexOf(data);
    if (index !== -1) {
      array.splice(index, 1);
      gallery = array;
      this.setState({gallery: gallery}, () => {
        this.setEnableDisable();
      });
    } else {
      this.setEnableDisable();
    }
    console.log('in onRemovePhoto:', this.state.gallery);
  };
  setEnableDisable = () => {
    const store = this.props.CreateCampaignStore;

    if (
      store.campainData.campaignTitle.length > 0 &&
      this.state.gallery.length > 1
    ) {
      store.setEnabled(true);
    } else {
      store.setEnabled(false);
    }
  };
  setuserdataandredirect() {
    const store = this.props.CreateCampaignStore;
    const selectedCategories = store.categoriesArray.filter((item) => {
      return item.isSelected;
    });
    if (store.campainData.campaignDetails.length === 0) {
      this.props.CreateCampaignStore.setValidationData({
        CampaignDetailError: strings('Enter_Campaign_Description'),
      });
    }
    // else if (this.props.CreateCampaignStore.campainData.pricePerInstaStory.length === 0) {
    //   this.props.CreateCampaignStore.setValidationData({priceError: strings('Enter_Price')})
    // }
    else if (selectedCategories.length === 0) {
      this.props.CreateCampaignStore.setValidationData({
        categoryError: strings('Select_Campaign_Categories'),
      });
      this.refs._scrollView.scrollTo(100);
    } else if (
      this.props.CreateCampaignStore.campainData.storyDate.length === 0
    ) {
      this.props.CreateCampaignStore.setValidationData({
        dateError: strings('Select_date'),
      });
    } else if (store.campainData.countryArr.length === 0) {
      // store.setValidationData({ countryError: strings('Country_error') })
      store.campainData.countryArr.unshift({name: 'Any'});
    } else if (
      (this.state.paid ||
        this.state.sponsored ||
        this.state.eventsAppearence ||
        this.state.photoshootVideo) &&
      store.campainData.pricePerInstaStory < 5
    ) {
      this.props.CreateCampaignStore.setValidationData({
        priceError: strings('minimum_PostAmount'),
      });
      this.refs._scrollView.scrollTo(100);
    } else {
      let campaignImage = [];
      this.state.gallery.map((item) => {
        if (item.name !== 'empty') {
          return campaignImage.push(item.value);
          //campaignImage.splice(0, 0, item.value)
          // if(item.value==='updated')
          // {
          //   campaignImage.splice(0, 0, item.name)

          // }else
          // {
          //   campaignImage.splice(0, 0, Media_Base_URL+item.value)

          // }
        }
      });
      store.setCampaignData({campaignImage});
      this.props.navigation.navigate('CampaignPreview');
    }
  }
}
export default inject(
  'CreateCampaignStore',
  'MyProfileStore',
  'AuthStore',
)(observer(CreateCampaignForm));
