
import { StyleSheet, Platform } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import colors from '../../../../Themes/Colors';

export const styles = StyleSheet.create({
  mainView: {
    height:'100%', 
    backgroundColor:colors.white
  },
  contentView:{
    alignItems: 'center'
  },
  bannerImageStyle: {
    width: metrics.width,
    height: (metrics.width),
  },
  viewCampaignAndDetail: {
    marginHorizontal: metrics.widthSize(45),
    marginTop: -metrics.getHeightAspectRatio(30),
    borderRadius: metrics.widthSize(20),
    padding: metrics.widthSize(51),
    shadowColor: colors.app_black,
    shadowOffset: { width: 0, height: metrics.dimen_3 },
    shadowOpacity: 0.3,
    shadowRadius: metrics.dimen_4,
    elevation: metrics.dimen_6,
    backgroundColor:colors.white

  },
  textCampaignName: {
    color: colors.text_black,
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_16,
  },
  viewPrice: {
    marginTop: metrics.getHeightAspectRatio(11),
    flexDirection: 'row'
  },
  textPrice: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.text_large,
    color: colors.app_Blue,
  },
  labelPrice: {
    marginLeft: metrics.widthSize(15),
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_11,
    color: '#7A818A',
    alignSelf:'center'
  },
  lineView: {
    marginTop: metrics.getHeightAspectRatio(11),
    borderBottomColor: 'rgba(112,112,112,0.1)',
    borderBottomWidth: 1,
  },
  labelHiredInfluencer: {
    marginTop: metrics.getHeightAspectRatio(14),
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_13,
    color: '#7A818A',
  },
  imageUser: {
    width: metrics.widthSize(150),
    height: metrics.widthSize(150),
    borderRadius: metrics.widthSize(75),
    backgroundColor:'red'
  },
  viewUserName: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginLeft: metrics.widthSize(39),

  },
  textName: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.text_black,
  },
  textUserName: {
    marginTop: metrics.getHeightAspectRatio(4),
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: colors.app_Blue,
  },
  viewAmount: {
    borderRadius: 8,
    zIndex: -3,
    marginHorizontal: metrics.widthSize(45),
    marginTop: -metrics.getHeightAspectRatio(10),
    paddingTop: metrics.getHeightAspectRatio(30),
    paddingHorizontal: metrics.widthSize(50),
    paddingBottom: metrics.getHeightAspectRatio(14),
    backgroundColor: '#ECECEC',
  },
  labelOfferedAmount: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.text_black,
  },
  viewAmountField:{
    backgroundColor: colors.white,
    borderRadius: 5,
    marginTop: metrics.getHeightAspectRatio(8),
    width: '100%',
    alignItems:'center',
    height: metrics.getHeightAspectRatio(46),
    flexDirection:'row',
  },
  textdollar:{
    color: '#C0C4CC',
    borderRadius: 5,
    marginLeft: metrics.widthSize(39),
  },
  textEscrow:{
    color: '#7A818A',
    borderRadius: 5,
   // marginTop: metrics.getHeightAspectRatio(13),
   // alignSelf:'center',
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    marginRight:5
  },
  textInputAmount: {
    marginLeft: metrics.widthSize(20),
    marginRight: metrics.widthSize(20),
    flex:1,
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_normal,
    color: colors.text_black,
    backgroundColor: 'white',
    height: '100%'
  },
  bottomViewStyle: {
    position: 'absolute', 
    left:0, 
   right: 0, 
    bottom: 0, 
    height: metrics.dimen_72, 
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
},
textPayNow: {
  
  color:  colors.white, 
  marginTop:Platform.OS === 'android' ? metrics.dimen_25 : metrics.dimen_18
},
  headerTextStyle: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.text_16,
    color: colors.text_black,
  },
  normalText: {
    fontFamily: metrics.Lato_Italic,
    fontSize: metrics.text_11,
    color: '#7A818A',
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  containerEscrow:{
    flexDirection:'row',
    height:metrics.getHeightAspectRatio(48), 
    alignSelf:'flex-end', 
    justifyContent:'flex-start', 
    marginHorizontal:metrics.widthSize(50), 
    marginTop:metrics.widthSize(17)
  },
  imageInfo:{
    width:metrics.widthSize(42),
    height:metrics.widthSize(42)
  }
});
