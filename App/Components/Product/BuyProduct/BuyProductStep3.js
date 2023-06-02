import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import Loader from '../../../SupportingFIles/Loader';
import { inject, observer } from 'mobx-react';
import { strings } from '../../../Locales/i18';
import styles from './styles'
import CountryPicker from 'react-native-country-picker-modal';
import stripe, { PaymentCardTextField } from 'tipsi-stripe'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import cardStyles from '../../Stripe/KoliStripePayment/styles'
import images from '../../../Themes/Images';
import metrics from '../../../Themes/Metrics';
import colors from '../../../Themes/Colors';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { showAlert, getUserId, gettUserData } from '../../../SupportingFIles/Utills';

const formatCurrency = new Intl.NumberFormat('en-US')

class BuyProductStep3 extends Component {
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
          email: '',
        },
        };
      }
      
      handleFieldParamsChange = (valid, params) => {
        this.setState({
          valid,
          params,
        })
      }

    componentDidMount = () => {
        
        this.props.CompaignsStore.getStripeKeys()
        this.props.navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainercampaign }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image style={{ tintColor: colors.app_black }} source={images.backImage} />
                </TouchableOpacity>
            ),
            // headerRight: () => (

            //     <TouchableOpacity style={{ marginRight: metrics.dimen_20, }}
            //         onPress={() =>
            //             //this.props.navigation.navigate('CreateCampaign1',{type:'Add'})
            //             this.props.navigation.navigate('ManageAddress')

            //         }>
            //         <Image source={images.plusIcon} style={{ marginLeft: metrics.dimen_22 }} />
            //     </TouchableOpacity>

            // )
        })
      
    }

    render() {
        const productData = this.props.route.params.productData
        const productAmountToShow = (productData.productDiscount !== undefined 
          && productData.productDiscount !== 0) ? productData.productAmount - ((productData.productAmount * productData.productDiscount) / 100) 
          : productData.productAmount
        return (
            <View style={styles.mainView}>
                <Loader loading={this.props.ProductStore.isLoading} />
                {/* <KeyboardAwareScrollView> */}

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
                <View style={styles.viewSteps}>
                            <View style={styles.viewConetentSteps}>

                            <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                            <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >1</Text>
                                </View>

                                <View style={styles.viewLine} />

                                <View style={[styles.viewStepNumber, {backgroundColor:'rgba(22,88,211,0.05)'}]}>
                                    <Text style={[styles.labelStepCircle,{color:colors.app_Blue}]} >2</Text>
                                </View>
                                
                                <View style={styles.viewLine} />

                                <View style={styles.viewStepNumber}>
                                    <Text style={styles.labelStepCircle} >3</Text>
                                </View>
                                
                            </View>
                 </View>
                 <KeyboardAwareScrollView style={{backgroundColor:colors.white, marginTop: metrics.heightSize(21)}}>
                 <Text style={[cardStyles.textCampaignName,{marginTop:metrics.heightSize(60)}]}>{productData.productTitle}</Text>
        <Text style={cardStyles.textCampaignPrice}>{"S$" + " " + formatCurrency.format(productAmountToShow)}</Text>
        <Text style={cardStyles.textEmail}>{strings('Email_label')}</Text>
        <TextInput style={cardStyles.textInputStyle}
              placeholder = {strings('Email')}
              placeholderTextColor = 'rgba(192,196,204,1)'
              //editable={false}
             // value = {userData.profile.email}
              onChangeText={(text)=> this.setState({email:text})}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
            />
        <Text style={cardStyles.textEmail}>{strings('Card_Information')}</Text>
        <View style={cardStyles.viewStripeTf}>
        <PaymentCardTextField
        accessible={false}
            style={[cardStyles.field, !this.state.valid && cardStyles.mandatoryField]}
            onParamsChange={this.handleFieldParamsChange}
            numberPlaceholder="XXXX XXXX XXXX XXXX"
            expirationPlaceholder="MM/YY"
            cvcPlaceholder="CVC"
            // {...testID('cardTextField')}
          />
        </View>
        <Text style={cardStyles.textEmail}>{strings('Name_on_card')}</Text>
        <TextInput style={[cardStyles.textInputStyle , this.state.params.name === '' && cardStyles.mandatoryField]}
              placeholder = {strings('Name')}
              placeholderTextColor = "rgba(192,196,204,1)"
              value = {this.state.params.name}
              onChangeText={(text)=> this.updateName(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
            />
<Text style={cardStyles.textEmail}>{strings('Country_or_region')}</Text>
<TouchableOpacity  activeOpacity={1} onPress={() => 
{
  this.setState({ show_country_modal: true })
  //this.props.CompaignsStore.setSwipeViewActive(false)

  

}
  } >
        <TextInput style={[cardStyles.textInputStyle,{marginBottom:0,borderBottomLeftRadius:0,borderBottomRightRadius:0,borderBottomWidth:0}]}
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
                 style={cardStyles.downIcon}
                 />
                        </TouchableOpacity>

             <TextInput style={[cardStyles.textInputStyle,{marginTop:0,borderTopLeftRadius:0,borderTopRightRadius:0}]}
              placeholder = "Zip Code"
              placeholderTextColor = "rgba(192,196,204,1)"
              value = {this.state.params.addressZip}
              onChangeText={(text)=> this.updateZipCode(text)}
              autoCapitalize = "none"
              autoCompleteType = "off"
              autoCorrect = {false}
              maxLength = {15}
            />
               </KeyboardAwareScrollView>
                    <TouchableOpacity style={{...styles.bottomViewStyle}}
      onPress={() => this.onPayment()}>

<Text style = {[commonStyles.LatoBold_16, styles.submitButton]}>
          {strings('Continue')}</Text>
      </TouchableOpacity>
      {/* </KeyboardAwareScrollView> */}

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
    const store = this.props.ProductStore
    const productData = this.props.route.params.productData
    const addressData = this.props.route.params.addressData
   // console.log("discount:", productData.productDiscount)

    console.log(`
      Valid: ${this.state.valid}
      Number: ${this.state.params.number || '-'}
      Month: ${this.state.params.expMonth || '-'}
      Year: ${this.state.params.expYear || '-'}
      CVC: ${this.state.params.cvc || '-'}
    `)
     if( this.state.email === undefined|| this.state.email === '' )
    {
      showAlert("Please enter email")

    }
    else if(!this.state.valid)
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

      store.setLoading(true)

      const token = await stripe.createTokenWithCard(this.state.params)
      const productAmountToend = (productData.productDiscount !== undefined 
        && productData.productDiscount !== 0) ? productData.productAmount - ((productData.productAmount * productData.productDiscount) / 100) 
        : productData.productAmount
      getUserId().then(userid => {
        const dataParam = {
            ownerId: userid,
            name:this.state.params.name,
        email:this.state.email, 
        amount: productData.productAmount,
        description : `Stripe Payment for ${productData.productTitle}`,
        stripeToken: token.tokenId,
        productId: productData.id,
        addressId: addressData.id,//productOwnerId
        productOwnerId: productData.productOwnerId,
        discountPrice: (productData.productDiscount !== undefined && productData.productDiscount !== 0) ? productData.productAmount - ((productData.productAmount * productData.productDiscount) / 100) : 0
      }
        this.props.ProductStore.setNavigation(this.props.navigation)
        this.props.ProductStore.initiateProductPayment(dataParam)
      })

      
    }
  }
 
}
export default inject("AddressStore", "AuthStore", "ProductStore","CompaignsStore")(observer(BuyProductStep3))


