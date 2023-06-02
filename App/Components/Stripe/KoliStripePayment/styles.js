import { StyleSheet } from 'react-native';
import metrics from '../../../Themes/Metrics';
// import images from '../../../Themes/Images';
import colors from '../../../Themes/Colors';
// import { strings } from '../../../Locales/i18';
// import { commonStyles } from '../../../SupportingFIles/Constants';

export default StyleSheet.create({
    textCampaignName: {
        marginTop: metrics.getHeightAspectRatio(50),
        fontFamily: metrics.Lato_SemiBold,
        fontWeight: '400',
        textAlign:'center',
        fontSize: metrics.text_16,
        color: '#6D6D6D',
        alignSelf:'center',
        width: metrics.widthSize(876)
      },
      textEmail: {
        fontWeight: '400',
          marginLeft: metrics.widthSize(45),
        marginTop: metrics.getHeightAspectRatio(15),
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.app_black,
      },
      textCampaignPrice: {
        marginTop: metrics.getHeightAspectRatio(15),
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(30),
        color: colors.app_black,
        alignSelf:'center',

      },
      textInputStyle:{
        borderRadius: metrics.dimen_4,
        height: metrics.dimen_45,
        backgroundColor: 'rgba(248,248,248,1)',
        paddingHorizontal: metrics.dimen_10,
        marginVertical: metrics.dimen_5,
        marginHorizontal: metrics.widthSize(45),
        borderWidth: metrics.size(0.5) ,
        borderColor: 'rgba(227,227,227,1)',
        shadowColor:'#E3E3E3',
        shadowOffset: { width: 0, height: metrics.size(0.5) },
        shadowOpacity: 1.0,
        shadowRadius: metrics.dimen_3,
        elevation: metrics.dimen_6
    },
    viewStripeTf:{
      paddingHorizontal: metrics.dimen_10,
        marginVertical: metrics.dimen_5,
        marginHorizontal: metrics.widthSize(15),
        shadowColor:'#E3E3E3',
        shadowOffset: { width: 0, height: metrics.size(0.5) },
        shadowOpacity: 1.0,
        shadowRadius: metrics.dimen_4,
        elevation: metrics.dimen_6
        //height: metrics.dimen_50,
    },
    field: {
      marginVertical: metrics.dimen_1,
      borderWidth: metrics.size(0.5) ,
       // width: '90%',
        //color: '#449aeb',
        borderColor: 'rgba(227,227,227,1)',
        borderRadius: metrics.dimen_4,
        backgroundColor: 'rgba(248,248,248,1)',
        overflow: 'hidden',
        
      },
      bottomButton :{
        marginTop: metrics.dimen_30,
        borderRadius:5,
        justifyContent: 'center',
        alignItems:'center',

        height: metrics.aspectRatioHeight(144),
        backgroundColor:  colors.app_Blue,
        marginHorizontal: metrics.widthSize(40),
        shadowColor:colors.app_Blue,
        shadowOffset: { width: 0, height: metrics.size(3) },
        shadowOpacity: 0.5,
        shadowRadius: metrics.dimen_10,
        elevation: metrics.dimen_6
      },
      textPayNow:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(14),
        color: colors.whiteHalfAlpha,
      },
      viewPoweredByStripe: {
        marginTop: metrics.aspectRatioHeight(70),
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        //backgroundColor:'red',

      },
      textPoweredBy:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(12),
        color: '#9E9E9E',
        alignSelf:'center',

      },
      imageStripeLogo:{
        marginTop: metrics.aspectRatioHeight(5),
        marginLeft: metrics.widthSize(12),
        width: metrics.widthSize(100),
        height: metrics.aspectRatioHeight(33),

      },
      viewTermsPrivacy: {
        //marginTop: metrics.aspectRatioHeight(36),
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        height: metrics.aspectRatioHeight(144),
        //backgroundColor:'red',

      },
      viewBack:{
        position:'absolute',
        top:metrics.aspectRatioHeight(0),
        left:metrics.widthSize(42),
        height: metrics.aspectRatioHeight(144),
        flexDirection:'row'
      },
      iconBack:{
        width: metrics.widthSize(60),
        height: metrics.widthSize(60),
      },
      iconKoli:{
        width: metrics.widthSize(54),
        height: metrics.widthSize(63),
        marginLeft:metrics.widthSize(30),

      },
      mandatoryField: {
        borderColor: colors.app_RedColor,
      },
      downIcon:{
        alignSelf:'center',
        position: 'absolute',
        width: metrics.widthSize(60),
        height: metrics.widthSize(60),
        right : metrics.widthSize(80),
        top:'30%'
      },
});
