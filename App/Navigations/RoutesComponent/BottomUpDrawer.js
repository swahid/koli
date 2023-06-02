import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { strings } from '../../Locales/i18';
import metrics from '../../Themes/Metrics';
import DeviceInfo from 'react-native-device-info';
import { inject, observer } from 'mobx-react';
import images from '../../Themes/Images';
import colors from '../../Themes/Colors';
import { setChatDataFetched, setisLogin,setUserData, setUserId } from '../../SupportingFIles/Utills';
import MenuCampaignLine from '../../Assets/Images/MenuCampaignLine';
import MenuMyApplicationsLine from '../../Assets/Images/MenuMyApplicationsLine';
import MenuSettingsLine from '../../Assets/Images/MenuSettingsLine';
import MenuAboutLine from '../../Assets/Images/MenuAboutLine';
import MenuLogoutLine from '../../Assets/Images/MenuLogoutLine';
import MenuFaqLine from '../../Assets/Images/MenuFaqLine';
import MenuHelpLine from '../../Assets/Images/MenuHelpLine';
import MenuPrivacyLine from '../../Assets/Images/MenuPrivacyLine';
import MenuTCLine from '../../Assets/Images/MenuTCLine';
import PortfolioLine from '../../Assets/Images/PortfolioLine';
import ManageAddress from '../../Assets/Images/ManageAddress';
import TransactionMenu from '../../Assets/Images/TransactionMenu';
import BoughtOrderMenu from '../../Assets/Images/BoughtOrderMenu';

