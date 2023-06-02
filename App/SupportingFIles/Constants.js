import { StyleSheet } from "react-native"
import metrics from "../Themes/Metrics"
import colors from '../Themes/Colors';
import { Platform } from 'react-native';

export const FBANavigationEntity = "navigation"
export const FBACampaignEntity = "campaign"

export const webPageUrl = {
  termsConditions: 'https://staging-api.koliapp.com/terms-and-conditons.html',
  privacyPolicy: 'https://staging-api.koliapp.com/privacy-policy.html',
  aboutKoli: 'https://staging-api.koliapp.com/about.html',
  faq: 'https://staging-api.koliapp.com/faq',
}
export const keys = {
    isLogin: 'isUserLogin',
    userId: 'userId',
    userData: 'userData',
    Fname:'Fname',
    Lname:'Lname',
    Avtarurl:'Avtarurl',
    accessToken: 'accessToken',
    navigationObj: 'navigationObj',
    feesAndCommission: 'feesAndCommission',
    chatDataFetched: 'chatDataFetched',
    influencerSortType:'influencerSortType'

}

export const instainfo=
{
  appId:'583326835918001',
  appSecret:'f7471f15d9ad375383f0fdf1e9d6a590',
  redirectUrl:'https://koli.ai/'
}

export const loginValues = {
  loginEmail: '',
  loginPassword: '',
}

export const SignupUserTypes = { 
  Influencer: 'influencer',
  Brand: 'brand',
  Agency: 'agency',
  Others: 'others'
};
export const isAutoLoginEnabled = true

