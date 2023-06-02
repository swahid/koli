import {
    StyleSheet,
    Platform
 } from 'react-native';
 import metrics from '../../../Themes/Metrics';
 import colors from '../../../Themes/Colors';
 
 export default StyleSheet.create({
     mainView:{
         flex:1,
         backgroundColor: "#F3F3F3"
     },
     emptyContainer:{
        alignItems:'center',
        justifyContent: 'center',
      //  backgroundColor: colors.white,
        flex: 1,
        marginTop: -metrics.dimen_30
    },
    listContainer: {
        
         marginTop: metrics.aspectRatioHeight(21),
       
 
     },
     viewSteps:{
        alignItems:'center',
        justifyContent:'center',
        paddingVertical: metrics.getHeightAspectRatio(39),
        backgroundColor: colors.white,

     },
     viewConetentSteps:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
     },
     viewStepNumber:{
        width: metrics.widthSize(66),
        height: metrics.widthSize(66),
        borderRadius: metrics.widthSize(33),
        backgroundColor: "#508DFF",
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor: "#508DFF"
     },
     viewLine:{
         width: metrics.widthSize(207),
         height: 1,
         backgroundColor:"#508DFF",
         marginHorizontal: metrics.widthSize(16.5)
     },

    labelStepCircle:{
       
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(12),
        color: colors.white,
        textAlign: 'center',        
    },
    radioButton: {
        height: metrics.widthSize(60),
        width: metrics.widthSize(60),
        borderRadius: metrics.widthSize(30),
        borderWidth: metrics.widthSize(4.5),
        borderColor: colors.app_Blue,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: metrics.dimen_10
        
      },
      radioButtonInnerCircle: {
            height: metrics.widthSize(24),
            width: metrics.widthSize(24),
            borderRadius: metrics.widthSize(12),
            backgroundColor: colors.app_Blue,
      },
      viewListItem:{
        marginHorizontal: metrics.widthSize(66),
        marginTop: metrics.aspectRatioHeight(40),
        flexDirection: 'row',
        
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
        marginTop:Platform.OS === 'android' ? metrics.dimen_25 : metrics.dimen_18,
        textTransform:'uppercase'
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
        width:'89%',
        alignSelf:'center',
        justifyContent:'center',
        marginHorizontal: metrics.widthSize(66),
      },
      viewProductData:{
       
          marginHorizontal: metrics.widthSize(45),
          marginVertical: metrics.heightSize(60),
          flexDirection: 'row'
      },
      imageProduct:{
          width: metrics.widthSize(258),
          height: metrics.widthSize(258),
          borderRadius: metrics.dimen_8,
      },
      textProductName: {
        marginLeft: metrics.widthSize(36), 
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.getFontSize(16),
        color: '#3D4046',
    },
    textItemLeft:{
        marginTop: metrics.dimen_10,
        marginLeft: metrics.widthSize(36), 
        fontFamily: metrics.Lato_SemiBold,
        fontSize: metrics.getFontSize(16),
        color: '#FF6767',
    }
    
 });