import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  ImageBackground,
  Linking
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Avatar } from 'react-native-paper'
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18'
import FastImage from 'react-native-fast-image'
import { gettUserData, Numberformatesunit, showAlert, NumberformatesunitUptoOneDecimal } from '../../../SupportingFIles/Utills';
import { commonStyles } from '../../../SupportingFIles/Constants';
import images from '../../../Themes/Images';
import Loader from '../../../SupportingFIles/Loader';
import BottomSheet from 'reanimated-bottom-sheet'
import ReadMore from 'react-native-read-more-text';
import { Button } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import BottomUpDrawer from "../../../Navigations/RoutesComponent/BottomUpDrawer";
import { SwipeablePanel } from 'rn-swipeable-panel';
import MenuHumburgerLine from '../../../Assets/Images/MenuHumburgerLine';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import EmailUserProfile from '../../../Assets/Images/EmailUserProfile';
import Gender from '../../../Assets/Images/Gender';
import Birthday from '../../../Assets/Images/Birthday';
import Phone from '../../../Assets/Images/Phone';
import StarRating from 'react-native-star-rating'

import { useScrollToTop } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

@inject('MyProfileStore', 'AuthStore', 'SettingsStore')
@observer
class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedItem: '',
      textShown: -1,
      InstaUsername: '',
      Addinstaname: '',
      showMenu: false, 
      userData: {},
      socialData:[]

    }

  }



  renderBottomSheetinsta() {
    return (

      <RBSheet
        ref={ref => { this.instabottomSheet = ref }}
        height={250}
        duration={170}>
        <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_black, marginTop: metrics.dimen_20, marginLeft: metrics.dimen_20 }}>
          {strings('UserName')}
        </Text>
        <TextInput
          style={{ ...styles.textInputStyle }}
          placeholder={strings('UserName')}
          value={this.state.Addinstaname}
          onChangeText={(text) => this.setState({ Addinstaname: text })}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Button style={{ ...styles.addButtonStyle, margin: metrics.dimen_20, borderColor: colors.app_Blue, height: metrics.dimen_46 }}
          onPress={() => this.validateInstaUserName()}
          labelStyle={{ ...commonStyles.LatoBold_14, width: '80%', color: 'white' }}
        >
          {strings('Add')}
        </Button>
      </RBSheet>
    )
  }

  validateInstaUserName() {

    if (this.state.Addinstaname === '') {
      showAlert('', 'Please enter Instagram user name')
    } else {
      this.instabottomSheet.close()
      // this.props.MyProfileStore.setIsLoading(true)
      // this.props.MyProfileStore.updateUserProfile('MyProfile')
      // this.props.MyProfileStore.setInstaUserName(this.state.Addinstaname)
      this.props.MyProfileStore.validateInstaUserNamenew(this.state.Addinstaname)
    }
  }

  toggleNumberOfLines = index => {
    this.setState({
      textShown: this.state.textShown === index ? -1 : index,
    });
  };

  componentDidMount() {
    // this.props.navigation.setOptions({
    //   headerRight: () => (
    //     <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
    //       <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')}>
    //         <Image source={images.editProfileIcon} style={{ marginLeft: metrics.dimen_20 }} />
    //       </TouchableOpacity>
    //     </View>
    //   )
    // })
    this.props.AuthStore.setNavigation(this.props.navigation)
    // this.props.navigation.addListener('focus', () => {
    if (this.props.AuthStore.isLogin) {
      this.props.MyProfileStore.setIsLoading(true)

      //this.fetchUserData()
      this.setState({ Addinstaname: '' })
    }
    else {
      this.props.navigation.navigate('AuthStack')
    }
    // });
    this.props.navigation.addListener('focus', () => {
      this.resetUserData()
      //this.props.MyProfileStore.getprofile()
      
      this.props.MyProfileStore.getAppSelectedUserData()
      this.fetchUserData()
      if(this.bs.current !== null)
      {
        this.bs.current.snapTo(2)
      }
    });
    this._unsubscribe =  this.props.navigation.addListener('tabPress', () => {
      // do something
    });
    console.log('userName:',this.props.MyProfileStore.userName)

    this.props.navigation.setOptions({
      //  title: this.props.MyProfileStore.userName ? '@' + this.props.MyProfileStore.userName.replace("@","") : strings('Account'),
       
       headerRight: () => (

        <TouchableOpacity style={{ width:metrics.dimen_44,height:metrics.dimen_44,marginTop:metrics.dimen_20}}
        onPress={() => this.setState({showMenu:true})}>
          <MenuHumburgerLine />
        {/* <Image source={images.drawerIcon} /> */}
    </TouchableOpacity>
    //     <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
    //       <TouchableOpacity onPress={() => this.setState({showMenu:true})}>
    //         <Text style={{  fontFamily: metrics.Lato_Bold,
    // fontSize: metrics.getFontSize(16),
    // color: colors.app_Blue }}>MENU</Text>
    //       </TouchableOpacity>
    //     </View>
      ),

      headerTitle: () => (
        <View style={{marginLeft:Platform.OS === 'ios' ? metrics.dimen_20 :metrics.dimen_40, justifyContent: 'center', alignItems: 'center', color: "#1A1E24" }}>
          <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_16, width: metrics.widthSize(700), textAlign:'center'}}
          numberOfLines={1}>
            {this.props.MyProfileStore.userName ? '@' + this.props.MyProfileStore.userName.replace("@","") : strings('Account')}</Text>
         <Text style={{
            fontFamily: metrics.Lato_Regular,
            fontSize: metrics.text_11,
            marginTop:metrics.dimen_2,
            color: "#58DC72" 
          }}>{strings("Online")}</Text>
        </View>
      )
    })
    this.props.MyProfileStore.updatelastMyProfileVisit()
  }
