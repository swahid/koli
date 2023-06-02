import stripe from 'tipsi-stripe'
import CryptoJS from "react-native-crypto-js";

// import { payDepositAPI } from './API_module/API';
// import ProgressDialog from './ProgressDialog'

stripe.setOptions({

  publishableKey: 'pk_test_kYxI1uwoMn3Nesv2MeSIu3n200nwgmf3wA',//'PUBLISHABLE_KEY',india 
  merchantId: 'sk_test_7P9UmGsJvtNZgZdNNkhz5rWR00hzCyiHGZ',//'MERCHANT_ID', // india

  androidPayMode: 'test', // test|production Android only

})

import {
  Alert
} from 'react-native';

export const payType = {
  card: 'card',
  applePay: 'applePay',
  googlePay: 'googlePay',
  custom: 'custom',
  bank: 'bank'
}


export const  showAlert = (title = '',message ='')=>{
  setTimeout(()=>Alert.alert(
      title,
      message,
      [{text: 'OK'}],
    ),200)
}
/**
 * This function open card payment screen and return card token on success
 */
const cardPayment = async(amount,dataParam, store) => {
  // Decrypt
let publisbhKeybytes  = CryptoJS.AES.decrypt(store.stripePublishableKey, '5L9yLb85bT9WessPBdDYug4mDDDNZpf0uHmuzBk2F9A');
let stripePublishableKey = publisbhKeybytes.toString(CryptoJS.enc.Utf8);

let secretKeybytes  = CryptoJS.AES.decrypt(store.stripeSecretKey, '5L9yLb85bT9WessPBdDYug4mDDDNZpf0uHmuzBk2F9A');
let stripeSecretKey = secretKeybytes.toString(CryptoJS.enc.Utf8);

console.log('stripePublishableKey:',stripePublishableKey)
console.log('stripeSecretKey:',stripeSecretKey)

  // stripe.setOptions({

  //   publishableKey: stripePublishableKey,//'PUBLISHABLE_KEY',india 
  //   merchantId: stripeSecretKey,//'MERCHANT_ID', // india
  
  //   androidPayMode: 'test', // test|production Android only
  
  // })
  

   const token = await stripe.paymentRequestWithCardForm()
     //console.log('token',token.tokenId)
     const paramsToSend = { ...dataParam, ...{ stripeToken: token.tokenId} }
     store.initiateStripePayment(paramsToSend)

//   let ownerid=2
//   let name='Raja'
//   let email='rajatsajal@gmail.com'
//   let tokenid=token.tokenId
//   let description='Test Stripe Payment'
//    payDepositAPI(amount,tokenid,ownerid,name,email,description ).then(response => {
// if(!response.error)
// {
//   showAlert('',response.paymentStatus)

// }else
// {
//   showAlert('',response.message)

// }
//   }).catch(error => {
//     console.warn('error==',error)

// })



  // return stripe
  //   .paymentRequestWithCardForm()
  //   .then(stripeTokenInfo => stripeTokenInfo.tokenId)
  //   .catch(error => {
  //     throw (error.code)
  //   })
}

const applePay = () => {
  const items = [{
    label: 'Whisky',
    amount: '50.00',
  }, {
    label: 'Tipsi, Inc',
    amount: '50.00',
  }]

  const shippingMethods = [{
    id: 'fedex',
    label: 'FedEX',
    detail: 'Test @ 10',
    amount: '10.00',
  }]

  const options = {
    requiredBillingAddressFields: ['all'],
    requiredShippingAddressFields: ['phone', 'postal_address'],
    shippingMethods,
  }

  return stripe.paymentRequestWithApplePay(items, options).then(response => response).catch(error => error)
}

const googlePay = () => {

  const options = {
    total_price: '80.00',
    currency_code: 'INR',
    shipping_address_required: false,
    billing_address_required: false,
    //shipping_countries: ["US", "CA"],
    line_items: [{
      currency_code: 'INR',
      description: 'Whisky',
      total_price: '50.00',
      unit_price: '50.00',
      quantity: '1',
    }, {
      currency_code: 'INR',
      description: 'Vine',
      total_price: '30.00',
      unit_price: '30.00',
      quantity: '1',
    }],
  }

  return stripe.deviceSupportsNativePay()
    //.then(val=>val&&stripe.canMakeNativePayPayments())
    .then(val => val && stripe.paymentRequestWithNativePay(options))
    .then(response => response).catch(error => error)
}

/**
 * type of the source to create. Can be one of:
 *  bancontact ‖ card ‖ griopay ‖ ideal ‖ sepaDebit ‖ sofort ‖ threeDSecure ‖ alipay
 */
const customPayment = (params = {}) => {
  return stripe.createSourceWithParams(params)
    .then(response => response).catch(error => error)
}
/*
* params -> specify use bank info for example
* const params = {
   // mandatory
   accountNumber: '000123456789',
   countryCode: 'us',
   currency: 'usd',
   // optional
   routingNumber: '110000000', // 9 digits
   accountHolderName: 'Test holder name',
   accountHolderType: 'company', // "company" or "individual"
  }
*/
const bankAccountPayment = (params = {}) => {
  return stripe.createTokenWithBankAccount(params)
    .then(response => response).catch(error => error)

}

/**
 * This function used for initiate payment request and return payment token on success or error on failure 
 * PaymentMethod -> Indiacte Source of payment (i.e. card payment, apple payment, etc)
 *  data -> it is used for custom payment and bank payment mode 
 * for more detial about custom payment params please follow https://tipsi.github.io/tipsi-stripe/docs/createsourcewithparamsparams.html
 * And for bank params follow https://tipsi.github.io/tipsi-stripe/docs/createtokenwithbankaccount.html
 */
export const initiatePayment = (paymentMethod ,Amount,store, data={}) => {
  console.log('CompaignsStore.compaignsList:',data,store) 

  switch (paymentMethod) {

    case payType.card: return cardPayment(Amount,data,store)

    case payType.applePay: return applePay()

    case payType.googlePay: return googlePay()

    case payType.custom: return customPayment(data)

    case payType.bank: return bankAccountPayment(data)

  }
}









