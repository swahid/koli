import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Image, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { strings } from '../../../Locales/i18';
import { Avatar } from 'react-native-paper'
import StarRating from 'react-native-star-rating'
import { inject, observer } from 'mobx-react';
import FastImage from 'react-native-fast-image'
import { convertCurrencybyCode, showAlert } from '../../../SupportingFIles/Utills';
const removeEmojis = (string) => {
  const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g

  return string.replace(regex, '')

}
const formatCurrency = new Intl.NumberFormat('en-US')

class AddReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rating: 0,
      message: ""
    }
  }


  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', color: "#1A1E24" }}>
          <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_16, textAlign: 'center' }}
            numberOfLines={1}>
            {"Write a Review"}
          </Text>

        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image style={styles.backButtonContainer} source={images.cross} />
        </TouchableOpacity>
      )
    })

  }


  render() {

    const urlPic = this.props.route.params.remarkdata.profile.avatarUrl
    const name = (this.props.route.params.remarkdata.profile.first ? this.props.route.params.remarkdata.profile.first : '') + " " + (this.props.route.params.remarkdata.profile.last ? this.props.route.params.remarkdata.profile.last : '')
    const imageUrl = (urlPic === null || urlPic === 'NA' || urlPic === '') ? images.KoliSquarePlaceholder : { uri: urlPic }
    const campaignImage = { uri: this.props.route.params.campaignData.campaignImage }

    return (

      <View style={styles.conatiner}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.bottomContainer}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <View style={styles.productView}>
            <View style={styles.productDetailView}>
              <FastImage
                style={styles.campaignImageView}
                source={campaignImage}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                <Text numberOfLines={1} style={[styles.title]}>{this.props.route.params.campaignData.campaignTitle}</Text>
                <Text numberOfLines={1} style={[styles.amountText]}>{convertCurrencybyCode(this.props.route.params.campaignData.campaignAmountCurrency) +
                 formatCurrency.format(this.props.route.params.remarkdata.lastOfferAmount)}</Text>
              </View>
            </View>

          </View>
          <View style={styles.userView}>

            <View style={styles.userNameView}>

              <Avatar.Image
                source={imageUrl}
                size={45}
              />

              <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                <Text numberOfLines={1} style={[styles.title]}>{name}</Text>
                <Text numberOfLines={1} style={[styles.subtitle]}>{this.props.route.params.remarkdata.profile.username ? "@" + this.props.route.params.remarkdata.profile.username : ""}</Text>

              </View>
            </View>


            <View style={styles.ratingView}>

              <StarRating
                containerStyle={{ width: metrics.getW(120) }}
                //disabled={false}

                maxStars={5}
                starSize={metrics.dimen_20}
                rating={this.state.rating}
                fullStarColor={colors.RatingYellow}
                selectedStar={(val) => this.setState({ rating: val })}
              />


            </View>
          </View>



          <View style={{ backgroundColor: colors.white, paddingBottom: metrics.dimen_15 }}>
            <View style={styles.commentMainView}>
              <Text style={{ ...commonStyles.LatoRegular_Normal, marginTop: 15, color: 'rgba(62,62,70,1)' }}>{strings('add_comment')}</Text>
              <TextInput style={{ ...commonStyles.multilineTextInputAddReviewStyle, ...commonStyles.LatoRegular_Normal, marginTop: metrics.dimen_8, marginBottom: 5, color: "#3E3E46" }}
                placeholder={strings('more_detail_review_getmorevisibility')}
                placeholderTextColor="#B2B2B5"
                multiline={true}
                returnKeyType="default"
                value={this.state.message}
                // onChangeText={(text) => {this.setState({message:removeEmojis(text)})}}
                onChangeText={(text) => { this.setState({ message: text }) }}
              />
            </View>
          </View>
          {/* <View style ={styles.submitButtonStyle}> */}
        </KeyboardAwareScrollView>
        <TouchableOpacity style={styles.submitButtonStyle} onPress={() => this.submitReview()}>

          <Text style={styles.signUpTextStyle}>{strings("Submit")}</Text>
        </TouchableOpacity>
        {/* </View> */}

      </View>



    )
  }

  submitReview() {

    if (this.state.rating === 0) {
      showAlert('', "Please select rating")
    } else if (this.state.message === "") {
      showAlert('', "Please enter comment")
    } else {
      const param = {
        ownerId: this.props.route.params.campaignData.ownerId,
        campaignId: this.props.route.params.campaignData.id,
        reviewText: this.state.message,
        reviewRating: this.state.rating,
        applicantOwnerId: this.props.route.params.remarkdata.profile.ownerId,
        remarkId: this.props.route.params.remarkdata.id
      }
      this.props.ApplicantListStore.submitReview(param, this.props.route.params.campaignData.id)
      this.props.navigation.goBack()
    }
  }
}
export default inject('ApplicantListStore', "AuthStore")(observer(AddReview))

const styles = StyleSheet.create(
  {
    backButtonContainer: {
      marginLeft: metrics.dimen_16,
      marginTop: Platform.OS == 'android' ? metrics.dimen_2 : 3
    },


    conatiner: {

      flex: 1,
      backgroundColor: 'rgba(248,248,248,1)',
    },

    userProfile: {
      height: metrics.dimen_40,
      width: metrics.dimen_40,
      borderRadius: metrics.dimen_20
    },

    userView: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      marginTop: metrics.dimen_5,
      marginBottom: metrics.dimen_8,
      backgroundColor: colors.white

    },
    userNameView: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
      , marginTop: metrics.dimen_14,
      marginHorizontal: metrics.dimen_20
    },
    ratingView:
    {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 14,
      marginHorizontal: 20,

    },
    commentMainView: {
      flexDirection: 'column',
      justifyContent: "space-between",
      backgroundColor: colors.white,
      marginHorizontal: metrics.dimen_20

    },
    multilineTextInputStyle: {
      backgroundColor: 'rgba(248, 248, 248, 1)',
      borderColor: 'rgba(227, 227, 227, 1)',
      height: metrics.dimen_150,
      textAlignVertical: 'top',

      fontFamily: metrics.LatoSemiBold_Normal,
      color: colors.app_gray
    },

    submitButtonStyle: {
      backgroundColor: colors.app_Blue,
      borderRadius: metrics.dimen_4,
      height: metrics.dimen_70,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1
    },
    signUpTextStyle: {
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_16,
      color: colors.white,
      marginBottom: metrics.dimen_10,
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase'
    },
    title:
    {
      fontSize: metrics.text_normal,
      color: colors.gray,
      fontFamily: metrics.Lato_SemiBold,
      textTransform: 'capitalize',
    },
    subtitle:
    {
      fontSize: metrics.text_normal,
      fontFamily: metrics.Lato_Italic,
      color: 'rgba(134, 141, 147,1)',

    },
    amountText:
    {
      fontSize: metrics.text_normal,
      fontFamily: metrics.Lato_Regular,
      color: colors.app_Blue,
      marginTop: metrics.dimen_5

    },
    campaignImageView: {
      width: metrics.widthSize(220),
      height: metrics.widthSize(220),
      borderRadius: metrics.dimen_6,

    },
    productView: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      marginTop: metrics.dimen_5,
      marginBottom: metrics.dimen_8,
      backgroundColor: colors.white

    },
    productDetailView: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
      , marginTop: metrics.dimen_14,
      marginBottom: metrics.dimen_14,
      marginHorizontal: metrics.dimen_20
    },
  }
)