export const commonStyles = StyleSheet.create({
  progressBarStyle:{
    backgroundColor: 'rgba(246, 246, 246, 1)',
    marginTop: metrics.dimen_5
  },
  LatoBold_24:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_24,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_28:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxxl,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_22:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_xxl,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_18:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_large,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_16:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_14:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_normal,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoBold_12:{
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_medium,
    color: 'rgba(61, 64, 70, 1)'
  },
  LatoRegular_Medium:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: 'rgba(117, 118, 122, 1)'
  },
  LatoRegular_Normal:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: 'rgba(117, 118, 122, 1)'
  },
  LatoRegular_Large:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_large,
    color: 'rgba(117, 118, 122, 1)'
  },
  LatoSemiBold_Normal:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_normal,
    color: 'rgba(117, 118, 122, 1)'
  },
  LatoSemiBold_Small:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_small,
    color: 'rgba(117, 118, 122, 1)'
  },
  LatoItalic_Medium:{
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_medium,
    color: 'rgba(117, 118, 122, 1)'
  },
  campaignViewStyle:{
    backgroundColor: 'rgba(248, 248, 248, 1)',
    borderColor: 'rgba(227, 227, 227, 1)',
    borderWidth: metrics.dimen_1,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_46,
    alignItems: 'center', 
    flexDirection: 'row'
  },
  campaignViewfilter:{
    height: metrics.dimen_46,
    alignItems: 'center', 
    flexDirection: 'row'
  },
  NextButtonStyle:{
    backgroundColor: colors.app_Blue, 
    paddingVertical: metrics.dimen_6, 
    marginBottom:  metrics.dimen_35,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    borderRadius: metrics.dimen_4
  },
  FeesButton:{
    backgroundColor: colors.app_Blue, 
    paddingVertical: metrics.dimen_4, 
    marginBottom:  metrics.dimen_5,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 1},
    borderRadius: metrics.dimen_4
  },
  commingsoon:{
    backgroundColor: colors.app_Blue, 
    paddingVertical: metrics.dimen_4, 
    marginBottom:  metrics.dimen_5,
    marginTop:metrics.dimen_20,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 1},
    borderRadius: metrics.dimen_10
  },
  otherButtonStyle:{
    backgroundColor: 'rgba(248, 248, 248, 1)',
    paddingVertical: metrics.dimen_6, 
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227, 227, 227, 1)',
    borderRadius: metrics.dimen_4
  },
  multilineTextInputStyle:{
    backgroundColor: 'rgba(248, 248, 248, 1)',
    borderColor: 'rgba(227, 227, 227, 1)',
    borderWidth: metrics.dimen_1,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_150,
    textAlignVertical: 'top',
    paddingHorizontal: metrics.dimen_10,
    fontFamily: metrics.LatoSemiBold_Normal,
    color: colors.app_gray
  },

  multilineTextInputAddReviewStyle:{
    backgroundColor: 'rgba(248, 248, 248, 1)',
    borderColor: 'rgba(248, 248, 248, 1)',
    borderWidth:metrics.dimen_5,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_100,
    paddingHorizontal: metrics.dimen_10,
    paddingVertical:metrics.dimen_10,
    fontFamily: metrics.LatoSemiBold_Normal,
    color: colors.app_gray
  },
  errorTextStyle:{
    fontFamily: metrics.LatoRegular_Normal,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_5,
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16, 
    marginTop: Platform.OS == 'android' ? metrics.dimen_4 : 0
  },
  AppButtonStyle:{
    backgroundColor: colors.app_Blue, 
    paddingHorizontal: metrics.dimen_10, 
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    borderRadius: metrics.dimen_4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: metrics.dimen_1
  },

  AppButtonStylemalefemale:{
    paddingHorizontal: metrics.dimen_10, 
    borderRadius: metrics.dimen_4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: metrics.dimen_1
  },
  bannerImageStyle:{
      width: metrics.width,
      height: (metrics.width) /1.43,
  },
  cellStyle: {
    width: metrics.dimen_145,
    height: 110,
    marginRight:metrics.dimen_27,
    marginTop:metrics.dimen_20
},
squareCellStyle: {
  width: metrics.dimen_110,
  height: metrics.dimen_110,
  marginRight:metrics.dimen_10,
  marginTop:metrics.dimen_20
},
cellSubViewStyle: {
    width: metrics.dimen_145,
    height: 100,
    margin: 2,
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'rgba(227, 227, 227, 1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
},
squareCellSubViewStyle: {
  width: metrics.dimen_100,
  height: metrics.dimen_100,
  margin: 2,
  marginTop: 10,
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'rgba(227, 227, 227, 1)',
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
  
},
imageContainerStyle: {
  width: metrics.dimen_145,
  height: 100,
  margin: 0,
  borderRadius: 5
},
squareImageContainerStyle: {
  width: metrics.dimen_100,
  height: metrics.dimen_100,
  margin: 0,
  borderRadius: 5
},
cancelButtonMainViewStyle: {
  position: 'absolute',
  width: 60,
  height: 60,
  backgroundColor: 'transparent',
  right: -10,
  top: -10,
},
cancelButtonStyle: {
  width: 24,
  height: 24,
  backgroundColor: colors.app_Blue,
  marginTop: 0,
  marginLeft: 35,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center'
},
CampaignNextButtonStyle:{
  backgroundColor: colors.app_Blue, 
  paddingVertical: metrics.dimen_6, 
  bottom:  metrics.dimen_35,
  shadowColor: colors.app_Blue,
  shadowOpacity: 0.5,
  shadowOffset: {width: 2, height: 2},
  borderRadius: metrics.dimen_4,
  position:'absolute',
  width:'87%',
  alignSelf:'center'
},
submitButtonStyle:{
  backgroundColor: colors.app_Blue, 
  paddingVertical: metrics.dimen_6, 
  marginTop:  metrics.dimen_10,
  shadowColor: colors.app_Blue,
  shadowOpacity: 0.5,
  shadowOffset: {width: 2, height: 2},
  borderRadius: metrics.dimen_4,
  width:'85%',
  alignSelf:'center'
},
backButtonContainercampaign: {
  
  marginLeft: metrics.dimen_16, 
  marginTop: Platform.OS === 'android' ? metrics.dimen_4 : 0
},
})