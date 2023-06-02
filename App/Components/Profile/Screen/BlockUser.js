import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import {strings} from '../../../Locales/i18';
import FastImage from 'react-native-fast-image';
import images from '../../../Themes/Images';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SearchBar} from 'react-native-elements';

class BlockUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchvisible: false,
      updatedsearch: true,
      BlockUserList: '',
      isLoadingFirstTime: true,
      initialArr: Array.from({length: 15}, () =>
        Math.floor(Math.random() * 15),
      ),
    };
  }

  SearchOnOf() {
    console.log('click');
    this.setState({
      searchvisible: this.state.searchvisible === false ? true : false,
    });
  }
  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();

    this.setState({updatedsearch: text});
    var filterdata = this.props.BlockUserStore.BlockUserList.filter(
      (obj) =>
        obj.profile.first.toLowerCase().includes(formattedQuery) ||
        obj.profile.last.toLowerCase().includes(formattedQuery),
    );
    this.props.BlockUserStore.setblockUserFilterList(filterdata);
  };

  componentDidMount() {
    const store = this.props.BlockUserStore;

    this.props.navigation.addListener('focus', () => {
      this.props.navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => this.props.navigation.goBack()}>
            <Image source={images.backImage} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <View style={{marginRight: metrics.dimen_15, flexDirection: 'row'}}>
            {store.BlockUserList.length !== 0 && (
              <TouchableOpacity onPress={() => this.SearchOnOf()}>
                <Image source={images.search} />
              </TouchableOpacity>
            )}
          </View>
        ),
      });
    });
  }

  render() {
    const store = this.props.BlockUserStore;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {store.isLoading ? this.renderPlaceHolderView() : null}

        {this.state.searchvisible === true ? (
          <View
            styles={{
              flex: 1,
              marginHorizontal: metrics.dimen_10,
              marginTop: metrics.dimen_10,
            }}>
            <SearchBar
              lightTheme
              fontSize={metrics.dimen_12}
              fontFamily={metrics.Lato_Regular}
              placeholder={strings('Search')}
              onChangeText={(text) => this.handleSearch(text)}
              value={this.state.updatedsearch}
              containerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
              inputContainerStyle={{
                backgroundColor: colors.app_light_gray,
                shadowColor: colors.shadow_color,
                borderRadius: 20,
              }}
              icon={() => (
                <Icon name={'camera'} color={Colors.app_gray} size={26} />
              )}
              onClear={() => {
                this.setState({updatedsearch: ''});
                this.props.BlockUserStore.setblockUserFilterList(
                  this.props.BlockUserStore.BlockUserList,
                );
              }}
            />
          </View>
        ) : null}

        {store.blockUserFilterList.length > 0 ? (
          <FlatList
            style={styles.FlatList}
            data={store.blockUserFilterList}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => this.renderBlockUserItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          this.nODataRender()
        )}
      </View>
    );
  }
  renderBlockUserItem = (item) => {
    let firstName = item.profile.first ? item.profile.first : '';
    let lastName = item.profile.last ? item.profile.last : '';

    const urlPic = item.profile.avatarUrl;
    const imageUrl =
      urlPic === null || urlPic === 'NA' || urlPic === ''
        ? images.KoliSquarePlaceholder
        : {uri: urlPic};
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.ListMainView}>
          <View style={styles.imageViewContainer}>
            <FastImage
              source={imageUrl}
              style={styles.userAvatrar}
              size={55}
              fallback
              defaultSource={images.userPlaceholder}
            />
          </View>

          <View style={styles.datamainViewContainer}>
            <Text numberOfLines={1} style={[styles.title]}>
              {firstName + ' ' + lastName}
            </Text>
            <Text numberOfLines={1} style={[styles.subtitle]}>
              {item.profile.username ? '@' + item.profile.username : ''}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => this.showAlert(firstName, item.id)}
            style={styles.crossclick}>
            <FastImage style={styles.crossImage} source={images.crossRemove} />
          </TouchableOpacity>
        </View>
        <View style={[styles.seprater]}></View>
      </View>
    );
  };

  nODataRender() {
    const store = this.props.BlockUserStore;

    if (store.isLoading) {
      return null;
    }

    return (
      <View style={styles.noviewccontainer}>
        <Image source={images.BlockUser} style={styles.noviewImage} />
        <Text style={styles.noblocktitle}>{strings('No_blocked_users')}</Text>
        <Text style={styles.noblocksubtitle}>
          {strings('Anyone_you_block_willshowup_here')}
        </Text>
      </View>
    );
  }

  renderPlaceHolderView = () => {
    return this.state.initialArr.map((obj) => (
      <SkeletonPlaceholder>
        {/* <View
            style={[styles.sectionHeader, { height: 15, width: '20%', marginTop:10 }]}
          /> */}
        <View style={[styles.itemMainView, {paddingTop: metrics.dimen_5}]}>
          <View style={styles.imageType} />
          <View style={styles.textContentView}>
            <View
              style={[
                styles.textblockuser,
                {width: '95%', height: 50, borderRadius: 4, marginTop: 6},
              ]}
            />
            <View
              style={[styles.textblockbutton, {width: '20%', height: 10}]}
            />
            {/* <View
                style={[styles.borderBottomLine, { width: metrics.width, marginLeft: -metrics.dimen_100 }]}
              /> */}
          </View>
        </View>
      </SkeletonPlaceholder>
    ));
  };

  showAlert = (firstName, blockid) => {
    Alert.alert(
      '',
      strings('Are_you_sure_you') + ' ' + firstName + '?',
      [
        {text: strings('No'), onPress: () => console.log('No Pressed')},
        {
          text: strings('Yes'),
          onPress: () => {
            this.props.BlockUserStore.delUserfromBlockList(blockid);
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };
}
export default inject('BlockUserStore', 'AuthStore')(observer(BlockUser));

const styles = StyleSheet.create({
  FlatList: {
    flex: 1,
    marginTop: metrics.dimen_16,
  },

  ListMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: metrics.getW(50),
    marginLeft: metrics.dimen_5,
    marginRight: metrics.dimen_5,
    backgroundColor: colors.white,
  },
  imageViewContainer: {
    height: metrics.getW(60),
    overflow: 'hidden',
    width: '20%',
  },
  datamainViewContainer: {
    // height: metrics.getW(70),
    alignSelf: 'center',
    //overflow: 'hidden',
    width: '60%',
  },
  title: {
    fontSize: metrics.text_normal,
    color: colors.gray,
    fontFamily: metrics.Lato_SemiBold,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Regular,
    color: colors.app_Blue,
  },
  seprater: {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,
    marginTop: metrics.dimen_10,
    marginBottom: metrics.dimen_12,
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS === 'android' ? metrics.dimen_10 : 5,
  },

  noviewccontainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: metrics.dimen_100,
  },

  noviewImage: {
    width: metrics.dimen_100,
    height: metrics.dimen_100,
    alignSelf: 'center',
  },
  noblocktitle: {
    color: colors.gray,
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
    textAlign: 'center',
  },
  noblocksubtitle: {
    color: colors.gray,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    textAlign: 'center',
    marginTop: metrics.dimen_2,
  },
  crossImage: {
    width: metrics.dimen_20,
    height: metrics.dimen_20,
  },

  crossclick: {
    width: metrics.dimen_50,
    height: metrics.dimen_50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  userImage: {
    marginLeft: metrics.dimen_12,
    marginVertical: metrics.dimen_13,
    marginRight: metrics.dimen_18,
    height: metrics.dimen_50,
    width: metrics.dimen_50,
    borderRadius: metrics.dimen_25,
  },

  itemMainView: {
    flexDirection: 'row',
    paddingTop: metrics.dimen_10,
    paddingRight: metrics.dimen_10,
    height: metrics.getH(75),
  },
  imageType: {
    marginLeft: metrics.dimen_10,
    width: metrics.dimen_44,
    height: metrics.dimen_44,
    marginTop: metrics.dimen_12,
    borderRadius: metrics.dimen_22,
  },
  textContentView: {
    marginHorizontal: metrics.dimen_13,
    flexDirection: 'column',
    flex: 1,
  },
  textblockuser: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: '#3E3E46',
  },
  textblockbutton: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    marginTop: metrics.dimen_6,
    marginBottom: metrics.dimen_8,
    color: colors.app_gray,
  },
  userAvatrar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});