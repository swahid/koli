import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Modal
} from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../Themes/Metrics';
import images from '../Themes/Images';
import { commonStyles } from '../SupportingFIles/Constants';
import colors from '../Themes/Colors';
import { getUserId } from '../SupportingFIles/Utills';
import Moment from 'moment'
import { getAllNotifications, updateNotifications } from '../API/Notification/APINotification';
import { strings } from '../Locales/i18';
import ChatIconHeader from '../Components/CommonComponents/ChatIconHeader'
import { useScrollToTop } from '@react-navigation/native';

var context = null

@inject('CompaignsStore', 'AuthStore', 'NotificationStore')
@observer
class Notification extends Component {
  constructor(props) {
    super(props);
    context = this
    this.state = {
      showNotificationDetail: false,
      userId: null,
      isLoading: true,
      data: [],
      notoficationData: [],
      isRefreshingData: false,
      initialArr: Array.from({ length: 40 }, () => Math.floor(Math.random() * 40))

    };
  }
  componentDidMount() {
    this.props.NotificationStore.setNavigation(this.props.navigation)
    const notificationStore = this.props.NotificationStore

    if (this.props.AuthStore.isLogin) {
      this.props.navigation.addListener('focus', () => {
        if(notificationStore.reloadPage)
        {
        notificationStore.setReloadPage(false)
        getUserId().then(userid => {
          const param = { where: { ownerId: userid }, order: "id DESC", include: ["profile"], limit: 20, skip: 0,user_id:userid }
          this.setState({ userId: userid })
          this.getNotificationList(param)
        })
      }
      });

    }
    else {
      this.props.navigation.navigate('AuthStack')
    }
    //Hide Read all button as per client update on 31-August-2020
    this.props.navigation.setOptions({
      headerLeft: () => (
        null
        // <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
        //   onPress={() => this.props.navigation.goBack()}
        // >
        //   <Image source={images.backImage} />
        // </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
          <ChatIconHeader navigation={this.props.navigation} />

        </View>)
      // headerRight: () => (
      //   this.props.AuthStore.isLogin && 
      //   <View style={styles.readAllContentView}>
      //   <TouchableOpacity 
      //   disabled={this.props.route.params !== undefined && 
      //     this.props.route.params.unreadCount===0}
      //   onPress={() => context.readAllNotification()}>
      //     <Text style={[styles.textReadAll,
      //       this.props.route.params !== undefined && 
      //       this.props.route.params.unreadCount===0 && 
      //       styles.textReadAllDisabled]}>{strings('Read_All')}</Text>
      //   </TouchableOpacity>
      // </View>
      // ),
    }
    )
  }

  onRefreshData = () => {

    getUserId().then(userid => {
      // const param = { where: { ownerId: userid }, order: "id DESC",include: ["profile"] }
      const param = {
        where: { ownerId: userid }, order: "id DESC",
        include: ["profile"],
        limit: 20,
        skip: this.state.isRefreshingData ? 0 : this.state.notoficationData.length,
        user_id:userid
      }
      this.setState({ userId: userid })
      // this.props.NotificationStore.getNotificationList(param)
      this.getNotificationList(param)
    })
  }

