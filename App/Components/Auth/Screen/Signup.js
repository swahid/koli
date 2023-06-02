import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity,  Platform, SafeAreaView, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import { showAlert } from '../../../SupportingFIles/Utills';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import AppWebView from '../../AppWebView'
import { gettermsCondition } from '../../../API/Auth/TermsAndPolicy/TermsPrivacyPolicy'
import { SignupUserTypes } from '../../../SupportingFIles/Constants';
import MyImagePicker from '../../MyImagePicker'
import Config from "react-native-config";
import { uploadImage } from '../../../API/Campaign/ApiCampaign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
const removeEmojis = (string) => {
  // emoji regex from the emoji-regex library
  const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g

  return string.replace(regex, '')

}

class Signup extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.resetFields()
    this.props.navigation.addListener('focus', () => {
      this.resetFields()
      this.gettermsCondition()
    });
  }

  resetFields() {
    if(this.props.AuthStore.socialsignuptype === "")
    {
      this.props.AuthStore.deleteAllValidationError()
      this.props.AuthStore.setEmail('')
      this.props.AuthStore.setUserName('')
      this.props.AuthStore.setPassword('')
      this.props.AuthStore.setConfirmPassword('')
      this.props.AuthStore.setFirstName('')
      this.props.AuthStore.setLastName('')
      this.props.AuthStore.setUserImage('')
      this.props.AuthStore.setusernamevalidatedsuccess("")
      this.props.AuthStore.setusernamevalidate(false)
      this.props.AuthStore.setLoading(false)
      this.props.AuthStore.setaffilateCode('')
    }
  }
  render() {
    const store = this.props.AuthStore
    const { firstName,
      lastName,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      termsAccepted,
      signupSuccess,
      validationError,
      isLoading,
      isShowTermsConditon,
      selectedSignupUserType,
      userImage,
      userName,
      usernamevalidate,
      socialsignuptype,
      affilateCode,
    } = store

    const imageUrl = (userImage === null || userImage === '' || userImage === 'NA') ? images.cameraIcon : { uri: userImage }
   
   console.log('socialsignuptype',socialsignuptype)
    return (

      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <MyImagePicker ref={ref => this.sheet = ref} width={metrics.width} height={metrics.width} />

        <AppWebView isShow={isShowTermsConditon} url={this.props.AuthStore.termsdescription} onClose={this.onCloseTermsConditionView} />
        <Image source={images.backgroundImage} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
       
        <SafeAreaView>
          <View style={{backgroundColor: 'rgba(52, 52, 52, 0.2)', marginLeft: metrics.dimen_20, height:metrics.dimen_35,width:metrics.dimen_35, borderRadius:metrics.dimen_5,    

               }}>
          <TouchableOpacity style={styles.backContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={images.backImage} style={{ tintColor: 'white',marginBottom:metrics.dimen_5,marginLeft:metrics.dimen_1 }} />
          </TouchableOpacity></View>
        </SafeAreaView>

        <View style={{ justifyContent: 'space-between', flex: 1 }}>
          <View></View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.bottomContainer} 
            behavior={Platform.OS === "ios" ? "padding" : null}
            >
              <Text style={styles.headerTextStyle}>{strings('Signup')}</Text>

              <TouchableOpacity style={socialsignuptype==""?styles.profilePictureView :styles.profilePictureViewSocialLoginCase} onPress={this.showImagePicker}>
              <FastImage
              style={(imageUrl === images.cameraIcon ? styles.imageCamera : styles.imagestyle)}
              source={imageUrl}
              />
                {/* <Image style={(imageUrl === images.cameraIcon ? styles.imageCamera : styles.imagestyle)}
                resizeMode="contain"
                  source={imageUrl}
                > */}

                {/* </Image> */}
            </TouchableOpacity>
             
              <View style={{ ...styles.viewSignupType }}>
                {this.renderUserTypeView(SignupUserTypes.Influencer)}
                {this.renderUserTypeView(SignupUserTypes.Brand)}
                {this.renderUserTypeView(SignupUserTypes.Agency)}
                {this.renderUserTypeView(SignupUserTypes.Others)}
              </View >

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 0.48 }}>
                  <TextInput style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.firstNameError ? colors.app_RedColor : colors.clear, textTransform: 'capitalize' }}
                    placeholder={strings('FirstName')}
                    placeholderTextColor={colors.transparentWhite}
                    value={firstName}
                    onChangeText={(text) => store.setFirstName(text)}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    maxLength={15}
                  />
                  {validationError.firstNameError ? <Text style={styles.errorTextStyle}>{validationError.firstNameError}</Text> : null}
                </View>
                <View style={{ flex: 0.48 }}>
                  <TextInput style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.lastNameError ? colors.app_RedColor : colors.clear, textTransform: 'capitalize' }}
                    placeholder={strings('LastName')}
                    placeholderTextColor={colors.transparentWhite}
                    value={lastName}
                    onChangeText={(text) => store.setLastName(text)}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    maxLength={15}
                  />
                  {validationError.lastNameError ? <Text style={styles.errorTextStyle}>{validationError.lastNameError}</Text> : null}
                </View>
              </View>
              {socialsignuptype === '' && <TextInput 
              style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.emailError ? colors.app_RedColor : colors.clear }}
                placeholder={strings('Email')}
                placeholderTextColor={colors.transparentWhite}
                value={email}
                onChangeText={(text) => store.setEmail(text)}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="off"
              />}
              {(validationError.emailError && socialsignuptype === '') ? 
              <Text style={styles.errorTextStyle}>{validationError.emailError}</Text> : null}
              <View>

              <TextInput
               style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.usernameError ? colors.app_RedColor : colors.clear }}              
                 placeholder = {strings('eg_username')}
                 placeholderTextColor={colors.transparentWhite}
                autoCorrect = {false}
                maxLength={30}
                autoCapitalize = "none"
                autoCompleteType = "off"
                keyboardType="ascii-capable"
                onBlur={this.onSubmitEdit}
                value={userName}
                onChangeText = {(text) => {
                    this.props.AuthStore.deleteValidationError('usernameError')
                    this.props.AuthStore.setUserName(text)
                }}
                
            
            />
             {validationError.usernameError ? <Text style={styles.errorTextStyle}>{validationError.usernameError}</Text> : null}
            { usernamevalidate==true?<View style={styles.showHidePasswordIcon} onPress={() => store.setShowPassword(!showPassword)}>
             <Image source={images.checktik} style={{ tintColor: colors.app_green }} /></View>:null}
              </View>

            

             { socialsignuptype === '' &&  <View>

                <TextInput style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.passwordError ? colors.app_RedColor : colors.clear }}
                  placeholder={strings('Password_signup')}
                  textContentType="none"
                  placeholderTextColor={colors.transparentWhite}
                  value={password}
                  onChangeText={(text) => store.setPassword(text)}
                  secureTextEntry={showPassword}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  maxLength={15}
                />
                {validationError.passwordError ? <Text style={styles.errorTextStyle}>{validationError.passwordError}</Text> : null}
                <TouchableOpacity style={styles.showHidePasswordIcon} onPress={() => store.setShowPassword(!showPassword)}>
                  <Image source={showPassword ? images.hideIcon : images.showIcon} style={{ tintColor: colors.transparentWhite }} />
                </TouchableOpacity>
              </View>}

              {socialsignuptype === '' &&   <View>
                <TextInput style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: validationError.confirmPasswordError ? colors.app_RedColor : colors.clear }}
                  placeholder={strings('ConfirmPassword')}
                  textContentType="none"
                  placeholderTextColor={colors.transparentWhite}
                  value={confirmPassword}
                  onChangeText={(text) => { store.setConfirmPassword(text) }}
                  secureTextEntry={showConfirmPassword}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  maxLength={15}
                />
                {validationError.confirmPasswordError ? <Text style={styles.errorTextStyle}>{validationError.confirmPasswordError}</Text> : null}
                <TouchableOpacity style={styles.showHidePasswordIcon} onPress={() => store.setShowConfirmPassword(!showConfirmPassword)}>
                  <Image source={showConfirmPassword ? images.hideIcon : images.showIcon} style={{ tintColor: colors.transparentWhite }} />
                </TouchableOpacity>
              </View>}

              <View>
                <TextInput style={{ ...styles.textInputStyle, ...styles.normalText, borderWidth: metrics.dimen_1, borderColor: colors.clear }}
                  placeholder={strings('Affiliate_code_optional')}
                  textContentType="none"
                  placeholderTextColor={colors.transparentWhite}
                  value={affilateCode}
                  onChangeText={(text) => { store.setaffilateCode(text) }}
                  autoCapitalize="none"
                  keyboardType="ascii-capable"
                  autoCompleteType="off"
                  autoCorrect={false}
                  maxLength={30}
                />
             
                <TouchableOpacity style={styles.showHidePasswordIcon} onPress={() => this.showAffilateCodeInfo()}>
                <Image style={{alignSelf:'center', width:metrics.dimen_16, height:metrics.dimen_16, tintColor: colors.white}}
                    source={images.infoIcon}
                    resizeMode="contain"
                  ></Image>
                  {/* <Image source={showConfirmPassword ? images.hideIcon : images.showIcon} style={{ tintColor: colors.transparentWhite }} /> */}
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', marginTop: metrics.dimen_15, marginBottom: metrics.dimen_10 }}>
                <TouchableOpacity onPress={() => { store.setTermsAccepted(!termsAccepted) }}>
                  <Image source={termsAccepted ? images.checked : images.uncheck} />
                </TouchableOpacity>
                <Text style={{ ...styles.normalText, marginLeft: metrics.dimen_10 }}>{strings('IAgree')} <Text style={{ ...styles.normalText, textDecorationLine: 'underline' }} onPress={() => store.setShowTermsCondition(true)}>{strings('TermsConditions')}</Text></Text>
              </View>

              <TouchableOpacity style={{ ...styles.buttonStyle }} onPress={this.onSignUp}>
                <Text style={{ ...styles.signUpTextStyle }}>{strings('SignupNow')}</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </TouchableWithoutFeedback>
        </View>

        {signupSuccess ? this.props.navigation.goBack() : null}
      </View>
    );
  }
  renderUserTypeView = (selectedType) => {
    return (
      <TouchableOpacity style={[styles.viewSelectedType,
      selectedType !== this.props.AuthStore.selectedSignupUserType &&
      { backgroundColor: 'transparent' }]}
        onPress={() => this.onSelectUserType(selectedType)}>
        <Text style={[styles.textSelectedType,{textTransform: 'capitalize'},
        selectedType !== this.props.AuthStore.selectedSignupUserType &&
        { color: colors.transparentWhite }
        ]}  >
          {selectedType}
        </Text>
      </TouchableOpacity>
    )
  }
  onSelectUserType = (selectedType) => {
    console.log('selectedType:', selectedType)

    this.props.AuthStore.setUserSignupType(selectedType)
  }
  onSignUp = () => {
    const { termsAccepted } = this.props.AuthStore
    if (!termsAccepted) {
      showAlert('', strings('AcceptTerms'))
    } else {
      this.props.AuthStore.onSignup()
    }
  }

  showAffilateCodeInfo=()=>
  {
    showAlert('', strings('showAlerttext'))
  }
  onCloseTermsConditionView = () => {
    this.props.AuthStore.setShowTermsCondition(false)
  }

  gettermsCondition = () => {
    gettermsCondition().then(response => {
      const { status, data } = response
      if (status === 200) {
        this.props.AuthStore.settermsdescription(data.message[0].description)
      }
    }).catch(error => {
    })

  }
  // Check User Name Exist
  onSubmitEdit = () => {
   if(this.props.AuthStore.userName!=this.props.AuthStore.usernamevalidatedsuccess)
    this.props.AuthStore.onCheckUserName()
  }
  // Open Image Picker and Upload
  showImagePicker = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      const store = this.props.AuthStore
      this.sheet.openSheet().then(image => {
        console.log("image", image)
        //Upload image to server using API
        store.setLoading(true)

        const param = { base64ImageData: image.data, folderPath: 'users', bucketName: Config.BUCKET }

        uploadImage(param).then(response => {
          console.log("response", response)

          store.setLoading(false)
          store.setUserImage(response.data.path)

        }).catch(error => {
          store.setLoading(false)
        })


      })
    }, 700);
  }

  
}

