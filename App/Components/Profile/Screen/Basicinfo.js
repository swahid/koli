import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Image, Alert, Platform } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { Button } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Avatar, Switch } from 'react-native-paper'
import { commonStyles } from '../../../SupportingFIles/Constants';
import CountryPicker from 'react-native-country-picker-modal';
import MyImagePicker from '../../MyImagePicker'
import { uploadImage } from '../../../API/Campaign/ApiCampaign';
import RBSheet from "react-native-raw-bottom-sheet";
import { showAlert, fbLogin } from '../../../SupportingFIles/Utills';
import Config from "react-native-config";
import Interests from "./Interests";
import DateTimePickerComp from '../../DateTimePickerComp';
import Moment from 'moment'
import { getStatesOfCountry } from 'country-state-city/dist/lib/state';
import dropdownStyles from '../../CreateCampaign/CreateCampaignFrom/styles'
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';



class Basicinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
      countrymodaltype: "",
      showDatePicker: false,
      states:[],
      selectedState:"",
      emailvalue: "",
      phonevalue: "",
      keywordId:""
     

    };
    context = this
  }

  componentWillMount() {
    // this.props.MyProfileStore.getInterestList()

  }
  componentWillUnmount() {
    this.props.MyProfileStore.setUserExist(false)
    // this.props.MyProfileStore.setFollowersCount('0')
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      console.warn('come==')
      this.setState({ show_country_modal: false })
    });

    if (this.props.MyProfileStore.country === "") {
      this.props.MyProfileStore.setCountry(this.props.AuthStore.userlocationcountry)
    }else{
      console.log('l;;;',JSON.stringify(this.props.MyProfileStore.countryCode))
      this.fetchStates(this.props.MyProfileStore.countryCode)
      // if(this.props.MyProfileStore.countryCode!==null || this.props.MyProfileStore.countryCode!==undefined){
      // this.setKeywordId(`${this.props.MyProfileStore.countryCode.toLowerCase()}_state`)
      // }
      this.props.MyProfileStore.setCountry(this.props.MyProfileStore.country)
    }
 
    this.setState({selectedState:this.props.MyProfileStore.selectedState})
    this.setState({ emailvalue: this.props.MyProfileStore.emailPrivate })
    this.setState({ phonevalue: this.props.MyProfileStore.phonePrivate })

  }

  updateProfile = () => {
    this.props.MyProfileStore.setNavigation(this.props.navigation)
    // this.props.MyProfileStore.addState()
    this.props.MyProfileStore.updateUserProfile()
  }

  setgender(gendertype) {
    this.props.MyProfileStore.setGender(gendertype)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updatefirstname(fname) {
    this.props.MyProfileStore.setFirstName(fname)
    this.props.MyProfileStore.setupdatestatus(true)

  }
  updatelastname(lname) {
    this.props.MyProfileStore.setLastName(lname)
    this.props.MyProfileStore.setupdatestatus(true)
  }
  updatePayPalEmail(email) {
    this.props.MyProfileStore.setPaypalEmail(email)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updateBlogUrl(blogurl) {
    this.props.MyProfileStore.setblogUrl(blogurl)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updateDOB(dob) {
    this.props.MyProfileStore.setdob(dob)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updatebio(bio) {
    this.props.MyProfileStore.setBio(bio)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updatecountry(country) {

    this.props.MyProfileStore.setCountry(country)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updateState(state) {
    console.log(state)
    this.props.MyProfileStore.setSelectedState(state)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updateEmailPrivate() {
    this.setState({ emailvalue: !this.state.emailvalue })

    this.props.MyProfileStore.setemailPrivate(!this.state.emailvalue)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updatePhonePrivate() {
    this.setState({ phonevalue: !this.state.phonevalue })

    this.props.MyProfileStore.setphonePrivate(!this.state.phonevalue)
    this.props.MyProfileStore.setupdatestatus(true)
  }

  updateMobilecode(text) {
    this.props.MyProfileStore.setMobilecode(text)
    this.props.MyProfileStore.setupdatestatus(true)
  }
  updateMobile(text) {
    this.props.MyProfileStore.setMobile(text)
    this.props.MyProfileStore.setupdatestatus(true)
  }


  fetchStates(country){
    console.log('cc===',country)
    let tArr = getStatesOfCountry(country);
    console.log(tArr)
    let tempArr = [];
    if(tArr.length>0){
      tArr.map((it)=>{
        tempArr.push({label:it.name,value:it.name,countryCode:it.countryCode})
      })
    }
    this.setState({states:tempArr})
  }

  setKeywordId=(keywordId)=>{
    console.log(keywordId)
    this.setState({keywordId:keywordId})
    this.props.MyProfileStore.setSelectedKeyowrdId(keywordId)
  }

  selectState=(state)=>{
    console.log(state)
    this.setState({selectedState:state})
    this.props.MyProfileStore.setSelectedState(state)
  }

  render() {
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
    
    const isFromApplyJob = this.props.routeParams !== undefined ? this.props.routeParams.isFromApplyJob : false
    const imageUrl = userImage == null || userImage === '' || userImage === 'NA' ? images.userPlaceholder : { uri: userImage }
    const showemail = (email.includes("koliapp.com") || email.includes("loopback.com")) ? displayedEmail : email
      console.log('-=-=-=-=-=-=',selectedState);
      
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>


        <Loader loading={isLoading} />

        <DateTimePickerComp
          isDateTimePickerVisible={this.state.showDatePicker}
          maximumDate={new Date()}
          handleDatePicked={this.handleDatePicked}
          hideDateTimePicker={this.hideDateTimePicker}
          onCancel={() => this.setState({ showDatePicker: false })}
          mode="date"
        />
        <MyImagePicker
          ref={(ref) => { this.sheet = ref }}
          width={metrics.width} height={metrics.width} />
        {this.state.show_country_modal && <CountryPicker
          isMultiple={false}
          containerButtonStyle={{ height: 0 }}
          visible={this.state.show_country_modal}
          onClose={() => this.setState({ show_country_modal: false })}
          withEmoji={true}
          withFlag={true}
          withFilter={true}
          withAlphaFilter={true}
          withCallingCode={this.state.countrymodaltype == "Mobile" ? true : false}
          translation={'en'}
          filterProps={{
            filterable: false,
            placeholder: strings('search_country')
          }}
          onSelect={selectedCountry => {
            console.log(`${selectedCountry.cca2.toLowerCase()}_state`)
            this.fetchStates(selectedCountry.cca2)
            this.setKeywordId(`${selectedCountry.cca2.toLowerCase()}_state`)
            this.state.countrymodaltype == "Mobile" ? 
            this.updateMobilecode(selectedCountry.callingCode) 
            :
             this.updatecountry(selectedCountry.name)

          }}
        />}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', alignItems: 'center', marginTop: metrics.dimen_20 }}>
            <TouchableOpacity onPress={this.showImagePicker}>
              <Avatar.Image
                source={imageUrl}
                size={100}
              />
              <View style={{ position: 'absolute', bottom: 0, right: metrics.dimen_5, backgroundColor: colors.app_Blue, width: metrics.dimen_30, height: metrics.dimen_30, borderRadius: metrics.dimen_15, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={images.cameraIcon} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_24 }}>{strings('Gender')}</Text>
          <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_8 }}>
            <TouchableOpacity style={[{
              ...commonStyles.AppButtonStyle,
              height: metrics.dimen_40,
              marginRight: metrics.dimen_12,
              paddingHorizontal: metrics.dimen_15,
              backgroundColor: gender === 'male' ? colors.app_Blue : colors.app_light_gray,
              shadowColor: gender === 'male' ? colors.app_Blue : colors.app_light_gray,
              borderColor: gender === 'male' ? colors.app_Blue : colors.app_light_black
            }, isFromApplyJob && gender === null && styles.emptyInputStyle]}
              onPress={() => this.setgender('male')}
            >
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "male" ? 'white' : colors.app_black }}>{strings('Male')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{
              ...commonStyles.AppButtonStyle,
              height: metrics.dimen_40,
              paddingHorizontal: metrics.dimen_15,
              backgroundColor: gender === 'female' ? colors.app_Blue : colors.app_light_gray,
              shadowColor: gender === 'female' ? colors.app_Blue : colors.app_light_gray,
              borderColor: gender === 'female' ? colors.app_Blue : colors.app_light_black
            }, isFromApplyJob && gender === null && styles.emptyInputStyle]}
              onPress={() => this.setgender('female')}
            >
              <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: gender == "female" ? 'white' : colors.app_black }}>{strings('Female')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_20 }}>{strings('UserName')}</Text>
          <TextInput style={{ ...styles.textInputStylenoteditable }}
            placeholder={strings('UserName')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={userName}
            editable={false}
          />
          {showemail !== '' ?
            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: metrics.dimen_20, marginRight: metrics.dimen_10, marginTop: metrics.dimen_5 }}>
              <Text style={{ ...styles.signUpTextStyle, marginTop: metrics.dimen_10, marginBottom: 5 }}>{strings('Email_Address')}</Text>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...styles.signUpTextStyle, marginTop: metrics.dimen_8, }}>{"Public"}</Text>
                <Switch
                  onTintColor={'rgba(86, 162, 6, 1)'}
                  style={{ transform: [{ scaleX: Platform.OS == 'ios' ? .6 : .8 }, { scaleY: Platform.OS == 'ios' ? .6 : .8 }] }}
                  tintColor={'rgba(229, 229, 229, 1)'}
                  thumbTintColor={colors.white}
                  value={this.state.emailvalue}
                  onValueChange={
                    this.updateEmailPrivate.bind(this)
                  }
                // onValueChange={emailPrivate => this.updateEmailPrivate(emailPrivate)}

                />
              </View>
            </View> : null}
          {showemail !== '' ? <TextInput style={[styles.textInputStyleEmail, isFromApplyJob && showemail === '' && styles.emptyInputStyle]}
            placeholder={strings('Email_Address')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={showemail}
            editable={false}
          /> : null}


          <View style={{ flexDirection: "row", justifyContent: 'space-between', marginLeft: metrics.dimen_20, marginRight: metrics.dimen_10, marginTop: metrics.dimen_10 }}>
            <Text style={{ ...styles.signUpTextStyle, marginTop: metrics.dimen_10, marginBottom: 5 }}>{strings('Phone_Number')}</Text>

            {Mobilecode.length > 0 && Mobile.length > 0 ? <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.signUpTextStyle, marginTop: metrics.dimen_8, }}>{"Public"}</Text>
              <Switch
                onTintColor={'rgba(86, 162, 6, 1)'}
                style={{ transform: [{ scaleX: Platform.OS == 'ios' ? .6 : .8 }, { scaleY: Platform.OS == 'ios' ? .6 : .8 }] }}
                tintColor={'rgba(229, 229, 229, 1)'}
                thumbTintColor={colors.white}
                value={this.state.phonevalue}
                onValueChange={
                  this.updatePhonePrivate.bind(this)
                }

              />
            </View> : null}
          </View>

          <View style={{ flexDirection: 'row', width: "100%" }}>
            <TouchableOpacity style={
              [styles.textInputPhoneCountry,
              { justifyContent: 'center' },
              isFromApplyJob && Mobilecode.length === 0 && styles.emptyInputStyle]}
              onPress={() => this.setState({ show_country_modal: true, countrymodaltype: "Mobile" })}>
              <Text style={{ marginTop: metrics.dimen_5, color: Mobilecode.length > 0 ? colors.app_black : 'rgba(192,196,204,1)' }}>{Mobilecode.length > 0 ? " +" + Mobilecode : "  +65"}</Text>
              <Image style={{ position: "absolute", right: metrics.dimen_10, }} source={images.DropdownIcon} />
            </TouchableOpacity>

            <TextInput style={[styles.textInputStylePhone, isFromApplyJob && Mobile.length === 0 && styles.emptyInputStyle]}
              placeholder={strings('Phone_Number')}
              keyboardType="phone-pad"
              placeholderTextColor='rgba(192,196,204,1)'
              value={Mobile}
              maxLength={10}
              onChangeText={(text) => this.updateMobile(text)}
              editable={true}
            />
          </View>



          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('FirstName')}</Text>
          <TextInput style={[styles.textInputStyle, isFromApplyJob && firstName === '' && styles.emptyInputStyle]}
            placeholder={strings('FirstName')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={firstName}
            onChangeText={(text) => this.updatefirstname(text)}
            autoCapitalize='none'
            autoCompleteType='off'
            autoCorrect={false}
            maxLength={15}
          />

          {validationError.firstNameError ? <Text style={{ ...commonStyles.errorTextStyle, marginLeft: metrics.dimen_20, marginTop: 0 }}>{validationError.firstNameError}</Text> : null}

          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('LastName')}</Text>
          <TextInput style={[styles.textInputStyle, isFromApplyJob && lastName === '' && styles.emptyInputStyle]}
            placeholder={strings('LastName')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={lastName}
            onChangeText={(text) => this.updatelastname(text)}
            autoCapitalize='none'
            autoCompleteType='off'
            autoCorrect={false}
            maxLength={15}
          />
          {validationError.lastNameError ? <Text style={{ ...commonStyles.errorTextStyle, marginLeft: metrics.dimen_20, marginTop: 0 }}>{validationError.lastNameError}</Text> : null}


          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('BlogSiteUrl')}</Text>
          <TextInput style={[styles.textInputStyle, isFromApplyJob && firstName === '' && styles.emptyInputStyle]}
            placeholder={strings('BlogSiteUrl')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={blogUrl}
            onChangeText={(text) => this.updateBlogUrl(text)}
            autoCapitalize='none'
            autoCompleteType='off'
            autoCorrect={false}
/>
           {/* <Text style = {{...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15}}>{strings('paypal_email')}</Text>

            <TextInput style={[styles.textInputStyle,isFromApplyJob && firstName === '' && styles.emptyInputStyle]}
              placeholder = {strings('paypal_email')}
              placeholderTextColor = 'rgba(192,196,204,1)'
              value = {paypalEmail}
              onChangeText={(text)=> this.updatePayPalEmail(text)}
              autoCapitalize = 'none'
              autoCompleteType = 'off'
              autoCorrect = {false}
              maxLength = {100}
            /> */}
            {validationError.paypalError ? <Text style={{...commonStyles.errorTextStyle, marginLeft: metrics.dimen_20, marginTop: 0}}>{validationError.paypalError}</Text> : null}

          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('DOB')}</Text>
          <TouchableOpacity style={styles.campaignViewStyle} onPress={() => this.setState({ showDatePicker: true })}>

            <TextInput style={[styles.textInputStyle, isFromApplyJob && dob === '' && styles.emptyInputStyle]}
              placeholder={strings('DOB')}
              editable={false}
              placeholderTextColor='rgba(192,196,204,1)'
              pointerEvents="none"
              maxLength={30}
              value={dob ? Moment(dob).format('DD-MM-YYYY') : ""}
            />
          </TouchableOpacity>


          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('Country')}</Text>
          <TouchableOpacity style={
            [styles.textInputStyle,
            { justifyContent: 'center' },
            isFromApplyJob && country.length === 0 && styles.emptyInputStyle]}
            onPress={() => this.setState({ show_country_modal: true, countrymodaltype: "Country" })}>
            <Text style={{}}>{country.length > 0 ? country : strings('Select')}</Text>
            <Image style={{ position: "absolute", right: metrics.dimen_10, }} source={images.DropdownIcon} />
          </TouchableOpacity>

          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15 }}>{strings('State')}</Text>
          <DropDownPicker
            open={this.state.open}
            style={[styles.textInputStyle]}
            value={this.state.selectedState}
            items={this.state.states}
            itemStyle={styles.dropdownStyles}
            placeholder={this.state.selectedState.length>0?this.state.selectedState:strings('Select_State')}
            dropDownStyle={dropdownStyles.pickerStyles}
            setOpen={()=>{this.setState({open:'STATE'})}}
            // setValue={this.changeState}
            onChangeItem={(item)=>{
              console.log(item)
              this.updateState(item.value)
            }}
        
          />



          <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_15, marginLeft: metrics.dimen_22 }}>{strings('Bio')}</Text>
          <TextInput style={[styles.textInputStyle, styles.bioTextStyles, isFromApplyJob && bio === '' && styles.emptyInputStyle]}
            multiline={true}
            placeholderTextColor="rgba(192,196,204,1)"
            value={bio}
            maxLength={150}
            onChangeText={(text) => this.updatebio(text)}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
          />
          <Interests />

          <View style={{ height: metrics.dimen_20 }}></View>
        </KeyboardAwareScrollView>
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


  renderBottomSheet() {
    const store = this.props.MyProfileStore
    return (
      <RBSheet
        ref={ref => { this.bottomSheet = ref }}
        height={250}
        duration={170}>
        <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_black, marginTop: metrics.dimen_20, marginLeft: metrics.dimen_20 }}>{strings('UserName')}</Text>
        <TextInput
          style={{ ...styles.textInputStyle }}
          placeholder={strings('UserName')}
          value={store.instaUserName}
          onChangeText={(text) => store.setInstaUserName(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button style={{ ...styles.addButtonStyle, margin: metrics.dimen_20, borderColor: colors.app_Blue, height: metrics.dimen_46 }}
          onPress={() => this.props.MyProfileStore.validateInstaUserName()}
          loading={store.isLoading}
          labelStyle={{ ...commonStyles.LatoBold_14, width: '80%', color: 'white' }}
        >
          {strings('Add')}
        </Button>
      </RBSheet>
    )
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


        //Upload image to server using API

        const param = { base64ImageData: image.data, folderPath: 'users', bucketName: Config.BUCKET }

        uploadImage(param).then(response => {
          store.setIsLoading(false)
          console.log('uploadImage response:', response)
          store.setUserImage(response.data.path)

        }).catch(error => {
          store.setIsLoading(false)
          console.log("uploadImage data response =", error)
        })

      })
    }, 700);
  }


  handleDatePicked = date => {
    var dob = Moment(date).format('YYYY-MM-DD')
    this.updateDOB(dob)
    this.setState({ showDatePicker: false })

  };
  hideDateTimePicker = () => {
    this.setState({ showDatePicker: false })
  };

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
export default inject('MyProfileStore', 'AuthStore')(observer(Basicinfo))

