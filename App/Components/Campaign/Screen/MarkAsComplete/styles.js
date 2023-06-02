import { StyleSheet } from 'react-native';
import metrics from '../../../../Themes/Metrics';
import colors from '../../../../Themes/Colors';
import { ifIphoneX } from 'react-native-iphone-x-helper'
export default StyleSheet.create({
        centeredView: {
      height:metrics.height,
     width:'100%',
      justifyContent: 'flex-end',
      // position: 'absolute',
      //  bottom: 0,

     // backgroundColor:'red'
    },
    backgroundTouchableView:{
        position: 'absolute',
        top: 0,
        bottom: 0, 
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
     // alignSelf:'flex-end',
      width:'100%',
      borderTopLeftRadius:metrics.dimen_30,
      borderTopRightRadius:metrics.dimen_30,
      backgroundColor: "white",
      ...ifIphoneX({
        paddingBottom: metrics.dimen_30
    }, {
        paddingBottom: 0
    })
      ///padding: 35,
     // alignItems: "center",
      // shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 2
      // },
      // shadowOpacity: 0.25,
      // shadowRadius: 3.84,
      // elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    titleMarkAsComplete:{
      fontSize:metrics.getFontSize(18),
      color: colors.app_black, 
      marginVertical: metrics.aspectRatioHeight(75), 
      fontFamily: metrics.Lato_Bold,
      alignSelf:'center'
    },
    textIinputMarkAsCompleted:{
      marginTop: metrics.aspectRatioHeight(30), 
      marginBottom: metrics.aspectRatioHeight(20), 
      borderRadius: metrics.dimen_5,
      backgroundColor: 'rgba(248, 248, 248, 1)',
      borderColor: 'rgba(227, 227, 227, 1)',
      height: metrics.aspectRatioHeight(282),
      textAlignVertical: 'top',
      paddingHorizontal: metrics.widthSize(54),
      fontFamily: metrics.Lato_SemiBold,
      color: '#3E3E46',
      fontSize: metrics.getFontSize(14),
      marginHorizontal: metrics.dimen_18,
    },
    buttonSubmit:{
      //marginTop: metrics.aspectRatioHeight(40), 
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
      width:'90%',
      alignSelf:'center',
      justifyContent:'center',
      marginHorizontal: metrics.dimen_18,
      marginTop: metrics.aspectRatioHeight(45), 

    },
    textFieldTitle: {
      //marginTop:  metrics.dimen_15, 
      fontFamily: metrics.Lato_SemiBold,
      fontSize: metrics.getFontSize(14),
      color: '#3E3E46',
      marginHorizontal: metrics.dimen_28,
 },

 textFieldTitleRemark: {
  marginTop:  metrics.dimen_15, 
  fontFamily: metrics.Lato_SemiBold,
  fontSize: metrics.getFontSize(14),
  color: '#3E3E46',
  marginHorizontal: metrics.dimen_28,
},
 inputTextFieldStyle:{
  fontFamily: metrics.Lato_SemiBold,
  fontSize: metrics.getFontSize(14),
  color: '#3E3E46',
  width: '100%', 
  height: metrics.dimen_46, 
  backgroundColor: colors.clear, 
  paddingLeft: metrics.dimen_10
 // marginHorizontal: metrics.dimen_27,
},
containerViewStyle:{
  marginTop: metrics.aspectRatioHeight(30), 
  backgroundColor: 'rgba(248, 248, 248, 1)',
  borderRadius: metrics.dimen_4,
  height: metrics.dimen_46,
  alignItems: 'center', 
  flexDirection: 'row',
  marginHorizontal: metrics.dimen_18,
},
   // lineHeight: 28
  });