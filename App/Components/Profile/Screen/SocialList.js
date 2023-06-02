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
  FlatList,
  Platform
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonStyles, instainfo } from '../../../SupportingFIles/Constants';
import { fnum, showAlert, fbLogin } from '../../../SupportingFIles/Utills';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from '@react-native-community/cookies';
import { getInstaUsername } from '../../../API/Profile/User/ApiProfile';

class SocialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
      token: '',

      SocialMediaSelectArray: [
        {
          type: 'tiktok',
          image: images.tictocSocial,
          isSelected: false,
        },
        {
          type: 'youtube',
          image: images.youtubeSocial,
          isSelected: false,
        },

        {
          type: 'twitter',
          image: images.twitterSocial,
          isSelected: false,
        },
        {
          type: 'linkedin',
          image: images.linkedinSocial,
          isSelected: false,
        },
        {
          type: 'clubhouse',
          image: images.clubhouseSocial,
          isSelected: false,
        },

        {
          type: 'twitch',
          image: images.twitchSocial,
          isSelected: false,
        },
      ],
    };
    context = this;
  }

  setIgToken = (data) => {
    this.setState({ token: data.access_token });
    this.getInstausername(data.access_token);
  };

  updateinstaperpost(perpost) {
    this.props.MyProfileStore.setinstaperpost(perpost);
    this.props.MyProfileStore.setupdatestatus(true);
  }

  updatesetfacebookperpost(perpost) {
    this.props.MyProfileStore.setfacebookperpost(perpost);
    this.props.MyProfileStore.setupdatestatus(true);
  }

  onClear() {
    CookieManager.clearAll(true).then((res) => {
      this.setState({ token: null });
    });
  }

  componentDidMount() {
    this.onClear();
  }

  componentWillMount() {
    //this.props.MyProfileStore.getInterestList()
  }
  componentWillUnmount() {
    this.props.MyProfileStore.setUserExist(false);
    //this.props.MyProfileStore.setFollowersCount('0')
  }
  updateProfile = () => {
    this.props.MyProfileStore.setNavigation(this.props.navigation);

    this.props.MyProfileStore.updateUserProfile();
  };

  getInstausername = (userName) => {
    this.props.MyProfileStore.setIsLoading(true);
    getInstaUsername(userName)
      .then((response) => {
        
        const { data } = response;
        
        if (data) {
          this.props.MyProfileStore.setIsLoading(false);
          this.props.MyProfileStore.setInstaUserName(data.username);
          this.props.MyProfileStore.setupdatestatus(true);
          this.props.MyProfileStore.validateInstaUserName();
          // this.bottomSheet.open()
        } else {
          this.props.MyProfileStore.setIsLoading(false);
        }
      })
      .catch((error) => {
        this.props.MyProfileStore.setIsLoading(false);

        showAlert('', strings('SomethingWentWrong'));
      });
  };
  render() {
    const store = this.props.MyProfileStore;
    const {
      instaperpost,
      facebookperpost,
      instaUserName,
      followersCount,
      userExist,
      facebookUsername,
      isLoading,
      tiktokUrl,
      youtubeUrl,
      twitterUrl,
      linkedinUrl,
      clubhouseUrl,
      twitchUrl,
    } = store;
    const isFromApplyJob =
      this.props.routeParams !== undefined
        ? this.props.routeParams.isFromApplyJob
        : false;

    console.log('instaperpost==', instaperpost,);
    console.log('instaperUsername==', instaUserName);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={isLoading} />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: metrics.dimen_25,
              marginVertical: metrics.dimen_10,
              marginTop: metrics.dimen_20,
            }}>
            <TouchableOpacity
              onPress={() =>
                // this.props.navigation.navigate('Social', {
                //   Type: 'Insta',
                //   isFromApplyJob: isFromApplyJob,
                // })
               
                this.props.navigation.navigate('SocialProfileSetup', {
                  title: 'Instagram',
                })
              }>
              <View
                style={[
                  styles.campaignViewStyle,
                  styles.insatgramUserNameText,
                  isFromApplyJob &&
                  (instaUserName.length === 0 || instaperpost == 0) &&
                  styles.emptyInputStyle,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: metrics.dimen_10,
                    marginTop: 2,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.instaIcon}
                    style={{ width: metrics.dimen_22, height: metrics.dimen_22 }}
                  />
                  {/* <Text style={{ ...commonStyles.LatoSemiBold_Normal, color: colors.app_black, marginLeft: metrics.dimen_5 }}>{instaUserName.length > 0 ? "@" + instaUserName : strings('Link_Now')}</Text> */}
                  <Text
                    style={{
                      ...commonStyles.LatoSemiBold_Normal,
                      color: colors.app_black,
                      marginLeft: metrics.dimen_5,
                    }}>
                    {'Instagram'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {instaUserName.length > 0 && (
                    <Image
                      source={images.shorlisted}
                      style={{
                        height: metrics.dimen_15,
                        width: metrics.dimen_18,
                        marginRight: metrics.dimen_15,
                      }}
                    />
                  )}
                  <Image
                    source={images.rightArrowIcon}
                    style={{
                      height: metrics.dimen_15,
                      width: metrics.dimen_15,
                      tintColor: colors.app_black,
                      marginRight: metrics.dimen_10,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: metrics.dimen_25,
              marginVertical: metrics.dimen_10,
            }}>
            <TouchableOpacity
              onPress={() =>
                // this.props.navigation.navigate('Social', {
                //   Type: 'Fb',
                //   isFromApplyJob: isFromApplyJob,
                // })
                this.props.navigation.navigate('SocialProfileSetup', {
                  title: 'Facebook',
                })
              }>
              <View
                style={[
                  styles.campaignViewStyle,
                  styles.insatgramUserNameText,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: metrics.dimen_10,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.facebookLogo}
                    style={{ width: metrics.dimen_22, height: metrics.dimen_22 }}
                  />
                  <Text
                    style={{
                      ...commonStyles.LatoSemiBold_Normal,
                      color: colors.app_black,
                      marginLeft: metrics.dimen_5,
                    }}>
                    {'Facebook'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  {facebookUsername.length > 0 && (
                    <Image
                      source={images.shorlisted}
                      style={{
                        height: metrics.dimen_15,
                        width: metrics.dimen_18,
                        marginRight: metrics.dimen_15,
                      }}
                    />
                  )}
                  <Image
                    source={images.rightArrowIcon}
                    style={{
                      height: metrics.dimen_15,
                      width: metrics.dimen_15,
                      tintColor: colors.app_black,
                      marginRight: metrics.dimen_10,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{
              marginBottom: metrics.dimen_10,
              marginHorizontal: metrics.dimen_10,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'handled'}
            data={this.state.SocialMediaSelectArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => this.renderSociallist(item, index)}
          />

          <View style={{ height: metrics.dimen_40 }}></View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  renderSociallist = (item, index) => {
    const store = this.props.MyProfileStore;
    const {
      tiktokUrl,
      youtubeUrl,
      twitterUrl,
      linkedinUrl,
      clubhouseUrl,
      twitchUrl,
    } = store;
    console.log(
      'tiktokUrl,youtubeUrl,twitterUrl,linkedinUrl,clubhouseUrl,twitchUrl',
      tiktokUrl,
      youtubeUrl,
      twitterUrl,
      linkedinUrl,
      clubhouseUrl,
      twitchUrl,
    );

    return (
      <TouchableOpacity
        style={{
          marginHorizontal: metrics.dimen_15,
          marginVertical: metrics.dimen_10,
        }}
        onPress={() =>
          this.props.navigation.navigate('SocialProfileSetup', {
            title: item.type,
          })
        }>
        <View style={[styles.campaignViewStyle, styles.insatgramUserNameText]}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: metrics.dimen_10,
              marginTop: 2,
              alignItems: 'center',
            }}>
            <Image
              source={item.image}
              style={{ width: metrics.dimen_22, height: metrics.dimen_22 }}
            />
           {item.type=='youtube'?
            <Text
            style={{
              ...commonStyles.LatoSemiBold_Normal,
              color: colors.app_black,
              marginLeft: metrics.dimen_5,
            }}>
            YouTube
          </Text>
           :
            <Text
              style={{
                ...commonStyles.LatoSemiBold_Normal,
                color: colors.app_black,
                marginLeft: metrics.dimen_5,
                textTransform: 'capitalize',
              }}>
              {item.type}
            </Text>}
          </View>

          <View style={{ flexDirection: 'row' }}>
            {item.type === 'tiktok' && tiktokUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}
            {item.type === 'youtube' && youtubeUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}
            {item.type === 'twitter' && twitterUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}
            {item.type === 'linkedin' && linkedinUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}
            {item.type === 'clubhouse' && clubhouseUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}
            {item.type === 'twitch' && twitchUrl.length > 0 && (
              <Image
                source={images.shorlisted}
                style={{
                  height: metrics.dimen_15,
                  width: metrics.dimen_18,
                  marginRight: metrics.dimen_15,
                }}
              />
            )}

            <Image
              source={images.rightArrowIcon}
              style={{
                height: metrics.dimen_15,
                width: metrics.dimen_15,
                tintColor: colors.app_black,
                marginRight: metrics.dimen_10,
              }}
            />
          </View>
          {/* <Image source={images.rightArrowIcon} style={{height:metrics.dimen_15,width:metrics.dimen_15, tintColor: colors.app_black,marginRight:metrics.dimen_10}} /> */}
        </View>
      </TouchableOpacity>
    );
  };
}
export default inject('MyProfileStore', 'AuthStore')(observer(SocialList));

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
    fontFamily: metrics.Lato_SemiBold,
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
  campaignViewStyle: {
    backgroundColor: 'rgba(235, 238, 241, 1)',
    borderColor: 'rgba(235, 238, 241, 1)',
    borderWidth: metrics.dimen_1,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_46,
    alignItems: 'center',
    flexDirection: 'row',
  },
});