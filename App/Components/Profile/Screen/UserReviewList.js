import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import StarRating from 'react-native-star-rating';
import {inject, observer} from 'mobx-react';
import {Avatar} from 'react-native-paper';

import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';

class UserReviewList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
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
            }}
            numberOfLines={1}>
            {this.props.route.params.username}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image style={styles.backButtonContainer} source={images.backImage} />
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const store = this.props.UserProfileStore;
    const {userReviewlist, calculaterating} = store;
    console.log('calculaterating', parseFloat(calculaterating).toFixed(1));

    // calculaterating.toFixed(1)
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 0.5,
              marginTop: metrics.dimen_8,
              borderColor: colors.app_light_gray,
            }}>
            <Text style={styles.boldTextStyle}>
              {calculaterating ? parseFloat(calculaterating).toFixed(1) : ''}
            </Text>
            <StarRating
              containerStyle={{width: metrics.getW(100)}}
              disabled={true}
              maxStars={5}
              starSize={20}
              rating={calculaterating}
              fullStarColor={colors.RatingYellow}
            />
            <Text style={[styles.title, {paddingVertical: 10}]}>
              {'based on ' + userReviewlist.length + ' Reviews'}
            </Text>
            <View style={[styles.seprater]}></View>
          </View>

          <FlatList
            bounces={false}
            style={{backgroundColor: 'white', marginTop: metrics.dimen_15}}
            keyExtractor={({index}) => index + ''}
            data={userReviewlist}
            renderItem={({item}) => this.renderItem(item)}
          />
        </ScrollView>
        <View style={{height: metrics.dimen_20}}></View>

        {/* <View style= {{ justifyContent:'center',height:80,marginHorizontal:5}}>
                             <TouchableOpacity
                             onPress={() => this.props.navigation.navigate('AddReview')}>
                               <Text style = {{borderStyle:'solid',height:50,color:'deepskyblue',padding:15,borderColor:'gray',borderRadius:1,borderWidth:0.1,textAlign:'center'}}>Write a Review</Text> 
                             </TouchableOpacity>
                             </View>  */}
      </View>
    );
  }
  renderItem = (item) => {
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
            <Avatar.Image source={imageUrl} size={36} />
          </View>

          <View style={styles.datamainViewContainer}>
            <Text numberOfLines={1} style={[styles.title]}>
              {firstName + ' ' + lastName}
            </Text>
            <Text numberOfLines={1} style={[styles.subtitle]}>
              {item.profile.username ? '@' + item.profile.username : ''}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <StarRating
              disabled={true}
              maxStars={1}
              starSize={14}
              rating={item.reviewRating}
              fullStarColor={colors.RatingYellow}
            />
            <Text
              style={{
                marginLeft: metrics.dimen_2,
                fontFamily: metrics.Lato_Bold,
                color: colors.RatingYellow,
                fontSize: metrics.text_medium,
              }}>
              {item.reviewRating}
            </Text>
          </View>
        </View>
        <Text style={[styles.descriptiontext]}>{item.reviewText}</Text>
        <View style={[styles.seprateritem]}></View>
      </View>
    );
  };
}
export default inject(
  'UserProfileStore',
  'AuthStore',
)(observer(UserReviewList));
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_2 : 3,
  },

  boldTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_24,
    color: colors.app_black,
    marginVertical: metrics.dimen_6,
  },
  imageViewContainer: {
    height: metrics.getW(38),
    overflow: 'hidden',
    width: '13%',
  },
  ListMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.white,
  },

  datamainViewContainer: {
    width: '72%',
  },

  title: {
    fontSize: metrics.text_normal,
    color: colors.gray,
    fontFamily: metrics.Lato_SemiBold,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: metrics.text_normal,
    fontFamily: metrics.Lato_Italic,
    color: 'rgba(134, 141, 147,1)',
  },
  descriptiontext: {
    marginLeft: metrics.dimen_65,
    marginHorizontal: metrics.dimen_18,
    fontSize: metrics.text_medium,
    fontFamily: metrics.Lato_Italic,
    color: 'rgba(107, 107, 113,1)',
  },
  seprater: {
    borderWidth: 0.6,
    borderColor: colors.disable_gray_color,
    marginVertical: metrics.dimen_2,
  },
  seprateritem: {
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
});