import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import images from '../../../Themes/Images';
import Loader from '../../../SupportingFIles/Loader';
import { strings } from '../../../Locales/i18';
import { commonStyles ,SignupUserTypes} from '../../../SupportingFIles/Constants';
import { fbLogin, showAlert } from '../../../SupportingFIles/Utills';
import appleAuth, {
  AppleAuthRequestOperation, AppleAuthRequestScope, AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { color } from '../../../../__mocks__/react-native-reanimated/mock';
import colors from '../../../Themes/Colors';

class SplashVideo extends Component {


  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.AuthStore.setSignupSuccess(false)
      this.props.AuthStore.setUserNameSet(true)
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    });
    this.props.navigation.setOptions({
      gestureEnabled: false,
      swipeEnabled: false
    }
    )
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  render() {

    return (
      <View>

        <Loader loading={this.props.AuthStore.isLoading} />

        <Image source={images.backgroundImage} style={{ width: '100%', height: '100%' }} />
        <View style={styles.buttonContainer}>

          {/* <TouchableOpacity style={[styles.buttonStyle, styles.facebookButton]}
              onPress={() => this.doFacebookLogin()}
            >
              <Image source={images.facebookWhiteIcon} style={{ tintColor: 'white', marginRight: metrics.dimen_12 }} />
              <Text style={{ ...commonStyles.LatoBold_14, color: 'white' }}>{strings('Login_With_Facebook')}</Text>
          </TouchableOpacity> */}

          {Platform.OS === "ios" && <TouchableOpacity style={[styles.buttonStyle, styles.appleButton]}
            onPress={() => this.doAppleLogin()}
          >
            {/* <Image source={images.AppleIcon} style={{tintColor: 'white', position: 'absolute', left: metrics.dimen_24}}/> */}
            <Text style={{ ...commonStyles.LatoBold_18, color: 'white' }}>{strings('Login_with_apple')}</Text>
          </TouchableOpacity>}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <TouchableOpacity style={styles.buttonStyle}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Text style={styles.loginTextStyle}>{strings('Signin')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}
              onPress={() => this.openSignup()}
            >
              <Text style={styles.loginTextStyle}>{strings('Signup').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>

         
          <View style={styles.viewHelpdesk}>
            <TouchableOpacity style={{ flexDirection: 'row',  height: metrics.aspectRatioHeight(55)}}
              onPress={() => this.props.navigation.navigate('HelpStackScreen')}
            >
              <Image source={images.Helpdesk} style={{ marginRight: metrics.dimen_6 }} />
              <Text style={[styles.loginTextStyle, { color: 'white' }]}>{strings('Support').toUpperCase()}</Text>    
            </TouchableOpacity>
          </View>
          <View style={styles.viewHelpdesk}>
            <TouchableOpacity style={{ flexDirection: 'row',  height: metrics.aspectRatioHeight(55)}}
               onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'TabStack' }],
                });
                // this.props.navigation.navigate('TabStack')
    
              }
            }
            >
            
              <Text style={[styles.loginTextStyle, { color: 'white' }]}>{strings('Skip').toUpperCase()}</Text> 
              <Image source={images.rightArrowIcon} style={{tintColor:colors.white,marginRight:-metrics.dimen_8, width:metrics.dimen_12 ,height:metrics.dimen_12,marginTop:metrics.dimen_2}} />
              <Image source={images.rightArrowIcon} style={{tintColor:colors.white,width:metrics.dimen_12 ,height:metrics.dimen_12,marginTop:metrics.dimen_2 ,marginLeft:metrics.dimen_1  }} />   
            </TouchableOpacity>
          </View>
          </View>
        </View>
        {/* {!userNameSet  && this.onUserName()} */}
        {/* <TouchableOpacity style={styles.skipContainer}
          onPress={() => {
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: 'TabStack' }],
            });

          }

        
          }
        >
          <Text>{strings('Skip')}</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
openSignup()
{
  this.props.AuthStore.setUserSignupType(SignupUserTypes.Influencer)
  this.props.AuthStore.setsocialsignuptype("")
  this.props.AuthStore.setsocialsignupid("")
  this.props.navigation.navigate('Signup')
}
  doFacebookLogin = async () => {

    const callback = (error, result) => {
      console.log('result:', result)
      if (error) {
        this.props.AuthStore.setLoading(false)
        showAlert('', JSON.stringify(error))
      } else {
        this.props.AuthStore.setLoading(true)
        this.props.AuthStore.setNavigation(this.props.navigation)
        this.props.AuthStore.setEmail(result.email?result.email:'')
        this.props.AuthStore.setFirstName(result.first_name?result.first_name:'')
        this.props.AuthStore.setLastName(result.last_name?result.last_name:'')
        this.props.AuthStore.setUserImage(result.picture?result.picture.data.url:'')
        this.props.AuthStore.setsocialsignupid(result.id?result.id:'')

        
        this.props.AuthStore.doFacebookLogin()
      }
    }
    await fbLogin(callback)
  }

  doAppleLogin = async () => {

    this.props.AuthStore.setNavigation(this.props.navigation)
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      }).then(async (data) => {
        let Profile = { "first": data.fullName.givenName, "last": data.fullName.familyName, }
        this.props.AuthStore.doAppleLogin(data.email, data.user, Profile)
        this.props.AuthStore.setEmail(data.email?data.email:'')
        this.props.AuthStore.setFirstName(data.fullName.givenName?data.fullName.givenName:'')
        this.props.AuthStore.setLastName(data.fullName.familyName?data.fullName.familyName:'')
        this.props.AuthStore.setsocialsignupid(data.user?data.user:'')
        const credentialState = await appleAuth.getCredentialStateForUser(data.user)
        if (credentialState === appleAuthRequestResponse.AUTHORIZED) {
          return true
        }

      })
    } catch (error) {
      // console.log('error',error)
      return false
    }
  }

  onAppleLogout = async () => {
    // performs logout request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGOUT,
    });

    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user credential's have been revoked
    return (credentialState === AppleAuthCredentialState.REVOKED)
    // if (credentialState === AppleAuthCredentialState.REVOKED) {
    //   return true
    // }else{
    //     return false
    // }
  }
  onUserName = () => {
    setTimeout(() => {
      this.props.navigation.navigate('UserName')
    }, 500);
  }
}
export default inject("AuthStore")(observer(SplashVideo))

const styles = StyleSheet.create({
  backgroudImage: {
    width: metrics.width,
    height: metrics.height,
  },
  buttonContainer: {
    left: metrics.dimen_24,
    right: metrics.dimen_24,
    bottom: metrics.dimen_30,
    position: 'absolute',
  },
  buttonStyle: {
    borderRadius: metrics.dimen_4,
    flex: 0.47,
    height: metrics.aspectRatioHeight(138),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  loginTextStyle: {
    fontFamily: metrics.Lato,
    fontWeight: metrics.LatoRegular,
    fontSize: metrics.text_normal
  },
  skipContainer: {
    right: metrics.dimen_30,
    top: metrics.dimen_50,
    position: 'absolute',
    height: metrics.aspectRatioHeight(90),
    width: metrics.widthSize(220),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  facebookButton: {
    marginBottom: metrics.dimen_12,
    backgroundColor: 'rgba(66, 103, 178, 1)',
    flexDirection: 'row',
  },
  appleButton: {
    marginBottom: metrics.dimen_27,
    backgroundColor: '#000000',

  },
  viewHelpdesk:
  {
   
    marginTop: metrics.dimen_25,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignContent: 'center', 
    alignItems: 'center', 
  }
})