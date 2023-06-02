import React, { Component, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import ReadMore from 'react-native-read-more-text';
import Slideshow from '../../../SupportingFIles/Slideshow';
import images from '../../../Themes/Images';
import { commonStyles } from '../../../SupportingFIles/Constants';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import { SearchBar } from 'react-native-elements';
import { join, online } from '../../../Socket/index';
import {
  getUserId,
  checkLocationPermission,
  convertCurrencybyCode,
  getGeoCode,
  getParams,
  getFeesAndCommission,
} from '../../../SupportingFIles/Utills';
import messaging from '@react-native-firebase/messaging';
import {
  getUnreadChatCountFromALlChat,
  doMigration,
  addMessage,
} from '../../../Socket/ChatDb/LocalChatDb';
import socket from '../../../Socket/socket';
import AwesomeAlert from 'react-native-awesome-alerts';
import Geolocation from 'react-native-geolocation-service';
import CampaignListSkeleton from '../../CommonComponents/CampaignListSkeleton';
import ChatIconHeader from '../../CommonComponents/ChatIconHeader';
import { useScrollToTop } from '@react-navigation/native';
// import analytics from '@react-native-firebase/analytics';
import { logEvent } from '../../../API/Analytics/Firebase';
import RBSheet from 'react-native-raw-bottom-sheet';
import dynamicLinks from '@react-native-firebase/dynamic-links';

var context = null;
import Moment from 'moment';
const formatCurrency = new Intl.NumberFormat('en-US');

@inject('CompaignsStore', 'AuthStore', 'ChatStore', 'NotificationStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({ notiCount: 5 });
    this.state = {
      timer: null,
      searchvisible: false,
      backpagefalse: false,
      url: '',

      initialArr: [
        {
          id: 1,
          color: colors.app_Blue,
          text: 'Loading...',
        },
        {
          id: 2,
          color: 'red',
          text: 'Loading...',
        },
      ],
      selectedItem: null,
    };
    context = this;
    this._renderTruncatedFooter = this._renderTruncatedFooter.bind(this);
    this._renderRevealedFooter = this._renderRevealedFooter.bind(this);
  }

  handleDynamicLink = (link) => {
    const params = getParams(link);

    console.log('params===', params);
    setTimeout(() => {
      this.props.AuthStore.navigationTabObj.navigate('CampaignDetails', {
        data: { id: params.params },
      });
    }, 100);
  };

  componentDidMount() {
    dynamicLinks()
      .getInitialLink()
      .then((url) => {
        console.warn('url=====', url);
      });
    this.unsubscribe = dynamicLinks().onLink((url) => {
      console.log('url=====2', url);
      this.handleDynamicLink(url.url);
    });

    this.props.NotificationStore.getAllNotificationList();
    this.props.AuthStore.setNavigationTabObj(this.props.navigation);
    this.updateUser();
    doMigration();
    this.setupUserLastSeen();
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.SearchOnOf()}>
            <Image source={images.search} />
          </TouchableOpacity>
          <ChatIconHeader navigation={this.props.navigation} />
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: metrics.dimen_20 }}
          onPress={() => this.OpenMyCampaign()}>
          <Image
            source={images.homeTabIcon}
            style={{ height: metrics.getH(20), width: metrics.getW(20) }}
          />
        </TouchableOpacity>
      ),
    });

    // this.props.navigation.goBack()
    this.props.navigation.addListener('focus', () => {
      const store = this.props.CompaignsStore;
      //  store.setupdatedsearch('')
      store.getAppliedCampaignsStatus();
    });

    this.props.CompaignsStore.getCampaigns();

    this.props.CompaignsStore.doupdatedeviceinfo();

    this.joinToChat();

    setTimeout(() => {
      this.getLocation();
    }, 10);
  }

  componentWillMount() { }

  setupUserLastSeen() {
    let timer = setInterval(this.updateUser, 300000);
    this.setState({ timer });
  }
  updateUser = () => {
    this.props.AuthStore.updateUserLastSeen();
  };
  getLocation = async () => {
    const hasLocationPermission = await checkLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const initialPosition = JSON.stringify(position);

          console.log('User Location: ', initialPosition);
          if (this.props.AuthStore.isLogin) {
            const userParamsToUpdate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.props.CompaignsStore.updateUserProfileData(userParamsToUpdate);
            if (this.props.AuthStore.userlocationcountry === '') {
              this.getUserCountryfromLocation(
                position.coords.latitude,
                position.coords.longitude,
              );
            }
          }
        },
        (error) => {
          this.setState({ loading: false });
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        },
      );
    });
  };

  getUserCountryfromLocation = async (latitude, longitude) => {
    location_response = await getGeoCode(latitude + ',' + longitude);
    if (location_response) {
      let country = location_response.results[0].address_components.find(
        (item) => item.types[0] === 'country',
      );
      if (country) {
        console.log('country.long_name==ss', country.long_name);
        this.props.AuthStore.setuserlocationcountry(country.long_name);
      }
    }
  };

  joinToChat = async () => {
    const token = await messaging().getToken();
    const chatStore = this.props.ChatStore;

    getUserId().then((userid) => {
      join({ userId: userid, fcmToken: token });
      online({ userId: userid });
    });
    socket.on('sendMessage', (message) => {
      if (message !== null) {
        getUserId().then((userid) => {
          console.warn('chtStore.isOnChatDetail:', chatStore.isOnChatDetail);
          if (
            parseInt(userid, 10) === parseInt(message.receiverId, 10) &&
            !chatStore.isOnChatDetail
          ) {
            console.warn('Response sendMessage:' + JSON.stringify(message));
            message.message.read = false;
          }
          addMessage(message, message.userId, message.receiverId, null);
          getUnreadChatCountFromALlChat().then((chats) => {
            console.log(
              'getUnreadChatCountFromALlChat sendMessage:',
              JSON.stringify(chats),
            );

            chatStore.unreadConversations = chats.length;
            chatStore.updateUnreadConversations(chats.length);
          });
        });
      }
    });

    socket.on('join', (message) => {
      this.getTotalUnreadMessages();
    });
    socket.on('online', (message) => {
      this.getTotalUnreadMessages();
    });
  };
  getTotalUnreadMessages = () => {
    getUnreadChatCountFromALlChat().then((chats) => {
      if (chats !== undefined && chats !== null) {
        this.props.ChatStore.updateUnreadConversations(chats.length);
      }
    });
  };
  componentDidUpdate(nextProps) {
    if (
      this.props.CompaignsStore.isLoading !== nextProps.CompaignsStore.isLoading
    ) {
      this.forceUpdate();
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.unsubscribe();
  }

  SearchOnOf() {
    this.props.navigation.navigate('CampaignSearch');
  }

  OpenMyCampaign() {
    this.props.AuthStore.isLogin
      ? this.props.navigation.navigate('MyCompaign', { screen: 'MyCompaign' })
      : this.props.navigation.navigate('AuthStack');
  }

  UpdateSerch = (search) => {
    const store = this.props.CompaignsStore;
    store.setupdatedsearch(search);
  };
  render() {
    const {
      updatedsearch,
      compaignsList,
      isLoading,
      isRefreshing,
      isAppUpdate,
      FilterApply,
      SortApply,
      sortcompaignsList,
      showMessageUpdateVersion,
    } = this.props.CompaignsStore;
    const store = this.props.CompaignsStore;
    console.log('compaignsList ===', compaignsList);
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <AwesomeAlert
          show={isAppUpdate}
          showProgress={false}
          title="Mandatory KOLI App Update"
          message="In order to continue, you must update KOLI app now. This should only take few moments."
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          //cancelText="UPDATE"
          confirmText="UPDATE"
          confirmButtonColor="#1658D3"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.handleAppUpdate();
          }}
        />
        <RBSheet
          ref={(ref) => {
            this.bottomSheet = ref;
          }}
          height={200}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}></RBSheet>
        {this.state.searchvisible && (
          <View
            style={{
              marginLeft: metrics.dimen_5,
              width: '96%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.white,
            }}>
            <SearchBar
              lightTheme
              platform="default"
              placeholder={strings('Search')}
              inputStyle={{
                fontFamily: metrics.Lato_Regular,
                fontSize: metrics.text_normal,
                height: 30,
              }}
              onChangeText={(text) => this.UpdateSerch(text)}
              value={updatedsearch}
              containerStyle={{
                width: '96%',
                backgroundColor: colors.white,
                borderBottomColor: 'transparent',
                borderTopColor: 'transparent',
                marginTop: -metrics.dimen_5,
                marginLeft: -15,
                marginRight: -15,
                marginBottom: -8,
              }}
              inputContainerStyle={{
                backgroundColor: colors.app_light_gray,
                shadowColor: colors.shadow_color,
                borderRadius: 50,
              }}
              onClear={() => {
                this.UpdateSerch('');
                this.props.CompaignsStore.getCampaigns();
              }}
              onEndEditing={() => {
                this.props.CompaignsStore.getCampaigns();
              }}
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: colors.app_dividercampaign,
            height: 0.5,
            width: '100%',
            // marginTop: metrics.dimen_4
          }}></View>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: metrics.dimen_20,
            height: metrics.dimen_48,

            backgroundColor: 'white',
            // elevation: metrics.dimen_1,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '50%',
              justifyContent: 'center',
              alignContent: 'center',
              height: '100%',
            }}
            onPress={() =>
              this.props.AuthStore.isLogin
                ? this.props.navigation.navigate('CreateCampaignForm', {
                  type: 'Add',
                })
                : this.props.navigation.navigate('AuthStack')
            }>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={images.plusIcon}
                style={{
                  marginRight: metrics.dimen_2,
                  height: metrics.dimen_14,
                  width: metrics.dimen_14,
                  marginTop: 2,
                }}
              />
              <Text style={[styles.headerTextStyle, { marginLeft: 10 }]}>
                {strings('Create_campaign')}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.app_dividercampaign,
              height: metrics.dimen_30,
              width: 1,
              marginTop: metrics.dimen_4,
            }}></View>

          <TouchableOpacity
            style={{
              width: '26%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            onPress={() => this.props.navigation.navigate('SortCampaign')}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.headerTextStyle,
                  { marginLeft: metrics.dimen_20 },
                ]}>
                {'Sort'}
              </Text>
              <Image
                source={images.sort_new}
                style={{
                  marginLeft: metrics.dimen_8,
                  height: metrics.dimen_15,
                  width: metrics.dimen_12,
                  marginTop: 2,
                }}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.app_dividercampaign,
              height: metrics.dimen_30,
              width: 1,
              marginTop: metrics.dimen_4,
            }}></View>

          <TouchableOpacity
            style={{
              width: '26%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            onPress={() => this.props.navigation.navigate('CampaignFilter')}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.headerTextStyle, { marginLeft: 7 }]}>
                {strings('Filter')}
              </Text>
              <Image
                source={images.filter_new}
                style={{
                  marginLeft: metrics.dimen_8,
                  height: metrics.dimen_14,
                  width: metrics.dimen_12,
                  alignSelf: 'center',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: colors.app_dividercampaign,
            height: 0.5,
            width: '100%',
            // marginTop: metrics.dimen_4
          }}></View>
        {isLoading && compaignsList.length === 0 && <CampaignListSkeleton />}

        {showMessageUpdateVersion ? (
          <TouchableOpacity onPress={() => this.handleAppUpdate()}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                height: metrics.dimen_40,
              }}>
              <Text
                style={{ fontFamily: metrics.Lato_Bold, color: colors.app_gray }}>
                {strings('New_versionAppleMessage')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        {compaignsList.length > 0 && (
          <FlatList
            // style={{ marginHorizontal: metrics.dimen_10 }}
            onScroll={this.handleScroll}
            ref={this.props.scrollRef}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={compaignsList}
            renderItem={({ item }) => this.renderCompaign(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={100}
            onEndReached={() => {
              if (store.lastFetchedCount >= store.offSetlength) {
                this.props.CompaignsStore.getCampaigns();
              }
            }}
            // ListHeaderComponent={this.renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this._onRefresh}
              />
            }
          />
        )}
        {!isLoading && compaignsList.length == 0 ? this.renderNoJobs() : null}
      </View>
    );
  }
  handleAppUpdate() {
    const linkToOpen =
      Platform.OS === 'ios'
        ? 'itms-apps://itunes.apple.com/us/app/id1458269685?mt=8.'
        : 'http://play.google.com/store/apps/details?id=co.koli.android';
    Linking.canOpenURL(linkToOpen).then(
      (supported) => {
        supported && Linking.openURL(linkToOpen);
      },
      (err) => console.log(err),
    );
  }
  _onRefresh = () => {
    this.props.CompaignsStore.setRefreshing(true);
    this.props.CompaignsStore.getCampaigns();
  };
  handleScroll = (event) => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  };
  renderHeader = () => {
    return (
      <View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.headerTextStyle}>{strings('Compaign')}</Text>
          <TouchableOpacity
            style={{ marginTop: metrics.dimen_10 }}
            onPress={() =>
              this.props.AuthStore.isLogin
                ? this.props.navigation.navigate('myCompaignStackScreen', {
                  screen: 'CreateCampaign1',
                  params: { type: 'Add' },
                })
                : //this.props.navigation.navigate('myCompaignStackScreen', { screen: 'CreateCampaignForm', params: { type: 'Add' }, }) :
                this.props.navigation.navigate('AuthStack')
            }>
            <Image
              source={images.plusIcon}
              style={{ marginRight: metrics.dimen_2 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderCompaign = (item) => {
    const campaignGallery = item.campaignGallery;
    let campaignImage = images.tagBlue;
    const campaignStore = this.props.CompaignsStore;

    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('CampaignDetails', { data: item });

            // this.props.navigation.navigate('CampaignDetails', { data: item })
            logEvent(item);
          }}>
          <Slideshow
            onPress={() => {
              this.props.navigation.navigate('CampaignDetails', { data: item });

              // this.props.navigation.navigate('CampaignDetails', { data: item })
              logEvent(item);
            }}
            //height={metrics.width}
            width={metrics.width}
            dataSource={
              campaignGallery.length > 0
                ? campaignGallery
                : [item.campaignImage]
            }
            indicatorColor={colors.white}
            indicatorSelectedColor={colors.indicaterselected}
            arrowSize={0}
            titleStyle={{ marginTop: 50, color: 'red' }}
            containerStyle={styles.imageContainer}
            placeholderStyle={styles.imageContainer}
          />

          <View style={{ marginHorizontal: metrics.dimen_13 }}>
            <Text
              style={{
                ...styles.postedOnText,
                marginTop: metrics.dimen_14,
                marginBottom: metrics.dimen_8,
              }}>
              {`${strings('Posted_On')}: ${Moment(item.createdAt).format(
                'MMM DD, YYYY',
              )}`}
            </Text>
            <Text
              style={{
                ...styles.boldText,
                fontSize: metrics.text_16,
                marginBottom: metrics.dimen_8,
              }}>
              {item.campaignTitle}
            </Text>
            <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
            // onReady={this._handleTextReady}
            >
              <Text style={{ ...styles.mediumText, marginTop: metrics.dimen_8 }}>
                {item.campaignDetails}
              </Text>
            </ReadMore>
            {/* <Text style = {{...styles.boldText,fontSize: metrics.getFontSize(14), color: 'rgba(22, 88, 211, 1)', marginTop: metrics.dimen_8, marginBottom: metrics.dimen_10}}>{item.campaignAmountCurrency + " " +formatCurrency.format(item.campaignAmount)}</Text> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: metrics.dimen_8,
              marginBottom: metrics.dimen_10,
              marginLeft: metrics.dimen_13,
            }}>
            {/* {item.campaignType !== "paid" && */}
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  backgroundColor:
                    item.campaignType === 'shoutout'
                      ? '#58DC72'
                      : item.campaignType === 'paid'
                        ? colors.app_Blue
                        : '#FFC107',
                  paddingHorizontal: metrics.dimen_13,
                  height: metrics.dimen_25,
                  borderRadius: metrics.dimen_13,
                  justifyContent: 'center',
                }}>
                {item.campaignType === 'shoutout' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {'Shoutout Exchange'}
                  </Text>
                )}
                {item.campaignType === 'paid' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Paid: ${convertCurrencybyCode(item.campaignAmountCurrency) +
                      formatCurrency.format(item.campaignAmount)
                      }`}
                  </Text>
                )}

                {item.campaignType === 'sponsored' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Sponsored`}
                  </Text>
                )}

                {item.campaignType === 'commissionBased' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Commission Based`}
                  </Text>
                )}

                {item.campaignType === 'eventsAppearence' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Events Appearance`}
                  </Text>
                )}
                {item.campaignType === 'photoshootVideo' && (
                  <Text
                    style={{
                      fontFamily: metrics.Lato_SemiBold,
                      fontSize: metrics.text_13,
                      color: colors.white,
                    }}>
                    {`Photo / Video Shoot`}
                  </Text>
                )}
              </View>
              {/* } */}
            </View>

            <View
              style={{
                alignItems: 'center',
                marginRight: -metrics.dimen_4,
                height: 25,
                justifyContent: 'center',
              }}>
              {item.campaignType === 'shoutout' && (
                <Text
                  style={[
                    styles.tagTextStyle,
                    { marginRight: metrics.dimen_15 },
                  ]}>
                  {this.returnShoutoutContent(item)}
                </Text>
              )}

              {item.campaignType !== 'shoutout' && (
                <Text
                  style={[
                    styles.tagTextStyle,
                    { marginRight: metrics.dimen_15 },
                  ]}>
                  {item.remarks.length > 0
                    ? `${item.remarks.length} ${strings('Applications')}`
                    : `${strings('New_Listing')}`}
                </Text>
              )}

              {/* </View> */}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  returnShoutoutContent = (item) => {
    if (item.profile !== undefined && item.remarks.length > 0) {
      return ` ${item.remarks.length} ${strings('Applications')}`;
    } else {
      return `${strings('New_Listing')}`;
    }
  };
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{
          ...styles.normalText,
          marginTop: metrics.dimen_5,
          color: 'rgba(22, 88, 211, 1)',
        }}
        onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{
          ...styles.normalText,
          marginTop: metrics.dimen_5,
          color: 'rgba(22, 88, 211, 1)',
        }}
        onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  };
  renderNoJobs() {
    const store = this.props.CompaignsStore;

    return (
      <View
        style={{
          alignItems: 'center',
          height: '70%',
          justifyContent: 'center',
          marginBottom: 100,
        }}>
        <Image source={images.Campaign} />
        <Text
          style={{ ...commonStyles.LatoBold_16, marginTop: -metrics.dimen_40 }}>
          {store.updatedsearch === ''
            ? store.FilterApply == true
              ? strings('No_Campaigns_available_matching_your_filters')
              : strings('No_Campaigns_Available')
            : strings('No_Campaigns_available_matching_your_search')}
        </Text>
      </View>
    );
  }

  updateAppNotice() {
    Alert.alert(
      'Update Available',
      'This version of the app is outdated. Please update app from the ' +
      (Platform.OS == 'ios' ? 'app store' : 'play store') +
      '.',
      [
        {
          text: 'Update Now',
          onPress: () => {
            if (Platform.OS == 'ios') {
              Linking.openURL(APP_STORE_LINK).catch((err) =>
                console.error('An error occurred', err),
              );
            } else {
              Linking.openURL(PLAY_STORE_LINK).catch((err) =>
                console.error('An error occurred', err),
              );
            }
          },
        },
      ],
    );
  }
  getFeesData = (campaignData) => {
    const campaignStore = this.props.CompaignsStore;
    const feesData = campaignStore.feesAndTransactionData;

    const offerAmount = parseFloat(campaignData.campaignAmount);
    const paymentFees =
      (offerAmount * parseFloat(feesData.paypalPercentFee)) / 100;
    const payoutFees =
      (offerAmount * parseFloat(feesData.paypalReleaseFee)) / 100;
    const total = paymentFees + payoutFees + feesData.paypalFixedFee;
    const koliCom = (offerAmount * parseFloat(feesData.koliPlateformFee)) / 100;
    this.setState(
      { payPalFees: total.toFixed(2), koliCommission: koliCom.toFixed(2) },
      () => {
        this.bottomSheet.open();
      },
    );
  };
}
export default function (props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Home {...props} scrollRef={ref} />;
}
export const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(61, 64, 70, 1)',
  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_black,
  },
  mediumText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(12),
    color: 'rgba(97, 97, 100, 1)',
  },
  boldText: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(61, 64, 70, 1)',
  },
  imageContainer: {
    width: metrics.width,
    height: metrics.width,
  },
  cellContainer: {
    flex: 1,
    marginBottom: metrics.dimen_8,
    backgroundColor: 'white',
  },
  requestButtonStyle: {
    backgroundColor: colors.white,
    height: metrics.dimen_32,
    paddingLeft: metrics.dimen_20,
    paddingRight: metrics.dimen_20,
    shadowColor: colors.app_gray,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    borderRadius: metrics.dimen_50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomViewStyle: {
    position: 'absolute',
    width: '100%',
    paddingTop: 40,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomViewSortStyle: {
    marginLeft: metrics.dimen_20,
  },
  textStyleNormalwhite: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_medium,
    marginLeft: metrics.dimen_5,
    marginTop: 0.5,
    color: 'rgba(114, 114, 114, 1)',
  },
  tagTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_13,
    color: '#7A818A',
    marginTop: -metrics.dimen_2,
    marginHorizontal: metrics.dimen_10,
  },
  tagTextStyleios: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    // alignContent: 'center',
    // alignItems: 'center',
    color: 'white',
    // alignSelf:'center',
    marginTop: metrics.widthSize(20),
    marginLeft: -10,
  },
  tagViewStyle: {
    //position: 'absolute',
    // top: metrics.dimen_5,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-around',
    width: '100%',
    marginRight: metrics.dimen_3,
  },
  lineStyle: {
    backgroundColor: colors.app_light_gray,
    opacity: 0.4,
  },
  postedOnText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: '#7A818A',
  },
  imageRibbon: {
    //width:Platform.OS === 'ios' ? metrics.dimen_150 : metrics.dimen_150,
    height: metrics.dimen_40,
  },

  viewUnreadCount: {
    // marginTop:metrics.dimen_12,
    right: 0,
    position: 'absolute',
    height: metrics.dimen_5,
    width: metrics.dimen_5,
    borderRadius: 2.5,
    borderWidth: 0.5,
    borderColor: colors.white,
    backgroundColor: colors.app_RedColor,
  },
  textUnreadCount: {
    color: colors.white,
    fontSize: metrics.text_small,
    // alignSelf: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
});