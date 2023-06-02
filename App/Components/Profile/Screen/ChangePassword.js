import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image,} from 'react-native';
import { observer, inject } from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { commonStyles, instainfo } from '../../../SupportingFIles/Constants';
import { gettUserData,showAlert,getAccessToken } from '../../../SupportingFIles/Utills';




class ChangePassword extends Component {
  constructor(props) {
    super(props);
    
    context = this
  }

  

  
  componentDidMount() {
this.props.SettingsStore.setoldPassword("")
this.props.SettingsStore.setnewPassword("")

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
         {strings("change_Password")}
          </Text>
        </View>
      )
    })
    // this.props.navigation.addListener('focus', () => {
    //   this.resetUserData()
      
    // });

   
   
  }


  

 


  updatePassword()
  {
    if(this.props.SettingsStore.oldPassword.trim()==="")
    {
      showAlert("","Please enter Old Password")
    }else if(this.props.SettingsStore.newPassword.trim()==="")
    {
      showAlert("","Please enter New Password")

    }else if (this.props.SettingsStore.newPassword.length < 8)
    {
      showAlert("",strings("PasswordLengthMessage"))
      
     }else{
      getAccessToken().then(accessToken => {
      const params = {
        oldPassword: this.props.SettingsStore.oldPassword,
        newPassword	: this.props.SettingsStore.newPassword

      }
      this.props.SettingsStore.changePassword(params,accessToken)
    });
    }
  }


//   resetUserData = () => {
//     const store = this.props.MyProfileStore
//     gettUserData().then(data => {
//       this.setState({affiliatecode: data.affilateCode!=="NA"?data.affilateCode:""})
      

//     })

//   }
 
  render() {
    const store = this.props.SettingsStore
    const {  isLoading ,oldPassword,newPassword} = store

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Loader loading={isLoading} />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
        >
           <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
       <Text style={{ ...styles.topTitle, }}>
            {strings('password_mustbecontains')}
          </Text>
         </View>   
        
      
       <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_25}}>
            {strings('Old_Password')}
          </Text>
         </View>   
          <TextInput style={[styles.textInputStyle]}
            placeholder={strings('enterOldPassword')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={oldPassword}
            onChangeText={(text) => this.props.SettingsStore.setoldPassword(text)}
            autoCompleteType="off"
            secureTextEntry={true}
            maxLength={15}
            autoCorrect={false}
          />
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <Text style={{ ...styles.signUpTextStyle, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_20}}>
            {strings('New_Password')}
          </Text>
         </View>   
        

          <TextInput style={[styles.textInputStyle]}
            placeholder={strings('enter_NewPassword')}
            placeholderTextColor='rgba(192,196,204,1)'
            value={newPassword}
            onChangeText={(text) => this.props.SettingsStore.setnewPassword(text)}
            autoCompleteType="off"
            secureTextEntry={true}
            maxLength={15}
            autoCorrect={false}
          />
         
         <TouchableOpacity style={{ ...styles.bottomViewStyle }}
            onPress={() => this.updatePassword()}>
            <Text style={[commonStyles.LatoBold_16, styles.submitButton]}>
              {strings('Submit')}</Text>
          </TouchableOpacity>

        </KeyboardAwareScrollView>
    
          {/* {backAfterupdatecode===true?this.backview():null} */}
      </View>
     
    );
  }
backview()
{
  
    this.props.navigation.goBack()
    this.props.MyProfileStore.setbackAfterupdatecode(false)
  
}

}
export default inject('SettingsStore', 'AuthStore')(observer(ChangePassword))

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
 
  signUpTextStyle: {
    fontFamily: metrics.Lato_Bold,
    fontSize: metrics.getFontSize(14),
    color: 'rgba(62,62,62,70)'


  },
  topTitle:{
    fontFamily: metrics.Lato_Regular,
    fontSize: metrics.text_medium,
    color: '#7A818A',
    marginHorizontal: metrics.dimen_20, 
    marginTop: metrics.dimen_20
  },
 
  bottomViewStyle: {
    height: metrics.dimen_45, 
    backgroundColor: colors.app_Blue,
    borderRadius:metrics.dimen_8,
    alignItems: 'center',
    marginHorizontal:metrics.dimen_15,
    justifyContent:'center',
    marginTop:metrics.dimen_35
  },
  submitButton: {
    color: 'white', 
    textTransform: 'uppercase'
  },

  
})