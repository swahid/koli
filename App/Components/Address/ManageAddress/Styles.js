import { StyleSheet, Platform } from 'react-native';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';

export default StyleSheet.create({
    contentView:{ 
       // justifyContent: 'space-between', 
      // flex: 1 
      marginBottom:Platform.OS === 'ios' ? metrics.dimen_40 : metrics.dimen_50
    },
    containerStyle:{
        backgroundColor: colors.white, 
        
        //flex: 1,
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
    submitButton:{
        color:  colors.white, 
        marginTop:Platform.OS === 'android' ? metrics.dimen_25 : metrics.dimen_18
    },
    campaignViewStyle:{
        marginTop: metrics.aspectRatioHeight(30), 
        backgroundColor: 'rgba(248, 248, 248, 1)',
        borderRadius: metrics.dimen_4,
        height: metrics.dimen_46,
        alignItems: 'center', 
        flexDirection: 'row',
        marginHorizontal: metrics.dimen_27,
      },
      textFieldTitle: {
        marginTop: metrics.aspectRatioHeight(90), 
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.bankInfoListValue,
        marginHorizontal: metrics.dimen_27,

   },
      inputTextFieldStyle:{
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(14),
        color: colors.bankInfoListValue,
        
        width: '100%', 
        height: metrics.dimen_46, 
        backgroundColor: colors.clear, 
        marginLeft: metrics.widthSize(33),
        marginHorizontal: metrics.dimen_27,

      },
      errorTextStyle:{
        fontFamily: metrics.LatoRegular_Normal,
        color: colors.app_RedColor,
        marginTop: metrics.dimen_2,
        alignSelf:'flex-start',
        marginHorizontal: metrics.dimen_27,

      },
});