export default inject("AuthStore")(observer(Signup))

const styles = StyleSheet.create({
  bottomContainer: {
    marginLeft: metrics.dimen_30,
    marginRight: metrics.dimen_30,
  },
  backContainer: {
     marginLeft:metrics.dimen_4,
    marginTop: Platform.OS === 'android' ? metrics.dimen_20 : metrics.dimen_4,
    width: metrics.widthSize(132),
    aspectRatio: 1,
  },
  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.aspectRatioHeight(138),
    backgroundColor: colors.transparentBlack,
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_10,
  },
  viewSignupType: {
    borderRadius: metrics.aspectRatioHeight(69),
    //height: metrics.aspectRatioHeight(138),
    // width: 160,
    maxWidth: "100%",
    backgroundColor: colors.transparentBlack,
    padding: metrics.dimen_5,
    marginBottom: metrics.dimen_10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  viewSelectedType: {
    borderRadius: metrics.aspectRatioHeight(45),
    height: metrics.aspectRatioHeight(90),
    paddingHorizontal: metrics.dimen_14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'

  },
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    marginBottom: metrics.dimen_20,
    color: 'white'
  },
  textSelectedType: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: colors.app_black
  },
  buttonStyle: {
    borderRadius: metrics.dimen_4,
    width: '100%',
    height: metrics.aspectRatioHeight(138),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: metrics.dimen_20,
    marginBottom:metrics.dimen_40

  },
  signUpTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: colors.app_black
  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.white
  },
  errorTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_RedColor,
    marginTop: -metrics.dimen_5,
    marginBottom: metrics.dimen_5
  },
  showHidePasswordIcon: {
    position: 'absolute',
    paddingHorizontal: metrics.widthSize(30),
    right: metrics.dimen_1,
    height: metrics.aspectRatioHeight(138),
    justifyContent: 'center',
    marginVertical: metrics.dimen_10,
    // paddingVertical:metrics.dimen_30,
  },
  profilePictureView: {
    borderRadius: metrics.widthSize(144),
    height: metrics.widthSize(288),
    width: metrics.widthSize(288),
    backgroundColor: colors.transparentBlack,
    marginBottom: metrics.dimen_18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  profilePictureViewSocialLoginCase: {
    borderRadius: metrics.widthSize(144),
    height: metrics.widthSize(288),
    width: metrics.widthSize(288),
    backgroundColor: colors.transparentBlack,
    marginBottom: metrics.dimen_18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:metrics.dimen_150
  },
  imageCamera: {
    tintColor: '#9F9A99',
    height: metrics.widthSize(132),
    width: metrics.widthSize(132),
  },

  imagestyle: {
    height: metrics.widthSize(288),
    width: metrics.widthSize(288),
    borderRadius: metrics.widthSize(144)
  }

})