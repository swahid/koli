import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Dimensions, ScrollView, Platform, ImageBackground,Linking } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Avatar } from 'react-native-paper'
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18'
import FastImage from 'react-native-fast-image'
import { Numberformatesunit, NumberformatesunitUptoOneDecimal, time_ago, check_time_seconds, getUserId, validateEmail } from '../../../SupportingFIles/Utills';
import images from '../../../Themes/Images';
import Loader from '../../../SupportingFIles/Loader';
import { commonStyles } from '../../../SupportingFIles/Constants';
import ActionSheet from 'react-native-actionsheet'
import Report from '../../Campaign/Screen/Report';
import BottomSheet from 'reanimated-bottom-sheet'
import ReadMore from 'react-native-read-more-text';
import 'intl';
import 'intl/locale-data/jsonp/en-US'
import IGConnectView from '../../CommonComponents/IGConnectView'
import { gettUserData, convertCurrencybyCode } from '../../../SupportingFIles/Utills';
import { color } from 'react-native-reanimated';
import EmailUserProfile from '../../../Assets/Images/EmailUserProfile';
import Gender from '../../../Assets/Images/Gender';
import Birthday from '../../../Assets/Images/Birthday';
import Phone from '../../../Assets/Images/Phone';
import { join } from '../../../Socket/index'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import StarRating from 'react-native-star-rating'

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const formatCurrency = new Intl.NumberFormat('en-US')

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const HeaderTitle = (props) => {
  return <View
    style={{ width: 220 }}
  >
    <Text
      numberOfLines={2}
      style={{ fontWeight: '700', fontSize: 14, textAlign: 'center' }}
    >
      Let's see how long the title can be
  </Text>
  </View>
}

var context = null
// const options = [
//     strings('Cancel'), 
//     <Text style={{color: 'red'}}>{strings('Report')}</Text>,
//     'Watermelon', 
//     <Text style={{color: 'red'}}>{strings('Block')}</Text>
//   ]

