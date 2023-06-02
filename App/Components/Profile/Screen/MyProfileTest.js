/**
 * This is just a temporary Component for the test. It should not be needed in the future, after we fully refactor it to work with jest.
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
// import { Avatar } from 'react-native-paper'
import Avatar from 'react-avatar'
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
// import { strings } from '../../../Locales/i18'
// import FastImage from 'react-native-fast-image'
import { Image as FastImage } from 'react-native'
import { gettUserData, Numberformatesunit } from '../../../SupportingFIles/Utills';
import { commonStyles } from '../../../SupportingFIles/Constants';

import images from '../../../Themes/Images';
import Loader from '../../../SupportingFIles/Loader';
// import BottomSheet from 'reanimated-bottom-sheet'
import { Text as BottomSheet } from 'react'
import ReadMore from 'react-native-read-more-text';

const strings = (text) => text

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedItem: '',
      textShown: -1,
      InstaUsername: ''

    }

  }
  toggleNumberOfLines = index => {
    this.setState({
      textShown: this.state.textShown === index ? -1 : index,
    });
  };
  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: metrics.dimen_20, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')}>
            <Image source={images.editProfileIcon} style={{ marginLeft: metrics.dimen_20 }} />
          </TouchableOpacity>
        </View>
      )
    })
    this.props.AuthStore.setNavigation(this.props.navigation)
    this.props.navigation.addListener('focus', () => {
      if (this.props.AuthStore.isLogin) {
        this.props.MyProfileStore.setIsLoading(true)

        this.fetchUserData()

      }
      else {
        this.props.navigation.navigate('AuthStack')
      }
    });
  }

  fetchUserData() {
    const store = this.props.MyProfileStore
    const Authstore = this.props.AuthStore
    store.setFollowersCount('0')
    store.setPosts([])
    store.setPostsCount('0')
    gettUserData().then(data => {
      store.setUserImage(data.avatarUrl)
      store.setUserName(data.username)
      store.setFirstName(data.first)
      store.setLastName(data.last)
      store.setInstaUserName(data.instaUsername ? data.instaUsername : "")
      store.setBio(data.bio ? data.bio : "")
      this.setState({ bio: data.bio ? data.bio : "" })
      store.setCity(data.city ? data.city : "")
      store.setCountry(data.country ? data.country : "")
      store.setDisplayEmail(data.displayedEmail)
      store.setEmail(data.email)
      store.setGender(data.gender)
      store.setMyInterest(data.interests)
      store.setFacebookUserName(data.facebookUsername)
      store.setinstaperpost("" + data.instaPerPost)
      store.setfacebookperpost("" + data.facebookPerPost)
      if (data.instaUsername !== null) {
        store.getInstaPosts(data.instaUsername)
      } else {
        store.setIsLoading(false)
      }

      Authstore.setFirstName(data.first)
      Authstore.setLastName(data.last)
      Authstore.setUserImage(data.avatarUrl)
    })
    // setTimeout(() => {
    //   store.setIsLoading(false)
    // }, 500);
  }


  renderInner = () => {
    return (
      <View style={styles.panel}>

        <View style={{ marginLeft: metrics.dimen_15, marginRight: metrics.dimen_15, marginBottom: metrics.dimen_10 }}>
          <FastImage
            style={styles.imageThumbnailSheetView}
            source={{
              uri: this.state.SelectedItem ? this.state.SelectedItem.node.thumbnail_src : '',
              priority: FastImage.priority.normal
            }}
          /></View>

        <ScrollView>
          <View>
            <Text style={styles.panelSubtitle}>
              {this.state.SelectedItem ? this.state.SelectedItem.node.edge_media_to_caption.edges[0] ? this.state.SelectedItem.node.edge_media_to_caption.edges[0].node.text : '' : ''}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: metrics.dimen_10, marginTop: metrics.dimen_25 }}>
              <View style={{ flexDirection: 'row' }} >
                <Image style={{ height: metrics.dimen_25, width: metrics.dimen_25, tintColor: colors.app_black }} source={images.LikeIcon} />
                <Text style={styles.likecommenttitle}>
                  {this.state.SelectedItem ? Numberformatesunit(this.state.SelectedItem.node.edge_liked_by.count) : ''}
                </Text>
                <Image style={{ marginLeft: metrics.dimen_15, height: metrics.dimen_22, width: metrics.dimen_22, }} source={images.CommentIcon} />
                <Text style={styles.likecommenttitle}>
                  {this.state.SelectedItem ? Numberformatesunit(this.state.SelectedItem.node.edge_media_to_comment.count) : ''}
                </Text>
              </View>
              <View>
              </View>
              <Image style={{ tintColor: colors.app_black }} source={images.InstaIcon} />
            </View>
            <View style={{ height: metrics.dimen_90 }}></View>
          </View>


        </ScrollView>
      </View>
    )
  }



  renderSheetHeader = () => (
    <View style={styles.headertop}>
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    </View>

  )

  RenderBottomValue(item) {
    this.setState({ SelectedItem: item })
    this.bs.current.snapTo(0)

  }


  bs = React.createRef()
  renderBottomSheet() {

    return (
      <BottomSheet
        ref={this.bs}
        snapPoints={[Dimensions.get('window').height - metrics.dimen_155, Dimensions.get('window').height - metrics.dimen_155, 0]}
        renderHeader={this.renderSheetHeader}
        renderContent={() => this.renderInner()}
        initialSnap={2}
      />
    )
  }

  _render() {
    return <Text>TEST</Text>
  }

  render() {
    const store = this.props.MyProfileStore
    // if(store.isLoading)
    // {
    //   return (
    //     <Loader loading={store.isLoading} />

    //   )
    // }
    const { firstName, lastName, userImage, userName, city, country, bio, instaUserName } = store
    // console.log('~~~~~~~~~~~~~~~~~~~~> ' + JSON.stringify(store))
    if(instaUserName === '') {
        return this.listrenderHeader()
    } else {
    //   console.log('~~~~~~~~~~~~~~~~~~~~> ' + store.posts)
      const imageUrl = userImage == null ? images.koliIcon : { uri: userImage }
        return (

        <View style={styles.container}>
            <View style={[styles.seprater]}></View>

            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: metrics.dimen_20, }}>
            <Loader loading={store.isLoading} />
            {!store.isLoading && instaUserName !== '' ?
                <FlatList
                style={{ marginTop: metrics.dimen_20 }}
                data={store.posts}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, flexDirection: 'column', margin: 1, }}>
                    <TouchableOpacity onPress={() => this.RenderBottomValue(item)}>
                        <FastImage
                        style={styles.imageThumbnail}
                        source={{
                            uri: item.node.thumbnail_src,
                            priority: FastImage.priority.normal
                        }}
                        /></TouchableOpacity>
                    </View>
                )}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.listrenderHeader}
                // onEndReached = {()=>{
                //     this.props.MyProfileStore.getNextPost()
                // }}            
                /> :
                !store.isLoading && <View  >
                <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: metrics.dimen_20 }}>
                    <Avatar
                      src={imageUrl}
                      size={100}
                    />
                    <View style={{ marginLeft: metrics.dimen_20, width: '50%' }}>
                    <Text numberOfLines={3} style={{ ...styles.headerTextStyle, textTransform: 'capitalize' }}>{firstName + " " + lastName}</Text>
                    <Text style={{ ...styles.userNameTextStyle }}>@{userName}</Text>
                    <Text style={{ ...styles.addresTextStyle }}>{city + " " + country}</Text>
                    </View>
                </View>
                {bio ? <Text style={{ ...styles.bioTextStyle, marginTop: metrics.dimen_16, marginLeft: metrics.dimen_10 }}>{strings('Bio')}</Text> : null}
                {bio ? <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
                    <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={this._renderTruncatedFooter}
                    renderRevealedFooter={this._renderRevealedFooter}
                    // onReady={this._handleTextReady}
                    >
                    <Text style={{ ...styles.bioDesTextStyle }}>{bio}</Text>
                    </ReadMore>
                </View> : null}

                <View style={{ ...styles.lineStyle, height: 0.4, marginHorizontal: 0, marginTop: metrics.dimen_25 }} />
                <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: metrics.dimen_70 }}>
                    <View style={{ left: '40%', }} >
                    <Image source={images.NoInstagram} />

                    </View>
                    <Text style={{ ...commonStyles.LatoBold_16, marginTop: metrics.dimen_20, textAlign: 'center' }}>{strings('Instagram_accountnotlinked')}</Text>

                    <Text style={{ ...commonStyles.LatoRegular_Medium, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_12, textAlign: 'center' }}>{strings('Please_link_your_instagramaccount')}</Text>

                </View>

                </View>

            }


            </View>
            {this.renderBottomSheet()}

            </View>
        );
    }
  }
  listrenderHeader = () => {
    const store = this.props.MyProfileStore
    const { firstName, lastName, userImage, userName, city, country, bio, followersCount, postCount, instaUserName } = store
    const imageUrl = userImage == null ? images.koliIcon : { uri: userImage }
    return (

      <View style={{ flex: 1 }} >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            src={imageUrl}
            size={100}
          />
          <View style={{ marginLeft: metrics.dimen_20, width: '50%' }}>
            <Text numberOfLines={3} style={{ ...styles.headerTextStyle, textTransform: 'capitalize' }}>{firstName + " " + lastName}</Text>
            <Text style={{ ...styles.userNameTextStyle }}>@{userName}</Text>
            <Text style={{ ...styles.addresTextStyle }}>{city + " " + country}</Text>
          </View>
        </View>
        {bio ? <Text style={{ ...styles.bioTextStyle, marginTop: metrics.dimen_16, marginLeft: metrics.dimen_10 }}>{strings('Bio')}</Text> : null}
        {bio ? <View style={{ flex: 1, marginLeft: 10, marginTop: 5 }}>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
          // onReady={this._handleTextReady}
          >
            <Text testID="bio" style={{ ...styles.bioDesTextStyle }}>{bio}</Text>
          </ReadMore>
        </View> : null}




        <View style={{ ...styles.lineStyle, height: 0.4, marginHorizontal: 0, marginTop: metrics.dimen_25 }} />

        {instaUserName !== '' && <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '49%' }}>
            <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_large, fontWeight: metrics.LatoRegular, marginTop: metrics.dimen_5 }}>{Numberformatesunit(followersCount)}</Text>
            <Text style={{ ...styles.addresTextStyle }}>{strings('Followers')}</Text>
          </View>
          <View style={{ ...styles.lineStyle, height: 50, width: Platform.OS == "ios" ? 0.6 : 0.4, marginTop: metrics.dimen_4 }}></View>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '49%' }}>
            <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_large, fontWeight: metrics.LatoRegular, marginTop: metrics.dimen_5 }}>{Numberformatesunit(postCount)}</Text>
            <Text style={{ ...styles.addresTextStyle }}>{strings('Posts')}</Text>
          </View>
        </View>}




        {/* {followersCount.length > 0 || postCount.length > 0 && <View style={{ ...styles.lineStyle, height: 0.4, marginHorizontal: 0, marginTop: metrics.dimen_4 }} />}
      {followersCount.length > 0 || postCount.length > 0 && <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_16, fontWeight: metrics.LatoBold, marginVertical: metrics.dimen_15 }}>{strings('Posts')}</Text>} */}
        {instaUserName !== '' && <View style={{ ...styles.lineStyle, height: 0.4, marginHorizontal: 0, marginTop: metrics.dimen_4 }} />}
        {instaUserName !== '' && <Text style={{ fontFamily: metrics.Lato, fontSize: metrics.text_16, fontWeight: metrics.LatoBold, marginVertical: metrics.dimen_15 }}>{strings('Posts')}</Text>}

      </View>
    )
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ReadMore')}
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ ...styles.normalText, marginTop: metrics.dimen_5, color: 'rgba(22, 88, 211, 1)' }} onPress={handlePress}>
        {strings('ShowLess')}
      </Text>
    );
  }

}
export default inject('MyProfileStore', 'AuthStore')(observer(MyProfile))


