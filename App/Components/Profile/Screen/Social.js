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
import RBSheet from 'react-native-raw-bottom-sheet';
import { fnum, showAlert, fbLogin } from '../../../SupportingFIles/Utills';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from '@react-native-community/cookies';
import { getInstaUsername } from '../../../API/Profile/User/ApiProfile';

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
      token: '',
    };
    context = this;
  }

  setIgToken = (data) => {
    console.log('Insta login responce data', data);
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
            {this.props.route.params.Type === 'Insta'
              ? 'Instagram'
              : 'Facebook'}
          </Text>
        </View>
      ),
    });
    this.onClear();
  }

  componentWillMount() {
    // this.props.MyProfileStore.getInterestList()
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
        console.log('response==', response.data);
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
    } = store;
    const isFromApplyJob = this.props.route.params.isFromApplyJob;
    console.log('instaperpost', isFromApplyJob);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={isLoading} />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <InstagramLogin
            ref={(ref) => (this.instagramLogin = ref)}
            appId={instainfo.appId}
            appSecret={instainfo.appSecret}
            redirectUrl={instainfo.redirectUrl}
            scopes={['user_profile']}
            onLoginSuccess={this.setIgToken}
            onLoginFailure={(data) => console.warn(data)}
          />

          <Text
            style={{
              ...styles.signUpTextStyle,
              marginHorizontal: metrics.dimen_20,
              fontSize: metrics.text_xxl,
              marginTop: metrics.dimen_15,
            }}>
            {strings('Link_Social_Media')}
          </Text>

          {this.props.route.params.Type === 'Insta' ? (
            <Text
              style={{
                ...styles.signUpTextStyle,
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_15,
                fontWeight: metrics.LatoRegular,
              }}>
              {strings('Instagram')}
            </Text>
          ) : null}
          {this.props.route.params.Type === 'Insta' ? (
            <View
              style={{
                justifyContent: 'space-between',
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{ width: '80%' }}
                onPress={() => this.instagramLogin.show()}
                // onPress={() => this.bottomSheet.open()}
                disabled={userExist || instaUserName.length > 0}>
                <View
                  style={[
                    commonStyles.campaignViewStyle,
                    styles.insatgramUserNameText,
                    isFromApplyJob &&
                    instaUserName.length === 0 &&
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
                      style={{
                        width: metrics.dimen_20,
                        height: metrics.dimen_20,
                      }}
                    />
                    <Text
                      style={{
                        ...commonStyles.LatoSemiBold_Normal,
                        color: colors.app_black,
                        marginLeft: metrics.dimen_5,
                      }}>
                      {instaUserName.length > 0
                        ? '@' + instaUserName
                        : strings('Link_Now')}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...commonStyles.LatoSemiBold_Normal,
                      color: colors.app_black,
                      marginRight: metrics.dimen_10,
                    }}>
                    {followersCount === 0
                      ? ''
                      : fnum(followersCount) + ' ' + strings('Followers')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...commonStyles.campaignViewStyle,
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  disabled={instaUserName === 0}
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.showremoveAccountAlert('insta');
                  }}>
                  <Image
                    source={images.trashIcon}
                    style={{
                      tintColor:
                        userExist || instaUserName.length > 0
                          ? colors.app_Blue
                          : 'rgba(176, 176, 176, 1)',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {this.props.route.params.Type === 'Insta' ? (
            <Text
              style={{
                ...styles.signUpTextStyle,
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_15,
              }}>
              {strings('Price_Per_Post')}
            </Text>
          ) : null}

          {this.props.route.params.Type === 'Insta' ? (
            <TextInput
              style={[
                styles.textInputStyle,
                isFromApplyJob && instaperpost == 0 && styles.emptyInputStyle,
              ]}
              placeholder={strings('Enter_perpostgig')}
              placeholderTextColor="rgba(192,196,204,1)"
              keyboardType="number-pad"
              value={instaperpost === 0 ? '' : instaperpost}
              onChangeText={(text) => this.updateinstaperpost(text)}
              autoCompleteType="off"
              autoCorrect={false}
              maxLength={10}
            />
          ) : null}

          {this.props.route.params.Type === 'Fb' ? (
            <Text
              style={{
                ...styles.signUpTextStyle,
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_15,
                fontWeight: metrics.LatoRegular,
              }}>
              {strings('Facebook')}
            </Text>
          ) : null}
          {this.props.route.params.Type === 'Fb' ? (
            <View
              style={{
                justifyContent: 'space-between',
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{ width: '80%' }}
                onPress={() => this.doFacebookLogin()}
                disabled={facebookUsername.length > 0}>
                <View
                  style={{
                    ...commonStyles.campaignViewStyle,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: metrics.dimen_10,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.facebookLogo}
                      style={{
                        width: metrics.dimen_20,
                        height: metrics.dimen_20,
                      }}
                    />
                    <Text
                      style={{
                        ...commonStyles.LatoSemiBold_Normal,
                        color: colors.app_black,
                        marginLeft: metrics.dimen_5,
                      }}>
                      {facebookUsername.length > 0
                        ? '@' + facebookUsername
                        : strings('Link_Now')}
                    </Text>
                  </View>
                  {/* <Text style={{...commonStyles.LatoSemiBold_Normal, color: colors.app_black, marginRight: metrics.dimen_10}}>{followersCount == 0 ? "" :  fnum(followersCount) + " " + strings('Followers')}</Text> */}
                </View>
              </TouchableOpacity>
              <View
                style={{
                  ...commonStyles.campaignViewStyle,
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={facebookUsername.length === 0}
                  onPress={() => {
                    this.showremoveAccountAlert('facebook');
                  }}>
                  <Image
                    source={images.trashIcon}
                    style={{
                      tintColor:
                        facebookUsername.length > 0
                          ? colors.app_Blue
                          : 'rgba(176, 176, 176, 1)',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {this.props.route.params.Type === 'Fb' ? (
            <Text
              style={{
                ...styles.signUpTextStyle,
                marginHorizontal: metrics.dimen_20,
                marginTop: metrics.dimen_15,
              }}>
              {strings('Price_Per_Post')}
            </Text>
          ) : null}
          {this.props.route.params.Type === 'Fb' ? (
            <TextInput
              style={{ ...styles.textInputStyle }}
              placeholder={strings('Enter_perpostgig')}
              placeholderTextColor="rgba(192,196,204,1)"
              keyboardType="number-pad"
              value={facebookperpost === 0 ? '' : facebookperpost}
              onChangeText={(text) => this.updatesetfacebookperpost(text)}
              autoCompleteType="off"
              autoCorrect={false}
              maxLength={10}
            />
          ) : null}

          <View style={{ height: metrics.dimen_40 }}></View>
        </KeyboardAwareScrollView>
        {this.renderBottomSheet()}
      </View>
    );
  }
  doFacebookLogin = async () => {
    const callback = (error, result) => {
      if (error) {
        showAlert('', JSON.stringify(error));
      } else {
        this.props.MyProfileStore.setFacebookUserName(result.name);
        this.props.MyProfileStore.setupdatestatus(true);
      }
    };
    await fbLogin(callback);
  };
  renderBottomSheet() {
    const store = this.props.MyProfileStore;
    return (
      <RBSheet
        ref={(ref) => {
          this.bottomSheet = ref;
        }}
        height={180}
        duration={170}>
        <Text
          style={{
            ...commonStyles.LatoSemiBold_Normal,
            color: colors.app_black,
            marginTop: metrics.dimen_10,
            marginLeft: metrics.dimen_20,
          }}>
          {strings('UserName')}
        </Text>
        <TextInput
          style={{ ...styles.textInputStyle }}
          placeholder={strings('UserName')}
          value={store.instaUserName}
          onChangeText={(text) => store.setInstaUserName(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          style={{
            ...styles.addButtonStyle,
            margin: metrics.dimen_20,
            marginTop: metrics.dimen_5,
            borderColor: colors.app_Blue,
            height: metrics.dimen_46,
          }}
          onPress={() => this.validateInstaUsername()}
          loading={store.isLoading}
          labelStyle={{
            ...commonStyles.LatoBold_14,
            width: '80%',
            color: 'white',
          }}>
          {strings('Add')}
        </Button>
      </RBSheet>
    );
  }

  validateInstaUsername() {
    this.bottomSheet.close();
    this.props.MyProfileStore.validateInstaUserName();
  }
  renderInterest = (item) => {
    return <Text style={{ flex: 1 }}>{item}</Text>;
  };

  showremoveAccountAlert = (type) => {
    setTimeout(() => {
      Alert.alert(
        strings('Remove_account'),
        strings('Are_you_sure'),
        [
          { text: strings('Cancel'), onPress: () => console.log('No Pressed') },
          {
            text: strings('Yes'),
            onPress: () => {
              type === 'insta'
                ? this.removeinstaccount()
                : this.removefacebookaccount();
            },
          },
        ],
        { cancelable: true },
      );
    }, 500);
  };
  removeinstaccount() {
    const store = this.props.MyProfileStore;
    store.setInstaUserName('');
    store.setUserExist(false);
    store.setFollowersCount('');
    store.setupdatestatus(true);
  }
  removefacebookaccount() {
    const store = this.props.MyProfileStore;

    store.setFacebookUserName('');
    store.setupdatestatus(true);
  }
}
export default inject('MyProfileStore', 'AuthStore')(observer(Social));

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
});