import { StyleSheet, Platform } from 'react-native';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';

export default StyleSheet.create({
    containerStyle:{
        backgroundColor: colors.white, 
        flex: 1,
    },
    keybaordAwerScrollView:{ 
       // marginTop: metrics.dimen_10
    },
    contentView:{ 
        justifyContent: 'space-between', 
        flex: 1 },
        textFieldTitle:{
            marginTop: metrics.aspectRatioHeight(84), 
            fontFamily: metrics.Lato_SemiBold,
            fontSize: metrics.getFontSize(14),
            color: '#3E3E46',
            marginHorizontal: metrics.dimen_27,
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
         inputTextFieldStyle:{
           fontFamily: metrics.Lato_SemiBold,
           fontSize: metrics.getFontSize(14),
           color: '#3E3E46',
          // marginHorizontal: metrics.dimen_27,
         },
         multilineTextInputStyle:{
           marginTop: metrics.aspectRatioHeight(30), 
           borderRadius: metrics.dimen_5,
           backgroundColor: 'rgba(248, 248, 248, 1)',
           borderColor: 'rgba(227, 227, 227, 1)',
           height: metrics.aspectRatioHeight(330),
           textAlignVertical: 'top',
           paddingTop: metrics.aspectRatioHeight(39),
           paddingHorizontal: metrics.aspectRatioHeight(33),
           fontFamily: metrics.Lato_SemiBold,
           color: '#3E3E46',
           fontSize: metrics.getFontSize(14),
           marginHorizontal: metrics.dimen_27,
          // lineHeight: 28
         },
         buttonSubmit:{
            marginTop: metrics.aspectRatioHeight(40), 
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
            width:'87%',
            alignSelf:'center',
            justifyContent:'center',
            marginHorizontal: metrics.dimen_27,
          },
          imageArrow:{
            height: metrics.dimen_20,
           // backgroundColor:'red', 
            width:metrics.dimen_10,
            right:metrics.widthSize(25), 
            alignSelf:'center',
            position:'absolute',
            
          },
          errorTextStyle:{
            fontFamily: metrics.LatoRegular_Normal,
            color: colors.app_RedColor,
            marginTop: metrics.dimen_5,
            alignSelf:'flex-start',
            marginHorizontal: metrics.dimen_27,
          },
          textCategory:{
            fontFamily: metrics.Lato_Regular,
            fontSize: metrics.getFontSize(11),
            color: colors.app_Blue,
            margin: metrics.dimen_8,
            //backgroundColor:'red'
          },
          textCategoryContainer:{
            marginRight: metrics.dimen_8,
            borderRadius: 5, 
            backgroundColor:'#F8F8F8', 
            flexDirection:'row', 
            marginBottom:metrics.aspectRatioHeight(30),                   
          },
          imageCross:{
            marginTop: metrics.dimen_1,
            width:metrics.widthSize(25), 
            height:metrics.widthSize(25), 
            alignSelf:'center',
            marginRight:metrics.widthSize(30), 
            tintColor: colors.app_Blue
          },
          viewTransactionListItem:{
            marginTop: metrics.dimen_20,
            marginHorizontal: metrics.dimen_15,
            flexDirection:'row'

          },
          transactionImage:{
            width: metrics.dimen_44,
            height: metrics.dimen_44,

          },
          viewProductData:{
       
            marginHorizontal: metrics.widthSize(45),
            marginVertical: metrics.heightSize(60),
            flexDirection: 'row'
        },
        imageProduct:{
            width: metrics.widthSize(153),
            height: metrics.widthSize(153),
            borderRadius: metrics.dimen_8,
        },
        textProductName: {
          marginLeft: metrics.widthSize(36), 
          fontFamily: metrics.Lato_Bold,
          fontSize: metrics.getFontSize(16),
          color: '#3D4046',
      },
      emptyContainer:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
       height:'100%',
        marginTop: -metrics.dimen_40
    },
      imageNoTransactions:{
        width: metrics.widthSize(90),
        height: metrics.widthSize(90),
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
        textAlign: 'center'
    },
        //   emptyContainer:{
        //     alignItems:'center',
        //     justifyContent: 'center',
        //     backgroundColor: colors.white,
        //     flex: 1,
        //     marginTop: -metrics.dimen_30
        // },


        
        startShoppingContainer:{
          backgroundColor:colors.app_Blue, 
          shadowColor: '#1658D3',
          shadowOffset: { width: 0, height: metrics.widthSize(10)},
          shadowOpacity: 0.4,
          shadowRadius: metrics.widthSize(10),
          borderRadius: metrics.widthSize(18),
          elevation: 1,
          marginTop: metrics.dimen_30
        },
        textStartShopping:{
          marginVertical:metrics.widthSize(39), 
          marginHorizontal:metrics.widthSize(50), 
          color: colors.white,
          textTransform: 'uppercase',
          fontFamily: metrics.Lato_Bold,
          fontSize: metrics.getFontSize(14),
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