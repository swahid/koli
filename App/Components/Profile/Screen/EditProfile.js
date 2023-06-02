import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  Alert,
  Dimensions,
  BackHandler,
  Platform
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import MyImagePicker from '../../MyImagePicker'
import Basicinfo from './Basicinfo'
import SocialList from './SocialList'
import Demographics from './Social'
import { uploadImage } from '../../../API/Campaign/ApiCampaign';
import { showAlert, fbLogin } from '../../../SupportingFIles/Utills';
import ScrollableTabView, { ScrollableTabBar } from '@yz1311/react-native-scrollable-tab-view';
import Config from "react-native-config";
import { ScrollView } from 'react-native-gesture-handler';






class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
    };
    context = this

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    if(this.props.route.params !== undefined )
    {
      this.props.MyProfileStore.setNavigationParams(this.props.route.params)
    }

  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.backButtonContainer}
          onPress={() => this.OnBackPress()}
        >
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.updateProfile()}>
            <Text style={{  fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(16),
    color: colors.app_Blue }}>{strings('Save')}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  handleBackButtonClick = () => {
    if (this.props.MyProfileStore.updatestatus === true) {
     this.unsavedChangesAlert()
    }
    else
    {
      this.props.navigation.goBack()
    }
    return true;  }

  OnBackPress() {
    if (this.props.MyProfileStore.updatestatus === false) {
      this.props.navigation.goBack()

    } else {
      this.unsavedChangesAlert()
    }

  }
  unsavedChangesAlert=()=>{
    Alert.alert(
      strings('Unsaved_Changes'),
      strings('Do_you_save_the_changes'),
      [
        { text: strings('No'), onPress: () => this.cancelProfileUpdate() },
        { text: strings('Save'), onPress: () => this.ProfileUpdate() },
      ],
      { cancelable: true }
    );
  }

  ProfileUpdate() {
    this.props.MyProfileStore.setNavigation(this.props.navigation)
    this.props.MyProfileStore.updateUserProfile()

  }
  cancelProfileUpdate() {
    this.props.MyProfileStore.setNavigation(this.props.navigation)
    this.props.MyProfileStore.setupdatestatus(false)
    this.props.navigation.goBack()
  }
  componentWillUnmount() {
    this.props.MyProfileStore.setUserExist(false)
   
  }
  updateProfile = () => {
    const store = this.props.MyProfileStore

    const { firstName,
      lastName,
      bio,
      userImage,
      userName,
      gender,
      isLoading,
      email,
      country,
      selectedState,
      validationError,
      displayedEmail,
      dob,
      emailPrivate,
      Mobilecode,
      Mobile,
      phonePrivate,
      paypalEmail,
      blogUrl } = store
    
    const isFromApplyJob = this.props.route.params !== undefined ? this.props.route.params.isFromApplyJob : false

    if(isFromApplyJob){
        console.log(gender,Mobile,Mobilecode,bio,firstName,lastName)
        if(bio==""){
            this.scrollRef.scrollToEnd();
        }else if(gender=="" || Mobile==""||Mobilecode==""||lastName==""||firstName==""){
          this.scrollRef.scrollTo(0);
        }else{
          this.props.MyProfileStore.setNavigation(this.props.navigation)

    this.props.MyProfileStore.updateUserProfile()
        }
    }else{
this.props.MyProfileStore.setNavigation(this.props.navigation)

    this.props.MyProfileStore.updateUserProfile()
    }
    
  }
  render() {
    const store = this.props.MyProfileStore
    const { isLoading } = store

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollableTabView
          onScroll={() => Keyboard.dismiss()}
          renderTabBar={() => (
            <ScrollableTabBar
              style={styles.scrollStyle}
              tabStyle={styles.tabStyle}
            />
          )}
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarInactiveTextColor={colors.toptab_color}
          tabBarActiveTextColor={colors.app_Blue}
          tabBarUnderlineStyle={styles.underlineStyle}
          initialPage={0}
        >
            <ScrollView ref={(ref)=> {this.scrollRef=ref}} tabLabel={strings('Basic_info')} >
          <Basicinfo navigation={this.props.navigation} 
          key={'1'} 
          tabLabel={strings('Basic_info')} 
          style={{ flex: 1, backgroundColor: colors.app_light_gray }}
          routeParams={this.props.route.params} />
          </ScrollView>
          <SocialList navigation={this.props.navigation} 
          routeParams={this.props.route.params}
          key={'2'} 
          tabLabel={strings('Socials')} 
          style={{ flex: 1, backgroundColor: colors.app_light_gray }} />
        </ScrollableTabView>

        <Loader loading={isLoading} />
        <MyImagePicker ref={ref => this.sheet = ref} width={metrics.width} height={metrics.width} />
       
      </View>
    );
  }
  doFacebookLogin = async () => {
    const callback = (error, result) => {
      if (error) {
        showAlert('', JSON.stringify(error))
      } else {
        this.props.MyProfileStore.setFacebookUserName(result.name)
      }
    }
    await fbLogin(callback)
  }

  renderInterest = (item) => {
    return (
      <Text style={{ flex: 1 }}>{item}</Text>
    )
  }
  showImagePicker = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      const store = this.props.MyProfileStore
      this.sheet.openSheet().then(image => {
        this.props.MyProfileStore.setIsLoading(true)
        const param = {base64ImageData:image.data, folderPath: 'users', bucketName:Config.BUCKET}
        uploadImage(param).then(response => {
          store.setIsLoading(false)
          console.log('uploadImage response:',response)
          store.setUserImage(response.data.path)
        
      }).catch(error => {
        store.setIsLoading(false)
          console.log("uploadImage data response =", error)
      })

      })
    }, 700);
  }

  showremoveAccountAlert = (type) => {

    setTimeout(() => {
      Alert.alert(
        strings('Remove_account'),
        strings('Are_you_sure'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          { text: strings('Yes'), onPress: () => { type === 'insta' ? this.removeinstaccount() : this.removefacebookaccount() } },
        ],
        { cancelable: true }
      );
    }, 500);
  }
  removeinstaccount() {
    const store = this.props.MyProfileStore
    store.setInstaUserName('')
    store.setUserExist(false)
    store.setFollowersCount('')
  }
  removefacebookaccount() {
    const store = this.props.MyProfileStore

    store.setFacebookUserName('')

  }
}
export default inject('MyProfileStore', 'AuthStore')(observer(EditProfile))

const styles = StyleSheet.create({
  
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS === 'android' ? metrics.dimen_6 : 0
  },
  tabStyle: {
    width: Dimensions.get('window').width / 3,

  },
  scrollStyle: {
    backgroundColor: colors.white,

  },
  tabBarTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
  },
  underlineStyle: {
    backgroundColor: colors.app_Blue,
  },

})
