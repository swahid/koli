import { StyleSheet } from 'react-native';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';

export default StyleSheet.create({
    mainContainer:{
        backgroundColor: colors.white,
        flex: 1
    },
    viewForm:{
        marginHorizontal: metrics.widthSize(81),
       // flexDirection: 'row',
        marginTop: metrics.aspectRatioHeight(66),
    },
    textFieldTitle: {
        marginTop: metrics.aspectRatioHeight(90), 
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.bankInfoListValue,
   },
   inputTextFieldStyle:{
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.getFontSize(14),
    color: colors.bankInfoListValue,
    
    width: '100%', 
    height: metrics.dimen_46, 
    backgroundColor: colors.clear, 
    marginLeft: metrics.widthSize(33)
  },
  campaignViewStyle:{
    marginTop: metrics.aspectRatioHeight(30), 
    backgroundColor: colors.bankInfoTextInputBackground,
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_46,
    alignItems: 'center', 
    paddingRight: metrics.dimen_4,
   // paddingLeft: metrics.dimen_10,
    flexDirection:'row'
  },
  dobSytle:{
    width:'32%', 
    marginRight:metrics.dimen_5,
  },
  viewAccountTypeSelction :{
    marginTop: metrics.aspectRatioHeight(39), 
    flexDirection: 'row',
    alignItems:'center',

  },
  radioButtonContainer: {
    flexDirection: 'row', 
  },
  radioButton: {
    height: metrics.widthSize(60),
    width: metrics.widthSize(60),
    borderRadius: metrics.widthSize(30),
    borderWidth: metrics.widthSize(4.5),
    borderColor: colors.app_Blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInnerCircle: {
        height: metrics.widthSize(24),
        width: metrics.widthSize(24),
        borderRadius: metrics.widthSize(12),
        backgroundColor: colors.app_Blue,
  },
  textSaving:{
    marginTop: 0,
    marginLeft: metrics.widthSize(21)
  },
  radioButtonCurrent:{
    marginLeft: metrics.widthSize(81)
  },
  radioButtonUnselected: {
    borderColor: colors.bankInfoTextPlacholder,
  },
   buttonSubmit:{
    marginTop: metrics.aspectRatioHeight(80), 
    marginBottom: metrics.aspectRatioHeight(40), 
    height: metrics.aspectRatioHeight(138), 
    backgroundColor: colors.app_Blue, 
    //paddingVertical: metrics.dimen_6, 
    //bottom:  metrics.dimen_35,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    borderRadius: metrics.dimen_4,
    //position:'absolute',
    width:'85%',
    alignSelf:'center',
    justifyContent:'center',
    marginHorizontal: metrics.dimen_27,
  },
  errorTextStyle:{
    fontFamily: metrics.LatoRegular_Normal,
    color: colors.app_RedColor,
    marginTop: metrics.dimen_2,
    alignSelf:'flex-start',
  },
  datePickerContainerView:{
    backgroundColor:'#00000080',
    width: '100%',
   flex:1,
    alignItems:'flex-end',
    justifyContent:'flex-end'
    //height:200
  },
  textNotice:{
    fontFamily: metrics.Lato_Italic,
    color: colors.app_RedColor,
    fontSize: metrics.text_13,
    marginBottom: metrics.aspectRatioHeight(90), 
    textAlign:"center"

  },
  imageCalendar: {
    width:metrics.dimen_16,
    height: metrics.dimen_16,
    tintColor: colors.app_gray
  }
});