const styles = StyleSheet.create({
  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_5,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
    color: colors.app_black
  },
  // dropdownStyles: {
  //   borderRadius: metrics.dimen_4,
  //   backgroundColor: 'rgba(248,248,248,1)',
  //   paddingHorizontal: metrics.dimen_10,
  //   borderWidth: metrics.dimen_1,
  //   borderColor: 'rgba(227,227,227,1)',
  //   color: colors.app_black
  // },
  emptyInputStyle: {
    borderWidth: 0.5,
    borderColor: colors.app_RedColor
  },
  bioTextStyles: {
    height: metrics.dimen_150,
    textAlignVertical: "top",
    padding: metrics.dimen_10,
    lineHeight: metrics.dimen_18
  },
  textInputStylenoteditable: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_5,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
    color: 'rgba(114, 114, 114, 1)'
  },

  textInputStyleEmail: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
    color: 'rgba(114, 114, 114, 1)'
  },

  textInputStylePhone: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginRight: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    marginLeft: metrics.dimen_13,
    borderColor: 'rgba(227,227,227,1)',
    color: colors.app_black,
    width: "65%"
  },
  textInputPhoneCountry: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginLeft: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
    color: colors.app_black,
    width: "20%"
  },
  PickerStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    marginVertical: metrics.dimen_10,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
  },
  signUpTextStyle: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: 'rgba(62,62,62,70)'


  },
  interestButtonStyle: {
    marginRight: metrics.dimen_10,
    marginBottom: metrics.dimen_10,
    paddingVertical: metrics.dimen_2,

  },
  interestTextStyle: {
    fontFamily: metrics.Lato,
    fontWeight: metrics.LatoBold,
    fontSize: metrics.text_normal,
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
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_6 : 0
  },
  tabStyle: {},
  scrollStyle: {
    backgroundColor: 'white',
  },
  tabBarTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  underlineStyle: {
    backgroundColor: colors.app_Blue,
  },

})
