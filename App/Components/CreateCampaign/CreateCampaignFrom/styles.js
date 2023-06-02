import { StyleSheet } from 'react-native';
import metrics from '../../../Themes/Metrics';
// import images from '../../../Themes/Images';

import colors from '../../../Themes/Colors';
// import { commonStyles } from '../../../SupportingFIles/Constants';

export default styles = StyleSheet.create({
    textFieldTitle:{
         marginTop: metrics.dimen_15, 
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
      FilterDropdownStyle:{
        marginTop: metrics.aspectRatioHeight(10), 
        backgroundColor: 'rgba(248, 248, 248, 1)',
        borderRadius: metrics.dimen_4,
        height: metrics.dimen_46,
        alignItems: 'center', 
        flexDirection: 'row',
        width:'85%',
        marginHorizontal: metrics.dimen_27,
      },
      FilterDropdownStyle2:{
        marginTop: metrics.aspectRatioHeight(10), 
        backgroundColor: 'rgba(248, 248, 248, 1)',
        borderRadius: metrics.dimen_4,
        height: metrics.dimen_46,
        alignItems: 'center', 
        flexDirection: 'row',
        width:'85%',
        marginHorizontal: metrics.dimen_27,
      },
      pickerStyles:{
        // marginTop: metrics.aspectRatioHeight(30), 
        backgroundColor: 'rgba(248, 248, 248, 1)',
        borderRadius: metrics.dimen_4,
        alignItems: 'center', 
        flexDirection: 'row',
        width:'85%',alignSelf:'center',
        marginHorizontal: metrics.dimen_27,
      },
      dropdownItemStyle:{
        height:45,alignSelf:'center',
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
      textBudgetDesc:{
        marginTop: metrics.aspectRatioHeight(21), 
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.getFontSize(10),
        color: '#ABABAB',
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
  itemAgeGender:{
    marginRight: metrics.dimen_9,borderRadius: metrics.widthSize(10),
    backgroundColor:'#F8F8F8', 
     flexDirection:'row', 
     marginBottom:metrics.aspectRatioHeight(30),
  },
  selectedItemAgeGender:{
    backgroundColor:colors.app_Blue, 
    shadowColor: '#1658D3',
    shadowOffset: { width: 0, height: metrics.widthSize(10)},
    shadowOpacity: 0.4,
    shadowRadius: metrics.widthSize(10),
    elevation: 1,
  },
  textItemAgeGender:{
    marginVertical:metrics.widthSize(39), 
    marginHorizontal:metrics.widthSize(50), 
    color: '#3E3E46'
  },
  textSelectedItemAgeGender:{
    color: colors.white
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
  imageArrow:{
    height: metrics.dimen_20,
   // backgroundColor:'red', 
    width:metrics.dimen_10,
    right:metrics.widthSize(25), 
    alignSelf:'center',
    position:'absolute',
    
  },
  viewAccountTypeSelction :{
   // marginTop: metrics.aspectRatioHeight(10), 
   // flexDirection: 'row',
   // alignItems:'center',
    marginHorizontal: metrics.dimen_27,

  },
  radioButtonContainer: {
    flexDirection: 'row', 
  },
  radioButton: {
    height: metrics.widthSize(60),
    width: metrics.widthSize(60),
    borderRadius: metrics.widthSize(30),
    borderWidth: metrics.widthSize(4.5),
    borderColor: colors.app_Blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: metrics.dimen_18
  },
  radioButtonInnerCircle: {
        height: metrics.widthSize(24),
        width: metrics.widthSize(24),
        borderRadius: metrics.widthSize(12),
        backgroundColor: colors.app_Blue,
  },
  textSaving:{
    marginTop: metrics.dimen_18,
    marginLeft: metrics.widthSize(21)
  },
  radioButtonCurrent:{
    marginLeft: metrics.widthSize(81)
  },
  radioButtonUnselected: {
    borderColor: colors.bankInfoTextPlacholder,
  },
  viewIgMain:{
    backgroundColor: "#F8F8F8",
  },
  viewIgTopBottomBorder:{
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
  },
  viewIgConnect:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical: metrics.dimen_14,
    marginHorizontal: metrics.dimen_27,
    justifyContent: 'space-between'

  },
  textIgConnect: {
    fontFamily: metrics.Lato_SemiBold,
    fontSize: metrics.getFontSize(14),
    color: "#3E3E46",
  },
  instagramIcon: {
    width: metrics.dimen_15,
    height: metrics.dimen_15
},
countryPickerboxWithShadow: {
  shadowColor: colors.app_black,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.4,
  shadowRadius: 10,  
  elevation: 5,
  marginHorizontal: metrics.dimen_27, 
  height: 300, 
  borderRadius: 10, 
  marginTop: 10
  //backgroundColor:colors.app_Blue, 
 // padding:5
},
textPopupTitle:{
  fontFamily: metrics.Lato_Bold,
  fontSize: metrics.getFontSize(13),
  color: '#3E3E46',
},
textPopupDescription:{
  fontFamily: metrics.Lato_Regular,
  fontSize: metrics.getFontSize(13),
  color: '#3E3E46',
  marginTop: 2
  //flex: 1,
  //backgroundColor:'red'
},
textFieldTitletype:{
  marginTop: metrics.dimen_15, 
  fontFamily: metrics.Lato_SemiBold,
  fontSize: metrics.getFontSize(14),
  color: '#3E3E46',
 
},
});