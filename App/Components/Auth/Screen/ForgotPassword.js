import React, { Component } from 'react';
import {  Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, StatusBar, TextInput} from 'react-native';
import {observer, inject} from 'mobx-react';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import Loader from '../../../SupportingFIles/Loader';



class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount(){
    this.resetFields()
    this.props.navigation.addListener('focus', () => {
      this.resetFields()
    });
  }

  resetFields(){
    this.props.AuthStore.deleteAllValidationError()
    this.props.AuthStore.setEmail('')
  }

  render() {
    const {email, validationError, isLoading, resetSuccess} = this.props.AuthStore
    return (
      <SafeAreaView style = {{flex: 1}}>
          <Loader loading={isLoading}/>
          <StatusBar barStyle="dark-content" />
            <TouchableOpacity style={styles.backContainer}
                onPress={()=>this.props.navigation.goBack()}
            >
                <Image source = {images.backImage}/>
            </TouchableOpacity>
            <Text style = {{...styles.headerTextStyle, marginHorizontal: metrics.dimen_20}}>{strings('ForgotPassword')}</Text>
            <Text style = {{...styles.mediumText, marginHorizontal: metrics.dimen_20}}>{strings('ForgotInstruction')}</Text>
            <Text style = {{...styles.semiBolText, marginHorizontal: metrics.dimen_20, marginTop: metrics.dimen_20}}>{strings('Email_Address')}</Text>
            <TextInput style={{...styles.textInputStyle}}
              placeholder = {strings('EnterEmail')}
              placeholderTextColor = "rgba(192,196,204,1)"
              value = {email}
              onChangeText={(text)=>this.props.AuthStore.setEmail(text)}
              autoCorrect = {false}
              autoCapitalize = "none"
              autoCompleteType = "off"
            />
            {validationError.emailError ? <Text style={styles.errorTextStyle}>{validationError.emailError}</Text> : null}

            <TouchableOpacity style = {styles.submitButtonStyle} onPress = {this.onReset}>
              <Text style = {{...styles.signUpTextStyle, color: 'white'}}>{strings('ResetPassword')}</Text>
            </TouchableOpacity>
            {resetSuccess && this.props.navigation.navigate('Login')}
      </SafeAreaView>

    );
  }
  onReset = () =>{
      this.props.AuthStore.onReset()
  }
}

export default inject("AuthStore")(observer(ForgotPassword))


const styles = StyleSheet.create({
    backContainer:{
        marginLeft: metrics.dimen_20, 
        marginVertical: metrics.dimen_20
    },
    textInputStyle:{
      borderRadius: metrics.dimen_4,
      height: metrics.dimen_46,
      backgroundColor: 'rgba(248,248,248,1)',
      paddingHorizontal: metrics.dimen_10,
      marginVertical: metrics.dimen_10,
      marginHorizontal: metrics.dimen_20,
      borderWidth: metrics.dimen_1,
      borderColor: 'rgba(227,227,227,1)'
    },
    headerTextStyle:{
      fontFamily: metrics.Lato_Bold,
      fontSize: metrics.text_xxxl,
      marginBottom: metrics.dimen_20,
      color: 'rgba(62,62,70,1)'
    },
    signUpTextStyle:{
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.text_normal,
        color: colors.app_black
    },
    mediumText:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_normal,
      color: colors.app_black
    },
    semiBolText:{
      fontFamily: metrics.Lato_SemiBold,
      fontSize: metrics.text_normal,
      color: 'rgba(62,62,70,1)'
    },
    submitButtonStyle:{
      backgroundColor: colors.app_Blue,
      borderRadius: metrics.dimen_4,
      height: metrics.dimen_45,
      position: 'absolute',
      left: metrics.dimen_20,
      right: metrics.dimen_20,
      bottom: metrics.dimen_37,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor:'black',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1
    },
    errorTextStyle:{
      fontFamily: metrics.Lato_Regular,
      fontSize: metrics.text_normal,
      color: colors.app_RedColor,
      marginTop: -metrics.dimen_5,
      marginBottom: metrics.dimen_5,
      marginLeft: metrics.dimen_20
    }
  
  })

