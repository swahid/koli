import {
    StyleSheet
 } from 'react-native';
 import metrics from '../../../Themes/Metrics';
 import colors from '../../../Themes/Colors';
import { color } from 'react-native-reanimated';
 

export default StyleSheet.create({
    mainContainer:{
        backgroundColor: colors.backgroundColor,
       // flex:1
    },
    viewImageProductsContainer:{
        width: '100%',
        height: metrics.width,
    },
    imageProductsContainer:{
        width: metrics.width,
        height: metrics.width,
    },
    viewProductDetail:{
        paddingHorizontal: metrics.widthSize(45),
        backgroundColor: colors.white,

    },
    textProductName: {
        marginTop: metrics.aspectRatioHeight(39), 
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(16),
        color: '#3D4046',
    },
    textProductDescriptio: {
        marginTop: metrics.aspectRatioHeight(21), 
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(12),
        color: '#616161',
    },
    viewPriceContainer:{
        marginTop: metrics.aspectRatioHeight(39), 
        marginBottom: metrics.aspectRatioHeight(36), 
        justifyContent: "space-between",
        flexDirection:'row',
        //backgroundColor:'red'

    },
    viewBuyNow:{
        width: metrics.widthSize(258),
        aspectRatio: 86/36,
        backgroundColor: colors.app_Blue,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: metrics.widthSize(18),
    },
    textBuyNow:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(12),
        color: colors.white,
    },
    viewPrice:{
        justifyContent: "center",
        alignItems: "center",
        flexDirection:'row'

       // backgroundColor:'red'
    },
    textPrice: {
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.app_Blue,
    },
    viewDiscountContainer:{
        marginLeft: metrics.widthSize(33),
        flexDirection:'row'
    },
    textDiscount:{
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(12),
        color: "#707070",
        textDecorationLine: 'line-through',
        alignSelf:"center"
    },
    viewDiscountPercent:{
        minWidth: metrics.widthSize(165),
        height: metrics.aspectRatioHeight(60),
        backgroundColor: "#40E8A4",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: metrics.widthSize(8),
        marginLeft: metrics.widthSize(33),

    },
    textDiscountPercent: {
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(11),
        color: colors.white,
    },
    viewMoreProducts:{
        backgroundColor: colors.white,
       // flex:1,
        paddingHorizontal: metrics.widthSize(45),
    },
    viewSeperator:{
        width:'100%',
        backgroundColor: '#F3F3F3',
        height: metrics.aspectRatioHeight(21),

    },
    textMoreProductsFromSeller:{
        marginVertical:  metrics.widthSize(45),
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(14),
        color: colors.text_black,  
    },
    viewUserDetails:{
        flexDirection:'row'
    },
    userImage:{
        width: metrics.widthSize(111),
        height: metrics.widthSize(111),
        borderRadius: metrics.widthSize(55.5)
    },
    viewUserName:{
        marginHorizontal:  metrics.widthSize(24),
        alignSelf:'center'
    },
    textName:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(12),
        color: colors.text_black,  
    },
    textUserName:{
        marginTop: metrics.getHeightAspectRatio(2),
        fontFamily: metrics.Lato_Italic,
        fontSize: metrics.getFontSize(11),
        color: colors.app_Blue,  
    },
    viewDiscountPercentGrid:{
       // maxWidth: metrics.widthSize(165),
        height: metrics.aspectRatioHeight(60),
        backgroundColor: "#40E8A4",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: metrics.widthSize(8),
        paddingHorizontal: metrics.widthSize(15),
        marginBottom: metrics.aspectRatioHeight(21), 
        alignSelf: 'flex-start'

       // marginLeft: metrics.widthSize(33),
    },
    viewPriceGrid:{
       // justifyContent: "space-between",
        alignItems: "center",
        flexDirection:'row',
        marginTop: metrics.aspectRatioHeight(27), 
        marginBottom: metrics.aspectRatioHeight(21), 
    },
    backImageContainer:{
        position:'absolute',
        width: metrics.dimen_48,
        height: metrics.dimen_48,
      //  top:0,
      //  left:0,
       // backgroundColor:'red'
    },
    backImage:{
        marginLeft: metrics.widthSize(45),
        marginTop: metrics.widthSize(45),
        
        shadowColor:colors.app_gray,
        shadowOffset: { width: 0, height: metrics.dimen_3 },
        shadowOpacity: 0.2,
        shadowRadius: metrics.dimen_4,
        elevation: metrics.dimen_6

    },



});