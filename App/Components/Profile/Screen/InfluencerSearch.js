import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { strings } from '../../../Locales/i18';
import FastImage from 'react-native-fast-image';
import Loader from '../../../SupportingFIles/Loader';
import { SearchBar } from 'react-native-elements';
import images from '../../../Themes/Images';
import {
  Numberformatesunit,
  getInfluencerSearchData,
  setInfluencerSearchData,
} from '../../../SupportingFIles/Utills';

class InfluencerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      InfluencerSearchData: [],
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => this.props.navigation.goBack()}>
          <Image source={images.backImage} />
        </TouchableOpacity>
      ),
    });
    const store = this.props.InfluencerSearchStore;
    this.UpdateSerch('');
    store.setInfluencerList([]);

    store.setsearchedInfluencer([]);

    getInfluencerSearchData().then((InfluencerSearchData) => {
      this.setState({ InfluencerSearchData: InfluencerSearchData });
    });
  }

  fetchSearchInfluencerData(Searchvalue) {
    const store = this.props.InfluencerSearchStore;
    if (Searchvalue === '') {
      store.setInfluencerList([]);
    }
    store.getSearchInfluencerList(Searchvalue);
  }

  UpdateSerch = (search) => {
    const store = this.props.InfluencerSearchStore;
    store.setupdateSearch(search);
  };

  render() {
    const store = this.props.InfluencerSearchStore;
    console.log('searchedInfluencer=', store.searchedInfluencer);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={store.isLoading} />
        <View style={styles.seprater}></View>

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
            padding: 10,
          }}>
          <SearchBar
            lightTheme
            platform="default"
            placeholder={strings('search_hastag')}
            inputStyle={{
              fontFamily: metrics.Lato_Regular,
              fontSize: metrics.text_normal,
            }}
            onChangeText={(text) => this.UpdateSerch(text)}
            value={store.updateSearch}
            containerStyle={{
              width: '100%',
              backgroundColor: colors.white,
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              marginTop: -metrics.dimen_5,
              marginLeft: -15,
              marginRight: -15,
            }}
            inputContainerStyle={{
              backgroundColor: colors.app_light_gray,
              shadowColor: colors.shadow_color,
              borderRadius: 20,
            }}
            onClear={() => {
              store.setInfluencerList([]);
              this.UpdateSerch('');
              store.sethasNextPage(0);
              store.setsearchedInfluencer([]);
            }}
            onSubmitEditing={() => {
              store.setInfluencerList([]);
              store.sethasNextPage(0);
              this.fetchSearchInfluencerData(store.updateSearch);
              this.UpdateSearchData(store.updateSearch);
            }}
          />
        </View>
        <View style={{ width: '100%' }}>
          {store.isLoading === false &&
            store.InfluencerList.length <= 0 &&
            this.state.InfluencerSearchData.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                height: metrics.dimen_40,
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(248, 248, 248, 1)',
                paddingHorizontal: metrics.dimen_20,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: metrics.Roboto_Regular,
                  color: colors.app_gray,
                }}>
                {strings('Recent_search')}
              </Text>
              <TouchableOpacity onPress={() => this.deleteAllItem()}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: metrics.Roboto_Regular,
                    color: colors.app_Blue,
                  }}>
                  {'Clear History'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {store.InfluencerList.length <= 0 ? (
            <View style={{ marginBottom: metrics.dimen_170 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={1}
                data={this.state.InfluencerSearchData.sort(
                  (a, b) => b.id - a.id,
                )}
                renderItem={({ item, index }) =>
                  this.renderRecentSearch(item, index)
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : null}
        </View>

        {store.InfluencerList.length > 0 && (
          <FlatList
            style={{ flex: 1 }}
            data={store.InfluencerList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => this.renderInfluencersearchItem(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={10}
            onEndReached={() => {
              if (
                !store.end_curser &&
                store.hasNextPage >= store.offSetlength
              ) {
                this.props.InfluencerSearchStore.getSearchInfluencerNextPage(
                  store.updateSearch,
                );
              }
            }}
          />
        )}
        {store.InfluencerList.length === 0 &&
          this.state.InfluencerSearchData.length === 0 &&
          this.NODataRender()}
      </View>
    );
  }
  renderInfluencersearchItem = (item) => {
    let lastName = item.last ? item.last.replace(/^"|"$/g, '') : '';
    let fullName = item.first
      ? item.first.replace(/^"|"$/g, '') + ' ' + lastName
      : '';
    const urlPic = item.avatarUrl;
    const imageUrl =
      urlPic === null || urlPic === 'NA' || urlPic === ''
        ? images.userPlaceholder
        : { uri: urlPic };
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('UserProfile', { UserData: item })
        }>
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.ListMainView}>
            <FastImage
              style={styles.imageViewContainer}
              source={imageUrl}
              fallback
              defaultSource={images.userPlaceholder}
            />

            <View style={styles.datamainViewContainer}>
              <Text numberOfLines={1} style={[styles.title]}>
                {fullName}
              </Text>
              <Text numberOfLines={1} style={[styles.subtitle]}>
                {item.instaUsername}
              </Text>

              {item.instaUsername ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[styles.subtitle, { fontSize: metrics.text_medium }]}>
                    {Numberformatesunit(item.followersCount)}
                  </Text>
                  <Image
                    style={{
                      width: metrics.getW(15),
                      height: metrics.getW(15),
                      marginTop: metrics.dimen_5,
                      margin: metrics.dimen_2,
                    }}
                    source={images.users}></Image>
                </View>
              ) : null}
            </View>
          </View>
          <View
            style={[
              styles.seprater,
              { marginVertical: metrics.dimen_15 },
            ]}></View>
        </View>
      </TouchableOpacity>
    );
  };

  renderRecentSearch = (item, index) => {
    return (
      <View style={{ backgroundColor: 'rgba(241, 241, 241, 1)' }}>
        <View
          style={{
            marginHorizontal: metrics.dimen_7,
            marginVertical: metrics.dimen_15,
            flexDirection: 'row',
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              width: '90%',
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', width: '90%' }}
              onPress={() => this.searchcampaignfromRecentSearchData(item)}>
              <Image
                source={images.search_history}
                style={{
                  marginLeft: metrics.dimen_12,
                  height: metrics.dimen_18,
                  width: metrics.dimen_18,
                }}
              />
              <Text
                style={{
                  fontFamily: metrics.Roboto_Regular,
                  alignItems: 'center',
                  color: colors.app_gray,
                  marginLeft: metrics.dimen_20,
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '10%' }}>
            <TouchableOpacity
              style={{ with: '40' }}
              onPress={() => this.deleteItemByName(item.name)}>
              <Image
                source={images.cross}
                style={{
                  height: metrics.dimen_18,
                  width: metrics.dimen_18,
                  tintColor: 'rgba(187, 192, 200, 1)',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderColor: 'rgba(227,227,227,1)',
            borderBottomWidth: 1,
            marginHorizontal: metrics.dimen_30,
          }}
        />
      </View>
    );
  };

  UpdateSearchData(search) {
    let influencersearchdata = this.state.InfluencerSearchData;
    InfluencerSearchdata = influencersearchdata.filter(
      (obj) => obj.name.toLowerCase() !== search.toLowerCase(),
    );
    InfluencerSearchdata.push({
      id: InfluencerSearchdata.length + 1,
      name: search,
    });
    this.setState({ InfluencerSearchData: InfluencerSearchdata });
    setInfluencerSearchData(InfluencerSearchdata);
  }

  searchcampaignfromRecentSearchData(item) {
    const store = this.props.InfluencerSearchStore;

    this.UpdateSerch(item.name);

    store.setInfluencerList([]);
    store.sethasNextPage(0);
    this.fetchSearchInfluencerData(store.updateSearch);
  }
  deleteItemByName(name) {
    const filteredData = this.state.InfluencerSearchData.filter(
      (item) => item.name.toLowerCase() !== name.toLowerCase(),
    );
    this.setState({ InfluencerSearchData: filteredData });
    setInfluencerSearchData(filteredData);
  }
  deleteAllItem() {
    this.setState({ InfluencerSearchData: [] });
    setInfluencerSearchData([]);
  }
  NODataRender() {
    const store = this.props.InfluencerSearchStore;

    if (store.isLoading) {
      return null;
    }

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: metrics.dimen_100,
        }}>
        {/* <Text style={{ color: colors.gray, fontFamily: metrics.Roboto_Regular, fontSize: metrics.text_normal, textAlign: 'center',  }}>{store.updateSearch}</Text> */}
        <Image
          source={images.SearchResultNo}
          style={{
            width: metrics.dimen_200,
            height: metrics.dimen_200,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }
}
export default inject('InfluencerSearchStore')(observer(InfluencerSearch));

const styles = StyleSheet.create({
  // headerTextStyle: {
  //   fontFamily: metrics.Lato_Bold,
  //   fontSize: metrics.text_xxxl,
  //   marginLeft: metrics.dimen_20,
  //   marginBottom: metrics.dimen_20,
  //   color: 'rgba(61, 64, 70, 1)',
  // },

  // imageThumbnail: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   aspectRatio: 1,
  // },

  ListMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: colors.white,
  },
  imageViewContainer: {
    width: metrics.dimen_70,
    height: metrics.dimen_70,
    borderRadius: metrics.dimen_35,
  },
  datamainViewContainer: {
    paddingLeft: 10,
    overflow: 'hidden',
    width: '65%',
  },
  title: {
    fontSize: metrics.text_normal,
    color: colors.gray,
    fontFamily: metrics.Lato_SemiBold,
    textTransform: 'capitalize',
  },
  subtitle: {
    marginTop: metrics.dimen_5,
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Light,
    color: colors.app_gray,
  },
  seprater: {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS === 'android' ? metrics.dimen_10 : 5,
  },
});