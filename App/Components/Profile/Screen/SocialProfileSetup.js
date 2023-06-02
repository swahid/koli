import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonStyles, instainfo } from '../../../SupportingFIles/Constants';

import { gettUserData } from '../../../SupportingFIles/Utills';

class SocialProfileSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
      token: '',
      channelurl: '',
      channelfollower: '',
      pricePerPost:'',
      channelurlValidation: false,
      channelFollowerValidation: false,
      pricePerPostValidation:false,
      unlinkurl: false,
    };
    context = this;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ ...commonStyles.backButtonContainercampaign }}
          onPress={() => this.props.navigation.goBack()}>
          <Image
            style={{ tintColor: colors.app_black }}
            source={images.backImage}
          />
        </TouchableOpacity>
      ),

      headerTitle: () => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            color: '#1A1E24',
          }}>
          <Text
            style={{
              fontFamily: metrics.Lato_Bold,
              fontSize: metrics.text_16,
              width: metrics.widthSize(700),
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
            numberOfLines={1}>
            {this.props.route.params.title}
          </Text>
        </View>
      ),
    });
    this.props.navigation.addListener('focus', () => {
      this.resetUserData();
    });

    const store = this.props.MyProfileStore;
    console.log(this.props.route.params.title)
    if (this.props.route.params.title === 'Instagram') {
    
      this.setState({ channelurl: store.instaUserName });
      this.setState({ channelfollower: store.instaperpost, });
    
      if (store.instaUserName !== '' && store.instaperpost !== '') {
        this.setState({ unlinkurl: true });
      }
    } 
    else if (this.props.route.params.title === 'Facebook') {
      this.setState({ channelurl: store.facebookUsername });
      console.log(store)
      this.setState({ channelfollower: store.facebookperpost });
      if (store.facebookUsername !== '' && store.facebookperpost !== '') {
        this.setState({ unlinkurl: true });
      }
    } 
    else if (this.props.route.params.title === 'tiktok') {
      this.setState({ channelurl: store.tiktokUrl });
      this.setState({ channelfollower: store.tiktokFollower ,
        // pricePerPost:store.tiktokPerPost
      });
      if (store.tiktokUrl !== '' && store.tiktokFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    } else if (this.props.route.params.title === 'youtube') {
      this.setState({ channelurl: store.youtubeUrl });
      console.log(store.youtubePerPost)
      this.setState({ channelfollower: store.youtubFollower,
        // pricePerPost:store.youtubePerPost
       });
      if (store.youtubeUrl !== '' && store.youtubFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    } else if (this.props.route.params.title === 'twitter') {
      this.setState({ channelurl: store.twitterUrl });
      this.setState({ channelfollower: store.twitterFollower ,
        // pricePerPost:store.twitterPerPost
      });
      if (store.twitterUrl !== '' && store.twitterFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    } else if (this.props.route.params.title === 'linkedin') {
      this.setState({ channelurl: store.linkedinUrl });
      this.setState({ channelfollower: store.linkedinFollower ,
        // pricePerPost:store.linkedinPerPost
      });
      if (store.linkedinUrl !== '' && store.linkedinFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    } else if (this.props.route.params.title === 'clubhouse') {
      this.setState({ channelurl: store.clubhouseUrl });
      this.setState({ channelfollower: store.clubhouseFollower ,
        // pricePerPost:store.clubhousePerPost
      });
      if (store.clubhouseUrl !== '' && store.clubhouseFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    } else if (this.props.route.params.title === 'twitch') {
      this.setState({ channelurl: store.twitchUrl });
      this.setState({ channelfollower: store.twitchFollower 
        // ,pricePerPost:store.twitchPerPost
      });
      if (store.twitchUrl !== '' && store.twitchFollower !== '') {
        this.setState({ unlinkurl: true });
      }
    }
  }

  updateProfile = () => {
    this.props.MyProfileStore.setNavigation(this.props.navigation);

    if (this.state.channelurl.trim() == '') {
      this.setState({ channelurlValidation: true });
    } else if (this.state.channelfollower.trim() == '') {
      this.setState({ channelFollowerValidation: true });
    }
    // else if(this.state.pricePerPost=="0"||this.state.pricePerPost==""){
    //   this.setState({ pricePerPostValidation: true });

    // }
    else {
      if (this.props.route.params.title === 'Instagram') {
        this.props.MyProfileStore.setInstaUserName(this.state.channelurl);
        this.props.MyProfileStore.setinstaperpost(this.state.channelfollower);
      }else  if (this.props.route.params.title === 'Facebook') {
        this.props.MyProfileStore.setFacebookUserName(this.state.channelurl);
        this.props.MyProfileStore.setfacebookperpost(this.state.channelfollower);
      }else if (this.props.route.params.title === 'tiktok') {
        this.props.MyProfileStore.settiktokUrl(this.state.channelurl);
        this.props.MyProfileStore.settiktokFollower(this.state.channelfollower);
        // this.props.MyProfileStore.settiktokperpost(this.state.pricePerPost)
      } else if (this.props.route.params.title === 'youtube') {
        this.props.MyProfileStore.setyoutubeUrl(this.state.channelurl);
        this.props.MyProfileStore.setyoutubFollower(this.state.channelfollower);
        // this.props.MyProfileStore.setyoutubeperpost(this.state.pricePerPost)

      } else if (this.props.route.params.title === 'twitter') {
        this.props.MyProfileStore.settwitterUrl(this.state.channelurl);
        this.props.MyProfileStore.settwitterFollower(
          this.state.channelfollower,
        );
        // this.props.MyProfileStore.settwitterperpost(this.state.pricePerPost)

      } else if (this.props.route.params.title === 'linkedin') {
        this.props.MyProfileStore.setlinkedinUrl(this.state.channelurl);
        this.props.MyProfileStore.setlinkedinFollower(
          this.state.channelfollower,
        );
        // this.props.MyProfileStore.setlinkedinperpost(this.state.pricePerPost)

      } else if (this.props.route.params.title === 'clubhouse') {
        this.props.MyProfileStore.setclubhouseUrl(this.state.channelurl);
        this.props.MyProfileStore.setclubhouseFollower(
          this.state.channelfollower,
        );
        // this.props.MyProfileStore.setclubhouseperpost(this.state.pricePerPost)

      } else if (this.props.route.params.title === 'twitch') {
        this.props.MyProfileStore.settwitchUrl(this.state.channelurl);
        this.props.MyProfileStore.settwitchFollower(this.state.channelfollower);
        // this.props.MyProfileStore.settwitchperpost(this.state.pricePerPost)

      }

      this.props.MyProfileStore.updateUserProfile();
    }
  };

  unlinkUrlfromProfile = () => {
    this.props.MyProfileStore.setNavigation(this.props.navigation);
    if (this.props.route.params.title === 'Instagram') {
      this.props.MyProfileStore.setInstaUserName('');
      this.props.MyProfileStore.setinstaperpost('');
    } else if (this.props.route.params.title === 'Facebook') {
      this.props.MyProfileStore.setFacebookUserName('');
      this.props.MyProfileStore.setfacebookperpost('');
    } 
    else if (this.props.route.params.title === 'tiktok') {
      this.props.MyProfileStore.settiktokUrl('');
      this.props.MyProfileStore.settiktokFollower('');
      // this.props.MyProfileStore.settiktokperpost('')
    } else if (this.props.route.params.title === 'youtube') {
      this.props.MyProfileStore.setyoutubeUrl('');
      this.props.MyProfileStore.setyoutubFollower('');
      // this.props.MyProfileStore.setyoutubeperpost('')
    } else if (this.props.route.params.title === 'twitter') {
      this.props.MyProfileStore.settwitterUrl('');
      this.props.MyProfileStore.settwitterFollower('');
      // this.props.MyProfileStore.settwitchperpost('')
    } else if (this.props.route.params.title === 'linkedin') {
      this.props.MyProfileStore.setlinkedinUrl('');
      this.props.MyProfileStore.setlinkedinFollower('');
      // this.props.MyProfileStore.setlinkedinperpost('')
    } else if (this.props.route.params.title === 'clubhouse') {
      this.props.MyProfileStore.setclubhouseUrl('');
      this.props.MyProfileStore.setclubhouseFollower('');
      // this.props.MyProfileStore.setclubhouseperpost('')
    } else if (this.props.route.params.title === 'twitch') {
      this.props.MyProfileStore.settwitchUrl('');
      this.props.MyProfileStore.settwitchFollower('');
      // this.props.MyProfileStore.settwitchperpost('')
    }

    this.props.MyProfileStore.updateUserProfile();
  };

  updatechannelurl(text) {
    this.setState({ channelurl: text, channelurlValidation: false });
  }
  updatechannelfollower(text) {
    this.setState({ channelfollower: text, channelFollowerValidation: false });
  }

  updatePricePerPost(text){
    this.setState({pricePerPost:text,pricePerPostValidation:false})
  }

  resetUserData = () => {
    
    const store = this.props.MyProfileStore;
    gettUserData().then((data) => {
      // store.setUserImage(data.avatarUrl)
      // store.setFirstName(data.first)
      // store.setLastName(data.last)
      // store.setBio(data.bio ? data.bio : "")
      // store.setCountry(data.country ? data.country : "")
      // store.setGender(data.gender)
      // store.setMyInterest(data.interests)
     
      // store.setinstaperpost("" + data.instaPerPost)
      console.log('dddddd',data)
      store.setfacebookperpost(data.facebookPerPost)
      store.setFacebookUserName(data.facebookUsername)
      store.setInstaUserName(data.instaUserName)
      store.setinstaperpost(data.instaPerPost)
      store.settiktokperpost(data.tiktokperpost)
      store.setyoutubeperpost(data.youtubePerPost)
      store.settwitterperpost(data.twitterPerPost)
      store.setlinkedinperpost(data.linkedinPerPost)
      store.setclubhouseperpost(data.clubhousePerPost)
      store.settwitchperpost(data.twitterPerPost)
      store.setyoutubeUrl(data.youtubelink ? data.youtubelink : '');
      store.setyoutubFollower(
        data.youtubefollower ? '' + data.youtubefollower : '',
      );
      store.settwitterUrl(data.twitterlink ? data.twitterlink : '');
      store.settwitterFollower(
        data.twitterfollower ? '' + data.twitterfollower : '',
      );
      store.settiktokUrl(data.tiktoklink ? data.tiktoklink : '');
      store.settiktokFollower(
        data.tiktokfollower ? '' + data.tiktokfollower : '',
      );
      store.setlinkedinUrl(data.linkedinlink ? data.linkedinlink : '');
      store.setlinkedinFollower(
        data.linkedinfollower ? '' + data.linkedinfollower : '',
      );
      store.setclubhouseUrl(data.clubhouselink ? data.clubhouselink : '');
      store.setclubhouseFollower(
        data.clubhousefollower ? '' + data.clubhousefollower : '',
      );
      store.settwitchUrl(data.twitchlink ? data.twitchlink : '');
      store.settwitchFollower(
        data.twitchfollower ? '' + data.twitchfollower : '',
      );
    });
  };
  showremoveAccountAlert = () => {
    setTimeout(() => {
      Alert.alert(
        strings('Remove_channel'),
        strings('Are_you_sure'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          {
            text: strings('Yes'),
            onPress: () => {
              this.unlinkUrlfromProfile();
            },
          },
        ],
        { cancelable: true },
      );
    }, 500);
  };
  render() {
    const store = this.props.MyProfileStore;
    const { isLoading } = store;
    const {title}  = this.props.route.params

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={isLoading} />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                ...styles.signUpTextStyle,
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_25,
              }}>
              {title=="Facebook"||title=="Instagram" ?strings('UserName'):strings('Channel')}
            </Text>

            <TouchableOpacity
              disabled={this.state.unlinkurl === false}
              style={{ alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                this.showremoveAccountAlert();
              }}>
              <Text
                style={{
                  ...styles.signUpTextStyle,
                  marginHorizontal: metrics.dimen_20,
                  marginTop: metrics.dimen_25,
                  color:
                    this.state.unlinkurl === true
                      ? colors.app_Blue
                      : 'rgba(176, 176, 176, 1)',
                }}>
                {strings('Unlink')}
              </Text>
              {/* <Image source={images.trashIcon} style={{ tintColor: this.state.channelurl!== "" ? colors.app_Blue : 'rgba(176, 176, 176, 1)' }} /> */}
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.textInputStyle]}
            placeholder={title=="Facebook"||title=="Instagram" ?strings('UserName'):strings('Enterurl')}
            placeholderTextColor="rgba(192,196,204,1)"
            value={this.state.channelurl}
            autoCompleteType="off"
            keyboardType="default"
            autoCorrect={false}
            onChangeText={(text) => this.updatechannelurl(text)}
          />
          {this.state.channelurlValidation ? (
            <Text
              style={{
                ...commonStyles.errorTextStyle,
                marginLeft: metrics.dimen_20,
                marginTop: 0,
              }}>
              {title=="Facebook"||title=="Instagram" ?strings('Enter_User_Name'):strings('enter_channel_url')}
            </Text>
          ) : null}

          <Text
            style={{
              ...styles.signUpTextStyle,
              marginHorizontal: metrics.dimen_20,
              marginTop: metrics.dimen_15,
            }}>
            {title=="Facebook"||title=="Instagram" ?strings('Price_Per_Post'):title==="youtube"?strings('Followersubscriber'):strings("Followers")}
          </Text>
          
          <TextInput
            style={[styles.textInputStyle]}
            placeholder={title=="Facebook"||title=="Instagram" ?"":strings('exampleEg')}
            placeholderTextColor="rgba(192,196,204,1)"
            keyboardType="number-pad"
            value={this.state.channelfollower}
            onChangeText={(text) => this.updatechannelfollower(text)}
            autoCompleteType="off"
            autoCorrect={false}
            maxLength={15}
          />
          {this.state.channelFollowerValidation ? (
            <Text
              style={{
                ...commonStyles.errorTextStyle,
                marginLeft: metrics.dimen_20,
                marginTop: 0,
              }}>
              {title=="Facebook"||title=="Instagram" ?strings('Price_Per_Post'):strings('enter_followers')}
            </Text>
          ) : null}
{/* {title=="Facebook"||title=="Instagram"?null:<>
        <Text
            style={{
              ...styles.signUpTextStyle,
              marginHorizontal: metrics.dimen_20,
              marginTop: metrics.dimen_15,
            }}>
            {strings('Price_Per_Post')}
          </Text>
          <TextInput
            style={[styles.textInputStyle]}
            placeholder={"0"}
            placeholderTextColor="rgba(192,196,204,1)"
            keyboardType="number-pad"
            value={this.state.pricePerPost}
            onChangeText={(text) => this.updatePricePerPost(text)}
            autoCompleteType="off"
            autoCorrect={false}
            maxLength={15}
          />

{this.state.pricePerPostValidation ? (
            <Text
              style={{
                ...commonStyles.errorTextStyle,
                marginLeft: metrics.dimen_20,
                marginTop: 0,
              }}>
              {strings('Price_Per_Post')}
            </Text>
          ) : null}
          </>} */}

          <TouchableOpacity
            style={{ ...styles.bottomViewStyle }}
            onPress={() => this.updateProfile()}>
            <Text style={[commonStyles.LatoBold_16, styles.submitButton]}>
              {strings('Save')}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
export default inject(
  'MyProfileStore',
  'AuthStore',
)(observer(SocialProfileSetup));

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
  },
  emptyInputStyle: {
    borderWidth: 0.5,
    borderColor: colors.app_RedColor,
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
    color: 'rgba(114, 114, 114, 1)',
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
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(62,62,62,70)',
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
    justifyContent: 'center',
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_6 : 0,
  },
  tabStyle: {},
  scrollStyle: {
    backgroundColor: 'white',

    // justifyContent: 'center',
  },
  tabBarTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  underlineStyle: {
    backgroundColor: colors.app_Blue,
  },
  insatgramUserNameText: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomViewStyle: {
    backgroundColor: colors.app_Blue,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    marginTop: metrics.dimen_30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: metrics.dimen_20,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  submitButton: {
    color: colors.white,
  },
  headerUserName: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(16),
    marginLeft: 10,
    textTransform: 'capitalize',
    width: Platform.OS === 'ios' ? metrics.dimen_130 : metrics.dimen_190,
    textAlignVertical: 'center',
  },
});