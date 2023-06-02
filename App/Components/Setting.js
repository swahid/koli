import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  StyleSheet, 
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import metrics from '../Themes/Metrics';
import colors from '../Themes/Colors';
import images from '../Themes/Images';
import { strings } from '../Locales/i18';
import { Switch } from 'react-native-paper';
// import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { gettUserData } from '../SupportingFIles/Utills';
import {observer, inject} from 'mobx-react';
import Loader from '../SupportingFIles/Loader';
import SettingNotification from '../Assets/Images/settingNotification';
import changePassword from '../Assets/Images/changePassword';
import block_User from '../Assets/Images/block_User';
import Affiliate from '../Assets/Images/Affiliate';
import MenuAboutLine from '../Assets/Images/MenuAboutLine';
import MenuPrivacyLine from '../Assets/Images/MenuPrivacyLine';
import MenuTCLine from '../Assets/Images/MenuTCLine';
import MenuFaqLine from '../Assets/Images/MenuFaqLine';
import { webPageUrl } from '../SupportingFIles/Constants';


class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingListData: [

        {
          id: 1,     
          data: [{ image:SettingNotification, text: strings("Notifications"), isSwitch: true, id: 1,indexid: 1, switchState: false }, 
           //{ text: strings("Email_Notifications"), isSwitch: true, id: 2, switchState: true }
        ]
        },
        {
          id: 2,     
          data: [{ image:changePassword, text: strings("change_Password"), isSwitch: false, id: 1,indexid: 2, switchState: false,navigation:'ChangePassword' }, 
        ]
        },

        {
          id: 3,
          data: [{image:block_User, text: strings("Blocked_users"), isSwitch: false, id: 1,indexid: 3, navigation: 'BlockUser' }]
        },
        {
          id: 4,
          data: [{image:Affiliate, text: strings("affiliateSettings"), isSwitch: false, id: 1,indexid: 4, navigation: 'AffiliateSettings' }]
        },
        {
          id: 5,
          data: [{text: strings('AboutKoli'), image:MenuAboutLine, isSwitch: false, id: 1,indexid: 5, }]
        },
        {
          id: 6,
          data: [{text: strings('PrivacyPolicy'), image:MenuPrivacyLine, isSwitch: false, id: 1,indexid: 6, }]
        },
        {
          id: 7,
          data: [{text: strings('TermsConditions'), image:MenuTCLine, isSwitch: false, id: 1,indexid: 7, }]
        },
        {
          id: 8,
          data: [{text: strings('Faqs'), image:MenuFaqLine, isSwitch: false, id: 1,indexid: 8, }]
        },
      ]
    };
  }


  
  componentDidMount = () =>{
    this.getUserDataAndSetSwitchStatus()
  }
  getUserDataAndSetSwitchStatus = () =>{
    gettUserData().then(userData => {
      const settingsData = [...this.state.settingListData]
      settingsData[0].data[0].switchState = userData.appNotificationSetting === 1 ? true : false
      settingsData[0].data[1].switchState = userData.emailNotificationSetting === 1 ? true : false
      this.setState({settingListData:settingsData})

      // console.log('user data value =', userData)
     
    })
    this.props.BlockUserStore.getBlockUserList()
  }

  render() {
    const store = this.props.MyProfileStore
    const { isLoading} = store
    return (
      <View style={styles.container}>
        <Loader loading={isLoading}/>
        <SectionList
        scrollEnabled={false}
          sections={this.state.settingListData}
          keyExtractor={(item, index) => item + index}
          renderItem={(item, index) => this.listItem(item)}
         // renderSectionHeader={this.renderHeader}
        // renderSectionFooter={this.renderFooter}

        // renderSectionHeader={({ section: { title } }) => (
        //   <Text style={styles.header}>{title}</Text>
        // )}
        />
      </View>
    );
  }
  renderHeader = () => {
    return (
      <View style={styles.contentViewHeader}>
        <View style={styles.lineView}></View>
        <View style={styles.lineView}></View>

      </View>
    )
  }
  renderFooter = () => {
    return (
      <View style={styles.contentViewHeader}>
        <View style={styles.lineView}></View>
      </View>
    )
  }
  listItem = (data) => {
    console.log("data.indexid",data.item.indexid)
    return (
      <TouchableOpacity style={styles.item}
      
        onPress={() =>{
          if(data.item.navigation !== undefined)
          {
           
            this.props.navigation.navigate(data.item.navigation)
          }else{
            console.log("data.id",data.indexid)
             if (data.item.indexid === 5 || data.item.indexid === 8)
            {
             
              this.props.navigation.navigate('webViewStackScreen', {
                screen: 'WebViewNavCom',
                params: data.item.indexid === 5 ?
                { From: 'about', url: webPageUrl.aboutKoli } : { From: 'FAQ', url: webPageUrl.faq },
              });
            }
            else if(data.item.indexid === 6)
            {
            
              this.props.navigation.navigate('privacyPolicyStackScreen', {
                screen: 'PrivacyPolicy',
                params: { From: 'Privacy', url: webPageUrl.privacyPolicy },
              });
            }else if(data.item.indexid === 7)
            {
            
              this.props.navigation.navigate('TermsconditionStackScreen', {
                screen: 'Termscondition',
                params: { From: 'TermsCondition', url: webPageUrl.termsConditions },
              })
            }

          }

        }
          }
        >
        {data.index === 1 && <View style={styles.halfLine} />}
        <View style={styles.viewSettingRowData}>
       <View style={{flexDirection:'row',width:"85%",alignItems:'center'}}>
       <data.item.image style={styles.imageMenuItem}
            />
        <Text style={styles.title}>{data.item.text}</Text>

       </View>
       
          {data.item.isSwitch === true &&
            <Switch
              onTintColor={colors.app_Blue}
              tintColor={'rgba(112, 129, 138, 1)'}
              thumbTintColor={colors.white}
              // ios_backgroundColor={'rgba(112, 129, 138, 1)'}
              value={data.item.switchState}
              onValueChange={() => this.disableEnableSettings(data.item)}
            />}
             
        </View>

      </TouchableOpacity>
    )
  }
  disableEnableSettings = (data) =>{
    console.log('data.item:',data)
    this.changeSwitchState(data)
    Alert.alert(
      data.text,
      data.id === 1 ? strings('Push_Notification_Change_Confirmation') : strings('Email_Notification_Change_Confirmation'),
      [
        {
          text: strings('Cancel'),
          onPress: () => this.changeSwitchState(data),
          style: "cancel"
        },
        { text: strings('Yes'), onPress: () => this.changeSettingsAPICall(data) }
      ],
      { cancelable: false }
    );
  }
  changeSwitchState = (data) =>{
    const settingsData = [...this.state.settingListData]
    if(data.id === 1)
    {
      settingsData[0].data[0].switchState = data.switchState === true ? false : true
    }
    else
    {
      settingsData[0].data[1].switchState = data.switchState === true ? false : true

    }
    this.setState({settingListData:settingsData})

  }
  changeSettingsAPICall = (data) =>{
    var paramsToSend = {}
    if(data.id === 1)
    {
      paramsToSend = {appNotificationSetting: data.switchState ? 1 : 0} 
    }
    else
    {
      paramsToSend = {emailNotificationSetting: data.switchState ? 1 : 0} 

    }
    this.props.MyProfileStore.updateSettings(paramsToSend)
  }
}
export default inject("MyProfileStore","BlockUserStore")(observer(Setting))

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: colors.white,
    //marginTop: Constants.statusBarHeight,
     marginTop:metrics.dimen_1,
     paddingTop:metrics.dimen_5,
     paddingHorizontal: 16
  },
  item: {
    backgroundColor: colors.white,
  },

  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  title: {
    paddingLeft: metrics.widthSize(40),
    paddingRight: metrics.widthSize(42),
    paddingVertical: metrics.aspectRatioHeight(50),
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_16,
  },
  contentViewHeader: {
    backgroundColor: '#F3F3F3',
    height: metrics.aspectRatioHeight(33),
    justifyContent: 'space-between',
    width: '100%'
  },
  lineView: {
    backgroundColor: 'rgba(112,112,112, 0.2)',
    height: metrics.aspectRatioHeight(3),
  },
  halfLine: {
    backgroundColor: 'rgba(112,112,112, 0.2)',
    height: metrics.aspectRatioHeight(3),
    marginLeft: metrics.widthSize(60),
  },
  viewSettingRowData: {
    flexDirection: 'row',
    alignItems: 'center',
    
  }, 
  rightArrow: {
    tintColor: colors.rightArrowSettings,
    marginRight: metrics.widthSize(20),
    width: metrics.widthSize(30),
    height: metrics.widthSize(39),

  },

  leftIcon: {
    width: metrics.widthSize(50),
    height: metrics.widthSize(50),

  },
  imageMenuItem: {
    width: metrics.widthSize(24),
    height: metrics.widthSize(24),
  },
});