class UserProfile extends Component {
  constructor(props) {
    super(props);
    context = this
    this.isNavigatedToCampaignDetail = false
    this.selectedIndex = 0;
    this.state = {
      socialData: [],
      SelectedItem: '',
      igTabSelected: true,
      index: 0,
      routes: [
        { key: 'first', title: 'Article' },
        { key: 'second', title: 'Contacts' },

      ],
      lastSeenDate: ""
    }
  }
  renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'first':
        return FirstRoute;
      case 'second':
        return SecondRoute;
    }
  };

  componentWillUnmount() {
    this.props.UserProfileStore.setPosts([])
    const store = this.props.UserProfileStore
    store.clearUserData()
  }
  componentDidMount() {

     this.props.navigation.addListener('focus', () => {
        this.setLastSeenData()
     });
    // this.props.navigation.addListener('focus', () => {
      this.setLastSeenData()
     // this.setSocialData()
      if (!this.isNavigatedToCampaignDetail) {
        const store = this.props.UserProfileStore

        store.setSelectedUserDetail({})
        store.setFollowersCount('-')
        store.setPostsCount('-')
        store.setblockUserstatus(false)

        this.fetchUserData()
        store.setKoliUserFollowerscount("")
        store.setKoliUserFollowingcount("")
        const data = this.props.route.params.UserData
        store.setuserReviewlist([])
        store.userReviewList(data.ownerId)

        // store.showfollowedbyYou(data.ownerId)
        // store.showfollowedToYou(data.ownerId)
        // store.getKoliUserFollowerscount(data.ownerId)
        // store.getKoliUserFollowingcount(data.ownerId)
        // this.getUserCampaigns()
      }
      else {
        this.isNavigatedToCampaignDetail = false
      }
      gettUserData().then(userData => {

        console.log("userData",userData)
        if (userData !== undefined && userData.instaUsername !== undefined) {
          if (userData.instaUsername === "" || userData.instaUsername === null || userData.instaUsername === undefined) {
            this.setState({ showIgView: true })
          }
          else {
            this.setState({ showIgView: false })
          }
        }
        else {
          this.setState({ showIgView: false })
        }
      })

      this.props.navigation.setOptions({
        headerRight: () => this.props.route.params.UserData.ownerId && (
          <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => context.showActionSheet()}>
              <Image source={images.MoreIcon} style={{ marginLeft: metrics.dimen_20 }} />
            </TouchableOpacity>
          </View>
        ),
        //title: <HeaderTitle>{ this.props.UserProfileStore.userName ? '@' + this.props.UserProfileStore.userName.replace("@","") : strings('Account')}</HeaderTitle>,
        headerTitle: () => (
          <View style={{ justifyContent: 'center', alignItems: 'center', color: "#1A1E24" }}>
            <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_16, width: metrics.widthSize(700), textAlign: 'center' }}
              numberOfLines={1}>
              {this.props.UserProfileStore.userName ? '@' + this.props.UserProfileStore.userName.replace("@", "") : strings('Account')}</Text>
            {this.state.lastSeenDate !== '' && <Text style={{
              fontFamily: metrics.Lato_Regular,
              fontSize: metrics.text_11,
              color: this.state.lastSeenDate === "Online" ? "#58DC72" : "#7A818A"
            }}>
              {this.state.lastSeenDate === "Online" ? this.state.lastSeenDate : `Last active ${this.state.lastSeenDate}`}
            </Text>}
          </View>
        )

        ,
        headerLeft: () => (
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image style={styles.backButtonContainer} source={images.backImage} />
          </TouchableOpacity>
        )
      })
    // });

  }
  setLastSeenData = () => {
    if (this.props.route.params.UserData.lastSeen === null) {
      //this.setState({lastSeenDate:"a few moments ago"})
    }
    else {
      var aDay = 24 * 60 * 60;
      console.log(time_ago(new Date(new Date(this.props.route.params.UserData.lastSeen) - aDay)));
      console.log("check_time_seconds:", check_time_seconds(new Date(new Date(this.props.route.params.UserData.lastSeen) - aDay)))

      if (check_time_seconds(new Date(new Date(this.props.route.params.UserData.lastSeen) - aDay)) > 600) {
        this.setState({ lastSeenDate: `${time_ago(new Date(new Date(this.props.route.params.UserData.lastSeen) - aDay))} ago` })
      }
      else {
        this.setState({ lastSeenDate: "Online" })
      }
    }
  }
  // setSocialData() {
  //   const data = this.props.UserProfileStore.selectedUserDetail
  //   var socialUserData = []
  //   if (data !== undefined) {
  //     //INSTAGRAM
  //     if (data.instaUsername !== undefined && data.instaUsername !== null && data.instaUsername !== '') {
  //       const instaObj = {
  //         type: "instagram",
  //         image: images.instaIcon,
  //         title: 'Instagram',
  //         followers: data.followers,
  //         metaData: "https://www.instagram.com/" + data.instaUsername
  //       }
  //       socialUserData.push(instaObj)
  //     }

  //     //TIKTOK
  //     if (data.tiktoklink !== undefined && data.tiktoklink !== null && data.tiktoklink !== '') {
  //       const tiktokObj = {
  //         type: "tiktok",
  //         image: images.tictocSocial,
  //         title: 'TikTok',
  //         followers: (data.tiktokfollower !== null && data.tiktokfollower !== '') ? data.tiktokfollower : 0,
  //         metaData: data.tiktoklink

  //       }
  //       socialUserData.push(tiktokObj)
  //     }

  //     //YOUTUBE
  //     if (data.youtubelink !== undefined && data.youtubelink !== null && data.youtubelink !== '') {
  //       const youtubeObj = {
  //         type: "youtube",
  //         image: images.youtubeSocial,
  //         title: 'YouTube',
  //         followers: (data.youtubefollower !== null && data.youtubefollower !== '') ? data.youtubefollower : 0,
  //         metaData: data.youtubelink

  //       }
  //       socialUserData.push(youtubeObj)
  //     }

  //     //TWITTER
  //     if (data.twitterlink !== undefined && data.twitterlink !== null && data.twitterlink !== '') {
  //       const obj = {
  //         type: "twitter",
  //         image: images.twitterSocial,
  //         title: 'Twitter',
  //         followers: (data.twitterfollower !== null && data.twitterfollower !== '') ? data.twitterfollower : 0,
  //         metaData: data.twitterlink

  //       }
  //       socialUserData.push(obj)
  //     }

  //     //LINKEDIN
  //     if (data.linkedinlink !== undefined && data.linkedinlink !== null && data.linkedinlink !== '') {
  //       const obj = {
  //         type: "linkedin",
  //         image: images.linkedinSocial,
  //         isSelected: false,
  //         title: 'Linkedin',
  //         followers: (data.linkedinfollower !== null && data.linkedinfollower !== '') ? data.linkedinfollower : 0,
  //         metaData: data.linkedinlink

  //       }
  //       socialUserData.push(obj)
  //     }

  //     //CLUBHOUSE
  //     if (data.clubhouselink !== undefined && data.clubhouselink !== null && data.clubhouselink !== '') {
  //       const obj = {
  //         type: "clubhouse",
  //         image: images.clubhouseSocial,
  //         isSelected: false,
  //         title: 'Clubhouse',
  //         followers: (data.clubhousefollower !== null && data.clubhousefollower !== '') ? data.clubhousefollower : 0,
  //         metaData: data.clubhouselink

  //       }
  //       socialUserData.push(obj)
  //     }
  //     //TWITCH
  //     if (data.twitchlink !== undefined && data.twitchlink !== null && data.twitchlink !== '') {
  //       const obj = {
  //         type: "twitch",
  //         image: images.twitchSocial,
  //         title: 'Twitch',
  //         followers: (data.twitchfollower !== null && data.twitchfollower !== '') ? data.twitchfollower : 0,
  //         metaData: data.twitchlink

  //       }
  //       socialUserData.push(obj)
  //     }
  //     // console.log('socialUserData:',socialUserData)
  //     this.setState({ socialData: socialUserData })
  //   }
  // }

  fetchUserData() {
    const store = this.props.UserProfileStore
    const data = this.props.route.params.UserData
    console.log('fetchUserData:', JSON.stringify(data))
    store.SetUserData(data)

    // if (!data.instaUsername) {
    //   store.setIsLoading(true)
    //   setTimeout(() => {
    //     store.setIsLoading(false)
    //   }, 300);
    // }
  }

  RenderBottomValue(item) {
    this.setState({ SelectedItem: item })
    this.bs.current.snapTo(0)
  }
  bs = React.createRef()
  renderBottomSheet() {
    return (

      <BottomSheet
        ref={this.bs}
        enabledContentGestureInteraction={false}

        enabledInnerScrolling={true}
        styles={{ colors: colors.app_Blue }}
        snapPoints={[Dimensions.get('window').height - metrics.dimen_80, 300, 0]}
        renderHeader={this.renderSheetHeader}
        renderContent={() => this.renderInner()}
        initialSnap={2}
      />
    )
  }
  handleIndexChange = (index) =>
    this.setState({
      index,
    });
  removeIgConnectView = () => {
    this.setState({ showIgView: false })
  }
  render() {
    const store = this.props.UserProfileStore
    const ownerData = { ownerId: this.props.route.params.UserData.ownerId }
    const { firstName, lastName, userImage, country, bio, instaaccounttype, blockUserstatus, KoliUserFollowingcount,userReviewlist,calculaterating,blogUrl } = store
    const imageUrl = (userImage === null || userImage === "NA" || userImage === "") ? images.userPlaceholder : { uri: userImage }
    //const imageUrl = userImage == null ? images.koliIcon : { uri: userImage }

    let fname = firstName === "?????? ???????? & ????? ?" ? '' : firstName
    console.log('KoliUserFollowingcount=', KoliUserFollowingcount)
    return (
      <View style={styles.container}>
        <View style={styles.seprater}></View>
        {this.state.showIgView && <IGConnectView
          navigation={this.props.navigation}
          removeIgConnectView={this.removeIgConnectView}
        />}

        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: metrics.dimen_8, alignItems: 'center' }}>
          {/* <Loader loading={store.isLoading} /> */}
          {blockUserstatus ? <ActionSheet
            accessible={true}
            ref={(o) => { this.ActionSheet = o }}
            options={[strings('Report'), strings('Cancel')]}
            cancelButtonIndex={blockUserstatus ? 1 : 2}
            destructiveButtonIndex={0}
            onPress={(index) => {
              if (index === 0) {
                this.showReport()
              }
            }}

          /> : <ActionSheet
            accessible={true}
            ref={(o) => { this.ActionSheet = o }}
            options={[strings('Report'), strings('Block'), strings('Cancel')]}
            cancelButtonIndex={blockUserstatus ? 1 : 2}
            destructiveButtonIndex={0}
            onPress={(index) => {
              if (index === 0) {
                this.props.AuthStore.isLogin?
                this.showReport():this.props.navigation.navigate('AuthStack')
              } else if (index === 1) {
                this.props.AuthStore.isLogin?
                this.showBlockAlert():this.props.navigation.navigate('AuthStack')
              }
            }}

          />}
          <Report show={store.showReport} onClose={this.onCloseReport} title={firstName + " " + lastName} campaignData={ownerData} fromUserReport={true} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={!instaaccounttype ? true : false}
          //scrollEnabled={false}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: this.state.showIgView ? metrics.dimen_10 : metrics.dimen_20 }}>
              <FastImage
                style={styles.userAvatrar}
                source={imageUrl}
                renderPlaceholder={this.renderPlaceholder}
                renderErrorImage={this.renderPlaceholder}
                fallback
                defaultSource={images.userPlaceholder}
              />
              {/* <Avatar.Image
            source={imageUrl}
            size={100}
          /> */}
              <View style={{ marginLeft: metrics.dimen_20, width: '60%', alignItems: 'flex-start' }}>
              <Text numberOfLines={3} style={{ ...styles.headerTextStyle, textTransform: 'capitalize', marginTop: metrics.dimen_10 }}>{fname.replace("?", "") + " " + (lastName ? lastName.replace('?', '') : '')}</Text>
            <Text style={{ ...styles.addresTextStyle, fontStyle: 'italic', }}>{country}</Text>
            { blogUrl!==""&&<Text style={{fontFamily:metrics.Lato_Regular,fontSize:metrics.text_11,color:colors.app_Blue}} onPress={ ()=> Linking.openURL(blogUrl) } >{blogUrl}</Text>}

                {/* Hide follower and following count 4 March 20201 */}

                {/* <View style={{ flexDirection: 'row', width: '100%' }} >
                  <View style={{ flexDirection: 'column', width: '50%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowerscount)}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Followers"}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', width: '50%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowingcount)}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Following"}</Text>

                  </View>
                </View> */}

              </View>
            </View>

            <View style={{flex: 1, marginVertical:metrics.dimen_7 }}>
              
                {/* Hide follower and following count 4 March 20201 */}

                <View style={{ flexDirection: 'row', width: '100%' }} >
              {/* {  KoliUserFollowerscount.length>0&&   <View style={{ flexDirection: 'column', width: '25%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowerscount)}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Followers"}</Text>
                  </View>}
                {KoliUserFollowingcount.length>0 && <View style={{ flexDirection: 'column', width: '25%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{Numberformatesunit(KoliUserFollowingcount)}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Following"}</Text>
                  </View>} */}
                  {userReviewlist.length>0&& <TouchableOpacity style={{width: '25%'}} onPress={() => this.props.navigation.navigate("UserReviewList", { username: (firstName + " " + lastName)+" Reviews",ownerId:ownerData.ownerId })}>
                  <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                  <View style={{flexDirection:'row'}}>
                  <StarRating
                  disabled={true}
                  maxStars={1}
                  starSize={13}
                  rating={calculaterating}
                  fullStarColor={colors.app_black}
                    />               
                <Text style={{ ...styles.ratingStyle }}>{calculaterating?parseFloat(calculaterating).toFixed(1):""}</Text>              
                </View>
                 
                <Text style={{ ...styles.followerTextStyle }}>{userReviewlist.length +" Reviews"}</Text>

                </View></TouchableOpacity>}

                  {/* <View style={{ flexDirection: 'column', width: '25%', alignItems: 'center' }}>
                    <Text style={{ ...styles.followerCountStyle }}>{}</Text>
                    <Text style={{ ...styles.followerTextStyle }}>{"Earning"}</Text>

                  </View> */}
                </View>

              </View>

            {bio ? <View style={{ flex: 1,marginBottom:metrics.dimen_10 }}>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
              //  onReady={this._handleTextReady}
              >
                <Text style={styles.bioDesTextStyle}>{bio}</Text>
              </ReadMore>
            </View> : null}
            {/* {bio ? <Text style={{ ...styles.bioTextStyle, marginTop: metrics.dimen_16, marginLeft: metrics.dimen_10 }}>{strings('Bio')}</Text> : null}
        {bio ? <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
          //  onReady={this._handleTextReady}
          >
            <Text style={styles.bioDesTextStyle}>{bio}</Text>
          </ReadMore>
        </View> : null} */}
            {/* <Text style={{ ...styles.bioDesTextStyle }}>{bio}</Text> */}
            {/* {this.renderInstagramView()} */}
            {this.renderInstaBlockedView()}
            {/* {!this.state.igTabSelected && store.campaignData.length === 0 && this.renderNoCampaign()} */}
            {/* <FlatList
              //  style={{ paddingTop: metrics.dimen_20 }}
              key={this.state.igTabSelected ? 'igtab' : 'campaigntab'}
              data={this.state.igTabSelected ? store.userPosts : store.campaignData}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>

                this.state.igTabSelected ? this.renderIgPostItem(item) : this.renderCampaignItem(item)


                // <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
                //   <TouchableOpacity onPress={() => this.RenderBottomValue(item)}>

                //     <FastImage
                //       style={styles.imageThumbnail}
                //       source={{
                //         uri: item.node.thumbnail_src,
                //         priority: FastImage.priority.normal
                //       }}
                //     /></TouchableOpacity>
                // </View>
              }
              numColumns={this.state.igTabSelected ? 3 : 1}
              keyExtractor={(item, index) => index.toString()}
            // ListHeaderComponent={this.renderHeader}
            // onEndReached = {()=>{
            //     this.props.MyProfileStore.getNextPost()
            // }}            
            /> */}
          </ScrollView>


        </View>
        {/* <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
      // onIndexChange={this.state.selectedIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      /> */}


        {this.renderBottomSheet()}
        {
          store.isLoading &&
          this.renderPlaceHolderView()}
      </View>
    );
  }
  renderPlaceholder = () => {
    return (<Image source={images.userPlaceholder} style={styles.userAvatrar}
    />)

  }
  renderIgPostItem = (item) => {
    if (this.state.igTabSelected) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
          <TouchableOpacity onPress={() => this.RenderBottomValue(item)}>

            <FastImage
              style={styles.imageThumbnail}
              source={{
                uri: item.node.thumbnail_src,
                priority: FastImage.priority.normal
              }}
            /></TouchableOpacity>
        </View>
      )
    }
    else {
      this.renderCampaignItem(item)
    }
  }
  renderCampaignItem = (item) => {
    console.log('renderCampaignItem:', item)
    return (
      <TouchableOpacity style={{
        flex: 1, flexDirection: 'row', margin: 1, marginBottom: 20,
        shadowColor: 'lightgray',
        shadowOffset: { width: metrics.dimen_3, height: metrics.dimen_3 },
        shadowOpacity: 1.0,
        shadowRadius: metrics.dimen_4,
        elevation: metrics.dimen_6,
        backgroundColor: 'white'
      }}
        onPress={() => {
          this.isNavigatedToCampaignDetail = true
          this.props.navigation.navigate('CampaignDetails', { data: item })
        }
        }

      >
        <FastImage
          style={styles.campaignImage}
          source={{
            uri: item.campaignImage,
            priority: FastImage.priority.normal
          }}
        />
        <View style={{ marginLeft: 11, paddingVertical: 11, flex: 1 }}>
          <Text style={styles.campaignTitle}>{item.campaignTitle}</Text>
          <Text style={styles.campaignCurrency}>{convertCurrencybyCode(item.campaignAmountCurrency) + formatCurrency.format(item.campaignAmount)}</Text>

          <Text style={styles.campaignDescription}
            numberOfLines={2}>{item.campaignDetails}</Text>
          <View style={{ alignItems: 'center', marginTop: 11, alignSelf: 'flex-end', marginRight: -2 }}>
            <Image source={images.tagBlue} style={styles.imageRibbon} />
            <View style={styles.tagViewStyle}
            // onPress={()=>this.props.navigation.navigate('ApplicantList', {JobData: item})}
            >

              <Text style={Platform.OS == 'android' ? styles.tagTextStyle : styles.tagTextStyleios}>{strings('Applications') + ` (${item.remarks.length})`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  renderIGView = () => {
    const store = this.props.UserProfileStore
    return (
      <FlatList
        style={{ paddingTop: metrics.dimen_20 }}
        data={this.state.igTabSelected ? store.userPosts : store.campaignData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
            <TouchableOpacity onPress={() => this.RenderBottomValue(item)}>

              <FastImage
                style={styles.imageThumbnail}
                source={{
                  uri: item.node.thumbnail_src,
                  priority: FastImage.priority.normal
                }}
              /></TouchableOpacity>
          </View>
        )}
        numColumns={this.state.igTabSelected ? 3 : 1}
        keyExtractor={(item, index) => index.toString()}
      //ListHeaderComponent={this.renderHeader}
      // onEndReached = {()=>{
      //     this.props.MyProfileStore.getNextPost()
      // }}            
      />
    )
  };
  renderNoCampaign() {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: '100%', alignSelf: 'center' }}>
        <Image source={images.Campaign} style={{ height: metrics.dimen_120, width: metrics.dimen_120 }} />
        <Text style={{ ...commonStyles.LatoBold_16, marginTop: metrics.dimen_10, marginHorizontal: metrics.dimen_20 }}>{strings('No_Campaigns_Available')}</Text>
      </View>
    )
  }
  showReport = () => {
    setTimeout(() => {
      this.props.UserProfileStore.setShowReport(true)
    }, 500);
  }
  showBlockAlert = () => {
    setTimeout(() => {
      Alert.alert(
        strings('Block'),
        strings('Are_you_sure'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          {
            text: strings('Yes'), onPress: () => {
              
              const data = this.props.route.params.UserData
              this.props.UserProfileStore.blockUser(data.ownerId)
            }
          },
        ],
        { cancelable: true }
      );
    }, 500);
  }


  showFollowAlert = (type) => {
    setTimeout(() => {
      const data = this.props.route.params.UserData
      this.props.UserProfileStore.userFollow(data.ownerId, type)
      // Alert.alert(
      //   strings('Follow'),
      //   strings('Are_you_sure'),
      //   [
      //     { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
      //     {
      //       text: strings('Yes'), onPress: () => {
      //         const data = this.props.route.params.UserData
      //         this.props.UserProfileStore.userFollow(data.ownerId,type)
      //       }
      //     },
      //   ],
      //   { cancelable: true }
      // );
    }, 500);
  }

  showUnFollowAlert = (type) => {
    setTimeout(() => {
      Alert.alert(
        '',
        strings('Are_you_sure_unfollow'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          {
            text: strings('Yes'), onPress: () => {
              const data = this.props.route.params.UserData
              this.props.UserProfileStore.unfollowuser(data.ownerId, type)
            }
          },
        ],
        { cancelable: true }
      );
    }, 500);
  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }
  onCloseReport = () => {
    this.props.UserProfileStore.setShowReport(false)
  }
  renderHeader = () => {
    return (
      // this.renderInstagramView()
      this.renderInstaBlockedView()

    )
  }
  getUserCampaigns = () => {
    if (this.props.route.params.UserData.ownerId) {
      this.props.UserProfileStore.getCampaignList(this.props.route.params.UserData.ownerId)
    }

  }

  renderInstagramView = () => {
    const store = this.props.UserProfileStore
    const { firstName, lastName, followersCount, postCount, instaUserName, isLoading, instaaccounttype } = store
    // const imageUrl = userImage == null ? images.koliIcon : { uri: userImage }
    const ownerId = this.props.route.params.UserData.ownerId
    const userData = this.props.UserProfileStore.selectedUserDetail
    return (
      <View>
        {/* { */}
        {/* (instaUserName && instaUserName.length > 0 && (followersCount > 0 || postCount > 0)) ? */}
        <View>
          <View style={{ flexDirection: 'row', marginTop: metrics.dimen_12 }}>
            {instaUserName !== undefined && instaUserName.length > 0 &&
              <TouchableOpacity style={{ ...styles.instaButton }}
                onPress={() => this.props.navigation.navigate('SocialProfileWebView', { url: "https://www.instagram.com/" + instaUserName, title: firstName + " " + lastName })}>
                <Image source={images.insta_Icon} style={{ marginRight: metrics.dimen_5 }} />
                <Text style={{ ...commonStyles.LatoRegular_Medium, color: colors.app_Blue }}>{strings('Instagram')}</Text>
              </TouchableOpacity>
            }

            {userData.facebookUsername !== undefined && userData.facebookUsername.length > 0 &&
              <TouchableOpacity style={{ ...styles.instaButton, marginLeft: metrics.dimen_8 }} onPress={() => this.props.navigation.navigate('SocialProfileWebView', { url: "https://www.facebook.com/" + instaUserName, title: firstName + " " + lastName })}>
                <Image source={images.facebookIcon} style={{ marginRight: metrics.dimen_5 }} />
                <Text style={{ ...commonStyles.LatoRegular_Medium, color: colors.app_Blue }}>{strings('Facebook')}</Text>
              </TouchableOpacity>}
          </View>

          <View style={{ marginHorizontal: 0, marginTop: metrics.dimen_25 }} />
          {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '49%' }}>
              <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_large, fontWeight: metrics.LatoRegular, marginTop: metrics.dimen_5 }}>{Numberformatesunit(followersCount)}</Text>
              <Text style={{ ...styles.addresTextStyle }}>{strings('Followers')}</Text>
            </View>
            <View style={{ ...styles.lineStyle, height: 50, width: 0.4, marginTop: metrics.dimen_4 }}></View>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '49%' }}>
              <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_large, fontWeight: metrics.LatoRegular, marginTop: metrics.dimen_5 }}>{Numberformatesunit(postCount)}</Text>
              <Text style={{ ...styles.addresTextStyle }}>{strings('Posts')}</Text>
            </View>
          </View> */}
          <View style={{ paddingTop: metrics.dimen_8, paddingBottom: metrics.dimen_8 }}>
            <Image source={images.Instastories_bg} style={{ width: '100%', height: Platform.OS == "ios" ? metrics.dimen_50 : metrics.dimen_60 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', position: 'absolute', top: Platform.OS == "ios" ? 20 : 15, }}>
              <View style={{ marginLeft: metrics.dimen_12, flexDirection: 'row', alignItems: 'center', width: '56%' }}>
                <Image source={images.instagram_full} />


              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center', width: '45%', }}>

                <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular }}>{NumberformatesunitUptoOneDecimal(followersCount)}</Text>
                <Text style={{ ...styles.addresTextStyle, fontSize: metrics.text_normal, marginVertical: 1 }}>{strings('Followers')}</Text>
              </View>

              {/* <View style={{ alignItems: 'center', justifyContent: 'center', width: '20%',marginRight:metrics.dimen_15 }}>
            <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular }}>{'$'}</Text>
            <Text style={{ ...styles.addresTextStyle,fontSize:metrics.text_normal,marginVertical:1  }}>{strings('Feepost')}</Text>
          </View> */}
            </View>
          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ flexDirection: 'column', width: '50%', alignItems: ownerId && store.campaignData.length > 0 ? 'center' : null }}
              onPress={() => this.setState({ igTabSelected: true })}>
              {instaaccounttype === false ? <Text style={[styles.textTab, this.state.igTabSelected && { color: colors.app_Blue }]}>{strings('IG_Posts')}</Text> : null}
              {instaaccounttype === false && this.state.igTabSelected && ownerId && store.campaignData.length > 0 && <View style={{
                borderWidth: 1,
                borderColor: colors.app_Blue, height: 1, width: '100%'
              }}></View>}
            </TouchableOpacity>

            {ownerId && store.campaignData.length > 0 && <TouchableOpacity style={{ flexDirection: 'column', width: '50%', alignItems: 'center' }}
              onPress={() => this.setState({ igTabSelected: false })}>
              {instaaccounttype === false ? <Text style={[styles.textTab, !this.state.igTabSelected && { color: colors.app_Blue }]}>{strings('Compaign') + ` (${store.campaignData.length})`}</Text> : null}
              {!this.state.igTabSelected && <View style={{
                borderWidth: 1,
                borderColor: colors.app_Blue, height: 1, width: '100%'
              }}></View>}
            </TouchableOpacity>}
          </View>
          {instaaccounttype === false ? <View style={{
            borderWidth: 0.5,
            borderColor: colors.disable_gray_color, height: 1, marginBottom: metrics.dimen_10
          }}></View> : null}

          {instaaccounttype === true ? <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: metrics.dimen_50 }}>
            <View style={{ left: '40%', }} >
              <Image source={images.privateprofile} />

            </View>
            <Text style={{ ...commonStyles.LatoBold_16, marginTop: metrics.dimen_20, textAlign: 'center' }}>{strings('this_account_is_private')}</Text>

            <Text style={{ ...commonStyles.LatoRegular_Medium, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_12, textAlign: 'center' }}>{strings('Make_your_account_public')}</Text>

          </View> : null}
        </View>
        {/* : !isLoading ?
          this.renderInstaBlockedView()
            // <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: metrics.dimen_70, marginHorizontal: metrics.dimen_10 }}>
            //   <View style={{ left: '40%', justifyContent: 'center' }} >
            //     <Image style={{ height: metrics.dimen_60, width: metrics.dimen_60, }} source={images.no_user_info} />

            //   </View>
            //   <Text style={{ ...commonStyles.LatoRegular_Medium, marginTop: metrics.dimen_20, textAlign: 'center', fontSize: metrics.text_normal, }}>{strings('Information_thisinfluencer')}</Text>

            //   <Text style={{ ...commonStyles.LatoRegular_Medium, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15, textAlign: 'center', fontSize: metrics.text_normal, }}>{strings('Please_try_again_later')}</Text>

            // </View> 
            // : null} */}

      </View>
    )

  }
  Item = ({ item }) => (
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
  renderInstaBlockedView = () => {
    const { firstName, lastName, followersCount, instaUserName, isLoading, blockUserstatus, followedToYou, followedbyYou,socialData } = this.props.UserProfileStore

    const userData = this.props.UserProfileStore.selectedUserDetail
    console.log('renderInstaBlockedView:==', userData.email)
    console.log('followedbyYou:', followedbyYou)
    console.log('followedToYou:', followedToYou)

    if (userData.interests !== undefined) {
      return (
        <View style={{ marginTop: metrics.dimen_2 }}>
          {socialData.length>0?<View style={{ flexDirection: 'row', marginBottom: metrics.dimen_20 }}>
            <FlatList
              scrollEnabled={socialData.length > 3 ? true : false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={socialData}
              renderItem={this.Item}
              keyExtractor={item => item.type}
            />
            {/* {userData.instaUsername !== undefined && userData.instaUsername !== null && userData.instaUsername !== "" &&
              <TouchableOpacity style={{ ...styles.instaButton }}
                onPress={() => this.props.navigation.navigate('SocialProfileWebView', { url: "https://www.instagram.com/" + userData.instaUsername, title: userData.first + " " + userData.last })}>
                <Image source={images.insta_Icon} style={{ marginRight: metrics.dimen_5 }} />
                <Text style={{ ...commonStyles.LatoRegular_Medium, color: colors.app_Blue }}>{strings('Instagram')}</Text>
              </TouchableOpacity>}

            {userData.facebookUsername !== undefined && userData.facebookUsername !== null && userData.facebookUsername !== '' &&
              <TouchableOpacity style={{ ...styles.instaButton, marginLeft: metrics.dimen_8 }} onPress={() => this.props.navigation.navigate('SocialProfileWebView', { url: "https://www.facebook.com/" + instaUserName, title: firstName + " " + lastName })}>
                <Image source={images.facebookIcon} style={{ marginRight: metrics.dimen_5 }} />
                <Text style={{ ...commonStyles.LatoRegular_Medium, color: colors.app_Blue }}>{strings('Facebook')}</Text>
              </TouchableOpacity>} */}
          </View>:null}

          {/* {((userData.followers !== null && userData.followers !== 0) || (followersCount !== '-' && followersCount !== 0)) &&
            <View style={{paddingTop: metrics.dimen_8, paddingBottom: metrics.dimen_8, marginBottom: metrics.dimen_12 }}>
              <Image 
              style={{
                width: '100%', height: '100%',
                position:'absolute'
              }} 
              source={images.Instastories_bg}
              />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ marginLeft: metrics.dimen_12, alignSelf: 'center', width: '56%', marginBottom: metrics.dimen_12 }}>
                    <Image source={images.instagram_full} />


                  </View>

                  <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: metrics.dimen_15, marginBottom:metrics.dimen_12 }}>

                    <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_normal, fontWeight: metrics.LatoRegular }}>
                      {NumberformatesunitUptoOneDecimal(userData.followers !== 0 ? userData.followers : followersCount)}
                    </Text>
                    <Text style={{ ...styles.addresTextStyle, fontSize: metrics.text_normal, marginVertical: 1 }}>{strings('Followers')}</Text>
                  </View>
                </View>
            </View>
            } */}
          {userData.interests !== undefined && userData.interests.length > 0 &&
            <View style={{ marginBottom: metrics.dimen_20 }}>
              <Text style={styles.textInterest}>Interests</Text>
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>
                {userData.interests.map(item => {
                  return (
                    <Text style={[commonStyles.LatoRegular_Normal, styles.tagViewLabel]}>
                      {item.toUpperCase()}
                    </Text>
                  )
                })}
              </View>
            </View>}

            {userData.dob&&userData.dob !== "" && <View style={{ flexDirection: 'row',marginTop:metrics.dimen_5,marginBottom:metrics.dimen_15}}>
            <Birthday 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />

            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>DATE OF BIRTH</Text>
            <Text style={styles.textGenderEmail}>{moment(userData.dob).format('Do MMM, YYYY')}</Text>
            </View>
            
          </View>}
          {/* 23-Apr-2021  Gender no longer needed in user profile - From Client*/}
          {/* {userData.gender !== null&&userData.gender !== "" && <View style={{ flexDirection: 'row',marginBottom:metrics.dimen_15}}>
            <Gender
              width={metrics.widthSize(111)}
              height={metrics.widthSize(111)}
            />
            <View style={{ marginHorizontal: metrics.dimen_18 }}>
              <Text style={styles.textInterest}>GENDER</Text>
              <Text style={styles.textGenderEmail}>{userData.gender.toUpperCase() === "MALE" ? "Male" : "Female"}</Text>
            </View>

          </View>} */}
         
          {userData.email.includes("loopback.com") || userData.email.includes("koliapp.com")||userData.emailPrivate===0 ||reg.test(userData.email) === false? null : <View style={{ flexDirection: 'row' }}>
            <EmailUserProfile
              width={metrics.widthSize(111)}
              height={metrics.widthSize(111)}
            />
            <View style={{ marginHorizontal: metrics.dimen_18 }}>
              <Text style={styles.textInterest}>EMAIL</Text>
              <Text numberOfLines={2} style={styles.textGenderEmail}>{userData.email}</Text>
            </View>
          </View>}

          { (userData.phoneCode===null||userData.phoneCode===""||userData.mobile===""||userData.phonePrivate===0)  ?null: <View style={{marginTop: metrics.dimen_15, flexDirection: 'row'}}>
          <Phone 
            width={metrics.widthSize(111)}
            height={metrics.widthSize(111)}
            />
            <View style={{marginLeft: metrics.dimen_18}}>
            <Text style={styles.textInterest}>PHONE NUMBER</Text>
            <Text style={styles.textGenderEmail}>{"+ "+userData.phoneCode+" "+userData.mobile}</Text>
            </View>
          </View>}


          {isLoading === false && blockUserstatus === false &&

            <View style={{ width: '100%', flexDirection: 'row' }}>
              <View style={styles.followunfollowView}>


                {(followedbyYou === 0 && followedToYou === 0) ?
                  <TouchableOpacity style={styles.touchablestyle}
                    onPress={() => this.props.AuthStore.isLogin?this.showFollowAlert('1'): this.props.navigation.navigate('AuthStack') }>
                    <Text style={styles.followunfollowtext}>{strings("Follow")}</Text>
                  </TouchableOpacity> : (followedbyYou === 0 && followedToYou === 1) ? <TouchableOpacity
                    style={styles.touchablestyle}
                    onPress={() => this.props.AuthStore.isLogin?this.showFollowAlert('2'): this.props.navigation.navigate('AuthStack')}>
                    <Text style={styles.followunfollowtext}>{strings("Follow_back")}</Text>
                  </TouchableOpacity> :
                   <TouchableOpacity
                   style={styles.touchablestyle}
                   onPress={() => this.props.AuthStore.isLogin? this.showUnFollowAlert('3'):this.props.navigation.navigate('AuthStack') }>
                   <Text style={styles.followunfollowtext}>{strings("Following")}</Text>
                 </TouchableOpacity>
                    // (followedbyYou == 1 && followedToYou == 0) ? <TouchableOpacity
                    //   style={styles.touchablestyle}
                    //   onPress={() =>this.props.AuthStore.isLogin? this.showUnFollowAlert('3'):this.props.navigation.navigate('AuthStack') }>
                    //   <Text style={styles.followunfollowtext}>{strings("Unfollow")}</Text>
                    // </TouchableOpacity> : 
                    // <TouchableOpacity
                    //   style={styles.touchablestyle}
                    //   onPress={() => this.props.AuthStore.isLogin? this.showUnFollowAlert('3'):this.props.navigation.navigate('AuthStack') }>
                    //   <Text style={styles.followunfollowtext}>{strings("Unfollow")}</Text>
                    // </TouchableOpacity>
                    }



              </View>

              <View style={styles.sendMessageView}>
                <TouchableOpacity
                  style={styles.touchablestyle}
                  onPress={() =>this.props.AuthStore.isLogin? this.navigateToChat(userData):this.props.navigation.navigate('AuthStack') }>
                  <Text style={styles.sendMessageText}>Send Message</Text>
                </TouchableOpacity>
              </View>


            </View>
          }

          {blockUserstatus &&

            <View style={styles.sendblockView}>
              <Text style={styles.sendblocktext}>User Blocked</Text>

            </View>}
        </View>
      )
    }


  }
  navigateToChat = (userData) => {
    getUserId().then(userid => {
      const recerverUserData = {
        _id: parseInt(userData.ownerId, 10),
        name: (userData.first ? userData.first : '') + " " + (userData.last ? userData.last : ''),
        avatar: userData.avatarUrl !== null ? userData.avatarUrl : ''
      }

      join({ userId: userid })
      this.props.navigation.navigate('ChatDetail', {
        receiverUserId: parseInt(userData.ownerId, 10),
        recerverUserData: recerverUserData,
        title: recerverUserData.name,
        receiverUserProfile: userData
      })

    })
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
        <ScrollView nestedScrollEnabled style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.panelSubtitle}>
              {this.state.SelectedItem ? this.state.SelectedItem.node.edge_media_to_caption.edges[0] ? this.state.SelectedItem.node.edge_media_to_caption.edges[0].node.text : '' : ''}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: metrics.dimen_10, marginTop: metrics.dimen_25, marginBottom: metrics.dimen_20 }}>
              <View style={{ flexDirection: 'row' }} >
                <Image style={{ height: metrics.dimen_22, width: metrics.dimen_22, }} source={images.LikeIcon} />
                <Text style={styles.likecommenttitle}>
                  {this.state.SelectedItem ? Numberformatesunit(this.state.SelectedItem.node.edge_liked_by.count) : ''}
                </Text>
                <Image style={{ marginLeft: metrics.dimen_20, height: metrics.dimen_22, width: metrics.dimen_22, }} source={images.CommentIcon} />
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

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: metrics.dimen_5, paddingHorizontal: metrics.dimen_10, }}>
          <View
            style={[styles.userImageStyle, { width: 100, height: 100, borderRadius: 50 }]}
          />
          <View style={{ marginLeft: metrics.dimen_10, width: Platform.OS === 'ios' ? '87%' : '80%' }}>
            <View style={{ ...styles.headerTextStyle, width: '40%', height: 20, textTransform: 'capitalize' }} />
            <View style={{ ...styles.addresTextStyle, width: '80%', height: 50 }} />
            <View style={styles.bioDesTextStyle} />
          </View>

        </View>
        <View style={[styles.instagramContainerView, { height: 40, marginHorizontal: metrics.dimen_10, marginTop: metrics.dimen_8 }]} />
        <View style={[styles.instagramContainerView, { height: 60, marginHorizontal: metrics.dimen_10, marginTop: metrics.dimen_8 }]} />
        <View style={[styles.instagramContainerView, { height: 572, marginHorizontal: metrics.dimen_10, marginTop: metrics.dimen_8 }]} />

      </SkeletonPlaceholder>
    )
  }
}

