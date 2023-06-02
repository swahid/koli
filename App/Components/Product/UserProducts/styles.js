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
     listView:{
        // marginTop: metrics.aspectRatioHeight(7), 
     },
 
     cellContainer:{
         paddingTop: metrics.widthSize(24),
         paddingLeft: metrics.widthSize(24),
         backgroundColor: colors.white,
        // alignItems:'center',
         width:"49.8%",
        // aspectRatio:187/252,
         marginTop: metrics.aspectRatioHeight(7), 

        // backgroundColor:'red'
        // marginBottom: metrics.aspectRatioHeight(21), 
         //flexDirection:"row"
     },
     imageProduct: {
         width: '91%',
         aspectRatio: 1,
         borderRadius: metrics.widthSize(24),
         //backgroundColor:'red'
     },
     viewProductDetail:{
         paddingHorizontal: metrics.widthSize(21),
     },
     textProductName: {
         marginTop: metrics.aspectRatioHeight(45), 
         fontFamily: metrics.Lato_Bold,
         fontSize: metrics.getFontSize(14),
         color: '#3D4046',
     },
     viewPriceContainer:{
         marginTop: metrics.aspectRatioHeight(27), 
         justifyContent: "space-between",
         flexDirection:'row',
         //backgroundColor:'red'
 
     },
     viewPrice:{
         justifyContent: "space-between",
         alignItems: "center",
         flexDirection:'row',
         marginTop: metrics.aspectRatioHeight(27), 
         marginBottom: metrics.aspectRatioHeight(45), 

        // backgroundColor:'red'
     },
     textPrice: {
         fontFamily: metrics.Lato_SemiBold,
         fontSize: metrics.getFontSize(10),
         color: colors.app_Blue,
     },
     viewDiscountContainer:{
         marginLeft: metrics.widthSize(18),
         flexDirection:'row',
     },
     textDiscount:{
         fontFamily: metrics.Lato_SemiBold,
         fontSize: metrics.getFontSize(10),
         color: "#707070",
         textDecorationLine: 'line-through',
         alignSelf:"center"
     },
     viewDiscountPercent:{
         minWidth: metrics.widthSize(129),
         height: metrics.aspectRatioHeight(51),
         backgroundColor: "#58DC72",
         justifyContent: "center",
         alignItems: "center",
         borderRadius: metrics.widthSize(6),
         marginLeft: metrics.widthSize(18),
 
     },
     textDiscountPercent: {
         fontFamily: metrics.Lato_SemiBold,
         fontSize: metrics.getFontSize(10),
         color: colors.white,
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

     }
 
 
 
 });