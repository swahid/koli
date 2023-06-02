import {
   StyleSheet
} from 'react-native';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

export default StyleSheet.create({
    mainContainer:{
backgroundColor: colors.backgroundColor
    },
    listView:{
        marginTop: metrics.aspectRatioHeight(21), 
    },

    cellContainer:{
        padding: metrics.widthSize(24),
        backgroundColor: colors.white,
        marginBottom: metrics.aspectRatioHeight(21), 
        //flexDirection:"row"
    },
    imageProduct: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: metrics.widthSize(24),
        //backgroundColor:'red'
    },
    viewProductDetail:{
        paddingHorizontal: metrics.widthSize(21),
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
        backgroundColor: "#58DC72",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: metrics.widthSize(12),
        marginLeft: metrics.widthSize(33),

    },
    textDiscountPercent: {
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(11),
        color: colors.white,
    },



});