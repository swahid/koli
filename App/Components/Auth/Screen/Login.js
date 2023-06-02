import React, { Component } from 'react';
import { View, 
  Text, 
  Image, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
   KeyboardAvoidingView, 
   Platform, 
   SafeAreaView, 
   ImageBackground,
   TouchableWithoutFeedback,
   Keyboard
   } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import  {isAutoLoginEnabled,loginValues} from '../../../SupportingFIles/Constants'


class Login extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.resetFields()
    this.props.navigation.addListener('focus', () => {
      this.resetFields()
    });
  }

  resetFields() {
    this.props.AuthStore.deleteAllValidationError()
    this.props.AuthStore.setEmail(isAutoLoginEnabled ? loginValues.loginEmail : '')
    // if (!validateEmail(this.props.AuthStore.email)) {
    //   this.props.AuthStore.setEmail('')
    // }
    this.props.AuthStore.setResetSuccess(false)
    this.props.AuthStore.setPassword(isAutoLoginEnabled ? loginValues.loginPassword : '')
    this.props.AuthStore.setShowPassword(true)
    this.props.AuthStore.setLoading(false)

  }

  render() {

    const store = this.props.AuthStore
    const { email, password, showPassword, validationError, isLoading } = this.props.AuthStore
    return (

      <ImageBackground source={images.backgroundImage} style={{width: '100%', height: '100%' }} >
<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <SafeAreaView>
        <View style={{backgroundColor: 'rgba(52, 52, 52, 0.2)', marginLeft: metrics.dimen_20, height:metrics.dimen_35,width:metrics.dimen_35, borderRadius:metrics.dimen_5,    

}}>
          <TouchableOpacity style={styles.backContainer}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={images.backImage} style={{ tintColor: 'white' }} />
          </TouchableOpacity></View>
        </SafeAreaView>
        <View style={{ justifyContent: 'space-between', flex: 1 }}>
          <View></View>
          <KeyboardAvoidingView
            style={styles.bottomContainer}
            behavior="padding"

          >
            <Text style={{ ...styles.headerTextStyle, alignSelf: 'center' }}>{strings('WelcomeMessage')}</Text>
            <TextInput style={styles.textInputStyle}
              accessible
              accessibilityLabel="Email input box"
              accessibilityHint="Key in the email address"
              placeholder={strings('Email_Address')}
              value={email}
              placeholderTextColor={colors.transparentWhite}
              onChangeText={(text) => store.setEmail(text)}
              autoCorrect={false}
              autoCapitalize="none"
              autoCompleteType="off"
            />
            {validationError.emailError ? <Text style={styles.errorTextStyle}>{validationError.emailError}</Text> : null}

            <View>
              <TextInput style={styles.textInputStyle}
                accessible
                accessibilityLabel="Password input box"
                accessibilityHint="Key in the password"
                placeholder={strings('Password')}
                value={password}
                placeholderTextColor={colors.transparentWhite}
                onChangeText={(text) => store.setPassword(text)}
                secureTextEntry={showPassword}
                autoCapitalize="none"
                autoCompleteType="off"
                maxLength={15}
              />
              {validationError.passwordError ? <Text style={styles.errorTextStyle}>{validationError.passwordError}</Text> : null}
              <TouchableOpacity 
              style={styles.showHidePasswordIcon}
              accessible 
              accessibilityRole="button" 
              accessibilityLabel="Secure Password" 
              accessibilityHint="Show hide password" 
              onPress={() => store.setShowPassword(!showPassword)}
              >
                <Image source={showPassword ? images.hideIcon : images.showIcon} style={{ tintColor: colors.transparentWhite}} />
              </TouchableOpacity>
            </View>

            <Text style={{ ...styles.normalText, alignSelf: 'center', marginTop: metrics.dimen_13 }} 
            onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              {strings('ForgotPassword')}?
              </Text>

            <TouchableOpacity 
            style={{ ...styles.buttonStyle }} onPress={this.onLogin}
            accessible 
            accessibilityRole="button" 
            accessibilityLabel="Signin" 
            accessibilityHint="Navigates to the login screen"
            >
              <Text style={{ ...styles.signUpTextStyle }}>{strings('Signin')}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
      </TouchableWithoutFeedback>

      </ImageBackground>
    );
  }

 
  onLogin = () => {
    this.props.AuthStore.setNavigation(this.props.navigation)
    this.props.AuthStore.onLogin()
  }
}

export default inject("AuthStore")(observer(Login))


const styles = StyleSheet.create({
  bottomContainer: {
    marginLeft: metrics.dimen_30,
    marginRight: metrics.dimen_30,
  },
  backContainer: {
    marginLeft:metrics.dimen_4,
    marginTop: Platform.OS === 'android' ? metrics.dimen_20 : metrics.dimen_4,
    width:metrics.widthSize(132),
    aspectRatio:1,
  },
  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.aspectRatioHeight(144),
    backgroundColor: colors.transparentBlack,
    color: 'white',
    paddingHorizontal: metrics.dimen_10,
    marginTop: metrics.dimen_20,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
  },
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_large,
    marginBottom: metrics.dimen_20,
    color: 'white'
  },
  buttonStyle: {
    borderRadius: metrics.dimen_4,
    width: '100%',
    height: metrics.aspectRatioHeight(144),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: metrics.dimen_37,
    marginTop: metrics.dimen_30,
  },
  signUpTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: colors.app_black
  },
  normalText: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_medium,
    color: 'white'
  },
  errorTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_5,
    marginBottom: metrics.dimen_5
  },
  showHidePasswordIcon:{
    position: 'absolute', 
    right: metrics.dimen_1, 
    //paddingTop: metrics.dimen_20,
    marginTop: metrics.dimen_20,
    paddingHorizontal:metrics.widthSize(30),
    //height:'100%',
    justifyContent:'center' ,
    height: metrics.aspectRatioHeight(144),
  }

})