import { webPageUrl } from '../../SupportingFIles/Constants';
import BoughtOrders from '../../Components/Product/BoughtOrders';
import ProductStore from '../../Stores/Products/ProductStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BottomUpDrawer extends Component {
  constructor(props) {
    super(props);
    const campaignStore = this.props.CompaignsStore
    //store.getAppliedCampaignsStatus()
    const myApplicationsTitle = campaignStore.myApplicationsList.length > 0 ?
      `${strings('My_Applications')} (${campaignStore.myApplicationsList.length})` :
      `${strings('My_Applications')}`
    this.state = {
        drawerItems:[
          {id:1, title: strings('MyCampaign'), image:MenuCampaignLine, navigationRoute:'MyCompaign'  },
          {id:2, title: myApplicationsTitle, 
                image:MenuMyApplicationsLine,
                navigationRoute:'myApplicationsStackScreen' },
          //  {id:3, title: strings('My_Store'), image:PortfolioLine,navigationRoute:'ProductStack' },
          // {id:4, title: strings('AboutKoli'), image:MenuAboutLine },
          // {id:5, title: strings('PrivacyPolicy'), image:MenuPrivacyLine },
          // {id:6, title: strings('TermsConditions'), image:MenuTCLine, navigationRoute:'TermsconditionStackScreen'  },
          // {id:7, title: strings('Faqs'), image:MenuFaqLine },
          {id:8, title: strings('Support'), image:MenuHelpLine, navigationRoute:'HelpStackScreen'},
          // {id:13, title: strings('Manage_Address'), image:ManageAddress, navigationRoute:'UserAddress'},
          // {id:11, title: strings('Your_Transactions'), image:TransactionMenu, navigationRoute:'TransactionHistory'},
          // {id:12, title: strings('Bought_Orders'), image:BoughtOrderMenu, navigationRoute:"BoughtOrders"},
          {id:9, title: strings('Setting'), image:MenuSettingsLine, navigationRoute:'SettingStackScreen'},
          {id:10, title: strings('Logout'), image:MenuLogoutLine},
    ]
    };
  }
  
   renderItem = ({ item }) => {
    return(
      <View>
        <TouchableOpacity style={styles.item}
        onPress={()=>
          {
            //this.props.closePanel()
            if(item.id === 6)
            {
              this.props.closePanel()
              this.props.navigation.navigate(item.navigationRoute, {
                screen: 'Termscondition',
                params: { From: 'TermsCondition', url: webPageUrl.termsConditions },
              })
            }
            else if (item.id === 4 || item.id === 7)
            {
              this.props.closePanel()
              this.props.navigation.navigate('webViewStackScreen', {
                screen: 'WebViewNavCom',
                params: item.id === 4 ?
                { From: 'about', url: webPageUrl.aboutKoli } : { From: 'FAQ', url: webPageUrl.faq },
              });
            }
            else if(item.id === 5)
            {
              this.props.closePanel()
              this.props.navigation.navigate('privacyPolicyStackScreen', {
                screen: 'PrivacyPolicy',
                params: { From: 'Privacy', url: webPageUrl.privacyPolicy },
              });
            }
            else if(item.id === 10)
            {
              Alert.alert(
                strings('Logout'),
                strings('AreYouSureLogout'),
                [
                    {text: strings('No'), onPress: () => console.log('No Pressed')},
                    {text: strings('Yes'), onPress: () => {
                      this.props.closePanel()
                        this.props.AuthStore.dologout()
                        AsyncStorage.clear()
                        setisLogin('false')
                        //props.AuthStore.setSelectedMenuItem(isLogin ? 0 : 0)
                        this.props.AuthStore.setSelectedMenuItem(0)
                        this.props.AuthStore.setIsLogin(false)
                        this.props.AuthStore.setUserImage('')
                        setUserData('') 
                        setUserId('')
                        setChatDataFetched('true')
                        
                        this.props.navigation.navigate('AuthStack')
                        this.props.SettingsStore.setAccountDetailsArray(null)
                        this.props.SettingsStore.setAccountDetails(null)
                        this.props.MyProfileStore.clearUserData()
                        this.props.AddressStore.setAddresses([])
                        this.props.AddressStore.setReloadContent(true)
                        this.props.NotificationStore.setReloadPage(true)
                        this.props.ProductStore.setEarnedData([])
                        this.props.ProductStore.setSpentData([])

                        // campaign filter reset
                        this.props.CompaignsStore.setFilterApply(false)
                        this.props.CompaignsStore.setcountry('All')
                        this.props.CompaignsStore.setgender('')
                        this.props.CompaignsStore.setminAge(0)
                        this.props.CompaignsStore.setmaxAge("")
                        this.props.CompaignsStore.setpricerangemin(0)
                        this.props.CompaignsStore.setpricerangemax(0)
                        this.props.CompaignsStore.setCompaigns([])
                        this.props.InfluencerStore.setSortby(2)

                    }},
                ],
                { cancelable: true }
              );
            }
            else
            {
              this.props.closePanel()

              this.props.navigation.navigate(item.navigationRoute)
            }
          }
        
        }>
          <item.image style={styles.imageMenuItem}/>
          {/* <SvgCss width="200" height="200" xml={MenuCampaignLine} /> */}
          {/* <MenuCampaignLine style={styles.imageMenuItem}/> */}

           {/* <Image style={styles.imageMenuItem}
                        source={item.image} /> */}
      <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>

      <View
          style={styles.borderBottomLine}
        />
    </View>
    )
    };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
       // scrollEnabled={false}
        data={this.state.drawerItems}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
      />
        <Text style = {styles.textVersion}>
          {strings('version_code')+" " + DeviceInfo.getVersion() + ' ( ' + DeviceInfo.getBuildNumber() + ' )'	}
          </Text>

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    //  height:metrics.height-metrics.getHeightAspectRatio(200),
      //backgroundColor:'red'
      //marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      //backgroundColor: '#f9c2ff',
      paddingVertical: metrics.widthSize(51),
      flexDirection: 'row',
      alignItems:'center',
    //  backgroundColor:'red'
    },
    title: {
      fontSize: metrics.text_16,
      fontFamily: metrics.Lato_SemiBold,
      color: '#252525'
    },
    imageMenuItem: {
      marginHorizontal: metrics.widthSize(51),
      width: metrics.widthSize(78),
      height: metrics.widthSize(78),
      tintColor: colors.app_black
    },
    borderBottomLine:{
      backgroundColor: '#DBDBDB',
      height:0.5,
      marginLeft: metrics.widthSize(170),
    },
    textVersion:{
      alignSelf: 'center', 
      color: 'rgba(54,54,54,1)', 
      fontSize: metrics.text_medium, 
      fontWeight: metrics.LatoRegular, 
      fontFamily: metrics.Lato,
      marginTop: metrics.dimen_20,
      marginBottom: Platform.OS === 'android' ? metrics.dimen_20 : null,

    }
  });
  export default inject('MyProfileStore', 'AuthStore', 'AddressStore', 'NotificationStore', 'ProductStore','CompaignsStore',"InfluencerStore")(observer(BottomUpDrawer))