componentWillUnmount() {
    this._unsubscribe();
  }

  fetchUserData() {
    const store = this.props.MyProfileStore
    const Authstore = this.props.AuthStore
    // store.getAppSelectedUserData()
    // store.getKoliUserFollowerscount()
    // store.getKoliUserFollowingcount()


    store.setFollowersCount('0')
    store.setPosts([])
    store.setPostsCount('0')
    gettUserData().then(data => {
      console.log("data==",data)
      this.setState({userData:data})
      store.setUserImage(data.avatarUrl)
      this.props.navigation.setOptions({
        title: data.username ? '@' + data.username.replace("@","") : strings('Account'),
     })
      store.setUserName(data.username)
      store.setFirstName(data.first)
      store.setLastName(data.last)
      store.setInstaUserName(data.instaUsername ? data.instaUsername : "")
      store.setBio(data.bio ? data.bio : "")
      this.setState({ bio: data.bio ? data.bio : "" })
      store.setCity(data.city ? data.city : "")
      store.setCountry(data.country ? data.country : "")
      store.setDisplayEmail(data.displayedEmail)
      store.setEmail(data.email)
      store.setGender(data.gender)
      store.setMyInterest(data.interests)
      store.setFacebookUserName(data.facebookUsername)
      store.setinstaperpost("" + data.instaPerPost)
      store.setfacebookperpost("" + data.facebookPerPost)
      store.setyoutubeUrl(data.youtubelink?data.youtubelink:"")
      store.setyoutubFollower(data.youtubefollower?""+data.youtubefollower:"")
      store.settwitterUrl(data.twitterlink?data.twitterlink:"")
      store.settwitterFollower(data.twitterfollower?""+data.twitterfollower:"")
      store.settiktokUrl(data.tiktoklink?data.tiktoklink:"")
      store.settiktokFollower(data.tiktokfollower?""+data.tiktokfollower:"")
      store.setlinkedinUrl(data.linkedinlink?data.linkedinlink:"")
      store.setlinkedinFollower(data.linkedinfollower?""+data.linkedinfollower:"")
      store.setclubhouseUrl(data.clubhouselink?data.clubhouselink:"")
      store.setclubhouseFollower(data.clubhousefollower?""+data.clubhousefollower:"")
      store.settwitchUrl(data.twitchlink?data.twitchlink:"")
      store.settwitchFollower(data.twitchfollower?""+data.twitchfollower:"")
      store.setdob(data.dob?""+data.dob:"")
      store.setemailPrivate(data.emailPrivate===0?false:true)
      store.setphonePrivate(data.phonePrivate===0?false:true)
      store.setMobilecode(data.phoneCode?data.phoneCode:"")
      store.setMobile(data.mobile?data.mobile:"")

      if (data.instaUsername !== null) {
        console.log("getInstaPosts==",data.instaUsername)
        store.getInstaPosts(data.instaUsername)
      } else {
        store.setIsLoading(false)
      }
      store.setPaypalEmail(data.paypal_email)
      store.setblogUrl(data.blogUrl?data.blogUrl:"")

      Authstore.setFirstName(data.first)
      Authstore.setLastName(data.last)
      Authstore.setUserImage(data.avatarUrl)

      this.setSocialData(data)

      
    })
    // setTimeout(() => {
    //   store.setIsLoading(false)
    // }, 500);
  }
  resetUserData = () => {
    const store = this.props.MyProfileStore
    gettUserData().then(data => {
      store.setUserImage(data.avatarUrl)
      store.setFirstName(data.first)
      store.setLastName(data.last)
      store.setBio(data.bio ? data.bio : "")
      store.setCountry(data.country ? data.country : "")
      store.setGender(data.gender)
      store.setMyInterest(data.interests)
      store.setFacebookUserName(data.facebookUsername)
      store.setinstaperpost("" + data.instaPerPost)
      store.setfacebookperpost("" + data.facebookPerPost)
      store.setyoutubeUrl(data.youtubelink?data.youtubelink:"")
      store.setyoutubFollower(data.youtubefollower?""+data.youtubefollower:"")
      store.settwitterUrl(data.twitterlink?data.twitterlink:"")
      store.settwitterFollower(data.twitterfollower?""+data.twitterfollower:"")
      store.settiktokUrl(data.tiktoklink?data.tiktoklink:"")
      store.settiktokFollower(data.tiktokfollower?""+data.tiktokfollower:"")
      store.setlinkedinUrl(data.linkedinlink?data.linkedinlink:"")
      store.setlinkedinFollower(data.linkedinfollower?""+data.linkedinfollower:"")
      store.setclubhouseUrl(data.clubhouselink?data.clubhouselink:"")
      store.setclubhouseFollower(data.clubhousefollower?""+data.clubhousefollower:"")
      store.settwitchUrl(data.twitchlink?data.twitchlink:"")
      store.settwitchFollower(data.twitchfollower?""+data.twitchfollower:"")
      store.setdob(data.dob?""+data.dob:"")
      store.setemailPrivate(data.emailPrivate===0?false:true)
      store.setphonePrivate(data.phonePrivate===0?false:true)
      store.setMobilecode(data.phoneCode?data.phoneCode:"")
      store.setMobile(data.mobile?data.mobile:"")
      store.setblogUrl(data.blogUrl?data.blogUrl:"")

      
    })

  }


  setSocialData(data) {
    //const data = this.props.UserProfileStore.selectedUserDetail

    console.log("data",data)
    var socialUserData = []
    if (data !== undefined) {
      //INSTAGRAM
      if (data.instaUsername !== undefined && data.instaUsername !== null && data.instaUsername !== '') {
        const instaObj = {
          type: "instagram",
          image: images.instaIcon,
          title: 'Instagram',
          followers: data.followers,
          metaData: "https://www.instagram.com/" + data.instaUsername
        }
        socialUserData.push(instaObj)
      }

      // if (data.facebookUsername !== undefined && data.facebookUsername !== null && data.facebookUsername !== '') {
      //   const instaObj = {
      //     type: "facebook",
      //     image: images.facebookLogo,
      //     title: 'Facebook',
      //     followers: data.followersCount,
      //     metaData: "https://www.facebook.com/" + data.facebookUsername
      //   }
      //   socialUserData.push(instaObj)
      // }


      //TIKTOK
      if (data.tiktoklink !== undefined && data.tiktoklink !== null && data.tiktoklink !== '') {
        const tiktokObj = {
          type: "tiktok",
          image: images.tictocSocial,
          title: 'TikTok',
          followers: (data.tiktokfollower !== null && data.tiktokfollower !== '') ? data.tiktokfollower : 0,
          metaData: data.tiktoklink

        }
        socialUserData.push(tiktokObj)
      }

      //YOUTUBE
      if (data.youtubelink !== undefined && data.youtubelink !== null && data.youtubelink !== '') {
        const youtubeObj = {
          type: "youtube",
          image: images.youtubeSocial,
          title: 'YouTube',
          followers: (data.youtubefollower !== null && data.youtubefollower !== '') ? data.youtubefollower : 0,
          metaData: data.youtubelink

        }
        socialUserData.push(youtubeObj)
      }

      //TWITTER
      if (data.twitterlink !== undefined && data.twitterlink !== null && data.twitterlink !== '') {
        const obj = {
          type: "twitter",
          image: images.twitterSocial,
          title: 'Twitter',
          followers: (data.twitterfollower !== null && data.twitterfollower !== '') ? data.twitterfollower : 0,
          metaData: data.twitterlink

        }
        socialUserData.push(obj)
      }

      //LINKEDIN
      if (data.linkedinlink !== undefined && data.linkedinlink !== null && data.linkedinlink !== '') {
        const obj = {
          type: "linkedin",
          image: images.linkedinSocial,
          isSelected: false,
          title: 'Linkedin',
          followers: (data.linkedinfollower !== null && data.linkedinfollower !== '') ? data.linkedinfollower : 0,
          metaData: data.linkedinlink

        }
        socialUserData.push(obj)
      }

      //CLUBHOUSE
      if (data.clubhouselink !== undefined && data.clubhouselink !== null && data.clubhouselink !== '') {
        const obj = {
          type: "clubhouse",
          image: images.clubhouseSocial,
          isSelected: false,
          title: 'Clubhouse',
          followers: (data.clubhousefollower !== null && data.clubhousefollower !== '') ? data.clubhousefollower : 0,
          metaData: data.clubhouselink

        }
        socialUserData.push(obj)
      }
      //TWITCH
      if (data.twitchlink !== undefined && data.twitchlink !== null && data.twitchlink !== '') {
        const obj = {
          type: "twitch",
          image: images.twitchSocial,
          title: 'Twitch',
          followers: (data.twitchfollower !== null && data.twitchfollower !== '') ? data.twitchfollower : 0,
          metaData: data.twitchlink

        }
        socialUserData.push(obj)
      }
      // console.log('socialUserData:',socialUserData)
      this.setState({ socialData: socialUserData })
    }
  }
  renderInner = () => {
    return (
      <View style={styles.panel}>

        <View style={{ marginLeft: metrics.dimen_15, marginRight: metrics.dimen_15, marginBottom: metrics.dimen_10 }}>
          <FastImage
            style={styles.imageThumbnailSheetView}
            source={{
              uri: this.state.SelectedItem ? this.state.SelectedItem.node.thumbnail_src : '',
              priority: FastImage.priority.normal
            }}
          /></View>

        <ScrollView>
          <View>
            <Text style={styles.panelSubtitle}>
              {this.state.SelectedItem ? this.state.SelectedItem.node.edge_media_to_caption.edges[0] ? this.state.SelectedItem.node.edge_media_to_caption.edges[0].node.text : '' : ''}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: metrics.dimen_10, marginTop: metrics.dimen_25 }}>
              <View style={{ flexDirection: 'row' }} >
                <Image style={{ height: metrics.dimen_25, width: metrics.dimen_25, tintColor: colors.app_black }} source={images.LikeIcon} />
                <Text style={styles.likecommenttitle}>
                  {this.state.SelectedItem ? Numberformatesunit(this.state.SelectedItem.node.edge_liked_by.count) : ''}
                </Text>
                <Image style={{ marginLeft: metrics.dimen_15, height: metrics.dimen_22, width: metrics.dimen_22, }} source={images.CommentIcon} />
                <Text style={styles.likecommenttitle}>
                  {this.state.SelectedItem ? Numberformatesunit(this.state.SelectedItem.node.edge_media_to_comment.count) : ''}
                </Text>
              </View>
              <View>
              </View>
              <Image style={{ tintColor: colors.app_black }} source={images.InstaIcon} />
            </View>
            <View style={{ height: metrics.dimen_90 }}></View>
          </View>


        </ScrollView>
      </View>
    )
  }



  renderSheetHeader = () => (
    <View style={styles.headertop}>
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    </View>

  )

  RenderBottomValue(item) {
    this.setState({ SelectedItem: item })
    if(this.bs.current !== null)
    {
      this.bs.current.snapTo(0)
    }
   // this.bs.current.snapTo(0)

  }


  bs = React.createRef()
  renderBottomSheet() {

    return (
      <BottomSheet
        ref={this.bs}
        snapPoints={[Dimensions.get('window').height - metrics.dimen_155, Dimensions.get('window').height - metrics.dimen_155, 0]}
        renderHeader={this.renderSheetHeader}
        renderContent={() => this.renderInner()}
        initialSnap={2}
      />
    )
  }

  render() {
    const store = this.props.MyProfileStore
    // if(store.isLoading)
    // {
    //   return (
    //     <Loader loading={store.isLoading} />

    //   )
    // }
    const { instaUserName,instaaccounttype } = store
    return (

      <View style={styles.container}>
        {/* <Loader loading={store.isLoading} /> */}
       
        <View style={styles.seprater}></View>
{!store.isLoading && 
        <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: metrics.dimen_10, }}>
{this.renderHeaderView()}
        </View>}
        {this.renderBottomSheet()}
        {this.renderBottomSheetinsta()}

        <Modal
                    visible={this.state.showMenu}
                    transparent={true}>
                    <View style={{ marginHorizontal: 0, marginVertical: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SwipeablePanel
                        closeOnTouchOutside={true}
                            fullWidth={true}
                            noBackgroundOpacity={true}
                            openLarge={true}
                            style={{flex:1, height: Platform.OS === 'ios' ? '50%' : null}}
                            showCloseButton={false}
                            onClose={() => this.closePanel()}
                            onPressCloseButton={() => this.closePanel()}
                            isActive={true}>
                            <BottomUpDrawer 
                            navigation={this.props.navigation}
                            AuthStore={this.props.AuthStore}
                            SettingsStore={this.props.SettingsStore}
                            MyProfileStore={this.props.MyProfileStore}
                            //userData={userData}
                                //campaignData={campaignData}
                               // amount={userData.offerStatus === 2 ? userData.offerAmount.toString() : this.state.amount}
                                //amount={this.state.amount}
                                closePanel={this.closePanel} 
                                />
                        </SwipeablePanel>
                    </View>
                </Modal>
{
store.isLoading && 
this.renderPlaceHolderView()}
      </View>

    );
  }
  renderPlaceholder = () =>{
    return (<Image source={images.KoliSquarePlaceholder} style={styles.userImageStyle}
      />)

  }
  closePanel = () => {
    //this.props.CompaignsStore.setSwipeViewActive(false)
    this.setState({showMenu:false})
};
  renderUserView = () => {
    const store = this.props.MyProfileStore
    const { firstName, lastName, userImage, city, country, bio, instaUserName, instaaccounttype,KoliUserFollowerscount,KoliUserFollowingcount,blogUrl } = store

    const imageUrl = userImage == null||userImage ===''||userImage === 'NA' ? images.userPlaceholder : { uri: userImage }
    console.log('userImage:',userImage)
    // var userNamenew = userName.replace('@', '');

    return (
      <ScrollView scrollEnabled={false}>
        <View style={{ flexDirection: 'row', }}>
          {/* <Avatar.Image
            source={imageUrl}
            size={100}
            style={styles.userImageStyle}
          /> */}
           <FastImage
        renderPlaceholder={this.renderPlaceholder}
        renderErrorImage={this.renderPlaceholder}
      // fallback
        //defaultSource={images.KoliSquarePlaceholder}
          style={styles.userAvatrar}
          source={imageUrl}
        />
          <View style={{ marginLeft: metrics.dimen_20, width:'60%', alignSelf:'center' }}>
          <Text numberOfLines={3} style={{ ...styles.headerTextStyle, textTransform: 'capitalize',marginTop:metrics.dimen_8 }}>{firstName + " " + lastName}</Text>
            <Text style={{ ...styles.addresTextStyle,    fontStyle: 'italic' }}>{city?city + " " + country:country}</Text>
           { blogUrl!==""&&<Text style={{fontFamily:metrics.Lato_Regular,fontSize:metrics.text_11,color:colors.app_Blue}} onPress={ ()=> Linking.openURL(blogUrl) } >{blogUrl}</Text>}

           
            {/* Hide follower and following count 4 March 20201 */}
          {/* <View style={{ flexDirection: 'row', width:'100%' }} >
                  <View style={{flexDirection:'column',width:'50%',alignItems:'center'}}>
                    <Text  style={{ ...styles.followerCountStyle}}>{Numberformatesunit(KoliUserFollowerscount)}</Text>
                    <Text  style={{ ...styles.followerTextStyle}}>{"Followers"}</Text>
                  </View>
                  <View style={{flexDirection:'column',width:'50%',alignItems:'center'}}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowingcount)}</Text>
                    <Text  style={{ ...styles.followerTextStyle }}>{"Following"}</Text>

                  </View>
                </View> */}
           
            {/* <Text numberOfLines={3} style={{ ...styles.headerTextStyle, textTransform: 'capitalize' }}>{firstName + " " + lastName}</Text>
            <Text style={{ ...styles.addresTextStyle,    fontStyle: 'italic' }}>{city?city + " " + country:country}</Text>
        {bio ? <View style={{ marginTop: 2,}}>
          <ReadMore
            numberOfLines={2}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
          //  onReady={this._handleTextReady}
          >
            <Text style={styles.bioDesTextStyle}>{bio}</Text>
          </ReadMore>
        </View> : null} */}
          </View>
        </View>
       
        {/* <View style={{flex: 1, marginTop: metrics.dimen_10, }}>
              <View style={{ flexDirection: 'row', width:'100%' }} >
                  <View style={{flexDirection:'column',width:'25%',alignItems:'center'}}>
                    <Text  style={{ ...styles.followerCountStyle}}>{Numberformatesunit(KoliUserFollowerscount)}</Text>
                    <Text  style={{ ...styles.followerTextStyle}}>{"Followers"}</Text>
                  </View>
                  <View style={{flexDirection:'column',width:'25%',alignItems:'center'}}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowingcount)}</Text>
                    <Text  style={{ ...styles.followerTextStyle }}>{"Following"}</Text>

                  </View>

                <TouchableOpacity style={{width: '25%'}} onPress={() => this.props.navigation.navigate("UserReviewList", { username: (firstName + " " + lastName)+" Reviews",ownerId:ownerData.ownerId })}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <View style={{flexDirection:'row'}}>
                  <StarRating
                  disabled={true}
                  maxStars={1}
                  starSize={15}
                  rating={3}
                  fullStarColor={colors.app_black}
                    />               
            <Text style={{ ...styles.ratingStyle }}>{2}</Text>              
              </View>
                 
                    <Text style={{ ...styles.followerTextStyle }}>{2 +" Reviews"}</Text>

                  </View></TouchableOpacity>
                   <View style={{ flexDirection: 'column', width: '25%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Earning"}</Text>

                  </View>
                </View>
                </View> */}
        {bio ? <View style={{ marginTop: metrics.dimen_12,marginLeft:metrics.dimen_5}}>
          <ReadMore
            numberOfLines={2}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
          //  onReady={this._handleTextReady}
          >
            <Text testID="bio" style={styles.bioDesTextStyle}>{bio}</Text>
          </ReadMore>
        </View> : null}


        {/* <Text style={styles.bioDesTextStyle }>{bio}</Text>

      {/* {((instaUserName !== '' && instaaccounttype === false && store.posts.length > 0) 
      // || (instaUserName === '')
      ) && <TouchableOpacity style={styles.instagramContainerView}
          onPress={() => this.props.navigation.navigate('EditProfile')}>
          <Text style={styles.editProfileText}>{strings('Edit_profile')}</Text>

        </TouchableOpacity>} */}
      </ScrollView>
    )
  }

  OpenBootshhetinsta() {
    this.setState({ Addinstaname: '' })
    this.instabottomSheet.open()

  }
  listfooter = () => {
    return (
      <View style={{ flex: 1, height: metrics.dimen_30 }}>

      </View>
    )
  }
  renderHeaderView = () =>{
    return(
      <View style={{ paddingTop: metrics.dimen_20}}>
            {this.renderUserView()}
        {this.renderInstaBlockedView()}
      </View>
    )
  }
  listrenderHeader = (instaaccounttype) => {
    const store = this.props.MyProfileStore
    const { followersCount, instaperpost, instaUserName } = store
    // const imageUrl = userImage == null ? images.koliIcon : { uri: userImage }
    // var userNamenew = userName.replace('@', '');
    console.warn('store.posts.length=', store.posts.length)
    return (

      <View style={{ flex: 1 }} >
        {this.renderUserView()}

        <View style={{ marginTop: metrics.dimen_15 }} />

        {instaUserName !== '' && store.posts.length > 0 && <View style={{ paddingTop: metrics.dimen_8, paddingBottom: metrics.dimen_8 }}>

          <Image source={images.Instastories_bg} style={{ width: '100%', height: Platform.OS == "ios" ? metrics.dimen_50 : metrics.dimen_60 }} />


          <View style={{
            position: 'absolute', justifyContent: 'space-between', flexDirection: 'row', top: Platform.OS == "ios" ? 20 : 15,
            bottom: Platform.OS === "ios" ? 15 : 10,
          }}>

            <View style={{ marginLeft: metrics.dimen_13, flexDirection: 'row', alignItems: 'center', width: instaperpost > 0 ? '45%' : '56%' }}>
              <Image source={images.instagram_full} />


            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center', width: instaperpost > 0 ? '25%' : '45%', }}>

              <Text style={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular, }}>{NumberformatesunitUptoOneDecimal(followersCount)}</Text>
              <Text style={{ ...styles.addresTextStyle, fontSize: metrics.text_normal, marginVertical: 1 }}>{strings('Followers')}</Text>
            </View>


            {(instaperpost && instaperpost > 0) ? <View style={{ alignItems: 'center', justifyContent: 'center', width: '24%', marginRight: metrics.dimen_15 }}>
              <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular }}>{'$' + instaperpost}</Text>
              <Text style={{ ...styles.addresTextStyle, fontSize: metrics.text_normal, marginVertical: 1 }}>{strings('Per_Post')}</Text>
            </View> : null}
          </View>
        </View>

        }

        {(instaUserName !== '' && instaaccounttype === false && store.posts.length > 0) && <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_16, fontWeight: metrics.LatoBold, marginVertical: metrics.dimen_15 }}>{strings('IG_Posts')}</Text>}

        {instaaccounttype && 
        <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: metrics.dimen_50 }}>
          <View style={{ left: '40%', }} >
            <Image source={images.privateprofile} />

          </View>
          <Text style={{ ...commonStyles.LatoBold_16, marginTop: metrics.dimen_20, textAlign: 'center' }}>{strings('this_account_is_private')}</Text>

          <Text style={{ ...commonStyles.LatoRegular_Medium, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_12, textAlign: 'center' }}>{strings('Make_your_account_public')}</Text>

        </View> }
        {this.renderInstaBlockedView()}
      </View>
    )
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }
  renderPlaceHolderView = () => {
    return (
            <SkeletonPlaceholder>

                <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: metrics.dimen_5,paddingHorizontal: metrics.dimen_10, }}>
                    <View
                        style={[styles.userImageStyle,{width:100, height:100, borderRadius:50}]}
                    />
                    <View style={{ marginLeft: metrics.dimen_10, width: Platform.OS === 'ios' ? '87%' : '80%' }}>
                        <View style={{ ...styles.headerTextStyle, width: '40%', height: 20,textTransform: 'capitalize' }} />
                        <View style={{ ...styles.addresTextStyle , width: '80%', height: 50 }} />
                        <View style={styles.bioDesTextStyle} />          
                    </View>

                </View>
                <View style={[styles.instagramContainerView,{height:40,marginHorizontal: metrics.dimen_10, marginTop:metrics.dimen_8}]}/>
                <View style={[styles.instagramContainerView,{height:60,marginHorizontal: metrics.dimen_10,marginTop:metrics.dimen_8}]}/>
                <View style={[styles.instagramContainerView,{height:500,marginHorizontal: metrics.dimen_10,marginTop:metrics.dimen_8}]}/>

            </SkeletonPlaceholder>
    )
}
renderInstaBlockedView = () => {
  const userData = this.state.userData
  if(userData.interests !== undefined)
  {
    return (
      <View style={{ marginTop: metrics.dimen_10 }}>
     {this.state.socialData.length? <View style={{ flexDirection: 'row', marginVertical: metrics.dimen_10 }}>

        <FlatList
              scrollEnabled={this.state.socialData.length > 3 ? true : false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.socialData}
              renderItem={this.SocialItem}
              keyExtractor={item => item.type}
            />
            </View>:null}
        
        {/* {userData.interests !== undefined && userData.interests.length > 0 &&
          <View style={{marginBottom: userData.followers == 0?metrics.dimen_15:metrics.dimen_22,}}>
            <Text style={styles.textInterest}>Interests</Text>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row'}}>
              {userData.interests.map(item => {
                return (
                  <Text style={[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                    {item.toUpperCase()}
                  </Text>
                )
              })}
            </View>
          </View>}


       {(userData.followers !== null && userData.followers !== 0) &&
       <View style={{marginBottom: metrics.dimen_15}}>
              <Image style={{width:'100%',height:'100%', position:'absolute'
                }} source={images.Instastories_bg} 
              />
              <View style={{ justifyContent: 'space-between', flexDirection: 'row',marginVertical:metrics.dimen_8 }}>
                <View style={{ marginLeft: metrics.dimen_12, flexDirection: 'row', alignItems: 'center', width: '56%' }}>
                  <Image source={images.instagram_full} />
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', width: '45%'}}>

                  <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular }}>
                  {NumberformatesunitUptoOneDecimal(userData.followers !== 0 ? userData.followers :"")}
                  </Text>
                  <Text style={{ ...styles.addresTextStyle, fontSize: metrics.text_normal, marginVertical: 1 }}>{strings('Followers')}</Text>
                </View>
              </View>
            </View>} */}

         {userData.dob&&userData.dob !== "" && <View style={{ flexDirection: 'row',marginTop:metrics.dimen_5}}>
         <Birthday 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />

            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>DATE OF BIRTH</Text>
            <Text style={styles.textGenderEmail}>{moment(userData.dob).format('Do MMM, YYYY')}</Text>
            </View>
            
          </View>}

         {userData.gender&&userData.gender !== null && <View style={{ flexDirection: 'row',marginTop:metrics.dimen_20}}>
            <Gender 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />
            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>GENDER</Text>
            <Text style={styles.textGenderEmail}>{userData.gender.toUpperCase() === "MALE" ? "Male" : "Female"}</Text>
            </View>
            
          </View>}

          { userData.email.includes("loopback.com")||reg.test(userData.email) === false ?null: <View style={{marginTop: metrics.dimen_20, flexDirection: 'row'}}>
            <EmailUserProfile 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />
            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>EMAIL</Text>
            <Text style={styles.textGenderEmail}>{userData.email}</Text>
            </View>
            {this.props.MyProfileStore.emailPrivate===false?<View style={{position: 'absolute',right:metrics.dimen_10,top:metrics.dimen_16}}>
            <Text style={styles.texthidden}>Hidden</Text>
            </View>:null}
          </View>}

          { userData.phoneCode===""||userData.phoneCode===null||userData.mobile==="" ?null: <View style={{marginTop: metrics.dimen_20, flexDirection: 'row'}}>
            <Phone 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />

            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>PHONE NUMBER</Text>
            <Text style={styles.textGenderEmail}>{"+ "+userData.phoneCode+" "+userData.mobile}</Text>
            </View>
            {this.props.MyProfileStore.phonePrivate===false && 
            <View style={{position: 'absolute',right:metrics.dimen_10,top:metrics.dimen_16}}>
            <Text style={styles.texthidden}>Hidden</Text>
            </View>}
          </View>}
          <TouchableOpacity style={styles.instagramContainerView}
          onPress={() => this.props.navigation.navigate('EditProfile')}>
          <Text style={styles.editProfileText}>{strings('Edit_profile')}</Text>

        </TouchableOpacity>
      </View>
    )
  }


}