  render() {
    console.log("this.state.notoficationData",this.state.notoficationData)
    return (
      <SafeAreaView style={styles.mainView}>
        {/* <Loader loading={this.props.NotificationStore.isLoading} /> */}
        {(this.state.notoficationData !== null &&
          this.state.notoficationData.length > 0) &&
          <FlatList
            ref={this.props.scrollRef}
            showsVerticalScrollIndicator={false}
            style={styles.listContainer}
            data={this.state.notoficationData}
            // sections={this.state.notoficationData}
            renderItem={({ item }) => this.renderListItem(item)}
            // renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
            keyExtractor={(item, index) => index.toString()}
            stickySectionHeadersEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={() => {
                  this.setState({ isRefreshingData: true })
                  this.onRefreshData()
                }
                }
              />
            }
            onEndReached={this.onRefreshData}
            onEndReachedThreshold={0.1}

          />}
        {!this.state.isLoading && this.state.notoficationData !== null &&
          this.state.notoficationData.length === 0 &&

          this.renderNoGiveAway()}
        {
          this.state.isLoading  && !this.state.isRefreshingData &&
          this.renderPlaceHolderView()
        }
        {this.state.selectedNotificationData !== undefined &&
          <Modal
            visible={this.state.showNotificationDetail}
            transparent={true}>
            <TouchableOpacity style={{ marginHorizontal: 0, marginVertical: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
              activeOpacity={1}
              onPress={() => this.closePanel()}>
              <View style={{
                paddingVertical: metrics.dimen_10,
                width: '100%',
                backgroundColor: 'white', borderTopLeftRadius: metrics.dimen_30, borderTopRightRadius: metrics.dimen_30, position: 'absolute', bottom: 0,
                //alignItems:'center'
              }}>
                <View style={{
                  width: '15%',
                  alignSelf: 'center',
                  backgroundColor: colors.app_light_black,
                  borderRadius: metrics.dimen_5,
                  height: metrics.dimen_5,
                }}></View>
                {this.renderNotificationPopup()}
              </View>
             
            </TouchableOpacity>
          </Modal>}
      </SafeAreaView>
    );
  }
  closePanel = () => {
    this.setState({ showNotificationDetail: false })
  };
  renderPlaceHolderView = () => {
    return (
      this.state.initialArr.map(obj => (
        <View>
          <View style={[styles.itemMainView, { paddingTop: metrics.dimen_5}]}>

            <View style={styles.imageTypeskelton} />
            <View style={styles.textContentView}>
              <View style={[styles.textNotification, { 
                width: '95%', 
                height: 50, 
                borderRadius: 4, 
                marginTop: 6,
                backgroundColor:colors.disable_gray_color}]} />
              <View style={[styles.textNotificationTime, { 
                width: '20%', 
                height: 10,
                backgroundColor:colors.disable_gray_color}]} />
            </View>

          </View>
        </View>
      ))
    )
  }


  renderSectionHeader = (title) => {
    var outputDate = Moment(title).calendar(null, {
      lastWeek: 'dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: 'ddd, DD MMM'
    });
    return (
      <Text style={styles.sectionHeader}> {outputDate} </Text>
    )
  }

  formatDate = (dateformat, date, language = 'en') => {

    try {

      Moment.locale(language)
      return date ? Moment.utc(date).local().format(dateformat) : ''

    } catch (error) {

      return ''
    }
  }

  renderNoGiveAway() {
    return (
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: '100%', height: '96%' }}>
        <Image source={images.no_notification} style={{ marginTop: -metrics.dimen_40, height: metrics.dimen_120, width: metrics.dimen_120 }} />
        <Text style={{ ...commonStyles.LatoBold_16, marginTop: metrics.dimen_10, marginHorizontal: metrics.dimen_20 }}>{strings('No_Notification')}</Text>
      </SafeAreaView>
    )
  }
  renderHeader = (item) => {
    return (
      <Text>{item}</Text>
    )
  }
  renderListItem = (data) => {
    //NA - NORMAL/DEFAULT
    //CAMPAIGN - CAMPAIGN 
    //KOLITEAM
    //USER
    //CAMPAIGNAPPLY
    //CMAPAIGNAPPLYADMIN
    //USER_CAMPAIGN_APPLY
    //ADMIN_CAMPAIGN_UPDATE

    var notificationImage = images.adminNotification
    // var notificationType = 'admin'
    if (data.type === "USER_CAMPAIGN_APPLY" ||
      data.type === "OWNER_OFFER_MARK_AS_COMPLETED" ||
      data.type === "OWNER_OFFER_DECLINED" ||
      data.type === "OWNER_OFFER_ACCEPT") {
      if (data.profile !== undefined && data.profile.avatarUrl !== null && data.profile.avatarUrl !== "NA"&& data.profile.avatarUrl !== "") {
        notificationImage = { uri: data.profile.avatarUrl }
      }
      else if (data.image !== "NA" && data.image !== null&& data.image !== "") {
        notificationImage = { uri: data.image }
      }
      else {
        notificationImage = images.intrestedNotification
      }
      // notificationType = 'campaign'
    }
    else if (data.type === "ADMIN_CAMPAIGN_APPROVE"
      || data.type === "ADMIN_CAMPAIGN_REJECT" ||
      data.type === "OWNER_DO_PAYMENT" ||
      data.type === "OWNER_PAYMENT_RELEASED" ||
      data.type === "OWNER_OFFER_APPLY" ||
      data.type === "KOLITEAM" || data.type === "KOLI_SEND_MESSAGE") {
      notificationImage = (data.campaignImage === null || data.campaignImage === 'NA' || data.campaignImage === '') ? images.loaderIcon : { uri: data.campaignImage }
      // notificationImage = images.loaderIcon
      // notificationType = 'campaign'
    }
    else {
      notificationImage = images.loaderIcon
    }
    var aDay = 24 * 60 * 60;
    console.log(this.time_ago(new Date(new Date(data.createdAt) - aDay)));
    const imageUrl = (notificationImage === null || notificationImage === 'NA' || notificationImage === '') ? images.KoliSquarePlaceholder : notificationImage

    return (
      <View>

        <TouchableOpacity style={[styles.itemMainView, data.readStatus === 0 && styles.itemMainViewUnread]}
          activeOpacity={1}
          onPress={() =>
            //this.props.navigation.navigate('myCompaignStackScreen',{campaignId:data.campaignId})
            // this.navigateToCampaignDetail(data)
            this.onTapNotification(data)
          }
        >
          <Image style={styles.imageType}
            source={imageUrl}></Image>
          <View style={styles.textContentView}>
            {this.renderNotificationMessage(data)}

            {/* <ReadMoreText style={{ ...commonStyles.LatoItalic_Medium, }}
            seeMoreStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue, width:'100%'}}
            seeLessStyle={{ ...commonStyles.LatoItalic_Medium,color:colors.app_Blue  }}
            backgroundColor={colors.white}
            >
 {this.renderNotificationMessage(data)}
             </ReadMoreText> */}
            {/* <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              {this.renderNotificationMessage(data)}
            </ReadMore> */}
            {/* {this.renderNotificationMessage(data)} */}
            <Text style={styles.textNotificationTime}>{`${this.time_ago(new Date(new Date(data.createdAt) - aDay))} ${strings('ago')}`}</Text>
          </View>
        </TouchableOpacity>
        {/* <View
          style={styles.borderBottomLine}
        /> */}
      </View>

    )
  }
  renderNotificationMessage = (data) => {

    // if (data.type === "ADMIN_CAMPAIGN_APPROVE") {
    //   return (
    //     <Text style={styles.textNotification}
    //     numberOfLines={2}
    //     >
    //       <Text style={styles.notificationHighlightedText}>{data.campaignName}{"\n"}</Text>
    //     {strings('Campaign_Approved_Notification')}      
    //      </Text>)
    // }
    // else if (data.type === "ADMIN_CAMPAIGN_REJECT") {
    //   return (
    //     <Text style={styles.textNotification}
    //     numberOfLines={2}><Text style={styles.notificationHighlightedText}>{data.campaignName}{"\n"}</Text>
    //     {strings('Campaign_Rejected_Notification')}     
    //      </Text>)
    // }
    // else 
    if (data.type === "USER_CAMPAIGN_APPLY" ||
      data.type === "OWNER_OFFER_MARK_AS_COMPLETED" ||
      data.type === "OWNER_OFFER_DECLINED" ||
      data.type === "OWNER_OFFER_ACCEPT" ||
      data.type === "OWNER_DO_PAYMENT" ||
      data.type === "OWNER_PAYMENT_RELEASED" ||
      data.type === "OWNER_OFFER_APPLY" ||
      data.type === "ADMIN_CAMPAIGN_REJECT" ||
      data.type === "ADMIN_CAMPAIGN_APPROVE"
    ) {
      return (
        <Text style={styles.textNotification}
          numberOfLines={2}>
          {/* <Text style={styles.notificationHighlightedText}>
            {strings('User_Interested_Notification')}{"\n"}
            </Text> */}
          {data.message}
        </Text>)
    }
    // else if (data.type === "KOLITEAM" || data.type === "KOLI_SEND_MESSAGE") {
    //   return (<Text style={styles.textNotification}
    //     numberOfLines={2}>{data.message}</Text>)
    // }
    else {
      return (<Text style={styles.textNotification}
        numberOfLines={2}>{data.message}</Text>)
      

    }


  }
  renderNotificationPopup = () => {
    var aDay = 24 * 60 * 60;
    return (
      <View>
        <Text style={[styles.textNotification, styles.textNotificationPopup]}>
          <Text style={styles.notificationHighlightedText}>{strings('KOLI_Team')}{" "}</Text>
          {this.state.selectedNotificationData.message}{" "}
        </Text>
        <Text style={styles.textPopupNotificationTime}>
          {`${this.time_ago(new Date(new Date(this.state.selectedNotificationData.createdAt) - aDay))} ${strings('ago')}`}</Text>
      </View>

    )

  }
  getNotificationList = (params) => {
    //this.setisLoading(true)
    //this.setState({ isLoading: true })
    getAllNotifications(params).then(response => {
     // console.warn('response.data', response.data)
      if (this.state.isRefreshingData) {
        this.setState({ notoficationData: [] })
      }
      this.setState({ isLoading: false, isRefreshingData: false, notoficationData: [...this.state.notoficationData, ...response.data] })
      const filteredReadData = response.data.filter(function (item) {
        return item.readStatus === 0;
      })
      this.props.navigation.setParams({
        unreadCount: filteredReadData.length
      })
      this.props.AuthStore.setNotiCount(filteredReadData.length)
      if (filteredReadData.length > 0) {
        this.readAllNotification()
      }
     
    }).catch(error => {
      this.setState({ isLoading: false })
    })

  }
  readAllNotification = () => {
    const store = this.props.NotificationStore

    if (this.props.route.params.unreadCount > 0) {
      const param = { ownerId: this.state.userId }
      const dataParam = { readStatus: 1 }
      this.setState({ isLoading: true })
      updateNotifications(param, dataParam).then(response => {
        //console.log('readAllNotification:', response)
        if (response.status === 200) {
          this.props.navigation.setParams({
            unreadCount: 0
          })
          store.setUnreadNotifictionCount(0)
          console.log('this.state.notoficationData:', this.state.notoficationData)
          if(this.state.notoficationData.length>0)
          {
            this.setState(prevState => ({
              notoficationData: prevState.notoficationData.map(
                obj => {
                  obj.readStatus = 1
                    return obj
                }
              ), isLoading: false
            }));
          }
        }

      })
    }


  }
  onTapNotification = (notificationData) => {
    if (notificationData.readStatus === 1) {
      this.handleNotificationRedirection(notificationData)
    }
    else {
      const store = this.props.NotificationStore
      const param = { ownerId: this.state.userId, id: notificationData.id }
      const dataParam = { readStatus: 1 }
      store.setisLoading(true)
      updateNotifications(param, dataParam).then(response => {
        if (response.status === 200 && !response.error) {
         store.setUnreadNotifictionCount(store.unreadNotificationCount - 1)
          this.setState(prevState => ({
            notoficationData: prevState.notoficationData.map(
              obj => {
                obj.data.map(item => {
                  if (item.id === notificationData.id) {
                    item.readStatus = 1
                  }
                  return item
                })
                return obj
              }
            ), isLoading: false
          }));
          this.handleNotificationRedirection(notificationData)

        }


      })
    }

  }
  handleNotificationRedirection = (notificationData) => {
    const store = this.props.NotificationStore

    if (notificationData.type === "OWNER_OFFER_APPLY" || notificationData.type === "OWNER_DO_PAYMENT") {

      if(notificationData.remarkId===null)
      {
        this.props.navigation.navigate('myApplicationsStackScreen')
      }else{
        store.getUserAppliedCampaignsList(notificationData)
      }
    
       
    }
    else if (notificationData.campaignId !== null && notificationData.campaignId !== 0 && notificationData.campaignId !== "") {
      store.getCampaignsByCampaignId(notificationData)
    }
    else if (notificationData.type === "KOLI_SEND_MESSAGE") {
      this.setState({ selectedNotificationData: notificationData, showNotificationDetail: true })
      store.setisLoading(false)
    }
    else {
      store.setisLoading(false)
    }
  }
  navigateToCampaignDetail = (item) => {
    this.props.NotificationStore.getCampaignsByCampaignId(item)

  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={[styles.textNotification, styles.showMoreLessText,]} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={[styles.textNotification, styles.showMoreLessText]} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }
  time_ago(time) {

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'day', 86400], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'days', 86400], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'month', 2419200], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'year', 29030400], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = '',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + '' + token;
      }
    return time;
  }

}
export default function (props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Notification {...props} scrollRef={ref} />;
}
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.white,
    flex: 1
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: 'transparent'
  },
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    marginLeft: metrics.dimen_20,

    color: 'rgba(61, 64, 70, 1)',
  },
  itemMainView: {
    flexDirection: 'row',
    paddingTop: metrics.dimen_10,
    paddingRight: metrics.dimen_10,
    height: metrics.getH(75),
  },
  itemMainViewUnread: {
    //backgroundColor: '#E6EFFF',
    backgroundColor: '#f4f5ff',

  },
  imageType: {
    marginLeft: metrics.dimen_10,
    width: metrics.dimen_44,
    height: metrics.dimen_44,
    borderRadius: metrics.dimen_22
  },
  imageTypeskelton: {
    marginLeft: metrics.dimen_10,
    width: metrics.dimen_44,
    height: metrics.dimen_44,
    marginTop: metrics.dimen_12,
    borderRadius: metrics.dimen_22,
    backgroundColor:colors.disable_gray_color 
  },
  textContentView: {
    marginHorizontal: metrics.dimen_13,
    flexDirection: 'column',
    flex: 1

  },
  textNotification: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: '#3E3E46',
  },
  textNotificationPopup: {
    marginHorizontal: metrics.dimen_24,
    marginTop: metrics.dimen_20,
  },
  textNotificationId: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    marginTop: metrics.dimen_10,
    color: colors.app_Blue
  },
  textNotificationTime: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    marginTop: metrics.dimen_6,
    marginBottom: metrics.dimen_8,
    color: colors.app_gray
  },
  textReadAll: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.dimen_14,
    color: colors.app_Blue
  },
  textReadAllDisabled: {
    color: colors.drawerIconTint
  },
  borderBottomLine: {
    backgroundColor: '#C0C4CC',
    height: 0.5
  },
  sectionHeader: {
    color: '#C0C4CC',
    marginTop: metrics.dimen_10,
    marginBottom: metrics.dimen_5,
    marginLeft: metrics.dimen_10,
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
  },
  readAllContentView: {
    marginRight: metrics.dimen_20,
    flexDirection: 'row'
  },
  notificationHighlightedText: {
    fontWeight: 'bold',
    // lineHeight: 30
  },
  showMoreLessText: {
    color: colors.app_Blue,
  },
  textPopupNotificationTime: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    marginTop: metrics.dimen_5,
    marginBottom: metrics.dimen_20,
    color: "#949FB4",
    marginHorizontal: metrics.dimen_24
  },

})