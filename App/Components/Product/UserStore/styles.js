import {
    StyleSheet
 } from 'react-native';
 import metrics from '../../../Themes/Metrics';
 import colors from '../../../Themes/Colors';
 
 export default StyleSheet.create({
     mainContainer:{
 backgroundColor: colors.backgroundColor,
 flex:1
     },
     viewAddProduct:{
         position: "absolute",
         right: metrics.widthSize(90),
         bottom: metrics.widthSize(90),
         width: metrics.widthSize(177),
         aspectRatio: 1,
         backgroundColor:colors.white,
         borderRadius: metrics.widthSize(88.5),
         justifyContent: 'center',
         alignItems: 'center',
         shadowColor:colors.app_black,
      shadowOffset: { width: 0, height: metrics.dimen_3 },
      shadowOpacity: 0.3,
      shadowRadius: metrics.widthSize(88.5),
      elevation: metrics.dimen_6
     },
     imagePlus:{
        width: metrics.widthSize(48),
        aspectRatio:1,

     },
     activeTabTextStyle:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(16),
        color: colors.app_Blue,
     },
     inactiveTabTextStyle:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(16),
        color: "rgba(61,64,70,0.3)",
       
     }
 
 
 
 
 });