export default inject('UserProfileStore', "AuthStore")(observer(UserProfile))


const styles = StyleSheet.create({
  scene: {
    height: 100,
    width: 100
  },
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
    color: 'black',
  },
  userNameTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    fontStyle: 'italic',
    marginVertical: metrics.dimen_2
  },
  addresTextStyle: {
    fontFamily: metrics.Roboto_Regular,
    fontSize: metrics.text_medium,
    color: 'rgba(122,129,138,1)',
    marginVertical: metrics.dimen_3
  },
  bioTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: 'rgba(162,167,174,1)',
  },
  bioDesTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: 'rgba(62,62,70,1)',
    marginTop: metrics.dimen_2,
    marginLeft: metrics.dimen_10,
  },
  lineStyle: {
    backgroundColor: 'rgba(112,112,112,1)',
    opacity: 0.4
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  editButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 88, 211, 1)',
    paddingHorizontal: metrics.dimen_30,
    height: metrics.dimen_45,
    position: 'absolute',
    bottom: metrics.dimen_40,
    borderRadius: metrics.dimen_4
  },
  boldTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'white',
  },
  instaButton: {
    flexDirection: 'row',
    borderRadius: metrics.dimen_15,
    height: metrics.dimen_30,
    borderColor: colors.app_light_black,
    borderWidth: metrics.dimen_1,
    paddingHorizontal: metrics.dimen_10,
    alignItems: 'center'
  },
  imageThumbnailSheetView: {

    aspectRatio: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  panel: {
    height: Dimensions.get('window').height - metrics.dimen_80,
    width: '100%',
    backgroundColor: colors.white,
  },
  headertop: {
    backgroundColor: '#f7f5eee8',
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
    color: 'rgba(114, 114, 114, 1)',
    marginLeft: metrics.dimen_4
  },
  seprater:
  {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,

  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_2 : 3
  },
  tagViewStyle: {
    position: 'absolute',
    top: metrics.dimen_5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    //right:10,
    justifyContent: 'space-around',
    width: '95%',
    //left: metrics.dimen_6,
  },
  tagTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    alignContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  tagTextStyleios: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    alignContent: 'center',
    alignSelf: 'center',
    color: 'white',
    marginTop: -2,
    marginRight: 5
  },
  campaignCurrency: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: '#1658D3',
    marginTop: metrics.dimen_10
  },
  campaignTitle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_13,
    color: '#3D4046',
    marginTop: metrics.dimen_10
  },
  campaignDescription: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: '#616164',
    marginTop: metrics.dimen_10,
    width: '100%'
  },
  campaignImage: {
    width: metrics.getW(130),
    //height: '100%' ,
  },
  imageRibbon: {
    width: metrics.getW(150)
  },
  textTab: {
    fontFamily: metrics.Lato,
    fontSize: metrics.text_16,
    fontWeight: metrics.LatoBold,
    marginVertical: metrics.dimen_15
  },
  userAvatrar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  textInterest: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_13,
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
    width: '48%',
    borderRadius: 5,
    marginLeft: metrics.dimen_5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    marginTop: metrics.getHeightAspectRatio(40)

  },

  sendblockView: {
   
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    marginTop: metrics.getHeightAspectRatio(40)
  },

  followunfollowView: {
    width: '48%',
    marginRight: metrics.dimen_5,
    borderRadius: 5,
    backgroundColor: '#4E8BFE',
    alignItems: 'center',
    marginTop: metrics.getHeightAspectRatio(40)
  },
  followunfollowtext: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.white,
    marginVertical: metrics.getHeightAspectRatio(14),
  },
  sendMessageText: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    marginVertical: metrics.getHeightAspectRatio(12),

  },
  sendblocktext: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    marginVertical: metrics.getHeightAspectRatio(14),
  },

  followerTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_12,
    marginTop: metrics.dimen_3,
    color: '#616168',
  },
  followerCountStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_18,
    color: 'black',
  },
  ratingStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_18,
    marginBottom:metrics.dimen_2,
    marginLeft:metrics.dimen_2,
    color: 'black',
  },
  touchablestyle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
}
)