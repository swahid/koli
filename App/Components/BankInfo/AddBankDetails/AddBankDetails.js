import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput
} from 'react-native';
import styles from './styles'
import images from '../../../Themes/Images';
import { strings } from '../../../Locales/i18';
import { commonStyles } from '../../../SupportingFIles/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import colors from '../../../Themes/Colors';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-native-paper';
import Loader from '../../../SupportingFIles/Loader';
import moment from 'moment';
import stripe from 'tipsi-stripe'
import { showAlert } from '../../../SupportingFIles/Utills';

class AddBankDetails extends Component {
    constructor(props) {
        super(props);

        const bankData = this.props.route.params.bankData
        console.log('bankData:', bankData)


        this.state = {
            isSubmit: false,
            selected: bankData !== null ? bankData.accountType === "saving" ? true : false : true,
            currentSelcted: bankData !== null ? bankData.accountType === "current" ? true : false : false,
            bankName: bankData !== null ? bankData.bankName : '',
            accountNumber: bankData !== null ? bankData.accountNumber.toString() : '',
            holderName: bankData !== null ? bankData.accountHolderName : '',
            swiftCode: bankData !== null ? bankData.swiftCode : '',
            routingNumber: bankData !== null ? bankData.rountingNumber : '',
            bankAddress: bankData !== null ? bankData.bankAddress : '',
            firstName: '',
            lastName: '',
        };
        
    }
    componentDidMount() {
        const bankData = this.props.route.params.bankData
        this.props.navigation.setOptions({
            title: bankData === null ? strings('Add_bank_details') : strings('Edit_bank_details'),
            headerLeft: () => (
                <TouchableOpacity style={{ ...commonStyles.backButtonContainer }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Image source={images.backImage} />
                </TouchableOpacity>
            ),
        }
        )
        this.props.CompaignsStore.getStripeKeys()
        this.setAddressData()

    }
    setAddressData(){
        const addressData = this.props.SettingsStore.addressData
        if(this.props.SettingsStore.addressData.accountNumber !== "")
        {
            this.setState({
            isSubmit: false,
            bankName: addressData.bankName,
            accountNumber: addressData.accountNumber,
            holderName: addressData.holderName,
            swiftCode: addressData.swiftCode,
            routingNumber: addressData.routingNumber,
            bankAddress: addressData.bankAddress,
            firstName: addressData.firstName,
            lastName: addressData.lastName,
            })
        }
    }
    render() {
        const store = this.props.SettingsStore

        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={store.isLoading} />
                <KeyboardAwareScrollView >
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}>
                        <View style={styles.viewForm}>

                            {/* Account type */}
                            {/* <Text style={[styles.textFieldTitle, { marginTop: 0 }]}>{strings('accountType')}</Text> */}

                            {/* Radio Button Saving */}
                            {/* <View style={styles.viewAccountTypeSelction}>
                                <TouchableOpacity style={styles.radioButtonContainer}
                                    onPress={() => {
                                        this.setState({ selected: true, currentSelcted: false })
                                    }}>
                                    <View style={[styles.radioButton, !this.state.selected && styles.radioButtonUnselected]}>
                                        {
                                            this.state.selected ?
                                                <View style={styles.radioButtonInnerCircle} />
                                                : null
                                        }
                                    </View>
                                    <Text style={[styles.textFieldTitle, styles.textSaving]}>{strings('Saving')}</Text>
                                </TouchableOpacity> */}
                                {/* Radio Button Current */}
                                {/* <TouchableOpacity style={styles.radioButtonContainer}
                                    onPress={() => {
                                        this.setState({ selected: false, currentSelcted: true })
                                    }}>
                                    <View style={[styles.radioButton, styles.radioButtonCurrent, !this.state.currentSelcted && styles.radioButtonUnselected]}>
                                        {
                                            this.state.currentSelcted ?
                                                <View style={styles.radioButtonInnerCircle} />
                                                : null
                                        }
                                    </View>
                                    <Text style={[styles.textFieldTitle, styles.textSaving]}>{strings('Current')}</Text>
                                </TouchableOpacity> */}


                            {/* </View> */}

                            {/* Account type */}
                            <Text style={styles.textFieldTitle}>{strings('Bank')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Bank_Name')}
                                    maxLength={30}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.bankName}
                                    onChangeText={(text) => {
                                        this.setState({ bankName: text })
                                        store.setAddressData({bankName: text})
                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                        // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                                {this.state.isSubmit && this.state.bankName === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Bank_Name_Error')}</Text>}

                            </View>
                            {/* Account Number */}
                            <Text style={styles.textFieldTitle}>{strings('accountNumber')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Enter_Number')}
                                    keyboardType="number-pad"
                                    maxLength={20}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.accountNumber}
                                    onChangeText={(text) => {
                                        this.setState({ accountNumber: text })
                                        store.setAddressData({accountNumber: text})

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                        // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                                {this.state.isSubmit && this.state.accountNumber === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Account_Number_Error')}</Text>}
                            </View>
                            {/* Account Holder Name */}
                            {/* <Text style={styles.textFieldTitle}>{strings('accountHolderName')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Enter_name')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.holderName}
                                    onChangeText={(text) => {
                                        this.setState({ holderName: text })

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                    // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                                {this.state.isSubmit && this.state.holderName === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Account_Holder_Error')}</Text>}
                            </View> */}

                            <Text style={styles.textFieldTitle}>{strings('FirstName')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('FirstName')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.firstName}
                                    onChangeText={(text) => {
                                        this.setState({ firstName: text })
                                        store.setAddressData({firstName: text})

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                    // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                                {this.state.isSubmit && this.state.firstName === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('EnterFirstName')}</Text>}
                            </View>

                            <Text style={styles.textFieldTitle}>{strings('LastName')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('FirstName')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.lastName}
                                    onChangeText={(text) => {
                                        this.setState({ lastName: text })
                                        store.setAddressData({lastName: text})

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                    // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                                {this.state.isSubmit && this.state.lastName === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('EnterLastName')}</Text>}
                            </View>

                            {/* Swift Code */}
                            {/* <Text style={styles.textFieldTitle}>{strings('swiftCode')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text></Text>
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('Enter_Code')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.swiftCode}
                                    onChangeText={(text) => {
                                        this.setState({ swiftCode: text })

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                        // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                            </View> */}
                            {/* {this.state.isSubmit && this.state.swiftCode === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Swift_Code_Error')}</Text>} */}
                            {/* Routing Number */}
                            <Text style={styles.textFieldTitle}>{strings('routingNumber')}
                            <Text style={{ color: colors.app_RedColor }}> *</Text>
                            </Text>
                            {/* <Text style={styles.textFieldTitle}>{strings('routingNumber')}</Text> */}
                            <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    //keyboardType="number-pad"
                                    placeholder={strings('routingNumber')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.routingNumber}
                                    onChangeText={(text) => {
                                        this.setState({ routingNumber: text })
                                        store.setAddressData({routingNumber: text})

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                        // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                />
                            </View>
                            {this.state.isSubmit && this.state.routingNumber === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Routing_Number_Error')}</Text>}
                            {/* Bank Address */}
                            {/* <Text style={styles.textFieldTitle}>{strings('bankAddress')}  */}
                            {/* <Text style={{ color: colors.app_RedColor }}> *</Text> */}
                            {/* </Text> */}
                            {/* <View style={styles.campaignViewStyle}>
                                <TextInput style={styles.inputTextFieldStyle}
                                    placeholder={strings('bankAddress')}
                                    placeholderTextColor={colors.bankInfoTextPlacholder}
                                    value={this.state.bankAddress}
                                    onChangeText={(text) => {
                                        this.setState({ bankAddress: text })

                                        // console.warn('text',text)
                                        // store.setCampaignData({ campaignTitle: text })
                                        // if (store.campainData.campaignTitle.length > 0 && this.state.gallery.length > 1) {
                                        //   store.setEnabled(true)
                                        // }else{
                                        //   store.setEnabled(false)

                                        // }
                                    }}
                                /> */}
                                {/* {this.state.isSubmit && this.state.bankAddress === '' &&
                                    <Text style={styles.errorTextStyle}>{strings('Bank_Address_Error')}</Text>} */}
                            {/* </View> */}
                        </View>

                    </TouchableWithoutFeedback>
                    <Button
                        style={[styles.buttonSubmit,
                        { backgroundColor: colors.app_Blue }]}
                        labelStyle={{ ...commonStyles.LatoBold_14, color: 'white' }}
                        onPress={() => this.onAddBankAccount()
                        }
                    >
                        {strings('Submit')}
                    </Button>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
    onAddBankAccount = async() => {
        const store = this.props.SettingsStore
        store.setNavigation(this.props.navigation)
        this.setState({ isSubmit: true })
        const bankData = this.props.route.params.bankData
        const { bankName, accountNumber, accountHolderName, swiftCode, routingNumber, firstName, lastName } = this.state
        if (bankName !== '' && accountNumber !== '' && accountHolderName !== ''  && routingNumber !== '' && firstName !== '' && lastName !== ''
        // && bankAddress !== ''
        ) {
            const params = {
                bankName: this.state.bankName,
                accountType: this.state.currentSelcted ? 'current' : 'saving',
                accountNumber: parseInt(this.state.accountNumber, 10),
                accountHolderName: this.state.holderName,
                swiftCode: this.state.swiftCode,
                rountingNumber: this.state.routingNumber,
                bankAddress: this.state.bankAddress,
            }
            if (bankData === null) {
                //Create bank account on stripe
                this.getStripeBankAccountToken(params)

                //store.addAccountDetails(params)
            }
            else {
                params.createdAt = bankData.createdAt
                params.id = bankData.id
                params.updatedAt = moment().utc(0).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                                
                //Create bank account on stripe
                //this.getStripeBankAccountToken(params)

               store.updateUserAccountDetails(params)

                // const paramsToken = {
                //     // mandatory
                //     accountNumber: this.state.accountNumber,
                //     countryCode: 'sg',
                //     currency: 'sgd',
                //     // optional
                //     routingNumber: "1100-000", // 9 digits
                //     accountHolderName: this.state.holderName,
                //     accountHolderType: 'individual', // "company" or "individual"
                //   }
                  
                //   try {
                //       store.setLoading(true)
              
                //     const token = await stripe.createTokenWithBankAccount(paramsToken)
                //     const paramsToSend = {bankTokenId:token.tokenId}
                //     console.log('stripe token:',token)
                //     store.setLoading(false)

                //     store.addBankAccount(paramsToSend)
                    
                //   } catch (error) {
                //     store.setLoading(false)
                //     showAlert(error.message)
                //     console.log('stripe error:',error)
                //   }
           
            }
        }
    }
    getStripeBankAccountToken = async(params) =>{
        const store = this.props.SettingsStore
        const paramsToken = {
            // mandatory
            accountNumber: this.state.accountNumber,
            countryCode: 'sg',
            currency: 'sgd',
            // optional
            routingNumber: this.state.routingNumber, // 9 digits
            accountHolderName: this.state.holderName,
            accountHolderType: 'individual', // "company" or "individual"
          }
          
          try {
            store.setLoading(true)
            console.log('publishableKey:',this.props.CompaignsStore.stripePublishableKey)
            console.log('setStripeSecretKey:',this.props.CompaignsStore.stripeSecretKey)

     stripe.setOptions({

          publishableKey: this.props.CompaignsStore.stripePublishableKey,//'PUBLISHABLE_KEY',india 
          merchantId: this.props.CompaignsStore.stripeSecretKey,//'MERCHANT_ID', // india
        
          androidPayMode: 'test', // test|production Android only
        
        })

          const token = await stripe.createTokenWithBankAccount(paramsToken)
          const personalInfo = this.props.route.params.personalInfo

          const paramsToSend = {
              bankTokenId:token.tokenId,
              countryShortCode : personalInfo.country.cca2,
              city : personalInfo.city,
            country : personalInfo.country.cca2,
              line1 : personalInfo.addressLine1,
              line2 : personalInfo.addressLine2,
               postal_code : personalInfo.postalCode,
              state : personalInfo.state,
              id_number : personalInfo.idNumber,
             day : personalInfo.date,
              month : personalInfo.month,
             year : personalInfo.year,
             bankName: this.state.bankName,
             accountType: this.state.currentSelcted ? 'current' : 'saving',
             accountNumber: this.state.accountNumber,
             accountHolderName: this.state.firstName+" "+this.state.lastName,
             swiftCode: this.state.swiftCode,
             rountingNumber: this.state.routingNumber,
             bankAddress: this.state.bankAddress,
            }
          console.log('stripe token:',token)
          //store.setLoading(false)
store.createAndAddAccountDetails(paramsToSend)
          //store.addBankAccount(paramsToSend,params)
          
        } catch (error) {
          store.setLoading(false)
          showAlert(error.message)
          console.log('stripe error:',error)
        }
    }
}
export default inject('SettingsStore', 'AuthStore', "CompaignsStore")(observer(AddBankDetails))

