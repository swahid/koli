import { action, observable, decorate } from 'mobx';
import { getUserAccount, addUserAccount, updateUserAccount, addStripeCreatedBankAccount,updatePassword } from '../../API/Settings/SettingsAPI';
import { getUserId,setUserData,showAlert } from '../../SupportingFIles/Utills';
import { strings } from '../../Locales/i18';
import { updateUserProfile,registerStripeAccount} from '../../API/Profile/User/ApiProfile';
import { Alert} from 'react-native';

const countriesJson = require('../../SupportingFIles/countries.json');


class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
   
    isLoading = false
    accountDetailsArray = null
    accountDetails = null
    accountType = 'saving'
    bankName = ''
    accountNumber = ''
    accountHolderName = ''
    swiftCode = ''
    rountingNumber = ''
    bankAddress = ''
    createdAt = ''
    updatedAt = ''
    addressData = {
        accountType: 'saving',
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        swiftCode: '',
        rountingNumber: '',
        bankAddress: '',
        firstName: '',
        lastName: ''
    }

    resetAddressData = () => {
        this.addressData = {
            accountType: 'saving',
            bankName: '',
            accountNumber: '',
            accountHolderName: '',
            swiftCode: '',
            rountingNumber: '',
            bankAddress: '',
            firstName: '',
            lastName: ''
        }
    }

    oldPassword=""
    newPassword=""
    setAddressData = (data) => {
        this.addressData = { ...this.addressData, ...data }
    }
    setNavigation = (navigation) => {
        this.navigation = navigation
    }
    setLoading = (loading) => {
        this.isLoading = loading
    }
    setAccountDetails = (data) => {
        this.accountDetails = data
    }
    setAccountDetailsArray = (data) => {
        this.accountDetailsArray = data
    }

    setoldPassword=(oldPassword)=>{
        this.oldPassword=oldPassword
    }

    setnewPassword=(newPassword)=>{
        this.newPassword=newPassword
    }
    getaccountDetails = () => {
        this.setLoading(true)
        getUserId().then(userid => {
            let param = {
                where: { ownerId: userid} }
            getUserAccount(param)
            .then(response => {
                this.setLoading(false)
                console.log('response getUserAccount:',response)
                if(response.status === 200) 
                {

                    if(response.data.length > 0)
                    {
                        const bankData = response.data[response.data.length - 1]
                       const bankDetailInfo=[
                            // {heading: strings('accountType'), value: bankData.accountType.charAt(0).toUpperCase() + bankData.accountType.slice(1)},
                            {heading: strings('accountHolderName'), value: bankData.accountHolderName},
                            {heading: strings('accountNumber'), value: bankData.accountNumber},
                            {heading: strings('swiftCode'), value: bankData.swiftCode},
                            {heading: strings('routingNumber'), value: bankData.rountingNumber},
                            // {heading: strings('bankAddress'), value:bankData.bankAddress},
                
                        ]
                        this.setAccountDetails(bankData)
                        this.setAccountDetailsArray(bankDetailInfo)

                    }
                    // else
                    // {
                    //     const bankDetailInfo=[
                    //         {heading: strings('accountType'), value: '-'},
                    //         {heading: strings('accountHolderName'), value: '-'},
                    //         {heading: strings('accountNumber'), value: '-'},
                    //         {heading: strings('swiftCode'), value: '-'},
                    //         {heading: strings('routingNumber'), value: '-'},
                    //         {heading: strings('bankAddress'), value: '-'},
                
                    //     ]
                    //     this.setAccountDetailsArray(bankDetailInfo)

                    // }
                   
                }

            })
            .catch(error => {
                this.setLoading(false)
            })
        })
    }
    addAccountDetails = (params) => {
        this.setLoading(true)
        getUserId().then(userid => {
            params.ownerId = userid
            console.log('params addAccountDetails:',params)
            addUserAccount(params)
            .then(response => {
                this.setLoading(false)
                console.log('response addAccountDetails:',response)
                if(response.status === 200) 
                {
                    this.navigation.goBack()
                }

            })
            .catch(error => {
                this.setLoading(false)
            })
        })
      
    }
    createAndAddAccountDetails = (params) => {
        //this.setLoading(true)
        console.log('params addAccountDetails:',params)
       // const selectedCountry = countriesJson.filter(obj => obj.name === params.country)
        getUserId().then(userid => {
            params.ownerId = userid
            params.countryShortCode = params.country
            console.log('params addAccountDetails:',params)
            registerStripeAccount(params)
            .then(response => {
                this.setLoading(false)
                console.log('response addAccountDetails:',response)
                if(response.status === 200 && !response.data.error) 
                {
                    this.resetAddressData()
                    setTimeout(() => {
                    Alert.alert(
                        '',
                        strings('Bank_Details_Added'),
                        [
                            {text: strings('Ok'), onPress: () => {
                                this.navigation.navigate('BankInfoDetail')
                            }},
                        ],
                        { cancelable: false }
                      );
                    },1000)
                }
                else if(response.status === 200 && response.data.error) 
                {
                    showAlert( '', response.data.message)
                }
                else
                {
                    showAlert( '', strings('SomethingWentWrong'))

                }

            })
            .catch(error => {
                this.setLoading(false)
            })
        })
      
    }
    updateUserAccountDetails = (params) => {
        this.setLoading(true)
        getUserId().then(userid => {
            params.ownerId = userid
            console.log('params updateAccountDetails:',params)
            updateUserAccount(params)
            .then(response => {
                this.setLoading(false)
                console.log('response updateAccountDetails:',response)
                if(response.status === 200) 
                {
                    this.navigation.goBack()
                }

            })
            .catch(error => {
                this.setLoading(false)
            })
        })
      
    }
    addBankAccount = (params, bankDetailsToSave) => {
        this.setLoading(true)
        getUserId().then(userid => {
            params.ownerId = userid
            console.log('params addBankAccount:',params)
            addStripeCreatedBankAccount(params)
            .then(response => {
                this.setLoading(false)
                console.log('response addBankAccount:',response)
                if(response.status === 200) 
                {
                   const profileParam = {stripeBankAccountId: response.data.data.id}
                    this.updateStripeBankId(userid,profileParam, bankDetailsToSave)
                    //this.navigation.goBack()
                }

            })
            .catch(error => {
                this.setLoading(false)
            })
        })
      
    }
    updateStripeBankId = (userId, profileParam,bankDetailsToSave) =>{
        this.setLoading(true)
        updateUserProfile(profileParam,userId).then(response =>{
            const {status, data} = response
            this.setLoading(false)
            if (status === 200 && !data.error) {
                let result = data.message.profile
                setUserData(JSON.stringify(result))
                if(bankDetailsToSave.id === undefined)
                {
                    this.addAccountDetails(bankDetailsToSave)
                }
                else
                {
                    this.updateUserAccountDetails(bankDetailsToSave)
                }
               // 
                // if(result.stripeBankAccountId === null)
                // {

                // }
                // else
                // {
                //  this.acceptDeclineOffer(id, offerStatus, userId)
                // }
            }else{
                showAlert( '', strings('SomethingWentWrong'))
            }
        }).catch(error => {
            this.setLoading(false)
            showAlert( '', strings('SomethingWentWrong'))

        })
    }


    changePassword = (params,accessToken) => {
        this.setLoading(true)
            updatePassword(params,accessToken)
            .then(response => {
                console.log("response==",response)
                this.setLoading(false)
                if(response.status === 200) 
                {
                    showAlert( '', "Password updated successfuly") 
                    this.setoldPassword("") 
                    this.setnewPassword("")              
                }else{

                    showAlert( '', "Please enter correct old password.")    
                }

            })
            .catch(error => {
                this.setLoading(false)
            })
      
      
    }
}

decorate(SettingsStore, {

    isLoading: observable,
    navigation: observable,
    accountDetails: observable,
    accountDetailsArray: observable,
    addressData: observable,
    newPassword:observable,
    oldPassword:observable,

    setLoading: action,
    setSubject: action,
    getSubjectList: action,
    setSubjectList: action,
    setAccountDetails: action,
    addAccountDetails: action,
    setAccountDetailsArray: action,
    updateUserAccountDetails: action,
    createAndAddAccountDetails: action,
    setAddressData: action,
    setnewPassword:action,
    setoldPassword:action,

});
export default SettingsStore;
