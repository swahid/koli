import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import {strings} from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
import messaging from '@react-native-firebase/messaging';
import {
  gettUserData,
  time_ago,
  check_time_seconds,
} from '../../../SupportingFIles/Utills';
import {getUnreadChatCountFromALlChat} from '../../../Socket/ChatDb/LocalChatDb';
import socket from '../../../Socket/socket';
import ChatIconHeader from '../../CommonComponents/ChatIconHeader';
import IGConnectView from '../../CommonComponents/IGConnectView';
import {useScrollToTop} from '@react-navigation/native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import SortInfluencer from '../Screen/SortInfluencer';
import ImageLoad from '../../../SupportingFIles/ImageLoad';
import {getInfluencerSortType} from '../../../SupportingFIles/Utills';
import {ScrollView} from 'react-native-gesture-handler';
var navigationObj = null;

@inject('InfluencerStore', 'AuthStore', 'ChatStore')
@observer
class Influencer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIgView: false,
      userLoginId: '',
      initialArr: Array.from({length: 40}, () =>
        Math.floor(Math.random() * 40),
      ),
      panelProps: {
        openLarge: false,
        isActive: false,
      },
    };
  }
  componentDidMount() {
    //this.props.AuthStore.setNotiCount(6)
    console.log('influencerrrrrrr');
    getInfluencerSortType().then((Sortby) => {
      if (Sortby === null) {
        console.log('influencerrrrrrr emptyyy');
        this.props.InfluencerStore.setSortby(3);
        this.fetchInfluencerData();
      } else {
        console.log('influencerrrrrrr datatttt');
        this.props.InfluencerStore.setSortby(Number(Sortby));
        this.fetchInfluencerData();
      }
    });

    const store = this.props.InfluencerStore;
    store.hasNextPage = 0;
    store.setInfluencerList(null);
    navigationObj = this.props.navigation;
    console.log('navigationObj:', navigationObj);
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: metrics.dimen_20, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('InfluencerSearch')}>
            <Image source={images.search} />
          </TouchableOpacity>

          <ChatIconHeader navigation={this.props.navigation} />
        </View>
      ),
    });
    this.props.navigation.addListener('focus', () => {
      gettUserData().then((userData) => {
        if (
          userData.instaUsername === '' ||
          userData.instaUsername === null ||
          userData.instaUsername === undefined
        ) {
          this.setState({showIgView: true, userLoginId: userData.ownerId});
        } else {
          this.setState({showIgView: false, userLoginId: userData.ownerId});
        }
      });
    });

    this.initiateMessageHandlers();
    this.props.navigation.setParams({
      scrollToTop: this.scrollToTop,
    });
  }
  onRefresh = () => {
    const store = this.props.InfluencerStore;
    store.hasNextPage = 0;
    store.setInfluencerList(null);
    this.fetchInfluencerData();
  };
  scrollToTop = () => {
    if (this.scrollView) {
      // Scroll to top of ScrollView. Syntax will vary for FlatList, et al
      this.scrollView.scrollTo({x: 0, y: 0, animated: false});
    }
  };
  getTotalUnreadMessages = () => {
    getUnreadChatCountFromALlChat().then((chats) => {
      console.log('getUnreadChatCountFromALlChat:', chats);
      this.props.ChatStore.updateUnreadConversations(chats.length);
    });
  };
  initiateMessageHandlers = () => {
    this.getTotalUnreadMessages();
    socket.on('sendMessage', (message) => {
      this.getTotalUnreadMessages();
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      if (remoteMessage.data.message !== undefined) {
        // this.props.AuthStore.navigationTabObj.navigate('ChatListing')
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          if (remoteMessage.data.message !== undefined) {
            // this.props.AuthStore.navigationTabObj.navigate('ChatListing')
          }
        }
      });
  };
  fetchInfluencerData() {
    const store = this.props.InfluencerStore;
    store.getInfluencerList();
  }
  removeIgConnectView = () => {
    this.setState({showIgView: false});
  };
  setLastSeenData = (item) => {
    //console.log("setLastSeenData:", item)
    if (item.lastSeen !== null) {
      var aDay = 24 * 60 * 60;

      if (check_time_seconds(new Date(new Date(item.lastSeen) - aDay)) > 600) {
        return `${time_ago(new Date(new Date(item.lastSeen) - aDay))} ago`;
      } else {
        return 'Online';
      }
    }
  };

  checkUrlMatches = (url) => {
    let url1 = new RegExp('//koli-media');

    if (url1.test(url)) {
      return true;
    } else {
      return false;
    }
    
  };

  render() {
    const store = this.props.InfluencerStore;

    //console.log("InfluencerList:", store.InfluencerList)

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <Loader loading={store.isLoading} /> */}
        {this.state.showIgView && (
          <IGConnectView
            navigation={this.props.navigation}
            removeIgConnectView={this.removeIgConnectView}
          />
        )}

       
        {!store.isLoading && (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={store.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
           
            ref={this.props.scrollRef}
            style={{flex: 1}}
            data={store.InfluencerList&& store.InfluencerList.length>0 ?store.InfluencerList.filter((it, index) => {
              console.log(it);
              let removeItem = this.checkUrlMatches(it.avatarUrl);
             
              if (removeItem == true) {
                return it;
              }
            }):[]}
            // columnWrapperStyle={{justifyContent: store.InfluencerList%3 == 2 ? 'flex-start' : 'space-between'}}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
              this.renderInfluencerItem(item, index)
            }
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            // ListHeaderComponent={this.renderHeader}

            onEndReachedThreshold={2}
            onEndReached={() => {
              console.log( '---->',!store.end_curser &&
                store.hasNextPage >= store.offSetlength &&
                !store.fetchingNextPageData)
              if (
                !store.end_curser &&
                store.hasNextPage >= store.offSetlength &&
                !store.fetchingNextPageData
              ) {
                this.props.InfluencerStore.getInfluencerNextPage();
              }
            }}
          />
        )}
        {!store.isLoading && (
          <View
            style={[
              styles.bottomViewStyle,
              {flexDirection: 'row', justifyContent: 'center'},
            ]}>
            <TouchableOpacity
              style={styles.requestButtonStyle}
              onPress={() => {
                this.props.InfluencerStore.setActionType('SORT');
                this.props.InfluencerStore.setShowInfluencerPopup(true);
                //this.props.navigation.navigate('SortInfluencer')
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image source={images.drawerIcon} />

                <Text style={[styles.textStyleNormalwhite]}>
                  {strings('Sort')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.requestButtonStyle, {marginLeft: '2%'}]}
              onPress={() => {
                this.props.InfluencerStore.setActionType('FILTER');
                this.props.InfluencerStore.setShowInfluencerPopup(true);
                //this.props.navigation.navigate('SortInfluencer')
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image source={images.drawerIcon} />

                <Text style={[styles.textStyleNormalwhite]}>
                  {strings('Filter')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {store.isLoading && (
          <FlatList
            ref={(ref) => {
              this.scrollView = ref;
            }}
            style={{flex: 1}}
            data={this.state.initialArr}
            // showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
              this.renderPlaceHolderView(item, index)
            }
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        <Modal visible={store.showInfluencerSortPopup} transparent={true}>
          <View
            style={{
              marginHorizontal: 0,
              marginVertical: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <SwipeablePanel
              closeOnTouchOutside={true}
              fullWidth={true}
              noBackgroundOpacity={true}
              {...this.state.panelProps}
              // openLarge={true}
              // style={{flex:1, height: metrics.dimen_200}}
              showCloseButton={false}
              onClose={() => this.closePanel()}
              onPressCloseButton={() => this.closePanel()}
              isActive={true}>
              <SortInfluencer
                navigation={this.props.navigation}
                // AuthStore={this.props.AuthStore}
                // SettingsStore={this.props.SettingsStore}
                // MyProfileStore={this.props.MyProfileStore}
                Sortby={this.props.InfluencerStore.Sortby}
                //userData={userData}
                //campaignData={campaignData}
                // amount={userData.offerStatus === 2 ? userData.offerAmount.toString() : this.state.amount}
                //amount={this.state.amount}
                closePanel={this.closePanel}
              />
            </SwipeablePanel>
          </View>
        </Modal>
      </View>
    );
  }
  closePanel = () => {
    this.props.InfluencerStore.setShowInfluencerPopup(false);
  };
  renderPlaceHolderView = () => {
    return (
      // <SkeletonPlaceholder>
      <View style={{flex: 1, flexDirection: 'column', margin: 0.3}}>
        <View style={styles.imageThumbnail}></View>
      </View>
      // </SkeletonPlaceholder>
    );
  };

  renderInfluencerItem = (item, index) => {
    // console.log('renderInfluencerItem:',item)
    const urlPic = item.avatarUrl;
    const lastSeen = this.setLastSeenData(item);
    var imageUrl =
      urlPic === null || urlPic === 'NA' || urlPic === ''
        ? images.KoliSquarePlaceholder
        : {uri: urlPic};
    return (
      <View
        style={{
          flexDirection: 'column',
          margin: 0.3,
          alignItems: 'flex-start',
        }}>
        <TouchableOpacity onPress={() => this.OpenUserProfile(item)}>
          {/* <Text>{index}</Text> */}
          <ImageLoad
            placeholderSource={images.userPlaceholder}
            placeholderStyle={styles.imageThumbnail}
            isShowActivity={false}
            style={styles.imageThumbnail}
            source={imageUrl}
          />
        </TouchableOpacity>
      </View>
    );
  };
  renderPlaceholder = () => {
    return (
      <Image source={images.userPlaceholder} style={styles.imagePlaceholder} />
    );
  };
  renderHeader = () => {
    return <Text style={styles.headerTextStyle}>{strings('Influencer')}</Text>;
  };

  OpenUserProfile(item) {
    console.log(item.ownerId)
    if (item.ownerId != this.state.userLoginId) {
      this.props.navigation.navigate('UserProfile', {UserData: item});
    } else {
      this.props.navigation.navigate('ProfileStackScreen');
    }
  }
}
export default function (props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Influencer {...props} scrollRef={ref} />;
}

const styles = StyleSheet.create({

  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    marginLeft: metrics.dimen_20,
    marginBottom: metrics.dimen_20,
    color: 'rgba(61, 64, 70, 1)',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: colors.disable_gray_color,
    width: (metrics.width - metrics.dimen_1) / 3,
    height: (metrics.width - metrics.dimen_1) / 3,
  },
  imagePlaceholder: {
    width: (metrics.width - metrics.dimen_1) / 3,
    height: (metrics.width - metrics.dimen_1) / 3,
    backgroundColor: colors.disable_gray_color,
  },
  bottomViewStyle: {
    position: 'absolute',
    width: '100%',
    paddingTop: 40,
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
  requestButtonStyle: {
    backgroundColor: colors.white,
    height: metrics.dimen_32,
    paddingLeft: metrics.dimen_20,
    paddingRight: metrics.dimen_20,
    shadowColor: colors.app_gray,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    borderRadius: metrics.dimen_50 / 2,
    justifyContent: 'center',
    elevation: Platform.OS == 'ios' ? metrics.dimen_4 : metrics.dimen_8,
    alignItems: 'center',
    marginBottom: 20,
  },
  textStyleNormalwhite: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    marginLeft: metrics.dimen_5,
    marginTop: 0.5,
    color: 'rgba(114, 114, 114, 1)',
    textTransform: 'uppercase',
  },
  textLastSeen: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(8),
    marginLeft: metrics.dimen_5,
    color: colors.white,
  },
  viewLastActive: {
    position: 'absolute',
    left: metrics.dimen_4,
    padding: metrics.dimen_4,
    bottom: metrics.dimen_4,
    height: 20,
    backgroundColor: 'rgba(45,45,45,0.6)',
    zIndex: 1,
    borderRadius: metrics.dimen_3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBullet: {
    width: metrics.dimen_4,
    height: metrics.dimen_4,
    marginLeft: metrics.dimen_4,
  },
});