const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxl,
    color: 'black',
    marginVertical: metrics.dimen_2
  },
  userNameTextStyle: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
    fontStyle: 'italic',
    marginVertical: metrics.dimen_2
  },
  addresTextStyle: {
    fontFamily: metrics.Roboto_Regular,
    fontSize: metrics.text_medium,
    color: 'rgba(122,129,138,1)',
    marginVertical: metrics.dimen_5
  },
  bioTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: 'rgba(162,167,174,1)',
  },
  bioDesTextStyle: {
    fontSize: metrics.text_medium,
    color: 'rgba(62,62,70,1)',
    fontStyle: 'italic',
    marginTop: metrics.dimen_5,


  },
  bioDesTextStylereadmore: {
    marginLeft: metrics.dimen_10,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: colors.app_Blue,
    fontStyle: 'italic',
    marginTop: metrics.dimen_5,


  },
  lineStyle: {
    backgroundColor: 'rgba(112,112,112,1)',
    opacity: 0.4
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  editButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 88, 211, 1)',
    paddingHorizontal: metrics.dimen_30,
    height: metrics.dimen_45,
    position: 'absolute',
    bottom: metrics.dimen_40,
    borderRadius: metrics.dimen_4
  },
  boldTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'white',
  },

  imageThumbnailSheetView: {

    aspectRatio: 1,

  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  panel: {
    height: Dimensions.get('window').height - metrics.dimen_155,
    width: '100%',
    backgroundColor: colors.white,
  },
  headertop: {
    backgroundColor: '#f7f5eee8',
    paddingTop: metrics.dimen_60,

  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    paddingTop: metrics.dimen_15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: metrics.dimen_100,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelSubtitle: {
    marginTop: metrics.dimen_10,
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal, color: 'rgba(114, 114, 114, 1)',
    paddingHorizontal: metrics.dimen_10
  },
  likecommenttitle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    marginTop: metrics.dimen_2,
    color: 'rgba(44, 44, 48, 1)',
    marginLeft: metrics.dimen_4
  },
  seprater:
  {
    borderWidth: 0.5,
    borderColor: colors.disable_gray_color,

  },
  normalText: {
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: colors.app_black,
    fontStyle: 'italic'
  },

})
