import { StyleSheet } from 'react-native';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';

export default StyleSheet.create({
    contentView:{ 
       // justifyContent: 'space-between', 
      flex: 1, 
      //marginBottom: metrics.dimen_50,
      backgroundColor: colors.white, 

    },
    containerStyle:{
        backgroundColor: colors.white, 
        
        //flex: 1,
    },
    emptyContainer:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        flex: 1,
        marginTop: -metrics.dimen_30
    },
    imageAddAddress:{
        width: metrics.widthSize(189),
        height: metrics.widthSize(189),
    },
    textEmptyAddress:{
        marginTop: metrics.dimen_10,
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(20),
        color: colors.app_black,
        marginHorizontal: metrics.dimen_50,
        textAlign: 'center',
        letterSpacing: metrics.widthSize(2)
    },
    textPlaceholderDetail:{
        marginTop: metrics.dimen_5,
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(14),
        color: '#1A1E24',
    },
    listContainer: {
       // marginHorizontal: metrics.widthSize(66),
       // marginVertical: metrics.aspectRatioHeight(60),
        backgroundColor: colors.white, 

    },
    textName:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(14),
        color: colors.app_black,
    },
    
    textAddress:{
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(12),
        color: colors.bankInfoListValue,
        marginTop: metrics.dimen_10,
    },
    viewListItem:{
        marginHorizontal: metrics.widthSize(66),
        marginTop: metrics.aspectRatioHeight(40)
    },
    borderBottomLine:{
        marginTop: metrics.aspectRatioHeight(40),
        backgroundColor: '#C0C4CC',
        height:0.5
      },
});