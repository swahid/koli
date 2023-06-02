import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { commonStyles } from '../../../SupportingFIles/Constants';
import { gettUserData } from '../../../SupportingFIles/Utills';


class AffiliateSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
     affiliatecode:""
    };
    context = this
  }

  

  
  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ ...commonStyles.backButtonContainercampaign }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image style={{ tintColor: colors.app_black }} source={images.backImage} />
        </TouchableOpacity>
      ),

      headerTitle: () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', color: "#1A1E24" }}>
          <Text style={{ fontFamily: metrics.Lato_Bold, fontSize: metrics.text_16, width: metrics.widthSize(700), textAlign: 'center',textTransform:'capitalize' }}
            numberOfLines={1}>
         {strings("affiliateSettings")}
          </Text>
        </View>
      )
    })
    this.props.navigation.addListener('focus', () => {
      this.resetUserData()
      
    });

   
   
  }


  

 
  updatCode = (text) => {

    this.setState({affiliatecode:text})
   

  }

  updateProfile()
  {

      this.props.MyProfileStore.setaffilateCode(this.state.affiliatecode)
      let param = {
        affilateCode: this.state.affiliatecode
      }
      this.props.MyProfileStore.updateAffiliateCode(param)
      
      
      
}


  resetUserData = () => {
    const store = this.props.MyProfileStore
    gettUserData().then(data => {
      this.setState({affiliatecode: data.affilateCode!=="NA"?data.affilateCode:""})
      

    })

  }
 
  render() {
    const store = this.props.MyProfileStore
    const {  isLoading ,affilateCode,backAfterupdatecode} = store

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>


        <Loader loading={isLoading} />


        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
        >

       <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_25}}>
            {strings('Affiliate_code_optional')}
          </Text>
         </View>   
        

          <TextInput style={[styles.textInputStyle]}
            placeholder={strings('EnterAffiliateCode')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={this.state.affiliatecode}
            onChangeText={(text) => this.updatCode(text)}
            autoCompleteType="off"
            autoCorrect={false}
          />

         
<View style={{backgroundColor:'rgba(252,248,235,1)',padding:metrics.dimen_10,marginHorizontal:metrics.dimen_20,marginTop:metrics.dimen_10,borderRadius:metrics.dimen_5}}>
<Text style={{ ...styles.signUpTextStyle}}>
            {strings('how_does_affiliatemarkettingwork')}
          </Text>
          <Text style={{ ...styles.textPopupDescription}}>
            {strings('Find_and_join_affiliate_programm')}
          </Text>
          <Text style={{ ...styles.textPopupDescription}}>
            {strings('Choose_which_offer_to_promote')}
          </Text>
          <Text style={{ ...styles.textPopupDescription}}>
            {strings('Obtain_a_unique_affiliate')}
          </Text>
          <Text style={{ ...styles.textPopupDescription}}>
            {strings('Share_those_link_on_your_blog')}
          </Text>
          <Text style={{ ...styles.textPopupDescription}}>
            {strings('Collect_a_commision_anytime')}
          </Text>
         
</View>
        

        </KeyboardAwareScrollView>
        <TouchableOpacity style={{ ...styles.bottomViewStyle }}
            onPress={() => this.updateProfile()}>
            <Text style={[commonStyles.LatoBold_16, styles.submitButton]}>
              {strings('Submit')}</Text>
          </TouchableOpacity>
          {backAfterupdatecode===true?this.backview():null}
      </View>
     
    );
  }
backview()
{
  
    this.props.navigation.goBack()
    this.props.MyProfileStore.setbackAfterupdatecode(false)
  
}

}
export default inject('MyProfileStore', 'AuthStore')(observer(AffiliateSettings))

const styles = StyleSheet.create({
  textInputStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_5,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)'
  },
  emptyInputStyle: {
    borderWidth: 0.5,
    borderColor: colors.app_RedColor
  },
  textInputStylenoteditable: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    paddingHorizontal: metrics.dimen_10,
    marginVertical: metrics.dimen_5,
    marginHorizontal: metrics.dimen_20,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
    color: 'rgba(114, 114, 114, 1)'
  },
  PickerStyle: {
    borderRadius: metrics.dimen_4,
    height: metrics.dimen_45,
    backgroundColor: 'rgba(248,248,248,1)',
    marginVertical: metrics.dimen_10,
    borderWidth: metrics.dimen_1,
    borderColor: 'rgba(227,227,227,1)',
  },
  signUpTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(15),
    color: 'rgba(62,62,62,70)'


  },
  interestButtonStyle: {
    marginRight: metrics.dimen_10,
    marginBottom: metrics.dimen_10,
    paddingVertical: metrics.dimen_2,

  },
  interestTextStyle: {
    fontFamily: metrics.Lato,
    fontWeight: metrics.LatoBold,
    fontSize: metrics.text_normal,
  },
  addButtonStyle: {
    backgroundColor: colors.app_Blue,
    marginBottom: metrics.dimen_35,
    shadowColor: colors.app_Blue,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    borderRadius: metrics.dimen_4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButtonContainer: {
    marginLeft: metrics.dimen_16,
    marginTop: Platform.OS == 'android' ? metrics.dimen_6 : 0
  },
  tabStyle: {},
  scrollStyle: {
    backgroundColor: 'white',

  },
  tabBarTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  underlineStyle: {
    backgroundColor: colors.app_Blue,
  },
  insatgramUserNameText: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomViewStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: metrics.dimen_72,
    backgroundColor: colors.app_Blue,
    alignItems: 'center',
  },
  submitButton: {
    color: 'white', marginTop: Platform.OS == 'android' ? metrics.dimen_25 : metrics.dimen_18, textTransform: 'uppercase'
  },
  headerUserName: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(16),
    marginLeft: 10,
    textTransform: 'capitalize',
    width: Platform.OS === 'ios' ? metrics.dimen_130 : metrics.dimen_190,
    textAlignVertical: 'center'
  },
  textPopupDescription:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.getFontSize(14),
    color: 'rgba(125, 123, 139, 1)',
    marginTop: 2
  },

})