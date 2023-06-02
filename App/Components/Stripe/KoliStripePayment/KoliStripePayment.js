import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { strings } from '../../../Locales/i18';
import stripe, { PaymentCardTextField } from 'tipsi-stripe'
import CountryPicker from 'react-native-country-picker-modal';
import { observer, inject } from 'mobx-react';
// import CryptoJS from "react-native-crypto-js";
import Loader from '../../../SupportingFIles/Loader';
import images from '../../../Themes/Images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showAlert } from '../../../SupportingFIles/Utills';
// import Config from "react-native-config";
const formatCurrency = new Intl.NumberFormat('en-US')

class KoliStripePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_country_modal: false,
      valid: false,
    params: {
      number: '',
      expMonth: 0,
      expYear: 0,
      cvc: '',
      name: '',
    },
    };
  }
  
  handleFieldParamsChange = (valid, params) => {
    this.setState({
      valid,
      params,
    })
  }
  render() {
    const store = this.props.CompaignsStore
    const { isLoading } = store
    const campaignData = this.props.campaignData
    const userData = this.props.userData

    return (
      <View >
                                <Loader loading={isLoading} />
                                <KeyboardAwareScrollView>

        {this.state.show_country_modal && <CountryPicker
                    containerButtonStyle={{ height: 0}}
                    visible={this.state.show_country_modal}
                    onClose={() => this.setState({ show_country_modal: false })}
                    withEmoji={true}
                    withFlag={true}
                    withFilter={true}
                    withAlphaFilter={true}
                    withCallingCode = {false}
                    translation={'en'}
                    filterProps={{
                      filterable:false,
                      placeholder: strings('search_country')
                    }}
                    onSelect={country => {this.updatecountry(country.name)
                      
                    }}
              />}
              <TouchableOpacity style={styles.viewBack} onPress={() =>  this.props.CompaignsStore.setSwipeViewActive(false)}>
              <Image source={images.BackArrow}
                 style={styles.iconBack}
                 />
                  <Image source={images.loaderIcon}
                 style={styles.iconKoli}
                 />
              </TouchableOpacity>
                  <Text style={styles.textCampaignName}>{this.props.campaignData.campaignTitle}</Text>
        <Text style={styles.textCampaignPrice}>{campaignData.campaignAmountCurrency + " " + formatCurrency.format(this.props.amount)}</Text>
        <Text style={styles.textEmail}>{strings('Email_label')}</Text>
        <TextInput style={styles.textInputStyle}
              placeholder = {strings('Email')}
              placeholderTextColor = 'rgba(192,196,204,1)'
              editable={false}
              value = {userData.profile.email}
             // onChangeText={(text)=> this.updatefirstname(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
            />
        <Text style={styles.textEmail}>{strings('Card_Information')}</Text>
        <View style={styles.viewStripeTf}>
        <PaymentCardTextField
        accessible={false}
            style={[styles.field, !this.state.valid && styles.mandatoryField]}
            onParamsChange={this.handleFieldParamsChange}
            numberPlaceholder="XXXX XXXX XXXX XXXX"
            expirationPlaceholder="MM/YY"
            cvcPlaceholder="CVC"
            // {...testID('cardTextField')}
          />
        </View>
        <Text style={styles.textEmail}>{strings('Name_on_card')}</Text>
        <TextInput style={[styles.textInputStyle , this.state.params.name === '' && styles.mandatoryField]}
              placeholder = {strings('Name')}
              placeholderTextColor = "rgba(192,196,204,1)"
              value = {this.state.params.name}
              onChangeText={(text)=> this.updateName(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
            />
<Text style={styles.textEmail}>{strings('Country_or_region')}</Text>
<TouchableOpacity  activeOpacity={1} onPress={() => 
{
  this.setState({ show_country_modal: true })
  //this.props.CompaignsStore.setSwipeViewActive(false)

  

}
  } >
        <TextInput style={[styles.textInputStyle,{marginBottom:0,borderBottomLeftRadius:0,borderBottomRightRadius:0,borderBottomWidth:0}]}
              placeholder = {strings('Country')}
              placeholderTextColor = "rgba(192,196,204,1)"
              editable={false}
              value = {this.state.params.addressCountry}
              pointerEvents="none"

             // onChangeText={(text)=> this.updatefirstname(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
              maxLength = {15}
            />
             <Image source={images.DropdownIcon}
                 style={styles.downIcon}
                 />
                        </TouchableOpacity>

             <TextInput style={[styles.textInputStyle,{marginTop:0,borderTopLeftRadius:0,borderTopRightRadius:0}]}
              placeholder = "Zip Code"
              placeholderTextColor = "rgba(192,196,204,1)"
              value = {this.state.params.addressZip}
              onChangeText={(text)=> this.updateZipCode(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
              maxLength = {15}
            />
            <TouchableOpacity style={styles.bottomButton}
            onPress={()=>this.onPayment()}>
              <Text style={styles.textPayNow}>{strings('Pay_Now')} {campaignData.campaignAmountCurrency + " " + formatCurrency.format(this.props.amount)}</Text>
            </TouchableOpacity>
            <View style={styles.viewPoweredByStripe}>
<Text style={styles.textPoweredBy}>{strings('Powered_by')}</Text>
                <Image source={images.stripeLogo}
                 style={styles.imageStripeLogo}
                 />
              </View>
              <View style={styles.viewTermsPrivacy}>
                <Text style={styles.textPoweredBy}>{strings('Terms')} </Text>
<Text style={styles.textPoweredBy}> {strings('Privacy')}</Text>

              </View>
              </KeyboardAwareScrollView>

      </View>
    );
  }
  updatecountry(_country)
  {
    this.setState({
      params: Object.assign({}, this.state.params, { addressCountry: _country }),
      show_country_modal:false
    })
    //this.props.CompaignsStore.setSwipeViewActive(true)

  }
  updateZipCode(_zipCode)
  {
    this.setState({
      params: Object.assign({}, this.state.params, { addressZip: _zipCode })
    })
  }
  updateName(_name)
  {
    this.setState({
      params: Object.assign({}, this.state.params, { name: _name })
    })
  }
  onPayment = async() =>{
    const store = this.props.CompaignsStore

    console.log(`
      Valid: ${this.state.valid}
      Number: ${this.state.params.number || '-'}
      Month: ${this.state.params.expMonth || '-'}
      Year: ${this.state.params.expYear || '-'}
      CVC: ${this.state.params.cvc || '-'}
    `)
    if(!this.state.valid)
    {
      showAlert(strings('Please_Enter_Valid_Card_Info'))

    }
    else if( this.state.params.name === undefined|| this.state.params.name === '' )
    {
      showAlert(strings('Please_Enter_Name'))

    }
    else
    {
      console.log('this.state.valid:',this.state.valid)
      console.log('this.state.params:',this.state.params)

      // let publisbhKeybytes  = CryptoJS.AES.decrypt(store.stripePublishableKey, '5L9yLb85bT9WessPBdDYug4mDDDNZpf0uHmuzBk2F9A');
      // let stripePublishableKey = publisbhKeybytes.toString(CryptoJS.enc.Utf8);
      
      // let secretKeybytes  = CryptoJS.AES.decrypt(store.stripeSecretKey, '5L9yLb85bT9WessPBdDYug4mDDDNZpf0uHmuzBk2F9A');
      // let stripeSecretKey = secretKeybytes.toString(CryptoJS.enc.Utf8);
      
      // console.log('stripePublishableKey:',stripePublishableKey)
      // console.log('stripeSecretKey:',stripeSecretKey)
      
      //   stripe.setOptions({
      
      //     publishableKey: stripePublishableKey,//'PUBLISHABLE_KEY',india 
      //     merchantId: stripeSecretKey,//'MERCHANT_ID', // india
        
      //    // androidPayMode: 'test', // test|production Android only
        
      //   })
        // stripe.setOptions({

        //   publishableKey: 'pk_test_kYxI1uwoMn3Nesv2MeSIu3n200nwgmf3wA',//'PUBLISHABLE_KEY',india 
        //   merchantId: 'sk_test_7P9UmGsJvtNZgZdNNkhz5rWR00hzCyiHGZ',//'MERCHANT_ID', // india
        
        //   androidPayMode: 'test', // test|production Android only
        
        // })
      store.setLoading(true)

      const token = await stripe.createTokenWithCard(this.state.params)
      //console.log(token)
     // store.setLoading(false)

      const userData = this.props.userData
      const dataParam = {amount: this.props.amount,name:(userData.profile.first ?
          userData.profile.first : '')
          + " " +
          (userData.profile.last ? userData.profile.last : ''),
      email:userData.profile.email, 
      description : 'Stripe Payment for Influencer Hiring',
      stripeToken: token.tokenId,
      applicantOwnerId: this.props.userData.ownerId,
      campaignId: this.props.campaignData.id
    }
      // const paramsToSend = { ...dataParam, ...{ stripeToken: token.tokenId} }
     // this.props.CompaignsStore.setSwipeViewActive(false)
      this.props.CompaignsStore.initiateStripePayment(dataParam)

      // setTimeout(() => {
      //   store.setLoading(true)

      //       }, 1000)


      // Client specific code
       //api.sendTokenToBackend(token)
    }
  }
}
export default inject("ApplicantListStore", "CompaignsStore")(observer(KoliStripePayment))

