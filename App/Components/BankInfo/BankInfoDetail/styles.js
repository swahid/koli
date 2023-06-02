import { StyleSheet } from 'react-native';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';

export default StyleSheet.create({
    headerRightContainer:{
        marginRight: metrics.dimen_10, 
        flexDirection: 'row',
       // backgroundColor:'red',
        width: metrics.widthSize(144),
        height: metrics.widthSize(144),
        alignItems:'center'
    },
    imagePlus: {
        marginLeft: metrics.dimen_22,
        width: metrics.widthSize(48),
        height: metrics.widthSize(48),

    },
    imageEdit: {
        marginLeft: metrics.dimen_22,
        width: metrics.widthSize(60),
        height: metrics.widthSize(60),

    },
    mainContainer:{
        backgroundColor: colors.white,
        flex: 1
    },
    emptyContainer:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        flex: 1,
        marginTop: -metrics.dimen_30
    },
    imageBankInfo:{
        width: metrics.widthSize(189),
        height: metrics.widthSize(189),
    },
    textEmptyBankInfo:{
        marginTop: metrics.dimen_24,
        fontFamily: metrics.Lato_Italic,
        fontSize: metrics.getFontSize(16),
        color: colors.bankInfoTextColor,
        marginHorizontal: metrics.dimen_50,
        textAlign: 'center',
        letterSpacing: metrics.widthSize(2)
    },
    listContainer: {
        marginHorizontal: metrics.widthSize(72),
        marginVertical: metrics.aspectRatioHeight(102)
    },
    viewListItem: {
        flexDirection: 'row'
    },
    textTitle: {
        width: '50%',
        textAlign:'left',
        fontSize: metrics.getFontSize(14),
        fontFamily: metrics.Lato_SemiBold,
        color: colors.bankInfoListTitle,
        marginBottom: metrics.aspectRatioHeight(72),
        letterSpacing: 0.5,
    },
    textValue: {
        color: colors.bankInfoListValue,
        //textTransform: 'capitalize'
    },
});