SocialItem = ({ item }) => (
  <LinearGradient colors={['#F9FBFF', '#ECF3FF']}
    style={{ width: metrics.widthSize(330), height: metrics.dimen_50, borderRadius: metrics.dimen_5, marginRight: metrics.dimen_9, alignItems: 'center', justifyContent: 'center', }}>
    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', alignSelf: 'center' }}
      onPress={() => this.props.navigation.navigate('SocialProfileWebView', { url: item.metaData, title: item.title })}>
      <Image source={item.image} style={{ width: metrics.dimen_22, height: metrics.dimen_22 }} />
      <View style={{ marginLeft: metrics.dimen_12 }}>
        <Text style={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.getFontSize(16), color: '#3D4046' }}>
          {NumberformatesunitUptoOneDecimal(item.followers)}
        </Text>

        <Text style={{ fontFamily: metrics.Lato_Regular, fontSize: metrics.getFontSize(11), color: '#7A818A' }}>
          {item.type === 'youtube' ? 'Subscriber' : 'Followers'}
        </Text>

      </View>
    </TouchableOpacity>
  </LinearGradient>
);

}
export default  function(props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

   return <MyProfile {...props} scrollRef={ref} />;
}

const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_14,
    color: 'black',
    marginVertical: metrics.dimen_2
  },
 
  addresTextStyle: {
    fontFamily: metrics.Roboto_Regular,
    fontSize: metrics.text_medium,
    color: 'rgba(122,129,138,1)',
    marginVertical: metrics.dimen_1,
    fontStyle: 'italic',
  },
  
  bioDesTextStyle: {
    fontSize: metrics.text_medium,
    color: 'rgba(62,62,70,1)',
  },
 
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },

  imageThumbnailSheetView: {

    aspectRatio: 1,

  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  panel: {
    height: Dimensions.get('window').height - metrics.dimen_155,
    width: '100%',
    backgroundColor: colors.white,
  },
  headertop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: metrics.dimen_60,

  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    paddingTop: metrics.dimen_15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: metrics.dimen_100,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelSubtitle: {
    marginTop: metrics.dimen_10,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal, color: 'rgba(114, 114, 114, 1)',
    paddingHorizontal: metrics.dimen_10
  },
  likecommenttitle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    marginTop: metrics.dimen_2,
    color: 'rgba(44, 44, 48, 1)',
    marginLeft: metrics.dimen_4
  },
  seprater:
  {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,

  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    fontStyle: 'italic'
  },

  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_5,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)'
  },
  addButtonStyle: {
    backgroundColor: colors.app_Blue,
    marginBottom: metrics.dimen_35,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    borderRadius: metrics.dimen_4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  instagramContainerView: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    marginTop: metrics.getHeightAspectRatio(20)
  },
  editProfileText: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    marginVertical: metrics.getHeightAspectRatio(7),
  },
  userImageStyle:{
    alignSelf:'flex-start',
    width: metrics.dimen_80,
    height: metrics.dimen_80,
    borderRadius: metrics.dimen_40
  },
  textInterest: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_13,
    color: "#A2A7AE"
  },
  texthidden: {
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_small,
    color: "#A2A7AE"
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
  textGenderEmail: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(14),
    color: "#3E3E46",
    marginTop: metrics.dimen_3
  },
  sendMessageView: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    marginTop: metrics.getHeightAspectRatio(20)
  },
  sendMessageText: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    marginVertical: metrics.getHeightAspectRatio(7),
  },

  userAvatrar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  followerCountStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_18,
    color: 'black',
  },
  followerTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_12,
    marginTop:metrics.dimen_5,
    color: '#616168',
  },
})