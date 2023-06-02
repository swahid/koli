import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Platform, TouchableHighlight } from 'react-native'
import { commonStyles } from '../../../SupportingFIles/Constants'
import metrics from '../../../Themes/Metrics'
import Moment from 'moment'
import { strings } from '../../../Locales/i18'
import colors from '../../../Themes/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import images from '../../../Themes/Images'
import { observer, inject } from 'mobx-react';
import Loader from '../../../SupportingFIles/Loader';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
const formatCurrency = new Intl.NumberFormat('en-US')
import Slideshow from '../../../SupportingFIles/Slideshow';
import { gettUserData,convertCurrencybyCode } from '../../../SupportingFIles/Utills';

class ApplyJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppliedInitiate: false,
      profileupdate: false,
      requiredfollowercount: '',
      userfollowercount: ''
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
    }
    )

    gettUserData().then(data => {
      // if (data.avatarUrl && data.gender && data.email && data.first && data.last && data.country && data.bio && data.interests.length > 0 && data.instaUsername && data.facebookUsername && data.instaPerPost > 0 && data.facebookPerPost > 0) {
      console.warn('Minimum followers count should be 1000 to apply for this campaign.', data)
      if (data.gender && data.email && data.first && data.last && data.country && data.bio && data.instaUsername && data.instaPerPost > 0) {
        this.setState({ profileupdate: false, userfollowercount: data.followers ? data.followers : '' })
      } else {

        this.setState({ profileupdate: true, userfollowercount: data.followers ? data.followers : '' })

      }
    })

  }
  componentWillUnmount() {
    this.props.CompaignsStore.setCampaignRemark('')
  }

  render() {
    const data = this.props.route.params.JobData
    const { applyCampaignLoading, appliedForCampaign, campaignRemark } = this.props.CompaignsStore
    //console.warn('data',data.minimumFollowers)
    return (
      <View style={{ flex: 1 }}>
        {appliedForCampaign && this.showSuccessAlert()}
        <Loader loading={applyCampaignLoading} />

        <KeyboardAwareScrollView>

          <Slideshow
          isApplyJob={true}
            height={metrics.width - metrics.dimen_100}
            width={metrics.width}
            dataSource={data.campaignGallery ? data.campaignGallery : []}
            indicatorColor={colors.white}
            indicatorSelectedColor={colors.indicaterselected}
            arrowSize={0}
            titleStyle={{ marginTop: 50, color: 'red' }}
            containerStyle={styles.imageContainer} />
          {/* <FastImage
        style={commonStyles.bannerImageStyle}
        source={{
            uri: data.campaignImage.length > 30 ? data.campaignImage : Media_Base_URL + data.campaignImage,
            priority: FastImage.priority.normal
        }}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
          <View style={{ ...styles.jobDetailViewStyle }}>
            <Text style={{ ...commonStyles.LatoBold_16 }}>{data.campaignTitle}</Text>
            <Text style={{ ...commonStyles.LatoRegular_Medium, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_4 }}>{strings('Posted_On') + " : " + Moment(data.createdAt).format('DD MMM, YYYY')}</Text>
            {/* {data.campaignType === "paid" && <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_12 }}>
              {data.campaignAmountCurrency + " " + formatCurrency.format(data.campaignAmount)}
            </Text>} */}

<View style={{backgroundColor:data.campaignType === "shoutout" ? '#58DC72' : data.campaignType === "paid" ? colors.app_Blue : "#FFC107", 
            paddingHorizontal:metrics.dimen_13, 
            height: metrics.dimen_25, 
            borderRadius: metrics.dimen_13, 
            marginTop: metrics.dimen_12,
            alignSelf: 'flex-start' ,
            justifyContent:'center'}}>
            <Text style={{ fontFamily: metrics.Lato_SemiBold,fontSize: metrics.text_13, color: colors.white }}>
            {data.campaignType === "shoutout" ? 
            "Shoutout Exchange" : 
            data.campaignType !== "paid" ? 
            `Sponsored: ${convertCurrencybyCode(data.campaignAmountCurrency) +formatCurrency.format(data.campaignAmount)}` 
            : `Paid: ${convertCurrencybyCode(data.campaignAmountCurrency) + formatCurrency.format(data.campaignAmount)}`}
            </Text>
            </View>
            {/* <Text style={{ ...commonStyles.LatoBold_14, color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_12 }}>
              {data.campaignAmountCurrency + " " + formatCurrency.format(data.campaignAmount)}
              </Text> */}
            <Text style={{ ...commonStyles.LatoBold_12, color: 'rgba(112, 129, 138, 1)', marginTop: metrics.dimen_20 }}>{strings('Location')}</Text>
            <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(62, 62, 70, 1)', marginTop: metrics.dimen_6 }}>{data.country}</Text>
          </View>

          <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: 'rgba(62, 62, 70, 1)', marginTop: metrics.dimen_120, marginHorizontal: metrics.dimen_20 }}>{strings('Message_To_Brand')}</Text>

          <View>
            <TextInput style={[
              commonStyles.multilineTextInputStyle,
              styles.textInputRemark
            ]}
              placeholder={strings('Enter_Remark')}
              multiline={true}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="off"
              value={campaignRemark}
              onChangeText={(text) => { this.props.CompaignsStore.setCampaignRemark(text) }}
            />
            <TouchableHighlight style={styles.buttonSubmit}
             // onPress={() => { this.onApply(data) }} 
              onPress={() => { this.checkUserUpdatedData(data) }} 

              underlayColor="transparent"
              >
              <Text style={styles.textSubmit}>{strings('Submit')}</Text>
            </TouchableHighlight>
          </View>



          {/* <TextInput style={{ ...commonStyles.multilineTextInputStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_6, height: metrics.dimen_96, backgroundColor: colors.app_light_gray }}
            placeholder={strings('Enter_Remark')}
            multiline={true}
            autoCapitalize='none'
            autoCorrect={false}
            autoCompleteType='off'
            value={campaignRemark}
            onChangeText={(text) => { this.props.CompaignsStore.setCampaignRemark(text) }}
          /> */}
          <View style={{ height: metrics.dimen_100 }}></View>
        </KeyboardAwareScrollView>

        <TouchableOpacity style={{ ...styles.bottomViewStyle }}
          onPress={() => {
            //this.onApply(data)
            this.checkUserUpdatedData(data)
          }
          }
        >
          <Text style={{ ...commonStyles.LatoBold_16, color: 'white', marginTop: Platform.OS == 'android' ? metrics.dimen_25 : metrics.dimen_18, textTransform: 'uppercase' }}>{strings('Apply')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  onApply = (data) => {
    if (this.state.profileupdate) {
      Alert.alert(
        '',
        strings('Please_update_missing_details_from_your_Profile_to_continue_applying_on_Collaborations_Jobs'),
        [
          { text: strings('Do_it_Later') },
          {
            text: strings('Update_Now'), onPress: () => {
              this.fetchUserData()


            }, style: 'destructive'
          },
        ],
        { cancelable: true }
      );
    } else {
      /* Update 31-Aug-2020 
        Campaign Apply remarks to be made optional */

      // if (campaignRemark.trim().length == 0) {
      //   showAlert('', strings('Please_Enter_Remark'))
      // } else {

      if(!this.state.isAppliedInitiate)
      {
        this.setState({ isAppliedInitiate: true }, () => {
          this.props.CompaignsStore.applyForCampaign(data.id)
        })
      }
      // if (this.state.userfollowercount >= data.minimumFollowers) {
      //   this.props.CompaignsStore.applyForCampaign(data.id)

      // } else {
      //   showAlert('', 'Minimum followers count should be ' + data.minimumFollowers + ' to apply for this campaign.')

      // }

      //  }

    }
  }
  checkUserUpdatedData = (applyData) =>{
    gettUserData().then(data => {
      // if (data.avatarUrl && data.gender && data.email && data.first && data.last && data.country && data.bio && data.interests.length > 0 && data.instaUsername && data.facebookUsername && data.instaPerPost > 0 && data.facebookPerPost > 0) {
      console.warn('Minimum followers count should be 1000 to apply for this campaign.', data)
      if (data.gender && data.email && data.first && data.last && data.country && data.bio && data.instaUsername && data.instaPerPost > 0&&data.dob) {
        this.setState({ profileupdate: false }, () => {
          this.onApply(applyData);
      })
      } else {

        this.setState({ profileupdate: true}, () => {
          this.onApply(applyData);
      })

      }
    })
  }

  fetchUserData() {
    const store = this.props.MyProfileStore
    store.setFollowersCount('0')
    store.setPosts([])
    store.setPostsCount('0')
    gettUserData().then(data => {
      store.setUserImage(data.avatarUrl)
      store.setUserName(data.username)
      store.setFirstName(data.first)
      store.setLastName(data.last)
      store.setInstaUserName(data.instaUsername ? data.instaUsername : "")
      store.setBio(data.bio ? data.bio : "")
      this.setState({ bio: data.bio ? data.bio : "" })
      store.setCity(data.city ? data.city : "")
      store.setCountry(data.country ? data.country : "")
      // store.setFollowersCount("0")
      //store.setPostsCount(data.totalPosts ? data.totalPosts : "0")
      store.setDisplayEmail(data.displayedEmail)
      store.setEmail(data.email)
      store.setGender(data.gender)
      store.setMyInterest(data.interests)
      store.setFacebookUserName(data.facebookUsername)
      store.setinstaperpost("" + data.instaPerPost)
      store.setfacebookperpost("" + data.facebookPerPost)
      store.setdob(data.dob ? data.dob : "")
      // if (data.instaUsername != null) {
      //   store.getInstaPosts(data.instaUsername)
      // }else
      // {
      //   store.setIsLoading(false)
      // }


    })
    setTimeout(() => {
      this.props.navigation.navigate('EditProfile', { isFromApplyJob: true })
    }, 500);
  }
  showSuccessAlert = () => {

    setTimeout(() => {
      Alert.alert(
        strings('Successfully'),
        strings('CampaignApplied'),
        [
          { text: strings('Ok'), onPress: () => { this.goBackscreen() } },
        ],
        { cancelable: false }
      );
    }, 200);
  }

  goBackscreen() {
    this.props.navigation.goBack()
    this.props.CompaignsStore.getCampaigns()

  }

}
export default inject("CompaignsStore", "MyProfileStore", "AuthStore")(observer(ApplyJob))


const styles = StyleSheet.create({
  jobDetailViewStyle: {
    position: "absolute",
    left: metrics.dimen_20,
    right: metrics.dimen_20,
    top: metrics.dimen_210,
    backgroundColor: 'white',
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: metrics.dimen_3 },
    shadowOpacity: 0.3,
    shadowRadius: metrics.dimen_4,
    borderRadius: metrics.dimen_4,
    padding: metrics.dimen_20
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
  buttonSubmit: {
   // bottom: metrics.getHeightAspectRatio(10),
    right: metrics.getW(30),
    height:'100%',
    position: 'absolute',
    justifyContent:'flex-end',
    //backgroundColor:'red'
  },
  textSubmit: {
    textTransform: 'uppercase',
    color: colors.app_Blue,
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_11,
    marginBottom: metrics.dimen_25
  },
  textInputRemark: {
    marginHorizontal: metrics.dimen_20,
    marginTop: metrics.dimen_6,
    paddingBottom: metrics.getW(10),
    height: metrics.dimen_96,
    backgroundColor: colors.app_light_gray,
    paddingRight: metrics.getW(60)
  }
})